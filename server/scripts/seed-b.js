const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Student = require('../models/Student');

const students = [
  { usn: '25SUPMCAGL052', name: 'KARTHIK K', email: 'karthikkarthik13179@gmail.com' },
  { usn: '25SUPMCAGL053', name: 'KARTHIK M', email: 'karthikkarthikm789@gmail.com' },
  { usn: '25SUPMCAGL054', name: 'KAUSHIK B S', email: 'Kaushik2112004@gmail.com' },
  { usn: '25SUPMCAGL055', name: 'KAVANA H S', email: 'kavanakavanahs64@gmail.com' },
  { usn: '25SUPMCAGL056', name: 'KAVANA S M', email: 'kavanakavyasm@gmail.com' },
  { usn: '25SUPMCAGL057', name: 'KAVYA H R', email: 'kavyahrkavya136@gmail.com' },
  { usn: '25SUPMCAGL058', name: 'KEERTHI KUSHI S', email: 'keerthikushi018@gmail.com' },
  { usn: '25SUPMCAGL059', name: 'KEERTHI M R', email: 'keerthinayak106@gmail.com' },
  { usn: '25SUPMCAGL060', name: 'KESHAV DEVANAND BONGALE', email: 'keshavbongale85@gmail.com' },
  { usn: '25SUPMCAGL061', name: 'KESHAV K S', email: 'keshvapadma@gmail.com' },
  { usn: '25SUPMCAGL062', name: 'KHUSHI C G', email: 'cgkhushi28@gmail.com' },
  { usn: '25SUPMCAGL063', name: 'LATHASHREE G C', email: 'lathasoumya678@gmail.com' },
  { usn: '25SUPMCAGL064', name: 'LEKHANA B M', email: 'lekhanabm05@gmail.com' },
  { usn: '25SUPMCAGL065', name: 'LIKHITHA N M', email: 'likhithg548@gmail.com' },
  { usn: '25SUPMCAGL066', name: 'LIKHITH GOWDA D N', email: 'likhithanm2004@gmail.com' },
  { usn: '25SUPMCAGL067', name: 'MAHESH C R', email: 'maheshcr2904@gmail.com' },
  { usn: '25SUPMCAGL068', name: 'MAHESH G P', email: 'maheshgp925@gmail.com' },
  { usn: '25SUPMCAGL069', name: 'MAMATHA R', email: 'mamathabr2020@gmail.com' },
  { usn: '25SUPMCAGL070', name: 'MANASA', email: 'mca8296@gmail.com' },
  { usn: '25SUPMCAGL071', name: 'MANASA KRISHNA HEGDE', email: 'manasakhegde86@gmail.com' },
  { usn: '25SUPMCAGL072', name: 'MANASA L', email: 'manasa0047@gmail.com' },
  { usn: '25SUPMCAGL073', name: 'MANJUNATHA S D', email: 'manjuknr613@gmail.com' },
  { usn: '25SUPMCAGL074', name: 'MANOJ B M', email: 'manojbm27@gmail.com' },
  { usn: '25SUPMCAGL075', name: 'MANOJ KUMAR A', email: 'kmanoj7382@gmail.com' },
  { usn: '25SUPMCAGL076', name: 'MANU KUMAR T', email: 'kumarmanu6818@gmail.com' },
  { usn: '25SUPMCAGL077', name: 'MARUTHI A', email: 'maruthi0666@gmail.com' },
  { usn: '25SUPMCAGL078', name: 'M D SAMEER', email: 'Sameer428557@gmail.com' },
  { usn: '25SUPMCAGL079', name: 'MITHUN R', email: 'mithunrr039@gmail.com' },
  { usn: '25SUPMCAGL080', name: 'MOHAMMED TOUFIQ', email: 'mohammedtoufiq@27kgmail.com' },
  { usn: '25SUPMCAGL081', name: 'MONIKA G', email: 'monikaediga02@gmail.com' },
  { usn: '25SUPMCAGL082', name: 'MONIKA N', email: 'monikangowda1404@gmail.com' },
  { usn: '25SUPMCAGL083', name: 'MUTHU S V', email: 'muthufrnds56@gmail.com' },
  { usn: '25SUPMCAGL084', name: 'NANDEESH P B', email: 'nandeeshpb4@gmail.com' },
  { usn: '25SUPMCAGL085', name: 'NITHIN KUMAR T C', email: 'nithinkumartc01@gmail.com' },
  { usn: '25SUPMCAGL086', name: 'NITHIN M L', email: 'nithinml0402@gmail.com' },
  { usn: '25SUPMCAGL087', name: 'NITHYASHREE A', email: 'nithyashreee964@gmail.com' },
  { usn: '25SUPMCAGL088', name: 'PARVATH RAJ R', email: 'parvathrajr@gmail.com' },
  { usn: '25SUPMCAGL089', name: 'PAWAN SIMHA R', email: 'iampawansimma.2004@gmail.com' },
  { usn: '25SUPMCAGL090', name: 'POOJA T R', email: 'poojapooja09766@gmail.com' },
  { usn: '25SUPMCAGL091', name: 'PRAGATHI K S', email: 'pragathigowda911@gmail.com' },
  { usn: '25SUPMCAGL092', name: 'PRAJWAL A P', email: 'prajjuap268@gmail.com' },
  { usn: '25SUPMCAGL093', name: 'PRAJWAL H K', email: 'prajuprajwal500@gmail.com' },
  { usn: '25SUPMCAGL094', name: 'PRAJWAL N', email: 'prajwalnp466@gmail.com' },
  { usn: '25SUPMCAGL095', name: 'PRAJWAL R', email: 'rajuprajwal2002@gmail.com' },
  { usn: '25SUPMCAGL096', name: 'PRATHIBHA K R', email: 'krprathibha37@gmail.com' },
  { usn: '25SUPMCAGL097', name: 'R VIVEK KARTHIK PRASAD', email: 'vivekkarthik16@gmail.com' },
  { usn: '25SUPMCAGL098', name: 'RAGHU K N', email: 'raghukn.2003@gmail.com' },
  { usn: '25SUPMCAGL099', name: 'RAHUL KATAGERI', email: 'rahulkatageri99@gmail.com' },
  { usn: '25SUPMCAGL100', name: 'RAHUL R', email: 'rahui.r.v.5998@gmail.com' },
  { usn: '25SUPMCAGL101', name: 'RAJASHREE V', email: 'rajashreev104@gmail.com' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedback-collector');
    console.log('Connected to MongoDB');

    await Student.deleteMany({ classGroup: 'MCA, 1st Year, 2nd Sem, B sec' });
    console.log('Cleared existing B section students');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('MCAB@123', salt);

    const studentsWithPassword = students.map(s => ({
      ...s,
      password: hashedPassword,
      role: 'student',
      classGroup: 'MCA, 1st Year, 2nd Sem, B sec',
    }));

    await Student.insertMany(studentsWithPassword);
    console.log(`Inserted ${students.length} B section students with password "MCAB@123"`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
