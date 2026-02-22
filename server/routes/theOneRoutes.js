const express = require('express');
const router = express.Router();
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');
const {
    getSystemMetrics,
    executeRawQuery,
    impersonateUser
} = require('../controllers/theOneController');

// All routes require authentication and super_admin role
router.use(protect);
router.use(requireSuperAdmin);

router.get('/metrics', getSystemMetrics);
router.post('/query', executeRawQuery);
router.post('/impersonate', impersonateUser);

module.exports = router;
