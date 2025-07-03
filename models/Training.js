import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true } // index of correct option
});

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['safety', 'security', 'procedure', 'other'], required: true },
  content: { type: String, required: true },
  questions: [questionSchema],
  videos: [{
  name: { type: String, required: false },
  url: { type: String, required: false }
}],
books: [{
  name: { type: String, required: false },
  url: { type: String, required: false }
}],

  requiredScore: { type: Number, default: 70 },
  isActive: { type: Boolean, default: true },
  
}, { timestamps: true });

export default mongoose.models.Training || mongoose.model('Training', trainingSchema);
