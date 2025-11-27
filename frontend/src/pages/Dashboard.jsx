import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold">{stats?.totalTasks || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
            <p className="text-4xl font-bold">{stats?.completionRate || 0}%</p>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-4xl font-bold">{stats?.tasksByStatus?.['in-progress'] || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Overdue</h3>
            <p className="text-4xl font-bold">{stats?.overdueTasks || 0}</p>
          </div>
        </div>

        {/* Tasks by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Pending</span>
                <span className="badge badge-pending">{stats?.tasksByStatus?.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">In Progress</span>
                <span className="badge badge-in-progress">{stats?.tasksByStatus?.['in-progress'] || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Completed</span>
                <span className="badge badge-completed">{stats?.tasksByStatus?.completed || 0}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Low</span>
                <span className="badge badge-low">{stats?.tasksByPriority?.low || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Medium</span>
                <span className="badge badge-medium">{stats?.tasksByPriority?.medium || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">High</span>
                <span className="badge badge-high">{stats?.tasksByPriority?.high || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.recentTasks?.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{task.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{task.employee_name}</td>
                    <td className="px-4 py-3">
                      <span className={`badge badge-${task.status}`}>{task.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Statistics (Admin Only) */}
        {isAdmin() && stats?.employeeStats && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Employee Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.employeeStats.map((emp) => (
                    <tr key={emp.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{emp.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{emp.total_tasks}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{emp.completed_tasks}</td>
                      <td className="px-4 py-3 text-sm text-blue-600">{emp.in_progress_tasks}</td>
                      <td className="px-4 py-3 text-sm text-yellow-600">{emp.pending_tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
