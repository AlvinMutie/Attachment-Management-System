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
    getStudentWorkspace,
    updateLogbook
} = require('../controllers/studentController');

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// Unified Student Workspace
router.get('/workspace', getStudentWorkspace);

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
router.put('/logbooks/:id', uploadLogbook, updateLogbook);

module.exports = router;
