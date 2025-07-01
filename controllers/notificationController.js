// controllers/notificationController.ts
import Notification from '../models/Notification.js';
import NotificationSettings from '../models/NotificationSettings.js';

// Send to Visitor
export const sendVisitorNotification = async (req, res) => {
  const { visitorId, type, message } = req.body;

  try {
    const notification = new Notification({
      recipient: visitorId,
      type,
      message,
      status: 'sent',
    });

    await notification.save();
    // TODO: Send email/SMS if needed

    res.json({ message: 'Visitor notification sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send visitor notification' });
  }
};

// Send to Host
export const sendHostNotification = async (req, res) => {
  const { hostId, visitorId, type, message } = req.body;

  try {
    const notification = new Notification({
      recipient: hostId,
      type,
      message,
      status: 'sent',
    });

    await notification.save();
    // TODO: Send email/SMS if needed

    res.json({ message: 'Host notification sent successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send host notification' });
  }
};

// Get Notification History
export const getNotificationHistory = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notification history' });
  }
};

// Get Notification Settings
export const getNotificationSettings = async (req, res) => {
  const userId = req.user.id;

  try {
    const settings = await NotificationSettings.findOne({ userId }) || new NotificationSettings({ userId });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Update Notification Settings
export const updateNotificationSettings = async (req, res) => {
  const userId = req.user.id;
  const { settings } = req.body;

  try {
    const updated = await NotificationSettings.findOneAndUpdate(
      { userId },
      { $set: settings },
      { upsert: true, new: true }
    );

    res.json({ message: 'Notification settings updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
