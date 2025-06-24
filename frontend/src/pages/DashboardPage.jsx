import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import TaskItem from '../components/TaskItem'; // Assuming TaskItem will be in this path
import TaskForm from '../components/TaskForm'; // Assuming TaskForm will be in this path
import './DashboardPage.css';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // To manage which task is being edited
  const [notification, setNotification] = useState(null); // For success/error messages

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  const handleCreateTask = async (taskData) => {
    try {
      await axiosInstance.post('/tasks', taskData);
      fetchTasks(); // Re-fetch tasks to update the list
      showNotification('Task created successfully!', 'success');
    } catch (error)
    {
      console.error('Error creating task:', error);
      showNotification('Failed to create task. Please try again.', 'error');
      throw error; // Re-throw to let form handle it
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await axiosInstance.put(`/tasks/${taskId}`, taskData);
      fetchTasks(); // Re-fetch tasks
      setEditingTask(null); // Clear editing state
      showNotification('Task updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      showNotification('Failed to update task. Please try again.', 'error');
      throw error; // Re-throw to let form handle it
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      fetchTasks(); // Re-fetch tasks
      showNotification('Task deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Failed to delete task. Please try again.', 'error');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="dashboard-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="notification-message">{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="dashboard-header">
        <h1 className="dashboard-title">Task Dashboard</h1>
        <p className="dashboard-subtitle">Manage your tasks efficiently</p>
      </div>

      <div className="dashboard-content">
        <div className="task-form-section">
          <div className="section-header">
            <h2 className="section-title">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <TaskForm
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
            initialData={editingTask}
            onCancel={editingTask ? handleCancelEdit : null}
            submitButtonText={editingTask ? 'Update Task' : 'Add Task'}
          />
        </div>

        <div className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">Your Tasks</h2>
            <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="tasks-container">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>No tasks yet</h3>
                <p>Create your first task using the form above to get started!</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onDelete={() => handleDeleteTask(task._id)}
                    onEdit={() => handleEdit(task)} // Pass function to set task for editing
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
