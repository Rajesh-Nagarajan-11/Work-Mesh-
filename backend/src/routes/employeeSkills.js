const express = require("express");
const { authenticate } = require("../middleware/auth");
const {
  getByEmployee,
  upsert,
  remove,
} = require("../controllers/employeeSkillController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router({ mergeParams: true });
router.use(authenticate);

// GET /api/employees/:empId/skills - Get all skills for an employee
router.get("/", asyncHandler(getByEmployee));

// POST /api/employees/:empId/skills - Add or update a skill
router.post("/", asyncHandler(upsert));

// DELETE /api/employees/:empId/skills/:skillId - Remove a skill
router.delete("/:skillId", asyncHandler(remove));

module.exports = router;
