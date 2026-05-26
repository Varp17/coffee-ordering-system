import { api } from './api';

export const baristaService = {
  getQueue: async (params = {}) => api.get('/barista/queue', params),
  acceptKOT: async (id) => api.patch(`/barista/kot/${id}/accept`),
  completeKOT: async (id) => api.patch(`/barista/kot/${id}/complete`),
  completeOrder: async (id) => api.patch(`/barista/orders/${id}/complete`),
  cancelOrder: async (id, reason) => api.patch(`/barista/orders/${id}/cancel`, { reason }),
};
