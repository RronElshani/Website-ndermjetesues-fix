const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// Visitor analytics
router.get('/visitors', adminController.getVisitorStats);

// User management
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Service management
router.get('/services', adminController.getAllServices);
router.delete('/services/:id', adminController.deleteAnyService);

module.exports = router;
