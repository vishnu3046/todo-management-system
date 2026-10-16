package com.todo.dto;

public class TaskStatsResponse {

    private long totalTasks;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks;
    private double completionRate;

    public TaskStatsResponse() {
    }

    public TaskStatsResponse(long totalTasks, long pendingTasks, long completedTasks, long overdueTasks) {
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.completedTasks = completedTasks;
        this.overdueTasks = overdueTasks;
        this.completionRate = totalTasks > 0 ? Math.round(((double) completedTasks / totalTasks * 100.0) * 10.0) / 10.0 : 0.0;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }
}
