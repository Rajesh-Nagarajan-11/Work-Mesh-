function ok(res, data, message) {
  return res.json({
    success: true,
    data,
    ...(message ? { message } : {}),
  });
}

function fail(res, statusCode, message, errors) {
  return res.status(statusCode).json({
    success: false,
    message: message || 'Request failed',
    ...(errors ? { errors } : {}),
    statusCode,
  });
}

module.exports = { ok, fail };

