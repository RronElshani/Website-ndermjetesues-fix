const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');

// Validation rules
const reviewValidation = [
    body('service_id').isInt().withMessage('Service ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('komenti').optional().trim()
];

// Public routes
router.get('/service/:serviceId', reviewController.getByService);

// Protected routes
router.post('/', authMiddleware, reviewValidation, reviewController.create);
router.put('/:id', authMiddleware, reviewController.update);
router.delete('/:id', authMiddleware, reviewController.delete);

module.exports = router;
