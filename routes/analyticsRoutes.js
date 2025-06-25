import express from 'express';
import { getVisitorStats, getAccessMetrics, getTrainingMetrics, getVisitorMetrics } from '../controllers/analyticsController.js';


const router = express.Router();

router.get('/visitors',  getVisitorStats);
router.get('/access',  getAccessMetrics);
router.get('/training',  getTrainingMetrics);
router.get('/visitor-metrics', getVisitorMetrics)

export default router;
