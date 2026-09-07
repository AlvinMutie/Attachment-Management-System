const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadCSV } = require('../middleware/uploadMiddleware');
const {
    getInstitutionalStudents,
    getInstitutionalPlacements,
    reviewPlacement,
    createInstitutionalStudent,
    getInstitutionalSupervisors,
    assignSupervisor,
    getInstitutionalAttendance,
    bulkOnboardStudents,
    getInstitutionalAnalytics,
    generateInstitutionalPDF
} = require('../controllers/adminController');

// All routes require authentication and school_admin role
router.use(protect);
router.use(authorize('school_admin'));

// Student Management & Placements
router.get('/students', getInstitutionalStudents);
router.post('/students', createInstitutionalStudent);
router.post('/students/bulk', uploadCSV, bulkOnboardStudents);
router.get('/placements', getInstitutionalPlacements);
router.put('/placements/:id/review', reviewPlacement);

// Supervisor Management & Assignment
router.get('/supervisors', getInstitutionalSupervisors);
router.post('/assign-supervisor', assignSupervisor);

// Attendance
router.get('/attendance', getInstitutionalAttendance);

// Analytics & Reporting
router.get('/analytics', getInstitutionalAnalytics);
router.get('/report', generateInstitutionalPDF);

module.exports = router;
