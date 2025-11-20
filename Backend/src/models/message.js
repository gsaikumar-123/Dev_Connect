const mongoose = require('mongoose');

// Each attachment represents a stored file or image URL
const attachmentSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'file'], required: true },
  url: { type: String, required: true },
  fileName: { type: String },
  sizeBytes: { type: Number }
}, { _id: false });

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, trim: true },
  attachments: { type: [attachmentSchema], default: [] },
  messageType: { type: String, enum: ['text', 'attachment', 'mixed'], default: 'text' },
  readAt: { type: Date },
  sentAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { timestamps: true });

messageSchema.index({ conversationId: 1, sentAt: -1 });
messageSchema.index({ fromUserId: 1 });
messageSchema.index({ toUserId: 1 });
messageSchema.index({ conversationId: 1, isDeleted: 1 });

module.exports = mongoose.model('Message', messageSchema);
