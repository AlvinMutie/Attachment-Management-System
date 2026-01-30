const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMyStudents } = require('../controllers/universityController');

router.use(protect);
router.use(authorize('university_supervisor'));

router.get('/my-students', getMyStudents);

module.exports = router;
