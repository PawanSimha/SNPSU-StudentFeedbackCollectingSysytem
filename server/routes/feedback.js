/*
  SOAS Feedback Collector - Anonymous course feedback platform for Sapthagiri NPS University
  Copyright (C) 2026 Pawan Simha R

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const express = require('express');
const Feedback = require('../models/Feedback');
const Allotment = require('../models/Allotment');
const { protect } = require('../middleware/auth');
const { SUBJECTS } = require('../config/subjects');

const router = express.Router();

router.get('/subjects', protect, (req, res) => {
  res.json(SUBJECTS);
});

router.get('/my', protect, async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ student: req.student._id }).sort({ createdAt: -1 }).lean();
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
});

const MIN_LEN = 50;
const MAX_LEN = 300;

router.post('/submit', protect, async (req, res, next) => {
  try {
    const { subject, rating, comments } = req.body;

    if (!subject || !rating) {
      return res.status(400).json({ message: 'Subject and rating are required' });
    }

    if (!SUBJECTS.includes(subject)) {
      return res.status(400).json({ message: 'Invalid subject' });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    if (typeof comments === 'string' && comments.trim()) {
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
    next(error);
  }
});

module.exports = router;
