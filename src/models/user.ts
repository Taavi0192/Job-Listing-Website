import { Schema, model, models } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string; // In a real app, you should hash this
  role: 'student' | 'faculty' | 'company' | 'alumni' | 'ilcHead';
}

const userSchema = new Schema<User>({
  _id?: ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'company', 'alumni', 'ilcHead'], required: true },
});

export default models.User || model<User>('User', userSchema);
