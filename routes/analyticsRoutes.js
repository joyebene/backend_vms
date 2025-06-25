import express from 'express';
import { getVisitorStats, getAccessMetrics, getTrainingMetrics } from '../controllers/analyticsController.js';


const router = express.Router();

router.get('/visitors',  getVisitorStats);
router.get('/access',  getAccessMetrics);
router.get('/training',  getTrainingMetrics);

export default router;
