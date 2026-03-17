const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controllers/projectController");
const { recommendTeam } = require("../controllers/teamFormationController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.use(authenticate);

router.get("/", asyncHandler(getAll));
router.get("/:id/recommend-team", asyncHandler(recommendTeam));
router.get("/:id", asyncHandler(getById));
router.post("/", requireRole("Admin", "Manager"), asyncHandler(create));
router.put("/:id", asyncHandler(update));
router.delete("/:id", requireRole("Admin", "Manager"), asyncHandler(remove));

module.exports = router;
