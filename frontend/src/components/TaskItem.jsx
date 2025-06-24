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

    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format the actual date for display
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });

    if (diffDays < -1) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        subText: formattedDate,
        isOverdue: true,
        icon: '🚨'
      };
    } else if (diffDays === -1) {
      return {
        text: 'Due yesterday',
        subText: formattedDate,
        isOverdue: true,
        icon: '🚨'
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due today',
        subText: formattedDate,
        isToday: true,
        icon: '⏰'
      };
    } else if (diffDays === 1) {
      return {
        text: 'Due tomorrow',
        subText: formattedDate,
        isSoon: true,
        icon: '📅'
      };
    } else if (diffDays <= 3) {
      return {
        text: `Due in ${diffDays} days`,
        subText: formattedDate,
        isSoon: true,
        icon: '📅'
      };
    } else if (diffDays <= 7) {
      return {
        text: `Due in ${diffDays} days`,
        subText: formattedDate,
        isUpcoming: true,
        icon: '📅'
      };
    } else {
      return {
        text: `Due ${formattedDate}`,
        subText: `in ${diffDays} days`,
        isNormal: true,
        icon: '📅'
      };
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
          <div className={`task-due-date ${
            dueDateInfo.isOverdue ? 'overdue' :
            dueDateInfo.isToday ? 'today' :
            dueDateInfo.isSoon ? 'soon' :
            dueDateInfo.isUpcoming ? 'upcoming' :
            'normal'
          }`}>
            <span className="due-date-icon">{dueDateInfo.icon}</span>
            <div className="due-date-content">
              <span className="due-date-text">{dueDateInfo.text}</span>
              {dueDateInfo.subText && (
                <span className="due-date-subtext">{dueDateInfo.subText}</span>
              )}
            </div>
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
