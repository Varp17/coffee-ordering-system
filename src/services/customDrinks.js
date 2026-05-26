import { api } from './api';

export const customDrinkService = {
  create: async (data) => {
    return api.post('/custom-drinks', data);
  },

  list: async (params = {}) => {
    return api.get('/custom-drinks', params);
  },

  getById: async (id) => {
    return api.get(`/custom-drinks/${id}`);
  },

  update: async (id, data) => {
    return api.patch(`/custom-drinks/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/custom-drinks/${id}`);
  },

  share: async (id, storeId) => {
    return api.post(`/custom-drinks/${id}/share`, { store_id: storeId });
  },

  reorder: async (id, data) => {
    return api.post(`/custom-drinks/${id}/reorder`, data);
  },
};
