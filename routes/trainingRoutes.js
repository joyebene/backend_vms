import express from 'express';
import {
  getTrainingById,
  updateTraining,
  deleteTraining,
  submitTraining,
  enrollVisitor,
  getTrainingStatus,
  generateCertificate,
} from '../controllers/trainingController.js';

const router = express.Router();

router.get('/training/:id', getTrainingById);
router.put('/training/:id', updateTraining);
router.delete('/training/:id', deleteTraining);

router.post('/training/enrollments', enrollVisitor);
router.get('/training/enrollments/visitor/:visitorId', getTrainingStatus);

router.post('/training/submit', submitTraining);
router.get('/training/certificates/:enrollmentId', generateCertificate);

export default router;
