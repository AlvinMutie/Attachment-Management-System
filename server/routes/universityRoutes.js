const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getMyStudents,
    getStudentOverview,
    getUniversityAssessments,
    submitUniversityAssessment,
    getUniversityWorkspace
} = require('../controllers/universityController');

// All routes require authentication and university_supervisor role
router.use(protect);
router.use(authorize('university_supervisor'));

// Unified University Supervisor Workspace
router.get('/workspace', getUniversityWorkspace);

// Students
router.get('/my-students', getMyStudents);
router.get('/student/:id/overview', getStudentOverview);

// Assessments
router.get('/assessments', getUniversityAssessments);
router.post('/assessments', submitUniversityAssessment);

module.exports = router;
