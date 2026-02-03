const bcrypt = require('bcryptjs');

const Organization = require('../models/Organization');
const Employee = require('../models/Employee');
const { ok } = require('../utils/apiResponse');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');

function setRefreshCookie(res, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/auth/refresh',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Register a new organization with admin employee
 * POST /api/auth/register
 */
async function register(req, res) {
  const { companyName, location, email, password, companySize, website, adminName } = req.body || {};

  // Validation
  if (!companyName || !location || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'companyName, location, email, password are required',
      statusCode: 400,
    });
  }

  // Check if email already exists globally
  const existing = await Employee.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered',
      statusCode: 409,
    });
  }

  // Create Organization
  const org = await Organization.create({
    companyName: String(companyName).trim(),
    location: String(location).trim(),
    companySize: companySize ? String(companySize) : null,
    website: website ? String(website) : null,
  });

  // Hash password
  const passwordHash = await bcrypt.hash(String(password), 10);

  // Create first Employee (Admin)
  const employee = await Employee.create({
    organizationId: org._id,
    name: adminName ? String(adminName).trim() : 'Admin',
    email: String(email).toLowerCase().trim(),
    passwordHash,
    department: 'Management',
    role: 'Admin',
    accessRole: 'Admin',
    experience: 0,
    skills: [],
    availability: {
      status: 'Available',
      currentProject: null,
      currentWorkload: 0,
      availableFrom: null,
    },
  });

  // Generate tokens
  const token = signAccessToken({
    sub: employee._id.toString(),
    accessRole: employee.accessRole,
    org: org._id.toString(),
  });
  const refreshToken = signRefreshToken({
    sub: employee._id.toString(),
    org: org._id.toString(),
  });
  setRefreshCookie(res, refreshToken);

  return ok(
    res,
    {
      user: {
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        role: employee.accessRole,
        photoUrl: employee.photoUrl || undefined,
        organizationId: org._id.toString(),
        organizationName: org.companyName,
      },
      token,
    },
    'Registered successfully'
  );
}

/**
 * Login with email and password
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'email and password are required',
      statusCode: 400,
    });
  }

  // Find employee by email
  const employee = await Employee.findOne({ email: String(email).toLowerCase().trim() });
  if (!employee) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      statusCode: 401,
    });
  }

  // Check if employee has a password (can login)
  if (!employee.passwordHash) {
    return res.status(401).json({
      success: false,
      message: 'This account does not have login access. Contact your admin.',
      statusCode: 401,
    });
  }

  // Verify password
  const validPassword = await bcrypt.compare(String(password), employee.passwordHash);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      statusCode: 401,
    });
  }

  // Fetch organization info
  const org = await Organization.findById(employee.organizationId);
  if (!org) {
    return res.status(500).json({
      success: false,
      message: 'Organization not found',
      statusCode: 500,
    });
  }

  // Generate tokens
  const token = signAccessToken({
    sub: employee._id.toString(),
    accessRole: employee.accessRole,
    org: employee.organizationId.toString(),
  });
  const refreshToken = signRefreshToken({
    sub: employee._id.toString(),
    org: employee.organizationId.toString(),
  });
  setRefreshCookie(res, refreshToken);

  return ok(
    res,
    {
      user: {
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        role: employee.accessRole,
        photoUrl: employee.photoUrl || undefined,
        organizationId: org._id.toString(),
        organizationName: org.companyName,
      },
      token,
    },
    'Logged in'
  );
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
async function refresh(req, res) {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Missing refresh token',
      statusCode: 401,
    });
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  }

  const employeeId = payload.sub;
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      statusCode: 401,
    });
  }

  const newToken = signAccessToken({
    sub: employee._id.toString(),
    accessRole: employee.accessRole,
    org: employee.organizationId.toString(),
  });

  return res.json({
    success: true,
    token: newToken,
    data: { token: newToken },
    message: 'Token refreshed',
  });
}

/**
 * Logout - clear refresh token cookie
 * POST /api/auth/logout
 */
async function logout(req, res) {
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
  return ok(res, { loggedOut: true }, 'Logged out');
}

module.exports = { register, login, refresh, logout };
