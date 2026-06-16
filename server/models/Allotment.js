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
