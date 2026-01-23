const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pervojaController = require('../controllers/pervojaController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Validation rules
const pervojaValidation = [
    body('pozicioni').trim().notEmpty().withMessage('Position is required'),
    body('kompania').trim().notEmpty().withMessage('Company is required'),
    body('data_fillimit').isDate().withMessage('Start date is required')
];

// Protected routes - professionals only
router.post('/', authMiddleware, roleMiddleware('profesionist'), pervojaValidation, pervojaController.create);
router.get('/my', authMiddleware, pervojaController.getMyExperience);
router.put('/:id', authMiddleware, pervojaController.update);
router.delete('/:id', authMiddleware, pervojaController.delete);

// Public route - get user's experience
router.get('/user/:userId', pervojaController.getByUserId);

module.exports = router;
