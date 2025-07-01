import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailNotificationsEnabled: { type: Boolean, default: true },
  hostNotificationsEnabled: { type: Boolean, default: true },
  visitorNotificationsEnabled: { type: Boolean, default: true },
  notificationTypes: { type: Map, of: Boolean, default: {} },
});

export default mongoose.model('NotificationSettings', notificationSettingsSchema);
