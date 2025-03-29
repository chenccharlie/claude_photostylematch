const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const validateRequest = require('../middleware/validateRequest');

// Register with email and password
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validateRequest,
  authController.register
);

// Login with email and password
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  authController.login
);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

// Apple OAuth routes
router.get(
  '/apple',
  passport.authenticate('apple', { scope: ['name', 'email'] })
);

router.get(
  '/apple/callback',
  passport.authenticate('apple', { session: false }),
  authController.appleCallback
);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Request password reset
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validateRequest,
  authController.forgotPassword
);

// Reset password with token
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  validateRequest,
  authController.resetPassword
);

module.exports = router;
