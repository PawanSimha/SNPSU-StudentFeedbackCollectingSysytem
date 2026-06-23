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

publicFeedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PublicFeedback', publicFeedbackSchema);
