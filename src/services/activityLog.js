import { api } from './api';

export const activityLogService = {
  getAll: async (params = {}) => api.get('/activity-logs', params),
};
