const express = require('express');
const Allotment = require('../models/Allotment');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/status', async (req, res) => {
  try {
    if (req.student.role === 'admin') {
      return res.json({ open: false });
    }
    const classGroup = req.student.classGroup;
    if (!classGroup) {
      return res.json({ open: false });
    }
    const allotment = await Allotment.findOne({ classGroup, isOpen: true });
    res.json({ open: !!allotment, message: allotment?.message || '' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  if (req.student.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const allotments = await Allotment.find();
    res.json(allotments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  if (req.student.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  try {
    const { classGroup, message } = req.body;
    if (!classGroup) {
      return res.status(400).json({ message: 'Class group is required' });
    }
    const trimmed = (message || '').trim();
    if (trimmed.length < 15) {
      return res.status(400).json({ message: 'Message must be at least 15 characters' });
    }
    if (trimmed.length > 50) {
      return res.status(400).json({ message: 'Message must not exceed 50 characters' });
    }

    let allotment = await Allotment.findOne({ classGroup });
    if (allotment) {
      allotment.isOpen = !allotment.isOpen;
      if (allotment.isOpen) {
        allotment.message = trimmed;
        allotment.allottedBy = req.student._id;
        allotment.allottedAt = new Date();
      }
    } else {
      allotment = await Allotment.create({
        classGroup,
        isOpen: true,
        message: trimmed,
        allottedBy: req.student._id,
        allottedAt: new Date(),
      });
    }
    await allotment.save();
    res.json(allotment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
