import express from 'express';
import {
  register,
  login,

  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', register);

router.post('/login', login);
//router.post('/refresh-token', refreshToken);

router.get('/profile', protect, getProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);

export default router;
