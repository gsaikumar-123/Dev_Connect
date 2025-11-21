const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const chatRouter = express.Router();

function getPairKey(a, b) {
  return [a.toString(), b.toString()].sort().join('_');
}

chatRouter.get('/chat/conversations', userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate({
        path: 'lastMessage',
        select: 'text attachments messageType fromUserId toUserId sentAt isDeleted'
      })
      .populate({
        path: 'participants',
        select: 'firstName lastName photoUrl about skills'
      })
      .sort({ lastMessageAt: -1 })
      .limit(50);

    const formatted = conversations.map(c => {
      const otherUser = c.participants.find(p => p._id.toString() !== userId.toString());
      return {
        _id: c._id,
        otherUser,
        lastMessage: c.lastMessage,
        unreadCount: c.unreadCounts.get(userId.toString()) || 0,
        lastMessageAt: c.lastMessageAt,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching conversations: ' + err.message });
  }
});

chatRouter.get('/chat/messages/:conversationId', userAuth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 30, 100);
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId, isDeleted: false })
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    messages.reverse();

    res.json({ success: true, data: messages, page });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching messages: ' + err.message });
  }
});

chatRouter.post('/chat/send', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, text, attachments } = req.body;

    if (!toUserId) {
      return res.status(400).json({ success: false, message: 'toUserId required' });
    }
    if (!text && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message body empty' });
    }

    const pairKey = getPairKey(fromUserId, toUserId);

    let conversation = await Conversation.findOne({ pairKey });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [fromUserId, toUserId],
        pairKey
      });
    }

    const messageType = attachments && attachments.length > 0 ? (text ? 'mixed' : 'attachment') : 'text';

    const message = await Message.create({
      conversationId: conversation._id,
      fromUserId,
      toUserId,
      text,
      attachments: attachments || [],
      messageType
    });

    
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = message.sentAt;

    const recipientKey = toUserId.toString();
    const currentUnread = conversation.unreadCounts.get(recipientKey) || 0;
    conversation.unreadCounts.set(recipientKey, currentUnread + 1);
    conversation.participantLastSeen.set(fromUserId.toString(), new Date());

    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .select('text attachments messageType fromUserId toUserId sentAt readAt');

    if (req.app.get('io')) {
      req.app.get('io').to(toUserId.toString()).emit('chat:newMessage', {
        conversationId: conversation._id.toString(),
        message: populatedMessage
      });
    }

    res.status(201).json({ success: true, data: populatedMessage, conversationId: conversation._id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error sending message: ' + err.message });
  }
});

chatRouter.post('/chat/start', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ success: false, message: 'toUserId required' });
    }

    const pairKey = getPairKey(fromUserId, toUserId);

    let conversation = await Conversation.findOne({ pairKey });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [fromUserId, toUserId],
        pairKey
      });
    }

    res.status(201).json({ success: true, conversationId: conversation._id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error starting chat: ' + err.message });
  }
});

chatRouter.post('/chat/read', userAuth, async (req, res) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId) return res.status(400).json({ success: false, message: 'conversationId required' });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    conversation.unreadCounts.set(req.user._id.toString(), 0);
    conversation.participantLastSeen.set(req.user._id.toString(), new Date());
    await conversation.save();

    if (req.app.get('io')) {
      const otherUserId = conversation.participants.find(p => p.toString() !== req.user._id.toString());
      req.app.get('io').to(otherUserId.toString()).emit('chat:readReceipt', { conversationId });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error marking read: ' + err.message });
  }
});

chatRouter.delete('/chat/message/:id', userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    if (message.fromUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Cannot delete others\' messages' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    const conversation = await Conversation.findById(message.conversationId);
    if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === message._id.toString()) {
      const nextLatest = await Message.find({ conversationId: conversation._id, isDeleted: false })
        .sort({ sentAt: -1 })
        .limit(1);
      if (nextLatest.length) {
        conversation.lastMessage = nextLatest[0]._id;
        conversation.lastMessageAt = nextLatest[0].sentAt;
      } else {
        conversation.lastMessage = null;
        conversation.lastMessageAt = null;
      }
      await conversation.save();
    }

    if (req.app.get('io')) {
      req.app.get('io').to(message.toUserId.toString()).emit('chat:messageDeleted', {
        messageId: message._id.toString(),
        conversationId: message.conversationId.toString()
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting message: ' + err.message });
  }
});

module.exports = chatRouter;
