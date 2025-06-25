import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // or 'Visitor' / 'Contractor' if applicable
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String, // 'visitor', 'contractor', 'employee', etc.
      required: true,
    },
    status: {
      type: String,
      enum: ['granted', 'denied'],
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true, // e.g., 'Main Gate', 'Reception', etc.
    },
    accessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AccessLog', accessLogSchema);
