const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/auth');

// Validation rules
const messageValidation = [
    body('receiver_id').isInt().withMessage('Receiver ID is required'),
    body('mesazhi').trim().notEmpty().withMessage('Message cannot be empty')
];

// All routes require authentication
router.use(authMiddleware);

// Get all conversations
router.get('/conversations', messageController.getConversations);

// Get unread count
router.get('/unread/count', messageController.getUnreadCount);

// Get messages with specific user
router.get('/:userId', messageController.getMessages);

// Send a message
router.post('/', messageValidation, messageController.sendMessage);

// Mark messages as read
router.put('/read/:userId', messageController.markAsRead);

module.exports = router;
