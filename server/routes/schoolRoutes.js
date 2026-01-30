const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMySchool, updateMySchool } = require('../controllers/schoolController');
const { uploadLogo } = require('../middleware/uploadMiddleware');

// All routes require authentication and school_admin role
router.use(protect);
router.use(authorize('school_admin'));

router.get('/my-school', getMySchool);
router.put('/my-school', uploadLogo, updateMySchool);

module.exports = router;
