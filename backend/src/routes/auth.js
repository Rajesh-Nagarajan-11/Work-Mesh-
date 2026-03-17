const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// POST /api/auth/register - Register a new organization + admin user
router.post("/register", asyncHandler(register));

// POST /api/auth/login - Login with email and password
router.post("/login", asyncHandler(login));

// POST /api/auth/refresh - Refresh access token via cookie
router.post("/refresh", asyncHandler(refresh));

// POST /api/auth/logout - Clear refresh token cookie
router.post("/logout", asyncHandler(logout));

module.exports = router;
