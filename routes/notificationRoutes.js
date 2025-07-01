// routes/notificationRoutes.ts
import express from 'express';
import {
  sendVisitorNotification,
  sendHostNotification,
  getNotificationHistory,
  getNotificationSettings,
  updateNotificationSettings,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/visitor', protect, sendVisitorNotification);
router.post('/host', protect, sendHostNotification);
router.get('/history', protect, getNotificationHistory);
router.get('/settings', protect, getNotificationSettings);
router.put('/settings', protect, updateNotificationSettings);

export default router;
