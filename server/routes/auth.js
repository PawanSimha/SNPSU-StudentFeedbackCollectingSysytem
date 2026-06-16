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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, usn, password } = req.body;

    if (!email || !usn || !password) {
      return res.status(400).json({ message: 'Please provide email, USN, and password' });
    }

    const student = await Student.findOne({ email: email.toLowerCase(), usn: usn.toUpperCase() });

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: student._id, role: student.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      usn: student.usn,
      role: student.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.student);
});

module.exports = router;
