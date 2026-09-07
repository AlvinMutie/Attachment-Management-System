const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getStudentInsightsAndRisk,
    getInterventionQueue,
    getModelRegistry
} = require('../controllers/insightController');

// All insight routes require authentication
router.use(protect);

// Institutional Intervention Queue
router.get('/queue', authorize('school_admin', 'attachment_coordinator', 'super_admin'), getInterventionQueue);

// Model Registry Governance
router.get('/models', authorize('school_admin', 'attachment_coordinator', 'super_admin'), getModelRegistry);

// Student Risk Score & Explainable Insights
router.get('/student/:id?', getStudentInsightsAndRisk);

module.exports = router;
