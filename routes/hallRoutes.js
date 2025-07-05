import express from 'express';
import axios from 'axios';
import Hall from '../models/Hall.js';

const router = express.Router();

// Create or update a hall's API
router.post('/', async (req, res) => {
  const { name, externalApiUrl } = req.body;

  if (!name || !externalApiUrl) {
    return res.status(400).json({ status: 'error', message: 'Missing hall name or API URL' });
  }

  try {
    const hall = await Hall.findOneAndUpdate(
      { name },
      { externalApiUrl },
      { new: true, upsert: true }
    );
    res.json({ status: 'success', hall });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Get all halls and their API URLs
router.get('/', async (req, res) => {
  try {
    const halls = await Hall.find();
    res.json({ status: 'success', halls });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Fetch groups from a specific hall
router.get('/:hallName/groups', async (req, res) => {
  const { hallName } = req.params;

  try {
    const hall = await Hall.findOne({ name: hallName });
    if (!hall) {
      return res.status(404).json({ status: 'error', message: 'Hall not found' });
    }

    const response = await axios.get(hall.externalApiUrl);
    res.json({ status: 'success', groups: response.data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
