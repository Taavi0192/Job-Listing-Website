import { Schema, model, models } from 'mongoose';

const JobSchema = new Schema({
  _id?: ObjectId,
  title: { type: String, required: true },
  company: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Internship, Part-time, Full-time
  location: { type: String, required: true }, // City
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Job = models.Job || model('Job', JobSchema);

export default Job;
