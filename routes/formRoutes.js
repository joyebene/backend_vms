import express from 'express';
import { submitContractorForm, submitVisitorForm } from '../controllers/formController.js';

const router = express.Router();

router.post('/visitor', submitVisitorForm);
router.post('/contractor', submitContractorForm);

export default router;