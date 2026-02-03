const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../controllers/employeeController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/employees - Get all employees in org
router.get('/', getAll);

// GET /api/employees/:id - Get single employee
router.get('/:id', getById);

// POST /api/employees - Create employee (Admin/Manager only)
router.post('/', requireRole('Admin', 'Manager'), create);

// PUT /api/employees/:id - Update employee
router.put('/:id', update);

// DELETE /api/employees/:id - Delete employee (Admin only)
router.delete('/:id', requireRole('Admin'), remove);

module.exports = router;
