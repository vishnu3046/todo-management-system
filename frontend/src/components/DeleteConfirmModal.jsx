import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container modal-sm"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="delete-modal-body">
          <div className="delete-warning-icon">
            <AlertTriangle size={28} className="text-danger" />
          </div>

          <h3 className="delete-modal-title">Delete Task?</h3>
          <p className="delete-modal-text">
            Are you sure you want to delete &ldquo;<strong>{task.title}</strong>&rdquo;? This action cannot be undone.
          </p>

          <div className="modal-footer delete-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onConfirm(task.id)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
