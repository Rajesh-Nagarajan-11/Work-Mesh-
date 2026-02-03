const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { getAll, getById, create, update, remove } = require('../controllers/projectController');

const router = express.Router();
router.use(authenticate);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', requireRole('Admin', 'Manager'), create);
router.put('/:id', update);
router.delete('/:id', requireRole('Admin', 'Manager'), remove);

module.exports = router;
