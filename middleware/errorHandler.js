const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ status: 'fail', message: messages.join(', ') });
  }

  console.error(err);
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
};

module.exports = errorHandler;