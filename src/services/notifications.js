import { api } from './api';

export const notificationService = {
  getTemplates: async () => {
    return api.get('/notifications/templates');
  },

  createTemplate: async (data) => {
    return api.post('/notifications/templates', data);
  },

  updateTemplate: async (id, data) => {
    return api.patch(`/notifications/templates/${id}`, data);
  },

  deleteTemplate: async (id) => {
    return api.delete(`/notifications/templates/${id}`);
  },
};
