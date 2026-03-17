const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const {
  getAll,
  getByEmployee,
  getByProject,
  create,
  update,
  remove,
} = require("../controllers/allocationController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.use(authenticate);

// GET /api/allocations - Get all allocations in the org
router.get("/", asyncHandler(getAll));

// GET /api/allocations/employee/:empId - Get allocations for a specific employee
router.get("/employee/:empId", asyncHandler(getByEmployee));

// GET /api/allocations/project/:projectId - Get allocations for a specific project
router.get("/project/:projectId", asyncHandler(getByProject));

// POST /api/allocations - Create a new allocation (Admin/Manager only)
router.post("/", requireRole("Admin", "Manager"), asyncHandler(create));

// PUT /api/allocations/:id - Update an allocation
router.put("/:id", asyncHandler(update));

// DELETE /api/allocations/:id - Delete an allocation (Admin/Manager only)
router.delete("/:id", requireRole("Admin", "Manager"), asyncHandler(remove));

module.exports = router;
