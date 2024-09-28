import { Schema, model, models } from 'mongoose';

const conversationSchema = new Schema({
  participants: [{ type: String, required: true }],  // Array of participant user IDs
  createdAt: { type: Date, default: Date.now },
});

const Conversation = models.Conversation || model('Conversation', conversationSchema);
export default Conversation;
