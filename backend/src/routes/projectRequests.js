const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createAndSend, getByToken, submitByToken } = require('../controllers/projectRequestController');

const router = express.Router();

router.post('/send', authenticate, createAndSend);
router.get('/form/:token', getByToken);
router.post('/form/:token/submit', submitByToken);

module.exports = router;
