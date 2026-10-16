import React from 'react';
import { CheckSquare, Plus, Calendar } from 'lucide-react';

export default function Navbar({ onOpenCreateModal, stats }) {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <CheckSquare size={22} className="brand-svg" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">TaskFlow</h1>
            <span className="brand-subtitle">Task Management System</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-date">
            <Calendar size={15} />
            <span>{todayFormatted}</span>
          </div>

          {stats && (
            <div className="navbar-summary-pill">
              <span className="summary-dot"></span>
              <span><strong>{stats.completedTasks}</strong> / {stats.totalTasks} Done</span>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
            id="nav-add-task-btn"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
