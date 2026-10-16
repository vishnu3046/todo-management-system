import React from 'react';
import { Layers, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export default function DashboardStats({ stats, activeStatusFilter, onSelectStatusFilter }) {
  const {
    totalTasks = 0,
    pendingTasks = 0,
    completedTasks = 0,
    overdueTasks = 0,
    completionRate = 0,
  } = stats || {};

  const statCards = [
    {
      id: 'ALL',
      title: 'Total Tasks',
      value: totalTasks,
      icon: Layers,
      color: 'blue',
      badge: 'All tasks in workspace',
    },
    {
      id: 'PENDING',
      title: 'Pending Tasks',
      value: pendingTasks,
      icon: Clock,
      color: 'amber',
      badge: 'Needs attention',
    },
    {
      id: 'COMPLETED',
      title: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'emerald',
      badge: `${completionRate}% completed`,
    },
    {
      id: 'OVERDUE',
      title: 'Overdue Tasks',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'rose',
      badge: overdueTasks > 0 ? 'Requires action' : 'All caught up',
    },
  ];

  return (
    <section className="dashboard-stats-section" aria-label="Task Summary Statistics">
      <div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeStatusFilter === card.id;

          return (
            <div
              key={card.id}
              className={`stat-card stat-${card.color} ${isSelected ? 'stat-card-active' : ''}`}
              onClick={() => onSelectStatusFilter(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStatusFilter(card.id);
                }
              }}
            >
              <div className="stat-card-header">
                <span className="stat-title">{card.title}</span>
                <div className={`stat-icon-wrapper bg-${card.color}-subtle`}>
                  <Icon size={20} className={`text-${card.color}`} />
                </div>
              </div>

              <div className="stat-card-body">
                <span className="stat-value">{card.value}</span>
                <span className="stat-badge">{card.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {totalTasks > 0 && (
        <div className="progress-overview-card">
          <div className="progress-overview-header">
            <div className="progress-title-wrap">
              <TrendingUp size={16} className="text-primary" />
              <span className="progress-title">Overall Progress</span>
            </div>
            <span className="progress-percentage">{completionRate}% Done</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      )}
    </section>
  );
}
