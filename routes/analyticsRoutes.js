import express from 'express';
import { getVisitorStats, getAccessMetrics, getTrainingMetrics } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/visitors', verifyToken, getVisitorStats);
router.get('/access', verifyToken, getAccessMetrics);
router.get('/training', verifyToken, getTrainingMetrics);

export default router;
