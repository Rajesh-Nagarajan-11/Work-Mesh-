const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  createAndSend,
  getByToken,
  submitByToken,
} = require("../controllers/projectRequestController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// POST /api/project-requests/send - Send form link to client (requires auth)
router.post("/send", authenticate, asyncHandler(createAndSend));

// GET /api/project-requests/form/:token - Get form details by token (public)
router.get("/form/:token", asyncHandler(getByToken));

// POST /api/project-requests/form/:token/submit - Submit form by token (public)
router.post("/form/:token/submit", asyncHandler(submitByToken));

module.exports = router;
