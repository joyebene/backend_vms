import express from 'express';
import multer from 'multer';
import { submitContractorForm, submitVisitorForm } from '../controllers/formController.js';

const router = express.Router();



const upload = multer({ storage });


router.post('/visitor', submitVisitorForm);
router.post('/contractor',  upload.array('documents'), submitContractorForm);

export default router;