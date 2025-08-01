import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

export default  mongoose.model('Group', groupSchema);
