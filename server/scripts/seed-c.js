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
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');

const students = [
  { usn: '25SUPMCAGL102', name: 'Student C001', email: 'student.c001@snpsu.edu.in' },
  { usn: '25SUPMCAGL103', name: 'Student C002', email: 'student.c002@snpsu.edu.in' },
  { usn: '25SUPMCAGL104', name: 'Student C003', email: 'student.c003@snpsu.edu.in' },
  { usn: '25SUPMCAGL105', name: 'Student C004', email: 'student.c004@snpsu.edu.in' },
  { usn: '25SUPMCAGL106', name: 'Student C005', email: 'student.c005@snpsu.edu.in' },
  { usn: '25SUPMCAGL107', name: 'Student C006', email: 'student.c006@snpsu.edu.in' },
  { usn: '25SUPMCAGL108', name: 'Student C007', email: 'student.c007@snpsu.edu.in' },
  { usn: '25SUPMCAGL109', name: 'Student C008', email: 'student.c008@snpsu.edu.in' },
  { usn: '25SUPMCAGL110', name: 'Student C009', email: 'student.c009@snpsu.edu.in' },
  { usn: '25SUPMCAGL111', name: 'Student C010', email: 'student.c010@snpsu.edu.in' },
  { usn: '25SUPMCAGL112', name: 'Student C011', email: 'student.c011@snpsu.edu.in' },
  { usn: '25SUPMCAGL113', name: 'Student C012', email: 'student.c012@snpsu.edu.in' },
  { usn: '25SUPMCAGL114', name: 'Student C013', email: 'student.c013@snpsu.edu.in' },
  { usn: '25SUPMCAGL115', name: 'Student C014', email: 'student.c014@snpsu.edu.in' },
  { usn: '25SUPMCAGL116', name: 'Student C015', email: 'student.c015@snpsu.edu.in' },
  { usn: '25SUPMCAGL117', name: 'Student C016', email: 'student.c016@snpsu.edu.in' },
  { usn: '25SUPMCAGL118', name: 'Student C017', email: 'student.c017@snpsu.edu.in' },
  { usn: '25SUPMCAGL119', name: 'Student C018', email: 'student.c018@snpsu.edu.in' },
  { usn: '25SUPMCAGL120', name: 'Student C019', email: 'student.c019@snpsu.edu.in' },
  { usn: '25SUPMCAGL121', name: 'Student C020', email: 'student.c020@snpsu.edu.in' },
  { usn: '25SUPMCAGL122', name: 'Student C021', email: 'student.c021@snpsu.edu.in' },
  { usn: '25SUPMCAGL123', name: 'Student C022', email: 'student.c022@snpsu.edu.in' },
  { usn: '25SUPMCAGL124', name: 'Student C023', email: 'student.c023@snpsu.edu.in' },
  { usn: '25SUPMCAGL125', name: 'Student C024', email: 'student.c024@snpsu.edu.in' },
  { usn: '25SUPMCAGL126', name: 'Student C025', email: 'student.c025@snpsu.edu.in' },
  { usn: '25SUPMCAGL127', name: 'Student C026', email: 'student.c026@snpsu.edu.in' },
  { usn: '25SUPMCAGL128', name: 'Student C027', email: 'student.c027@snpsu.edu.in' },
  { usn: '25SUPMCAGL129', name: 'Student C028', email: 'student.c028@snpsu.edu.in' },
  { usn: '25SUPMCAGL130', name: 'Student C029', email: 'student.c029@snpsu.edu.in' },
  { usn: '25SUPMCAGL131', name: 'Student C030', email: 'student.c030@snpsu.edu.in' },
  { usn: '25SUPMCAGL132', name: 'Student C031', email: 'student.c031@snpsu.edu.in' },
  { usn: '25SUPMCAGL133', name: 'Student C032', email: 'student.c032@snpsu.edu.in' },
  { usn: '25SUPMCAGL134', name: 'Student C033', email: 'student.c033@snpsu.edu.in' },
  { usn: '25SUPMCAGL135', name: 'Student C034', email: 'student.c034@snpsu.edu.in' },
  { usn: '25SUPMCAGL136', name: 'Student C035', email: 'student.c035@snpsu.edu.in' },
  { usn: '25SUPMCAGL137', name: 'Student C036', email: 'student.c036@snpsu.edu.in' },
  { usn: '25SUPMCAGL138', name: 'Student C037', email: 'student.c037@snpsu.edu.in' },
  { usn: '25SUPMCAGL139', name: 'Student C038', email: 'student.c038@snpsu.edu.in' },
  { usn: '25SUPMCAGL140', name: 'Student C039', email: 'student.c039@snpsu.edu.in' },
  { usn: '25SUPMCAGL141', name: 'Student C040', email: 'student.c040@snpsu.edu.in' },
  { usn: '25SUPMCAGL142', name: 'Student C041', email: 'student.c041@snpsu.edu.in' },
  { usn: '25SUPMCAGL143', name: 'Student C042', email: 'student.c042@snpsu.edu.in' },
  { usn: '25SUPMCAGL144', name: 'Student C043', email: 'student.c043@snpsu.edu.in' },
  { usn: '25SUPMCAGL145', name: 'Student C044', email: 'student.c044@snpsu.edu.in' },
  { usn: '25SUPMCAGL146', name: 'Student C045', email: 'student.c045@snpsu.edu.in' },
  { usn: '25SUPMCAGL147', name: 'Student C046', email: 'student.c046@snpsu.edu.in' },
  { usn: '25SUPMCAGL148', name: 'Student C047', email: 'student.c047@snpsu.edu.in' },
  { usn: '25SUPMCAGL149', name: 'Student C048', email: 'student.c048@snpsu.edu.in' },
  { usn: '25SUPMCAGL150', name: 'Student C049', email: 'student.c049@snpsu.edu.in' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedback-collector');
    console.log('Connected to MongoDB');

    await Student.deleteMany({ classGroup: 'MCA, 1st Year, 2nd Sem, C sec' });
    console.log('Cleared existing C section students');

    const studentsWithPassword = await Promise.all(students.map(async (s) => ({
      ...s,
      password: await bcrypt.hash('MCAC@123', 10),
      role: 'student',
      classGroup: 'MCA, 1st Year, 2nd Sem, C sec',
    })));

    await Student.insertMany(studentsWithPassword);
    console.log(`Inserted ${students.length} C section students with default password`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
