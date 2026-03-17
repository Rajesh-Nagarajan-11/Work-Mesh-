/**
 * errorHandler.js
 *
 * Central Express error-handling middleware.
 * Must be registered LAST (after all routes) in app.js.
 *
 * Handles:
 *  - Mongoose CastError  → 400 Bad Request  (e.g. invalid ObjectId)
 *  - Mongoose ValidationError → 400 Bad Request  (schema validation failures)
 *  - Duplicate key (code 11000) → 409 Conflict
 *  - JWT errors → 401 Unauthorized
 *  - Everything else → 500 Internal Server Error
 */

function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  // Always log the full error on the server for debugging
  console.error("[errorHandler]", err);

  // ── Mongoose CastError (e.g. invalid ObjectId "undefined") ──────────────────
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field "${err.path}": ${err.stringValue || err.value}`,
      statusCode: 400,
    });
  }

  // ── Mongoose ValidationError ─────────────────────────────────────────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
      statusCode: 400,
    });
  }

  // ── MongoDB duplicate-key error ───────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ") || "field";
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
      statusCode: 409,
    });
  }

  // ── JWT errors ────────────────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      statusCode: 401,
    });
  }

  // ── Explicit statusCode set by controllers / other middleware ─────────────────
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
    statusCode,
  });
}

module.exports = { errorHandler };
