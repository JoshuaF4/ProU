const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all tasks with optional filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, employee_id, priority } = req.query;
    let query = `
      SELECT t.*, e.name as employee_name, e.department 
      FROM tasks t 
      JOIN employees e ON t.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' AND t.employee_id = ?';
      params.push(req.user.id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (employee_id) {
      query += ' AND t.employee_id = ?';
      params.push(employee_id);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    query += ' ORDER BY t.created_at DESC';

    const tasks = await db.all(query, params);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await db.get(`
      SELECT t.*, e.name as employee_name, e.department 
      FROM tasks t 
      JOIN employees e ON t.employee_id = e.id
      WHERE t.id = ?
    `, [req.params.id]);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.employee_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create new task (admin only)
router.post('/',
  authMiddleware,
  adminMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('employee_id').isInt().withMessage('Valid employee ID is required'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('due_date').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, employee_id, status = 'pending', priority = 'medium', due_date } = req.body;

      const employee = await db.get('SELECT id FROM employees WHERE id = ?', [employee_id]);
      if (!employee) {
        return res.status(400).json({ error: 'Employee not found' });
      }

      const result = await db.run(
        'INSERT INTO tasks (title, description, employee_id, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, employee_id, status, priority, due_date]
      );

      const newTask = await db.get(`
        SELECT t.*, e.name as employee_name, e.department 
        FROM tasks t 
        JOIN employees e ON t.employee_id = e.id
        WHERE t.id = ?
      `, [result.id]);

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
);

// Update task
router.put('/:id',
  authMiddleware,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('due_date').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (req.user.role !== 'admin') {
        if (task.employee_id !== req.user.id) {
          return res.status(403).json({ error: 'Access denied' });
        }
        if (Object.keys(req.body).some(key => key !== 'status')) {
          return res.status(403).json({ error: 'You can only update task status' });
        }
      }

      const { title, description, status, priority, due_date, employee_id } = req.body;
      const updates = [];
      const values = [];

      if (title) {
        updates.push('title = ?');
        values.push(title);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }
      if (status) {
        updates.push('status = ?');
        values.push(status);
      }
      if (priority) {
        updates.push('priority = ?');
        values.push(priority);
      }
      if (due_date) {
        updates.push('due_date = ?');
        values.push(due_date);
      }
      if (employee_id && req.user.role === 'admin') {
        updates.push('employee_id = ?');
        values.push(employee_id);
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');

      if (updates.length === 1) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(req.params.id);

      await db.run(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      const updatedTask = await db.get(`
        SELECT t.*, e.name as employee_name, e.department 
        FROM tasks t 
        JOIN employees e ON t.employee_id = e.id
        WHERE t.id = ?
      `, [req.params.id]);

      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
);

// Delete task (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
