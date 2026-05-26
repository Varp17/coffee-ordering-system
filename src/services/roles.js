import { api } from './api';

export const roleService = {
  getAll: async () => api.get('/roles'),
  create: async (data) => api.post('/roles', data),
  update: async (id, data) => api.patch(`/roles/${id}`, data),
  delete: async (id) => api.delete(`/roles/${id}`),
};
