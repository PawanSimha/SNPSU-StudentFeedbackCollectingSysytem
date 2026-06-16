const express = require('express');
const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Allotment = require('../models/Allotment');
const PublicFeedback = require('../models/PublicFeedback');
const { protect } = require('../middleware/auth');
const { SUBJECTS } = require('../config/subjects');

const router = express.Router();

router.use(protect);

router.use((req, res, next) => {
  if (req.student.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
});

const CLASSES = [
  'MCA, 1st Year, 2nd Sem, A sec',
  'MCA, 1st Year, 2nd Sem, B sec',
  'MCA, 1st Year, 2nd Sem, C sec',
];

router.get('/classes', (req, res) => {
  res.json(CLASSES);
});

router.get('/students', async (req, res) => {
  try {
    const classFilter = req.query.class && req.query.class !== 'all'
      ? { classGroup: req.query.class }
      : {};
    const students = await Student.find({ role: 'student', ...classFilter })
      .select('name email usn classGroup')
      .sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const buildFeedbackFilter = (req) => {
  const filter = {};

  if (req.query.class && req.query.class !== 'all') {
    filter.classGroup = req.query.class;
  }

  if (req.query.student) {
    filter.student = req.query.student;
  }

  if (req.params.subject) {
    filter.subject = req.params.subject;
  }

  return filter;
};

router.get('/feedback', async (req, res) => {
  try {
    const fbFilter = buildFeedbackFilter(req);

    let query = {};
    if (fbFilter.classGroup) {
      const students = await Student.find({ role: 'student', classGroup: fbFilter.classGroup }).select('_id');
      const ids = students.map(s => s._id);
      query = ids.length ? { student: { $in: ids } } : { _id: null };
    }

    if (fbFilter.student) {
      query = { ...query, student: fbFilter.student };
    }

    const feedbacks = await Feedback.find(query)
      .populate('student', 'name email usn classGroup')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feedback/stats', async (req, res) => {
  try {
    const fbFilter = buildFeedbackFilter(req);

    let query = { role: 'student' };
    if (fbFilter.classGroup) {
      query.classGroup = fbFilter.classGroup;
    }

    const totalStudents = await Student.countDocuments(query);
    const studentsInClass = await Student.find(query).select('_id');
    const studentIds = studentsInClass.map(s => s._id);

    let feedbackFilter = studentIds.length
      ? { student: { $in: studentIds } }
      : { _id: null };

    if (fbFilter.student) {
      feedbackFilter = { student: fbFilter.student };
    }

    const totalFeedbacks = await Feedback.countDocuments(feedbackFilter);
    const subjects = await Feedback.distinct('subject', feedbackFilter);

    res.json({
      totalStudents,
      totalFeedbacks,
      totalSubjects: subjects.length || SUBJECTS.length,
      subjects: subjects.length ? subjects : SUBJECTS,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feedback/subject/:subject', async (req, res) => {
  try {
    const fbFilter = buildFeedbackFilter(req);

    let query = { subject: fbFilter.subject };
    if (fbFilter.classGroup) {
      const students = await Student.find({ role: 'student', classGroup: fbFilter.classGroup }).select('_id');
      const ids = students.map(s => s._id);
      query.student = ids.length ? { $in: ids } : null;
    }

    if (fbFilter.student) {
      query.student = fbFilter.student;
    }

    const feedbacks = await Feedback.find(query)
      .populate('student', 'name email usn classGroup')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feedback/subject/:subject/coverage', async (req, res) => {
  try {
    const classGroup = req.query.class;
    if (!classGroup) {
      return res.status(400).json({ message: 'Class query param required' });
    }

    const subject = req.params.subject;
    const studentsInClass = await Student.find({ role: 'student', classGroup }).select('name email usn');
    const totalStudents = studentsInClass.length;

    const feedbacks = await Feedback.find({ subject })
      .populate('student', 'name email usn classGroup');

    const gaveStudentIds = new Set(
      feedbacks.filter(f => f.student?.classGroup === classGroup).map(f => f.student._id.toString())
    );

    const gaveStudents = studentsInClass.filter(s => gaveStudentIds.has(s._id.toString()));
    const notGivenStudents = studentsInClass.filter(s => !gaveStudentIds.has(s._id.toString()));

    const gaveCount = gaveStudents.length;
    const notGivenCount = notGivenStudents.length;
    const gavePercent = totalStudents ? Math.round((gaveCount / totalStudents) * 100) : 0;
    const notGivenPercent = totalStudents ? 100 - gavePercent : 0;

    res.json({
      totalStudents,
      gaveCount,
      notGivenCount,
      gavePercent,
      notGivenPercent,
      gaveStudents,
      notGivenStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/db-overview', async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort({ classGroup: 1, name: 1 }).lean();
    const feedbacks = await Feedback.find().populate('student', 'name usn email classGroup').sort({ createdAt: -1 }).lean();
    const allotments = await Allotment.find().sort({ classGroup: 1 }).lean();
    const publicFeedbacks = await PublicFeedback.find().sort({ createdAt: -1 }).lean();

    const classGroups = {};
    students.forEach(s => {
      const key = s.classGroup || 'Unassigned';
      if (!classGroups[key]) classGroups[key] = { total: 0, students: [] };
      classGroups[key].total++;
      classGroups[key].students.push({ name: s.name, usn: s.usn, email: s.email, role: s.role });
    });

    const subjectStats = {};
    SUBJECTS.forEach(sub => {
      const fb = feedbacks.filter(f => f.subject === sub);
      subjectStats[sub] = { total: fb.length, uniqueStudents: new Set(fb.map(f => f.student?._id?.toString())).size };
    });

    const sanitizedFeedbacks = feedbacks.map(f => ({
      _id: f._id,
      subject: f.subject,
      comments: f.comments,
      createdAt: f.createdAt,
      student: f.student ? { name: f.student.name, usn: f.student.usn, email: f.student.email, classGroup: f.student.classGroup } : null,
    }));

    res.json({
      collections: {
        students: { count: students.length, classGroups, all: students.map(s => ({ _id: s._id, name: s.name, usn: s.usn, email: s.email, classGroup: s.classGroup, role: s.role })) },
        feedbacks: { count: feedbacks.length, subjectStats, totalSubjects: SUBJECTS.length, all: sanitizedFeedbacks },
        allotments: { count: allotments.length, all: allotments.map(a => ({ _id: a._id, classGroup: a.classGroup, isOpen: a.isOpen, message: a.message, allottedAt: a.allottedAt })) },
        publicFeedbacks: { count: publicFeedbacks.length, all: publicFeedbacks },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
