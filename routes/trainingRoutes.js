import express from 'express';
import {
  getTrainingById,
  updateTraining,
  deleteTraining,
  submitTraining,
  enrollVisitor,
  getTrainingStatus,
  generateCertificate,
  toggleTrainingStatus,
} from '../controllers/trainingController.js';

const router = express.Router();

router.get('/:id', getTrainingById);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

router.post('/enrollments', enrollVisitor);
router.get('/enrollments/visitor/:visitorId', getTrainingStatus);

router.post('/submit', submitTraining);
router.get('/certificates/:enrollmentId', generateCertificate);
router.patch('/:id/toggle', toggleTrainingStatus);


export default router;
