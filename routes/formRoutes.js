import express from 'express';
import multer from 'multer';
import path from 'path';
import { submitContractorForm, submitVisitorForm } from '../controllers/formController.js';

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });


router.post('/visitor', submitVisitorForm);
router.post('/contractor',  upload.array('documents'), submitContractorForm);

export default router;