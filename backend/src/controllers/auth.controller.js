const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const passport = require('passport');
const crypto = require('crypto');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'email',
      freeEditsUsed: 0,
      creditBalance: 0
    });

    // Generate token
    const token = generateToken(user);

    // Return user info and token
    return res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          creditBalance: user.creditBalance,
          freeEditsUsed: user.freeEditsUsed
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login with email and password
exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: info.message || 'Authentication failed'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user info and token
    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          creditBalance: user.creditBalance,
          freeEditsUsed: user.freeEditsUsed
        },
        token
      }
    });
  })(req, res, next);
};

// Google OAuth callback
exports.googleCallback = (req, res) => {
  // User is already authenticated by passport
  const token = generateToken(req.user);

  // Redirect to frontend with token
  // In production, use a more secure method for token transfer
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

// Apple OAuth callback
exports.appleCallback = (req, res) => {
  // User is already authenticated by passport
  const token = generateToken(req.user);

  // Redirect to frontend with token
  // In production, use a more secure method for token transfer
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is required'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid or expired token'
        });
      }

      // Find user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Generate new token
      const newToken = generateToken(user);

      // Return new token
      return res.status(200).json({
        status: 'success',
        data: {
          token: newToken
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// Request password reset
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that email doesn't exist for security
      return res.status(200).json({
        status: 'success',
        message: 'If your email is registered, you will receive reset instructions'
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    // Save token to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Send email with reset token
    // In a real app, send an email with reset link
    logger.info(`Reset token for ${email}: ${resetToken}`);

    return res.status(200).json({
      status: 'success',
      message: 'If your email is registered, you will receive reset instructions'
    });
  } catch (error) {
    next(error);
  }
};

// Reset password with token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find user with unexpired token
    const user = await User.findOne({
      where: {
        resetPasswordExpires: { [User.sequelize.Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Password reset token is invalid or has expired'
      });
    }

    // Verify token
    const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isValidToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Password reset token is invalid or has expired'
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};
