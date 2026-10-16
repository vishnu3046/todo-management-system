import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

export default function TaskList({
  tasks,
  loading,
  viewMode,
  statusFilter,
  searchQuery,
  onResetFilters,
  onOpenCreateModal,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className={`task-list-wrapper view-${viewMode}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="task-skeleton-card">
            <div className="skeleton-checkbox"></div>
            <div className="skeleton-lines">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-desc"></div>
              <div className="skeleton-line skeleton-meta"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onResetFilters={onResetFilters}
        onOpenCreateModal={onOpenCreateModal}
      />
    );
  }

  return (
    <div className={`task-list-wrapper view-${viewMode}`}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          viewMode={viewMode}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
