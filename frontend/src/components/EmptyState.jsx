import React from 'react';
import { ClipboardList, Plus, SearchX, CheckCircle2 } from 'lucide-react';

export default function EmptyState({
  statusFilter,
  searchQuery,
  onResetFilters,
  onOpenCreateModal,
}) {
  if (searchQuery) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrapper">
          <SearchX size={38} className="empty-svg" />
        </div>
        <h3 className="empty-title">No matching tasks found</h3>
        <p className="empty-subtitle">
          No tasks matched your search for &ldquo;<strong>{searchQuery}</strong>&rdquo;. Try adjusting keywords or resetting your search.
        </p>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onResetFilters}
        >
          Reset Search
        </button>
      </div>
    );
  }

  if (statusFilter === 'COMPLETED') {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrapper bg-emerald-subtle">
          <CheckCircle2 size={38} className="text-emerald" />
        </div>
        <h3 className="empty-title">No completed tasks yet</h3>
        <p className="empty-subtitle">
          Keep moving forward! Check off your tasks as you complete them to see your progress here.
        </p>
      </div>
    );
  }

  if (statusFilter === 'OVERDUE') {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrapper bg-emerald-subtle">
          <CheckCircle2 size={38} className="text-emerald" />
        </div>
        <h3 className="empty-title">No overdue tasks!</h3>
        <p className="empty-subtitle">
          Great job! All your tasks are right on track. There are no overdue items waiting.
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state-card">
      <div className="empty-icon-wrapper">
        <ClipboardList size={40} className="empty-svg" />
      </div>
      <h3 className="empty-title">No tasks available</h3>
      <p className="empty-subtitle">
        Your task list is empty. Add your first task to stay organized and boost your daily productivity!
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onOpenCreateModal}
      >
        <Plus size={18} />
        <span>Create First Task</span>
      </button>
    </div>
  );
}
