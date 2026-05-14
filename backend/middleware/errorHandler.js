const errorHandler = (err, req, res, next) => {
  // Log for developer visibility
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Something went wrong',
      status:  statusCode,
      // only show stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;