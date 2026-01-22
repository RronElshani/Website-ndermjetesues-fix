const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Validation rules
const serviceValidation = [
    body('titulli').trim().notEmpty().withMessage('Title is required'),
    body('pershkrimi').trim().notEmpty().withMessage('Description is required'),
    body('cmimi').isNumeric().withMessage('Valid price is required'),
    body('kategoria').trim().notEmpty().withMessage('Category is required'),
    body('qyteti').trim().notEmpty().withMessage('City is required')
];

// Public routes
router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getById);

// Protected routes (require authentication)
router.post('/', authMiddleware, roleMiddleware('profesionist'), serviceValidation, serviceController.create);
router.get('/user/my-services', authMiddleware, serviceController.getMyServices);
router.put('/:id', authMiddleware, serviceController.update);
router.delete('/:id', authMiddleware, serviceController.delete);

module.exports = router;
