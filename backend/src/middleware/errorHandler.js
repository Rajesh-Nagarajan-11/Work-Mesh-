function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors;

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    statusCode,
  });
}

module.exports = { errorHandler };

