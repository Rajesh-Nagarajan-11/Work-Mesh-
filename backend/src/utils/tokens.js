const jwt = require('jsonwebtoken');

function getAccessSecret() {
  return process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
}

function signAccessToken(payload) {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };

