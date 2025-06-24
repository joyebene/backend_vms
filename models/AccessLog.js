import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // or 'Visitor'
  role: { type: String, enum: ['visitor', 'employee'] },
  entryTime: Date,
  exitTime: Date,
  location: String,
  deviceId: { type: String },
  status: {
    type: String,
    enum: ['entered', 'exited'],
    default: 'entered'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('AccessLog', accessLogSchema);
