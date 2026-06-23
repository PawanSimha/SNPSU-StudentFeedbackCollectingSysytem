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
const rateLimit = require('express-rate-limit');
const PublicFeedback = require('../models/PublicFeedback');
const { protect } = require('../middleware/auth');
const { SUBJECTS } = require('../config/subjects');

const router = express.Router();

const publicLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '10'),
  message: { message: 'Too many submissions. Please try again later.' },
});

router.get('/subjects', (req, res) => {
  res.json(SUBJECTS);
});

router.post('/feedback', publicLimiter, async (req, res) => {
  try {
    const { subject, facultyName, comments } = req.body;
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!SUBJECTS.includes(subject)) {
      return res.status(400).json({ message: 'Invalid subject' });
    }
    if (facultyName && facultyName.length > 100) {
      return res.status(400).json({ message: 'Faculty name must not exceed 100 characters' });
    }
    if (!comments) {
      return res.status(400).json({ message: 'Comments are required' });
    }
    if (comments.length < 100) {
      return res.status(400).json({ message: 'Feedback must be at least 100 characters' });
    }
    if (comments.length > 300) {
      return res.status(400).json({ message: 'Feedback must be under 300 characters' });
    }
    const feedback = await PublicFeedback.create({ subject, facultyName: facultyName || '', comments });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Public feedback submit error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feedbacks', protect, async (req, res) => {
  try {
    const feedbacks = await PublicFeedback.find().sort({ createdAt: -1 }).lean();
    res.json(feedbacks);
  } catch (error) {
    console.error('Public feedback fetch error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
