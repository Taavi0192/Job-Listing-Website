import { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
  conversationId: { type: String, required: true },  // Conversation ID
  senderId: { type: String, required: true },  // User ID of the sender
  content: { type: String, required: true },  // Message content
  fileUrl: { type: String },  // Optional file attachment
  createdAt: { type: Date, default: Date.now },
  scheduledAt: { type: Date },  // Optional: Scheduling for future delivery
});

const Message = models.Message || model('Message', messageSchema);
export default Message;
