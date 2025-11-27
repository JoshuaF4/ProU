const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all employees
router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await db.all(`
      SELECT id, name, email, role, department, created_at 
      FROM employees 
      ORDER BY name
    `);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get single employee
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await db.get(
      'SELECT id, name, email, role, department, created_at FROM employees WHERE id = ?',
      [req.params.id]
    );
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Get employee with their tasks
router.get('/:id/tasks', authMiddleware, async (req, res) => {
  try {
    const employee = await db.get(
      'SELECT id, name, email, role, department FROM employees WHERE id = ?',
      [req.params.id]
    );
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const tasks = await db.all(
      'SELECT * FROM tasks WHERE employee_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    
    res.json({ ...employee, tasks });
  } catch (error) {
    console.error('Error fetching employee tasks:', error);
    res.status(500).json({ error: 'Failed to fetch employee tasks' });
  }
});

// Create new employee (admin only)
router.post('/', 
  authMiddleware,
  adminMiddleware,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role = 'user', department } = req.body;
      
      const existing = await db.get('SELECT id FROM employees WHERE email = ?', [email]);
      if (existing) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await db.run(
        'INSERT INTO employees (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, department]
      );

      const newEmployee = await db.get(
        'SELECT id, name, email, role, department, created_at FROM employees WHERE id = ?',
        [result.id]
      );

      res.status(201).json(newEmployee);
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }
);

// Update employee (admin only)
router.put('/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('department').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, department, role } = req.body;
      const updates = [];
      const values = [];

      if (name) {
        updates.push('name = ?');
        values.push(name);
      }
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      if (department) {
        updates.push('department = ?');
        values.push(department);
      }
      if (role) {
        updates.push('role = ?');
        values.push(role);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(req.params.id);
      
      await db.run(
        `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const updatedEmployee = await db.get(
        'SELECT id, name, email, role, department, created_at FROM employees WHERE id = ?',
        [req.params.id]
      );

      res.json(updatedEmployee);
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Failed to update employee' });
    }
  }
);

// Delete employee (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM employees WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
