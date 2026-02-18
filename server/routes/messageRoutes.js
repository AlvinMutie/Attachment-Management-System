const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages, markAsRead, getContacts } = require('../controllers/messageController');

router.use(protect);

router.post('/', sendMessage);
router.get('/contacts', getContacts);
router.get('/:userId', getMessages);
router.put('/read', markAsRead);

module.exports = router;
