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
