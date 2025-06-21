import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  visitorId: String,
  trainingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Training' },
  answers: [Number],
  score: Number,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Enrollment', enrollmentSchema);
