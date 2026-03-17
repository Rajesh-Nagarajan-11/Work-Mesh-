const express = require("express");
const { authenticate } = require("../middleware/auth");
const { getAnalytics } = require("../controllers/analyticsController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
router.use(authenticate);

// GET /api/analytics - Dashboard KPIs and chart data
router.get("/", asyncHandler(getAnalytics));

module.exports = router;
