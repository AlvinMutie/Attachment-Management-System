const express = require('express');
const router = express.Router();
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');
const {
    getDashboardAnalytics,
    getAllSchools,
    createSchool,
    updateSchool,
    toggleSchoolStatus,
    getGlobalUsers,
    updateUserRole,
    resetUserPassword,
    resetSchoolAdminPassword,
    toggleUserLock,
    getAuditLogs,
    getSystemHealth,
    impersonateUser,
    resetPasswordDirect
} = require('../controllers/superadminController');
const { uploadLogo } = require('../middleware/uploadMiddleware');

// All routes require authentication and super_admin role
router.use(protect);
router.use(requireSuperAdmin);

// Dashboard
router.get('/dashboard', getDashboardAnalytics);

// School Management
router.get('/schools', getAllSchools);
router.post('/schools', uploadLogo, createSchool);
router.put('/schools/:id', uploadLogo, updateSchool);
router.patch('/schools/:id/status', toggleSchoolStatus);
router.post('/schools/:id/reset-admin-password', resetSchoolAdminPassword);

// User Management
router.get('/users', getGlobalUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/users/:id/reset-password', resetUserPassword);
router.patch('/users/:id/lock', toggleUserLock);
router.post('/users/:id/reset-password-direct', resetPasswordDirect);
router.post('/users/:id/impersonate', impersonateUser);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// System Health
router.get('/system-health', getSystemHealth);

module.exports = router;
