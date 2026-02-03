function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
}

module.exports = { notFound };

