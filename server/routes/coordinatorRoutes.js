const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// All coordinator routes require authentication and attachment_coordinator, school_admin, or super_admin role
router.use(authMiddleware);
router.use(roleMiddleware(['attachment_coordinator', 'school_admin', 'super_admin']));

// Dashboard telemetry & metrics
router.get('/dashboard', coordinatorController.getDashboard);

// Prioritized attention queue
router.get('/attention-queue', coordinatorController.getAttentionQueue);

// Placements coordination
router.get('/placements', coordinatorController.getPlacements);
router.get('/placements/:id', coordinatorController.getPlacementById);

// Supervisor allocation & reassignment
router.post('/assign-supervisor', coordinatorController.assignOrReassignSupervisor);
router.put('/reassign-supervisor', coordinatorController.assignOrReassignSupervisor);
router.get('/supervisors', coordinatorController.getSupervisors);

// Organization host company directory
router.get('/organizations', coordinatorController.getOrganizations);
router.post('/organizations', coordinatorController.createOrganization);

// Academic oversight & completion readiness
router.get('/academic-overview', coordinatorController.getAcademicOverview);
router.get('/completion-readiness', coordinatorController.getCompletionReadiness);
router.get('/supervision', coordinatorController.getSupervisionOversight);

module.exports = router;
