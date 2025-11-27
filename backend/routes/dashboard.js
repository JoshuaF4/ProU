const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get dashboard statistics
router.get('/', authMiddleware, async (req, res) => {
  try {
    let whereClause = '';
    let params = [];

    if (req.user.role !== 'admin') {
      whereClause = 'WHERE employee_id = ?';
      params.push(req.user.id);
    }

    // Total tasks
    const totalTasks = await db.get(
      `SELECT COUNT(*) as count FROM tasks ${whereClause}`,
      params
    );

    // Tasks by status
    const tasksByStatus = await db.all(
      `SELECT status, COUNT(*) as count FROM tasks ${whereClause} GROUP BY status`,
      params
    );

    // Tasks by priority
    const tasksByPriority = await db.all(
      `SELECT priority, COUNT(*) as count FROM tasks ${whereClause} GROUP BY priority`,
      params
    );

    // Completion rate
    const completedTasks = await db.get(
      `SELECT COUNT(*) as count FROM tasks ${whereClause} ${whereClause ? 'AND' : 'WHERE'} status = 'completed'`,
      whereClause ? [...params] : []
    );

    const completionRate = totalTasks.count > 0 
      ? ((completedTasks.count / totalTasks.count) * 100).toFixed(2)
      : 0;

    // Overdue tasks
    const overdueTasks = await db.get(
      `SELECT COUNT(*) as count FROM tasks 
       ${whereClause} ${whereClause ? 'AND' : 'WHERE'} due_date < date('now') AND status != 'completed'`,
      params
    );

    // Recent tasks
    const recentTasks = await db.all(
      `SELECT t.*, e.name as employee_name 
       FROM tasks t 
       JOIN employees e ON t.employee_id = e.id
       ${whereClause}
       ORDER BY t.created_at DESC 
       LIMIT 5`,
      params
    );

    // Employee statistics (admin only)
    let employeeStats = null;
    if (req.user.role === 'admin') {
      employeeStats = await db.all(`
        SELECT 
          e.id,
          e.name,
          e.department,
          COUNT(t.id) as total_tasks,
          SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
          SUM(CASE WHEN t.status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks
        FROM employees e
        LEFT JOIN tasks t ON e.id = t.employee_id
        GROUP BY e.id, e.name, e.department
        ORDER BY total_tasks DESC
      `);
    }

    res.json({
      totalTasks: totalTasks.count,
      completionRate: parseFloat(completionRate),
      overdueTasks: overdueTasks.count,
      tasksByStatus: tasksByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {}),
      tasksByPriority: tasksByPriority.reduce((acc, curr) => {
        acc[curr.priority] = curr.count;
        return acc;
      }, {}),
      recentTasks,
      employeeStats
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
