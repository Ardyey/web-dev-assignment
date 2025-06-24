import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TaskForm.css';

const TaskForm = ({ onSubmit, initialData, onCancel, submitButtonText = 'Submit' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo'); // Default status
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'todo');
      setDueDate(initialData.dueDate ? initialData.dueDate.split('T')[0] : ''); // Format for date input
    } else {
      // Reset form if no initial data (e.g., after editing and then wanting to add new)
      setTitle('');
      setDescription('');
      setStatus('todo');
      setDueDate('');
    }
    // Clear errors when form data changes
    setErrors({});
  }, [initialData]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters long';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    // Description validation (optional but with length limit)
    if (description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Due date validation
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Status validation
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) {
      newErrors.status = 'Please select a valid status';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for submission
      const formData = {
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate || null
      };

      await onSubmit(formData);

      // Reset form fields if not editing (creating new task)
      if (!initialData) {
        setTitle('');
        setDescription('');
        setStatus('todo');
        setDueDate('');
        setErrors({});
      }
    } catch (error) {
      // Handle submission error
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time validation for title
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    // Clear title error if user starts typing
    if (errors.title && value.trim()) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // Get character count class for styling
  const getCharacterCountClass = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'error';
    if (percentage >= 80) return 'warning';
    return '';
  };

  // Real-time validation for description
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    // Clear description error if user fixes it
    if (errors.description && value.trim().length <= 500) {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  // Real-time validation for due date
  const handleDueDateChange = (e) => {
    const value = e.target.value;
    setDueDate(value);

    // Clear due date error if user selects a valid date
    if (errors.dueDate && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate >= today) {
        setErrors(prev => ({ ...prev, dueDate: '' }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`task-form ${isSubmitting ? 'submitting' : ''}`}>
      {errors.submit && (
        <div className="error-message global-error">
          {errors.submit}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Task Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            className={`form-input ${errors.title ? 'error' : ''}`}
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter task title..."
            disabled={isSubmitting}
            maxLength={100}
            required
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <div className={`character-count ${getCharacterCountClass(title.length, 100)}`}>
            {title.length}/100
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">Status <span className="required">*</span></label>
          <select
            id="status"
            className={`form-select ${errors.status ? 'error' : ''}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isSubmitting}
            required
          >
            <option value="todo">📋 To Do</option>
            <option value="in-progress">⚡ In Progress</option>
            <option value="done">✅ Done</option>
          </select>
          {errors.status && (
            <span className="error-message">{errors.status}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
          <span className="optional">(Optional)</span>
        </label>
        <textarea
          id="description"
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add task description..."
          rows="4"
          disabled={isSubmitting}
          maxLength={500}
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
        <div className={`character-count ${getCharacterCountClass(description.length, 500)}`}>
          {description.length}/500
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate" className="form-label">
          Due Date
          <span className="optional">(Optional)</span>
        </label>
        <input
          type="date"
          id="dueDate"
          className={`form-input ${errors.dueDate ? 'error' : ''}`}
          value={dueDate}
          onChange={handleDueDateChange}
          disabled={isSubmitting}
          min={new Date().toISOString().split('T')[0]} // Prevent past dates in date picker
        />
        {errors.dueDate && (
          <span className="error-message">{errors.dueDate}</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || Object.keys(errors).some(key => key !== 'submit' && errors[key])}
        >
          {isSubmitting ? 'Saving...' : submitButtonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    dueDate: PropTypes.string,
  }),
  onCancel: PropTypes.func,
  submitButtonText: PropTypes.string,
};

export default TaskForm;
