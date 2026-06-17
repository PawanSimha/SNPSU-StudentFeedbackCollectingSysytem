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
    let allotment = await Allotment.findOne({ classGroup });
    const opening = allotment ? !allotment.isOpen : true;

    if (opening) {
      const trimmed = (message || '').trim();
      if (trimmed.length < 15) {
        return res.status(400).json({ message: 'Message must be at least 15 characters' });
      }
      if (trimmed.length > 50) {
        return res.status(400).json({ message: 'Message must not exceed 50 characters' });
      }
    }

    if (allotment) {
      allotment.isOpen = opening;
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
