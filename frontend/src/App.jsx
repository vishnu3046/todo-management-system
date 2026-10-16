import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import TaskControls from './components/TaskControls';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { taskApi } from './api/taskApi';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch tasks and statistics
  const fetchTasksAndStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksData, statsData] = await Promise.all([
        taskApi.getAllTasks({
          status: statusFilter,
          priority: priorityFilter,
          search: searchQuery,
          sortBy,
          sortDirection,
        }),
        taskApi.getTaskStats(),
      ]);

      setTasks(tasksData || []);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Unable to connect to the backend server. Please verify Spring Boot and MySQL are running.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, sortBy, sortDirection]);

  // Initial load & when filters change
  useEffect(() => {
    fetchTasksAndStats();
  }, [fetchTasksAndStats]);

  // Handler: Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Handler: Save Task (Create or Update)
  const handleSaveTask = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingTask && editingTask.id) {
        await taskApi.updateTask(editingTask.id, formData);
        showToast('Task updated successfully!', 'success');
      } else {
        await taskApi.createTask(formData);
        showToast('Task created successfully!', 'success');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      await fetchTasksAndStats();
    } catch (err) {
      console.error('Save task error:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.validationErrors
          ? Object.values(err.response.data.validationErrors).join(', ')
          : 'Failed to save task.');
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Toggle Task Status
  const handleToggleStatus = async (taskId) => {
    try {
      const updated = await taskApi.toggleTaskStatus(taskId);
      const isDone = updated.status === 'Completed';
      showToast(
        isDone ? 'Task marked as completed! 🎉' : 'Task marked as pending.',
        'info'
      );
      await fetchTasksAndStats();
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Failed to update task status.', 'error');
    }
  };

  // Handler: Open Delete Modal
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  // Handler: Confirm Delete
  const handleConfirmDelete = async (taskId) => {
    try {
      setIsDeleting(true);
      await taskApi.deleteTask(taskId);
      showToast('Task deleted successfully.', 'success');
      setIsDeleteModalOpen(false);
      setDeletingTask(null);
      await fetchTasksAndStats();
    } catch (err) {
      console.error('Delete task error:', err);
      showToast('Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler: Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setSortBy('createdAt');
    setSortDirection('desc');
  };

  // Toggle sort direction
  const handleToggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {/* Dashboard Summary Statistics */}
          <DashboardStats
            stats={stats}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(filterId) => setStatusFilter(filterId)}
          />

          {/* Error Banner if connection fails */}
          {error && (
            <div className="error-banner">
              <div className="error-banner-left">
                <AlertTriangle size={20} className="text-danger" />
                <span className="error-banner-text">{error}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={fetchTasksAndStats}
              >
                <RefreshCw size={14} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Task Filtering and Sorting Controls */}
          <TaskControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortDirection={sortDirection}
            onToggleSortDirection={handleToggleSortDirection}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
            totalCount={tasks.length}
          />

          {/* Task List or Grid */}
          <TaskList
            tasks={tasks}
            loading={loading}
            viewMode={viewMode}
            statusFilter={statusFilter}
            searchQuery={searchQuery}
            onResetFilters={handleResetFilters}
            onOpenCreateModal={handleOpenCreateModal}
            onToggleStatus={handleToggleStatus}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </div>
      </main>

      {/* Modals and Overlays */}
      <TaskModal
        isOpen={isTaskModalOpen}
        initialData={editingTask}
        isSubmitting={isSubmitting}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={deletingTask}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
