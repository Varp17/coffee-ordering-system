import { api } from './api';

export const inventoryService = {
  getStockLevels: async (params = {}) => {
    return api.get('/inventory', params);
  },

  getTransactions: async (params = {}) => {
    return api.get('/inventory/transactions', params);
  },

  stockIn: async (data) => {
    return api.post('/inventory/stock-in', data);
  },

  adjust: async (data) => {
    return api.post('/inventory/adjust', data);
  },

  recordWastage: async (data) => {
    return api.post('/inventory/wastage', data);
  },

  getAlerts: async (params = {}) => {
    return api.get('/inventory/alerts', params);
  },

  getAlertSummary: async () => {
    return api.get('/inventory/alerts/summary');
  },

  resolveAlert: async (id) => {
    return api.patch(`/inventory/alerts/${id}/resolve`);
  },

  // Central inventory
  getCentralBatches: async (params = {}) => {
    return api.get('/inventory/central/production-batches', params);
  },

  getDistributionOrders: async (params = {}) => {
    return api.get('/inventory/central/distribution-orders', params);
  },
};
