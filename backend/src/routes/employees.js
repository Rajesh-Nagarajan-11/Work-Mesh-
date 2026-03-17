const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const {
  getAll,
  getById,
  create,
  update,
  remove,
  getEmployeeHistory,
} = require("../controllers/employeeController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/employees - Get all employees in org
router.get("/", asyncHandler(getAll));

// GET /api/employees/:id/history - Get employee project history
// NOTE: must be defined BEFORE /:id to avoid Express matching "history" as an id
router.get("/:id/history", asyncHandler(getEmployeeHistory));

// GET /api/employees/:id - Get single employee
router.get("/:id", asyncHandler(getById));

// POST /api/employees - Create employee (Admin/Manager only)
router.post("/", requireRole("Admin", "Manager"), asyncHandler(create));

// PUT /api/employees/:id - Update employee
router.put("/:id", asyncHandler(update));

// DELETE /api/employees/:id - Delete employee (Admin only)
router.delete("/:id", requireRole("Admin"), asyncHandler(remove));

module.exports = router;
