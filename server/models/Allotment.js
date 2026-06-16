const mongoose = require('mongoose');

const allotmentSchema = new mongoose.Schema({
  classGroup: {
    type: String,
    required: true,
    unique: true,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  allottedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  allottedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Allotment', allotmentSchema);
