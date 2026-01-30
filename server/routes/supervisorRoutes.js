const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getLivePresence } = require('../controllers/supervisorController');

// All routes require authentication and industry_supervisor role
router.use(protect);
router.use(authorize('industry_supervisor'));

router.get('/presence', getLivePresence);

module.exports = router;
