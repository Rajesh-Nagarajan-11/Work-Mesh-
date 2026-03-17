/**
 * asyncHandler.js
 *
 * Wraps an async Express route handler so that any unhandled promise
 * rejection is forwarded to Express's next(err) error-handler instead
 * of crashing the Node.js process.
 *
 * Usage:
 *   router.get('/', asyncHandler(myAsyncController));
 */

/**
 * @param {Function} fn - async (req, res, next) => void
 * @returns {Function} Express middleware
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
