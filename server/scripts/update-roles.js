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

mongoose.connect('mongodb://localhost:27017/feedback-collector').then(async () => {
  const r = await mongoose.connection.db.collection('students').updateMany(
    { role: { $exists: false } },
    { $set: { role: 'student' } }
  );
  console.log(`Updated ${r.modifiedCount} students with role=student`);

  const admin = await mongoose.connection.db.collection('students').findOne({ email: 'iampawansimha.2004@gmail.com' });
  console.log(`Admin role: ${admin?.role}`);

  process.exit(0);
});
