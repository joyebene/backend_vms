import express from 'express';
const router = express.Router();
import Group from '../models/Group.js';
import User from '../models/User.js';
import {protect }  from '../middleware/authMiddleware.js';

// Get all groups
router.get('/', protect, async (req, res) => {
  const groups = await Group.find();
  res.json(groups);
});

// Create group
// Create a new group
router.post('/', protect, async (req, res) => {
  const { name, description } = req.body;

  try {
    const existing = await Group.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Group already exists' });

    const group = new Group({ name, description });
    await group.save();

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});


// Assign groups to user/host
router.post('/access-map', protect, async (req, res) => {
  const { userId, groups } = req.body;
  await User.findByIdAndUpdate(userId, { groups });
  res.json({ success: true });
});

// Get groups for a user
router.get('/user/:id/groups', protect, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ groups: user.groups });
});

// GET /api/admin/groups/:groupName/members
router.get('/:groupName/members', protect, async (req, res) => {
  try {
    const members = await User.find({ groups: req.params.groupName });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get group members' });
  }
});


export default router;
