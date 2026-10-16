import axios from 'axios';

// Base URL: Fallback to proxy `/api/tasks` or use environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/tasks';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const taskApi = {
  /**
   * Fetch all tasks with optional filters, search, and sorting
   * @param {Object} params - { status, priority, search, sortBy, sortDirection }
   */
  async getAllTasks(params = {}) {
    const cleanParams = {};
    if (params.status && params.status !== 'ALL') cleanParams.status = params.status;
    if (params.priority && params.priority !== 'ALL') cleanParams.priority = params.priority;
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.sortDirection) cleanParams.sortDirection = params.sortDirection;

    const response = await apiClient.get('', { params: cleanParams });
    return response.data;
  },

  /**
   * Fetch a single task by ID
   * @param {number|string} id
   */
  async getTaskById(id) {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, dueDate, priority, status }
   */
  async createTask(taskData) {
    const response = await apiClient.post('', taskData);
    return response.data;
  },

  /**
   * Update an existing task
   * @param {number|string} id
   * @param {Object} taskData
   */
  async updateTask(id, taskData) {
    const response = await apiClient.put(`/${id}`, taskData);
    return response.data;
  },

  /**
   * Mark a task as completed
   * @param {number|string} id
   */
  async markAsCompleted(id) {
    const response = await apiClient.patch(`/${id}/complete`);
    return response.data;
  },

  /**
   * Toggle task status between Pending and Completed
   * @param {number|string} id
   */
  async toggleTaskStatus(id) {
    const response = await apiClient.patch(`/${id}/toggle`);
    return response.data;
  },

  /**
   * Delete a task
   * @param {number|string} id
   */
  async deleteTask(id) {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },

  /**
   * Fetch task statistics for dashboard
   */
  async getTaskStats() {
    const response = await apiClient.get('/stats');
    return response.data;
  },
};

export default taskApi;
