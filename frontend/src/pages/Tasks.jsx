import React, { useState, useEffect } from 'react';
import { tasksAPI, employeesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    employee_id: '',
    priority: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchTasks();
    if (isAdmin()) {
      fetchEmployees();
    }
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.employee_id) params.employee_id = filters.employee_id;
      if (filters.priority) params.priority = filters.priority;

      const response = await tasksAPI.getAll(params);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(taskId);
        fetchTasks();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
    fetchTasks();
  };

  if (loading && tasks.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          {isAdmin() && (
            <button onClick={handleCreateTask} className="btn btn-primary">
              Create New Task
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {isAdmin() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                <select
                  className="input"
                  value={filters.employee_id}
                  onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                >
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                className="input"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 gap-4">
          {tasks.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 text-lg">No tasks found</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`badge badge-${task.status}`}>{task.status}</span>
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 {task.employee_name}</span>
                      {task.department && <span>🏢 {task.department}</span>}
                      {task.due_date && (
                        <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="btn btn-secondary text-sm"
                    >
                      {isAdmin() ? 'Edit' : 'Update Status'}
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn btn-danger text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          employees={employees}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default Tasks;
