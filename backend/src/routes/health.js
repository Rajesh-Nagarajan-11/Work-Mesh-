const express = require('express');
const { ok } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', (req, res) => {
  ok(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});

module.exports = router;

