const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadLogbook } = require('../middleware/uploadMiddleware');
const {
    getStudentProfile,
    updateStudentPlacement,
    getStudentProgress,
    getStudentAttendance,
    recordStudentCheckIn,
    getStudentAssessments,
    submitLogbook,
    getMyLogbooks,
    refineLogbookSummary
} = require('../controllers/studentController');

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// Profile & Placement
router.get('/profile', getStudentProfile);
router.get('/placement', getStudentProfile);
router.put('/placement', updateStudentPlacement);
router.post('/placement', updateStudentPlacement);

// Progress Overview
router.get('/progress', getStudentProgress);

// Attendance
router.get('/attendance', getStudentAttendance);
router.post('/attendance/check-in', recordStudentCheckIn);

// Assessments
router.get('/assessments', getStudentAssessments);

// Logbooks
router.post('/logbooks', uploadLogbook, submitLogbook);
router.get('/logbooks', getMyLogbooks);
router.post('/logbooks/refine', refineLogbookSummary);

module.exports = router;
