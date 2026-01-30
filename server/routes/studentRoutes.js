const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadLogbook } = require('../middleware/uploadMiddleware');
const { submitLogbook, getMyLogbooks, refineLogbookSummary } = require('../controllers/studentController');

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

router.post('/logbooks', uploadLogbook, submitLogbook);
router.get('/logbooks', getMyLogbooks);
router.post('/logbooks/refine', refineLogbookSummary);

module.exports = router;
