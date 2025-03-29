const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../middleware/validateRequest');

// Get current user profile
router.get('/me', authenticate, userController.getProfile);

// Update user profile
router.put(
  '/me',
  authenticate,
  [
    body('name').optional(),
    body('email').optional().isEmail().withMessage('Valid email is required')
  ],
  validateRequest,
  userController.updateProfile
);

// Get user credits
router.get('/credits', authenticate, userController.getCredits);

// Purchase credits
router.post('/purchase-credits', authenticate, userController.purchaseCredits);

module.exports = router;
