import express from 'express';
import { submitContractorForm, submitVisitorForm, getFormByEmail } from '../controllers/formController.js';

const router = express.Router();



router.post('/visitor', submitVisitorForm);
router.post('/contractor',  submitContractorForm);
router.post('/email-lookup', getFormByEmail);

export default router;