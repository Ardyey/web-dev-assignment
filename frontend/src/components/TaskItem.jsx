import React from 'react';
import PropTypes from 'prop-types';
import './TaskItem.css';

const TaskItem = ({ task, onDelete, onEdit }) => {
  if (!task) {
    return <div className="task-item-error">No task data provided.</div>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo':
        return '📋';
      case 'in-progress':
        return '⚡';
      case 'done':
        return '✅';
      default:
        return '📋';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'todo':
        return 'status-todo';
      case 'in-progress':
        return 'status-in-progress';
      case 'done':
        return 'status-done';
      default:
        return 'status-todo';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isSoon: true };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, isSoon: true };
    } else {
      return { text: date.toLocaleDateString(), isNormal: true };
    }
  };

  const dueDateInfo = formatDate(task.dueDate);

  return (
    <div className={`task-item ${getStatusClass(task.status)}`}>
      <div className="task-header">
        <div className="task-status">
          <span className="status-icon">{getStatusIcon(task.status)}</span>
          <span className="status-text">{task.status?.replace('-', ' ') || 'Not set'}</span>
        </div>
        {dueDateInfo && (
          <div className={`task-due-date ${dueDateInfo.isOverdue ? 'overdue' : ''} ${dueDateInfo.isToday ? 'today' : ''} ${dueDateInfo.isSoon ? 'soon' : ''}`}>
            <span className="due-date-icon">📅</span>
            <span className="due-date-text">{dueDateInfo.text}</span>
          </div>
        )}
      </div>

      <div className="task-content">
        <h3 className="task-title">{task.title || 'No Title'}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="btn btn-edit">
          <span className="btn-icon">✏️</span>
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="btn btn-delete">
          <span className="btn-icon">🗑️</span>
          Delete
        </button>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    dueDate: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default TaskItem;
