const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, trim: true },
  readAt: { type: Date },
  sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

messageSchema.index({ conversationId: 1, sentAt: -1 });
messageSchema.index({ fromUserId: 1 });
messageSchema.index({ toUserId: 1 });

module.exports = mongoose.model('Message', messageSchema);
