const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getOverviewAnalytics,
    getStudentAnalytics,
    getSupervisorAnalytics,
    getDataQualityAudit
} = require('../controllers/analyticsController');

// All analytics routes require authentication
router.use(protect);

// Institutional Overview
router.get('/overview', authorize('school_admin', 'attachment_coordinator', 'super_admin'), getOverviewAnalytics);

// Data Quality Audit
router.get('/data-quality', authorize('school_admin', 'attachment_coordinator', 'super_admin'), getDataQualityAudit);

// Supervisor Mentee Analytics
router.get('/supervisor', authorize('industry_supervisor', 'university_supervisor'), getSupervisorAnalytics);

// Student Personal Analytics
router.get('/student/:id?', getStudentAnalytics);

module.exports = router;
