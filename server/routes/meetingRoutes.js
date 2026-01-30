const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createMeeting, getMeetings, respondToMeeting } = require('../controllers/meetingController');

router.use(protect);

router.post('/', createMeeting);
router.get('/', getMeetings);
router.patch('/:id/respond', respondToMeeting);

module.exports = router;
