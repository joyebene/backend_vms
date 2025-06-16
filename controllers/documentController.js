import Contractor from '../models/contractorModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use disk storage (or switch to cloud like S3 later)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage }).single('file');

export const uploadDocument = async (req, res) => {
  try {
    const { contractorId, documentType, description } = req.body;

    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) return res.status(404).json({ message: 'Contractor not found' });

    const fileUrl = `/uploads/${req.file.filename}`;

    const newDoc = {
      name: req.file.originalname,
      url: fileUrl,
      type: req.file.mimetype,
      uploadedAt: new Date(),
      description: description || '',
      documentType: documentType || '',
    };

    contractor.documents.push(newDoc);
    await contractor.save();

    res.status(200).json(newDoc);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
