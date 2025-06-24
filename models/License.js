import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
  licenseKey: { type: String, required: true, unique: true },
  expiryDate: { type: Date, required: true },
  isActive: {
    type: Boolean,
    default: function () {
      return this.expiryDate > new Date();
    }
  },
}, { timestamps: true });

export default mongoose.model('License', licenseSchema);
