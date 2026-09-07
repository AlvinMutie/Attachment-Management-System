const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAssignedStudents,
    getLivePresence,
    getSupervisorLogbooks,
    reviewLogbook,
    getSupervisorAttendance,
    markSupervisorAttendance,
    getSupervisorAssessments,
    submitSupervisorAssessment,
    getSupervisorWorkspace
} = require('../controllers/supervisorController');

// All routes require authentication and industry_supervisor role
router.use(protect);
router.use(authorize('industry_supervisor'));

// Unified Industry Supervisor Workspace
router.get('/workspace', getSupervisorWorkspace);

// Students
router.get('/students', getAssignedStudents);
router.get('/presence', getLivePresence);

// Logbooks
router.get('/logbooks', getSupervisorLogbooks);
router.put('/logbooks/:id/review', reviewLogbook);

// Attendance
router.get('/attendance', getSupervisorAttendance);
router.post('/attendance/mark', markSupervisorAttendance);

// Assessments
router.get('/assessments', getSupervisorAssessments);
router.post('/assessments', submitSupervisorAssessment);

module.exports = router;
