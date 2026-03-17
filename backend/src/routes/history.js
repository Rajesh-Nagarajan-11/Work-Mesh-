const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const {
  getAll,
  getByEmployee,
  getByProject,
  create,
  update,
  remove,
} = require("../controllers/historyController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.use(authenticate);

// GET /api/history - Get all history records in the org
router.get("/", asyncHandler(getAll));

// GET /api/history/employee/:empId - Get history for a specific employee
router.get("/employee/:empId", asyncHandler(getByEmployee));

// GET /api/history/project/:projectId - Get history for a specific project
router.get("/project/:projectId", asyncHandler(getByProject));

// POST /api/history - Create a new history record (Admin/Manager only)
router.post("/", requireRole("Admin", "Manager"), asyncHandler(create));

// PUT /api/history/:id - Update a history record
router.put("/:id", asyncHandler(update));

// DELETE /api/history/:id - Delete a history record (Admin/Manager only)
router.delete("/:id", requireRole("Admin", "Manager"), asyncHandler(remove));

module.exports = router;
