const mongoose = require('mongoose');

const publicFeedbackSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  facultyName: {
    type: String,
    default: '',
  },
  comments: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('PublicFeedback', publicFeedbackSchema);
