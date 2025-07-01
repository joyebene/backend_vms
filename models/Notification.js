// models/Notification.ts
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'visitor-arrival', 'visitor-departure', 'visitor-registration', 'visitor-cancelled',
      'check-in', 'check-out', 'registration', 'cancelled', 'welcome', 'reset-password',
    ],
    required: true,
  },
  recipient: { type: String, required: true }, // visitorId or hostId
  status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
  timestamp: { type: Date, default: Date.now },
  message: { type: String },
});

export default mongoose.model('Notification', notificationSchema);


// models/NotificationSettings.ts
const notificationSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  emailNotificationsEnabled: { type: Boolean, default: true },
  hostNotificationsEnabled: { type: Boolean, default: true },
  visitorNotificationsEnabled: { type: Boolean, default: true },
  notificationTypes: { type: Map, of: Boolean, default: {} },
});

export default mongoose.model('NotificationSettings', notificationSettingsSchema);
