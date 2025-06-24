import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  systemName: { type: String, default: 'Unimart' },
  allowSignup: { type: Boolean, default: true },
  supportEmail: { type: String, default: 'support@unimart.com' },
  logoUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('SystemSetting', systemSettingSchema);
