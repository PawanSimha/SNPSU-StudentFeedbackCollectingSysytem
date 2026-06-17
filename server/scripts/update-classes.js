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
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedback-collector').then(async () => {
  const r = await mongoose.connection.db.collection('students').updateMany(
    { role: 'student', classGroup: { $exists: false } },
    { $set: { classGroup: 'MCA, 1st Year, 2nd Sem, A sec' } }
  );
  console.log(`Updated ${r.modifiedCount} students with classGroup`);

  const count = await mongoose.connection.db.collection('students').countDocuments({ role: 'student' });
  console.log(`Total students: ${count}`);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
