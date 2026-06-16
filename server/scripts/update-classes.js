const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/feedback-collector').then(async () => {
  const r = await mongoose.connection.db.collection('students').updateMany(
    { role: 'student', classGroup: { $exists: false } },
    { $set: { classGroup: 'MCA, 1st Year, 2nd Sem, A sec' } }
  );
  console.log(`Updated ${r.modifiedCount} students with classGroup`);

  const count = await mongoose.connection.db.collection('students').countDocuments({ role: 'student' });
  console.log(`Total students: ${count}`);
  process.exit(0);
});
