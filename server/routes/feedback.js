const express = require('express');
const Feedback = require('../models/Feedback');
const Allotment = require('../models/Allotment');
const { protect } = require('../middleware/auth');
const { SUBJECTS } = require('../config/subjects');

const router = express.Router();

router.get('/subjects', protect, (req, res) => {
  res.json(SUBJECTS);
});

router.get('/my', protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.student._id }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const MIN_LEN = 50;
const MAX_LEN = 300;

router.post('/submit', protect, async (req, res) => {
  try {
    const { subject, rating, comments } = req.body;

    if (!subject || !rating) {
      return res.status(400).json({ message: 'Subject and rating are required' });
    }

    if (comments) {
      const trimmed = comments.trim();
      if (trimmed.length < MIN_LEN) {
        return res.status(400).json({ message: `Feedback must be at least ${MIN_LEN} characters` });
      }
      if (trimmed.length > MAX_LEN) {
        return res.status(400).json({ message: `Feedback must not exceed ${MAX_LEN} characters` });
      }
    }

    if (req.student.role !== 'admin') {
      const allotment = await Allotment.findOne({ classGroup: req.student.classGroup, isOpen: true });
      if (!allotment) {
        return res.status(403).json({ message: 'Feedback session is not open for your class' });
      }
    }

    const existing = await Feedback.findOne({ student: req.student._id, subject });
    if (existing) {
      existing.rating = rating;
      existing.comments = comments;
      await existing.save();
      return res.json(existing);
    }

    const feedback = await Feedback.create({
      student: req.student._id,
      subject,
      rating,
      comments,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
