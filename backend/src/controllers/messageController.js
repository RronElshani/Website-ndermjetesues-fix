const Message = require('../models/Message');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const messageController = {
    /**
     * Get all conversations for the current user
     * GET /api/messages/conversations
     */
    async getConversations(req, res) {
        try {
            const conversations = await Message.getConversations(req.user.id);
            res.json({
                success: true,
                data: conversations
            });
        } catch (error) {
            console.error('Get conversations error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch conversations'
            });
        }
    },

    /**
     * Get messages with a specific user
     * GET /api/messages/:userId
     */
    async getMessages(req, res) {
        try {
            const otherUserId = parseInt(req.params.userId);

            // Verify the other user exists
            const otherUser = await User.findById(otherUserId);
            if (!otherUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const messages = await Message.getMessages(req.user.id, otherUserId);

            // Mark messages as read
            await Message.markAsRead(req.user.id, otherUserId);

            res.json({
                success: true,
                data: {
                    messages,
                    otherUser: {
                        id: otherUser.id,
                        emri: otherUser.emri,
                        mbiemri: otherUser.mbiemri,
                        profile_picture: otherUser.profile_picture
                    }
                }
            });
        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch messages'
            });
        }
    },

    /**
     * Send a message
     * POST /api/messages
     */
    async sendMessage(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { receiver_id, mesazhi } = req.body;

            // Can't message yourself
            if (receiver_id === req.user.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot send message to yourself'
                });
            }

            // Verify receiver exists
            const receiver = await User.findById(receiver_id);
            if (!receiver) {
                return res.status(404).json({
                    success: false,
                    message: 'Recipient not found'
                });
            }

            const message = await Message.create({
                sender_id: req.user.id,
                receiver_id,
                mesazhi
            });

            res.status(201).json({
                success: true,
                data: message
            });
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message'
            });
        }
    },

    /**
     * Mark messages from a user as read
     * PUT /api/messages/read/:userId
     */
    async markAsRead(req, res) {
        try {
            const senderId = parseInt(req.params.userId);
            const count = await Message.markAsRead(req.user.id, senderId);

            res.json({
                success: true,
                message: `Marked ${count} messages as read`
            });
        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark messages as read'
            });
        }
    },

    /**
     * Get unread message count
     * GET /api/messages/unread/count
     */
    async getUnreadCount(req, res) {
        try {
            const count = await Message.getUnreadCount(req.user.id);
            res.json({
                success: true,
                data: { count }
            });
        } catch (error) {
            console.error('Get unread count error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get unread count'
            });
        }
    }
};

module.exports = messageController;
