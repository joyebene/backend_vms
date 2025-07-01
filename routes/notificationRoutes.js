// routes/notificationRoutes.ts
import express from 'express';
import {
  sendVisitorNotification,
  sendHostNotification,
  getNotificationHistory,
  getNotificationSettings,
  updateNotificationSettings,
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/visitor', authMiddleware, sendVisitorNotification);
router.post('/host', authMiddleware, sendHostNotification);
router.get('/history', authMiddleware, getNotificationHistory);
router.get('/settings', authMiddleware, getNotificationSettings);
router.put('/settings', authMiddleware, updateNotificationSettings);

export default router;
