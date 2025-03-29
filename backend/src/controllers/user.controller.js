const { User, CreditTransaction } = require('../models');
const logger = require('../utils/logger');

/**
 * Get the current user's profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the current user's profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Only update fields that were actually passed
    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({
          status: 'error',
          message: 'Email already in use by another account'
        });
      }
      user.email = email;
    }

    await user.save();

    // Remove sensitive data before returning
    const userData = user.toJSON();
    delete userData.password;
    delete userData.resetPasswordToken;
    delete userData.resetPasswordExpires;

    return res.status(200).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the current user's credit balance
 */
exports.getCredits = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'creditBalance', 'freeEditsUsed']
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get recent transactions
    const transactions = await CreditTransaction.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    return res.status(200).json({
      status: 'success',
      data: {
        creditBalance: user.creditBalance,
        freeEditsUsed: user.freeEditsUsed,
        freeEditsTotal: 3, // Hardcoded for now, could be moved to config
        recentTransactions: transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a checkout session for credit purchase
 * This is a placeholder that will need to be completed with Stripe integration
 */
exports.purchaseCredits = async (req, res, next) => {
  try {
    // This is a placeholder - in a real implementation, we would:
    // 1. Create a Stripe checkout session
    // 2. Return the session ID to redirect to the Stripe checkout page
    // 3. Handle the webhook from Stripe to confirm the payment and add credits
    
    logger.info(`Purchase credits request received for user ${req.user.id}`);
    
    return res.status(200).json({
      status: 'success',
      message: 'This endpoint is a placeholder for Stripe integration',
      data: {
        // In a real implementation, this would be the Stripe checkout session ID
        checkoutSessionId: 'placeholder_session_id'
      }
    });
  } catch (error) {
    next(error);
  }
};
