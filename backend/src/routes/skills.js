const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controllers/skillController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.use(authenticate);

// GET /api/skills - Get all skills in the org
router.get("/", asyncHandler(getAll));

// GET /api/skills/:id
router.get("/:id", asyncHandler(getById));

// POST /api/skills - Admin/Manager only
router.post("/", requireRole("Admin", "Manager"), asyncHandler(create));

// PUT /api/skills/:id
router.put("/:id", requireRole("Admin", "Manager"), asyncHandler(update));

// DELETE /api/skills/:id - Admin only
router.delete("/:id", requireRole("Admin"), asyncHandler(remove));

module.exports = router;
