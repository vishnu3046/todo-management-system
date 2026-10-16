import React from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  RotateCcw,
} from 'lucide-react';

export default function TaskControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onToggleSortDirection,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalCount,
}) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    sortBy !== 'createdAt' ||
    sortDirection !== 'desc';

  return (
    <div className="task-controls-container">
      {/* Search and Quick View Controls */}
      <div className="controls-row-top">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="view-mode-group" role="group" aria-label="View Mode">
          <button
            type="button"
            className={`btn-icon-toggle ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Card / Grid View"
            aria-label="Card View"
          >
            <LayoutGrid size={17} />
          </button>
          <button
            type="button"
            className={`btn-icon-toggle ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Compact List View"
            aria-label="List View"
          >
            <ListIcon size={17} />
          </button>
        </div>
      </div>

      {/* Filter Tabs and Sort Row */}
      <div className="controls-row-bottom">
        <div className="filter-tabs-wrapper">
          <div className="status-tabs" role="tablist">
            {[
              { id: 'ALL', label: 'All Tasks' },
              { id: 'PENDING', label: 'Pending' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'OVERDUE', label: 'Overdue' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.id}
                className={`filter-tab ${statusFilter === tab.id ? 'filter-tab-active' : ''}`}
                onClick={() => onStatusFilterChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dropdowns-group">
          {/* Priority Filter */}
          <div className="control-select-wrapper">
            <Filter size={14} className="control-select-icon" />
            <select
              className="control-select"
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="control-select-wrapper">
            <select
              className="control-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              aria-label="Sort tasks by"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority Level</option>
              <option value="title">Alphabetical (Title)</option>
            </select>
          </div>

          {/* Sort Direction Toggle */}
          <button
            type="button"
            className="btn btn-outline btn-sort-direction"
            onClick={onToggleSortDirection}
            title={sortDirection === 'asc' ? 'Ascending (Click for Descending)' : 'Descending (Click for Ascending)'}
            aria-label="Toggle sort direction"
          >
            <ArrowUpDown size={15} />
            <span className="sort-direction-label">
              {sortDirection === 'asc' ? 'Asc' : 'Desc'}
            </span>
          </button>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              className="btn btn-ghost btn-reset-filters"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="controls-summary-bar">
        <span className="results-count">
          Showing <strong>{totalCount}</strong> {totalCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>
    </div>
  );
}
