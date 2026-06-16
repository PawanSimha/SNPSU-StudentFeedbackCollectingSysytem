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
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const allotmentRoutes = require('./routes/allotment');
const publicRoutes = require('./routes/public');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/allotments', allotmentRoutes);
app.use('/api/public', publicRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
