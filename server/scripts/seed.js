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
  { usn: '25SUPMCAGL001', name: 'ABHISHEK S', email: 'abhisheks86609@gmail.com' },
  { usn: '25SUPMCAGL002', name: 'AISHWARYA S', email: 'aishwaryas0201@gmail.com' },
  { usn: '25SUPMCAGL004', name: 'AJAY S B', email: 'ajay937366@gmail.com' },
  { usn: '25SUPMCAGL005', name: 'AKSHAY S G', email: 'akshaysg0002@gmail.com' },
  { usn: '25SUPMCAGL006', name: 'ANKITHA RASHMI REDDY', email: 'ankitharashmireddy@gmail.com' },
  { usn: '25SUPMCAGL007', name: 'ANUJITH M', email: 'nanthuanujith@gmail.com' },
  { usn: '25SUPMCAGL008', name: 'APEKSHA H K', email: 'apekshahk4@gmail.com' },
  { usn: '25SUPMCAGL009', name: 'ASHITOSH SUTAR', email: 'ashitoshsutar18@gmail.com' },
  { usn: '25SUPMCAGL010', name: 'ASRA FATHIMA', email: 'ghasra482@gmail.com' },
  { usn: '25SUPMCAGL011', name: 'B M SIVA SAI KRISHNA REDDY', email: 'bmsivasaikrishnareddy@gmail.com' },
  { usn: '25SUPMCAGL012', name: 'BABU K', email: 'babukb440@gmail.com' },
  { usn: '25SUPMCAGL013', name: 'BASAVARAJ', email: 'basavarajmashatte7@gmail.com' },
  { usn: '25SUPMCAGL014', name: 'BENITA ANN TITUS', email: 'benitaann0804@gmail.com' },
  { usn: '25SUPMCAGL015', name: 'BHAVANA K B', email: 'kbbhavana845@gmail.com' },
  { usn: '25SUPMCAGL016', name: 'BHOOMIKA PRASAD T', email: 'bhoomikaprasadt@gmail.com' },
  { usn: '25SUPMCAGL017', name: 'CHAITANYA V', email: 'chaitanyav715143@gmail.com' },
  { usn: '25SUPMCAGL018', name: 'CHANDAN GOWDA D A', email: 'chandangda6@gmail.com' },
  { usn: '25SUPMCAGL019', name: 'CHANDAN GOWDA M U', email: 'chandangowdamu@gmail.com' },
  { usn: '25SUPMCAGL020', name: 'CHANDRIKA R', email: 'chandrikar9035@gmail.com' },
  { usn: '25SUPMCAGL021', name: 'CHAYA L K', email: 'chayalk575@gmail.com' },
  { usn: '25SUPMCAGL022', name: 'CHETHAN N S', email: 'chethangowda1944@gmail.com' },
  { usn: '25SUPMCAGL023', name: 'CHIDANAND GOWDA', email: 'chidanand5125@gmail.com' },
  { usn: '25SUPMCAGL024', name: 'D M TEJASWINI', email: 'dmltt2003@gmail.com' },
  { usn: '25SUPMCAGL025', name: 'DARSHAN BADIGER', email: 'darshanbadiger872@gmail.com' },
  { usn: '25SUPMCAGL026', name: 'DARSHAN VINAYAK HEGDE', email: 'darshanhegdehegde@gmail.com' },
  { usn: '25SUPMCAGL027', name: 'DEEKSHITHA K', email: 'deekshithak006@gmail.com' },
  { usn: '25SUPMCAGL028', name: 'DEEPIKA A C', email: 'deepikaac2004@gmail.com' },
  { usn: '25SUPMCAGL029', name: 'DEVIKA V', email: 'devishetty1409@gmail.com' },
  { usn: '25SUPMCAGL030', name: 'DHANUJA SANTHOSH', email: 'dhanuja400@gmail.com' },
  { usn: '25SUPMCAGL031', name: 'DHANUSH B', email: 'db9035292@gmail.com' },
  { usn: '25SUPMCAGL032', name: 'DHANUSHREE KS', email: 'dhanushreeks16@gmail.com' },
  { usn: '25SUPMCAGL033', name: 'DIVYA C', email: 'divya.chandrappa0304@gmail.com' },
  { usn: '25SUPMCAGL034', name: 'GAGAN R', email: 'gaganacharya.r@gmail.com' },
  { usn: '25SUPMCAGL035', name: 'GIRISH K', email: 'girish.kgiri2003@gmail.com' },
  { usn: '25SUPMCAGL036', name: 'GIRISH M C', email: 'girishmc448@gmail.com' },
  { usn: '25SUPMCAGL037', name: 'GUDLA SWATHI', email: 'swathi53852@gmail.com' },
  { usn: '25SUPMCAGL038', name: 'GURUKIRAN H A', email: 'guru53345@gmail.com' },
  { usn: '25SUPMCAGL039', name: 'H R MANOJ GOWDA', email: 'manojgowdahr7@gmail.com' },
  { usn: '25SUPMCAGL040', name: 'HARISH GOWDA K', email: 'hariharishgowda1825@gmail.com' },
  { usn: '25SUPMCAGL041', name: 'HARSHA GOWDA G R', email: 'gowdaharsha631@gmail.com' },
  { usn: '25SUPMCAGL042', name: 'HARSHA KIRAN K B', email: 'harshakirankb@gmail.com' },
  { usn: '25SUPMCAGL043', name: 'HARSHAVARDHAN A V', email: 'harshavardhan.a.v007@gmail.com' },
  { usn: '25SUPMCAGL044', name: 'HARSHAVARDHANA N', email: 'harshavardhan.raj18@gmail.com' },
  { usn: '25SUPMCAGL045', name: 'HEMANTH H', email: 'hemanthgowda4002@gmail.com' },
  { usn: '25SUPMCAGL046', name: 'JAGRUTHI D', email: 'jagruthid83@gmail.com' },
  { usn: '25SUPMCAGL047', name: 'JAYANTH G', email: 'gjayanth244@gmail.com' },
  { usn: '25SUPMCAGL048', name: 'JEEVITHA M N', email: 'jeevithamn537@gmail.com' },
  { usn: '25SUPMCAGL049', name: 'K M KANNIKA', email: 'kmkannika2004@gmail.com' },
  { usn: '25SUPMCAGL050', name: 'K P HEMITHA', email: 'kphemitha08@gmail.com' },
  { usn: '25SUPMCAGL051', name: 'KARTHIK B N', email: 'karthikbn209@gmail.com' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedback-collector');
    console.log('Connected to MongoDB');

    await Student.deleteMany({});
    console.log('Cleared existing students');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('MCAA@123', salt);

    const studentsWithPassword = students.map(s => ({
      ...s,
      password: hashedPassword,
      role: 'student',
      classGroup: 'MCA, 1st Year, 2nd Sem, A sec',
    }));

    await Student.insertMany(studentsWithPassword);
    console.log(`Inserted ${students.length} students with password "MCAA@123"`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
