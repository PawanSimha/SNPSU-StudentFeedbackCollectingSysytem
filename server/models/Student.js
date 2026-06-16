const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  usn: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  classGroup: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
