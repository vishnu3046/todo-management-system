import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, AlertCircle, CheckCircle } from 'lucide-react';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEdit = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Pending',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Pending',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Title must be 255 characters or fewer.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      dueDate: formData.dueDate || null,
      priority: formData.priority,
      status: formData.status,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="modal-subtitle">
              {isEdit
                ? 'Update your task details and deadline below.'
                : 'Fill in the information to add a new task to your list.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Title input */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="task-title"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Finalize project presentation slides"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              autoFocus
              maxLength={255}
            />
            {errors.title && (
              <span className="form-error">
                <AlertCircle size={13} />
                <span>{errors.title}</span>
              </span>
            )}
          </div>

          {/* Description input */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description <span className="label-optional">(Optional)</span>
            </label>
            <textarea
              id="task-desc"
              rows={3}
              className="form-textarea"
              placeholder="Add key notes, links, or sub-steps for this task..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Due Date & Status */}
          <div className="form-row-two-col">
            <div className="form-group">
              <label htmlFor="task-due-date" className="form-label">
                <Calendar size={14} className="label-icon" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                id="task-due-date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-status" className="form-label">
                <CheckCircle size={14} className="label-icon" />
                <span>Status</span>
              </label>
              <select
                id="task-status"
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Priority selection pills */}
          <div className="form-group">
            <label className="form-label">
              <Flag size={14} className="label-icon" />
              <span>Priority Level</span>
            </label>
            <div className="priority-pills-group" role="radiogroup">
              {[
                { value: 'Low', label: 'Low', color: 'low' },
                { value: 'Medium', label: 'Medium', color: 'medium' },
                { value: 'High', label: 'High', color: 'high' },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  role="radio"
                  aria-checked={formData.priority === p.value}
                  className={`priority-pill-btn pill-${p.color} ${
                    formData.priority === p.value ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, priority: p.value })
                  }
                >
                  <span className={`pill-dot dot-${p.color}`}></span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : isEdit ? (
                <span>Save Changes</span>
              ) : (
                <span>Create Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
