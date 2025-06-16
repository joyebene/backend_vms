import express from 'express';
import multer from 'multer';
// import path from 'path';
import fs from 'fs';
import Contractor from '../models/Contractor.js';

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/contractors';
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/**
 * Upload contractor document
 * Expects: file (multipart), visitorId, documentType, description (optional)
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { visitorId, documentType, description } = req.body;
    const file = req.file;

    if (!file || !visitorId || !documentType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const contractor = await Contractor.findById(visitorId);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    const documentEntry = {
      name: file.originalname,
      url: file.path, // store local path
      type: file.mimetype,
      uploadedAt: new Date(),
    };

    contractor.documents.push(documentEntry);
    await contractor.save();

    res.status(201).json({ message: 'Document uploaded', data: documentEntry });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get all contractor documents by contractor ID
 */
router.get('/visitor/:visitorId', async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.visitorId);
    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }
    res.status(200).json({ documents: contractor.documents || [] });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get a specific document by document ID
 */
router.get('/:documentId', async (req, res) => {
  try {
    const contractors = await Contractor.find({});
    for (const contractor of contractors) {
      const doc = contractor.documents.id(req.params.documentId);
      if (doc) return res.status(200).json({ document: doc });
    }
    res.status(404).json({ message: 'Document not found' });
  } catch (err) {
    console.error('Get document error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Delete document by document ID
 */
router.delete('/:documentId', async (req, res) => {
  try {
    const contractors = await Contractor.find({});
    for (const contractor of contractors) {
      const doc = contractor.documents.id(req.params.documentId);
      if (doc) {
        // Remove file from disk
        if (fs.existsSync(doc.url)) fs.unlinkSync(doc.url);

        // Remove from DB
        doc.remove();
        await contractor.save();

        return res.status(200).json({ message: 'Document deleted' });
      }
    }

    res.status(404).json({ message: 'Document not found' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
