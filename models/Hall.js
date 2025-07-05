import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  externalApiUrl: { type: String, required: true },
});

export default mongoose.model('Hall', hallSchema);
