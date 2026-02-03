const jwt = require('jsonwebtoken');

function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
}

/**
 * Middleware to verify JWT access token
 * Attaches decoded payload to req.user
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Missing or invalid authorization header',
      statusCode: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getAccessSecret());
    req.user = {
      id: decoded.sub,
      accessRole: decoded.accessRole,
      organizationId: decoded.org,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      statusCode: 401,
    });
  }
}

/**
 * Middleware to require specific access roles
 * @param  {...string} roles - Allowed roles (e.g., 'Admin', 'Manager')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
        statusCode: 401,
      });
    }

    if (!roles.includes(req.user.accessRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        statusCode: 403,
      });
    }

    next();
  };
}

module.exports = { authenticate, requireRole };
