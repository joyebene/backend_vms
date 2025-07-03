import express from 'express';
import { submitContractorForm, submitVisitorForm, getFormByEmail, getAllTrainings } from '../controllers/formController.js';
import Contractor from '../models/Contractor.js';

const router = express.Router();



router.post('/visitor', submitVisitorForm);
router.post('/contractor',  submitContractorForm);
router.post('/email-lookup', getFormByEmail);
router.get('/forms/trainings', getAllTrainings);

// routes/visitor.js
router.post('/:id/complete-training', async (req, res) => {
  const { id } = req.params;
  const { trainingId, score, title } = req.body;

  const contractor = await Contractor.findById(id);
  if (!contractor) return res.status(404).json({ error: 'Contractor not found' });

  // Avoid duplicate
  if (!contractor.completedTrainings.find(t => t.trainingId.toString() === trainingId)) {
    contractor.completedTrainings.push({
      trainingId,
      completedAt: new Date(),
      score,
      title
    });
    await contractor.save();
  }

  res.json({ message: 'Training marked as completed' });
});

router.get('/:id/completed-trainings', async (req, res) => {
  const { id } = req.params;
  const contractor = await Contractor.findById(id);
  if (!contractor) return res.status(404).json({ error: 'Contractor not found' });

  res.json(contractor.completedTrainings || []);
});


export default router;