const express = require('express');
const PublicFeedback = require('../models/PublicFeedback');
const { protect } = require('../middleware/auth');
const { SUBJECTS } = require('../config/subjects');

const router = express.Router();

router.get('/subjects', (req, res) => {
  res.json(SUBJECTS);
});

router.post('/feedback', async (req, res) => {
  try {
    const { subject, facultyName, comments } = req.body;
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!SUBJECTS.includes(subject)) {
      return res.status(400).json({ message: 'Invalid subject' });
    }
    if (!comments || comments.length < 100) {
      return res.status(400).json({ message: 'Feedback must be at least 100 characters' });
    }
    if (comments.length > 300) {
      return res.status(400).json({ message: 'Feedback must be under 300 characters' });
    }
    const feedback = await PublicFeedback.create({ subject, facultyName: facultyName || '', comments });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feedbacks', protect, async (req, res) => {
  try {
    const feedbacks = await PublicFeedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
