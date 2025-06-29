import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  emailNotificationsEnabled: { type: Boolean, default: true },
  qrCodeExpiryHours: { type: Number, default: 24 },
  visitorPhotoRequired: { type: Boolean, default: false },
  trainingRequired: { type: Boolean, default: false },
  systemVersion: { type: String, default: '1.0.0' },
}, { timestamps: true });

export default mongoose.model('SystemSetting', systemSettingSchema);
