import { api } from './api';

export const customerService = {
  getAll: async (params = {}) => {
    return api.get('/customers', params);
  },

  getById: async (id) => {
    return api.get(`/customers/${id}`);
  },

  updateSegment: async (id, segment) => {
    return api.patch(`/customers/${id}/segment`, { segment });
  },
};
