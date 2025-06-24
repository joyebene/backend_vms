import mongoose from 'mongoose';

const trainingRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule' },
  score: Number,
  completed: Boolean,
  completedAt: Date,
  duration: Number, // optional: in minutes
}, { timestamps: true });

export default mongoose.model('TrainingRecord', trainingRecordSchema);
