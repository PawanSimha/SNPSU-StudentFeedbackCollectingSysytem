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
