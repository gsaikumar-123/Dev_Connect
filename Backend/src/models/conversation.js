const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  pairKey: { type: String, required: true, unique: true }, // sorted participant ids joined by '_'
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: { type: Date },
  unreadCounts: { type: Map, of: Number, default: {} }, // key: userId, value: count
  participantLastSeen: { type: Map, of: Date, default: {} } // key: userId, value: last read timestamp
}, { timestamps: true });

conversationSchema.index({ pairKey: 1 }, { unique: true });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ 'participants': 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
