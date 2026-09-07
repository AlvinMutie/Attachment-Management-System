const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// All report routes require school_admin or super_admin roles
router.use(authMiddleware);
router.use(roleMiddleware(['school_admin', 'super_admin']));

// Placements report
router.get('/placements', reportController.getPlacementReport);

// Attendance report
router.get('/attendance', reportController.getAttendanceReport);

// Logbooks report
router.get('/logbooks', reportController.getLogbookReport);

// Assessments report
router.get('/assessments', reportController.getAssessmentReport);

// Supervisor workload report
router.get('/supervisor-workload', reportController.getSupervisorWorkloadReport);

// Operational alerts report
router.get('/operational-alerts', reportController.getOperationalAlertsReport);

module.exports = router;
