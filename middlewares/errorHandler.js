const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  console.error('Error:', message);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;