const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedback-collector');
    console.log('Connected to MongoDB');

    const existing = await Student.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      console.log('Admin already exists, updating...');
      const salt = await bcrypt.genSalt(10);
      existing.password = await bcrypt.hash('iamadmin', salt);
      existing.role = 'admin';
      existing.usn = '1234567890';
      await existing.save();
      console.log('Admin updated');
    } else {
      const salt = await bcrypt.genSalt(10);
      await Student.create({
        name: 'Pawan Simha',
        email: 'admin@gmail.com',
        usn: '1234567890',
        password: await bcrypt.hash('iamadmin', salt),
        role: 'admin',
      });
      console.log('Admin created');
    }

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed admin error:', error);
    process.exit(1);
  }
};

seedAdmin();
