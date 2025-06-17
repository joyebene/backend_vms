import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [(val) => val.length === 4, 'There must be exactly 4 options'],
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['safety', 'security', 'procedure', 'other'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    requiredScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: [(val) => val.length > 0, 'There must be at least one question'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Training = mongoose.models.Training || mongoose.model('Training', trainingSchema);

export default Training;
