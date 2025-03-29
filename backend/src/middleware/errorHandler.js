const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // Log the error
  logger.error(err.stack);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorMessage = err.errors.map(e => e.message).join(', ');
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorMessage = 'Resource already exists';
  }

  // Send the error response
  res.status(statusCode).json({
    status: 'error',
    message: errorMessage,
    // Include stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
