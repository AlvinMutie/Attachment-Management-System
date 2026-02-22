const express = require('express');
const router = express.Router();

const { submitInquiry, getInquiries } = require('../controllers/inquiryController');
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');

// Public route - any school can submit an inquiry
router.post('/', submitInquiry);

// Super admin protected route - view all inquiries
router.get('/', protect, requireSuperAdmin, getInquiries);

module.exports = router;
