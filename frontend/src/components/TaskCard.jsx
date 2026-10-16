import React from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { getDueStatus } from '../utils/dateUtils';

export default function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  viewMode = 'grid',
}) {
  const isCompleted = task.status === 'Completed';
  const dueInfo = getDueStatus(task.dueDate, task.status);

  // Priority color classes
  const priorityClassMap = {
    Low: 'priority-low',
    Medium: 'priority-medium',
    High: 'priority-high',
  };
  const priorityClass = priorityClassMap[task.priority] || 'priority-medium';

  return (
    <article
      className={`task-item ${viewMode === 'list' ? 'task-row' : 'task-card'} ${
        isCompleted ? 'task-completed' : ''
      } ${task.overdue ? 'task-overdue-border' : ''}`}
      data-task-id={task.id}
    >
      <div className="task-main-section">
        {/* Checkbox toggle */}
        <button
          type="button"
          className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check size={14} className="check-icon" />}
        </button>

        {/* Task Details */}
        <div className="task-content">
          <div className="task-header-row">
            <h3 className={`task-title ${isCompleted ? 'title-done' : ''}`}>
              {task.title}
            </h3>

            <div className="task-badges">
              <span className={`priority-badge ${priorityClass}`}>
                {task.priority} Priority
              </span>
            </div>
          </div>

          {task.description && (
            <p className={`task-description ${isCompleted ? 'desc-done' : ''}`}>
              {task.description}
            </p>
          )}

          {/* Meta row: Due Date and Created Date */}
          <div className="task-meta-row">
            {task.dueDate ? (
              <span className={`due-date-pill due-tone-${dueInfo.tone}`}>
                {dueInfo.tone === 'danger' && <AlertTriangle size={13} />}
                {dueInfo.tone === 'warning' && <Clock size={13} />}
                {dueInfo.tone === 'info' && <Calendar size={13} />}
                {dueInfo.tone === 'neutral' && <Calendar size={13} />}
                {dueInfo.tone === 'success' && <Check size={13} />}
                <span>{dueInfo.label}</span>
              </span>
            ) : (
              <span className="due-date-pill due-tone-neutral">
                <Calendar size={13} />
                <span>No deadline</span>
              </span>
            )}

            {task.createdAt && (
              <span className="task-created-time">
                Added {task.createdAt.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-action btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit task ${task.title}`}
        >
          <Edit2 size={16} />
        </button>

        <button
          type="button"
          className="btn-action btn-delete"
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
