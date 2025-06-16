// controllers/documentController.js
import Contractor from '../models/Contractor.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/contractors';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

export const uploadDocument = async (req, res) => {
  try {
    const { visitorId, documentType, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const contractor = await Contractor.findById(visitorId);
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }

    const fileUrl = `/uploads/contractors/${file.filename}`;

    const document = {
      name: file.originalname,
      url: fileUrl,
      type: file.mimetype,
      uploadedAt: new Date(),
    };

    contractor.documents.push(document);
    await contractor.save();

    res.status(200).json({ success: true, data: document });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getVisitorDocuments = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const contractor = await Contractor.findById(visitorId);

    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }

    res.status(200).json({ success: true, data: contractor.documents });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const contractor = await Contractor.findOne({ 'documents._id': documentId });

    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const doc = contractor.documents.id(documentId);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error('Get document error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const contractor = await Contractor.findOne({ 'documents._id': documentId });

    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const doc = contractor.documents.id(documentId);
    const filePath = path.join('./', doc.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    doc.remove();
    await contractor.save();

    res.status(200).json({ success: true, message: 'Document deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
