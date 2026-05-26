import { api } from './api';

export const d2cService = {
  getCatalog: async (params = {}) => api.get('/d2c/catalog', params),
  getProductBySlug: async (slug) => api.get(`/d2c/catalog/${slug}`),

  // Cart
  getOrCreateCart: async (sessionId) => api.post('/d2c/cart', { session_id: sessionId }),
  getCart: async (cartId) => api.get(`/d2c/cart/${cartId}`),
  addToCart: async (cartId, item) => api.post(`/d2c/cart/${cartId}/items`, item),
  updateCartItem: async (cartId, productId, data) => api.patch(`/d2c/cart/${cartId}/items/${productId}`, data),
  removeFromCart: async (cartId, productId) => api.delete(`/d2c/cart/${cartId}/items/${productId}`),
  clearCart: async (cartId) => api.delete(`/d2c/cart/${cartId}`),

  // Checkout
  checkout: async (cartId, data) => api.post(`/d2c/checkout/${cartId}`, data),

  // Orders
  getOrders: async (params = {}) => api.get('/d2c/orders', params),
  getOrderDetail: async (orderId) => api.get(`/d2c/orders/${orderId}`),

  // Subscriptions
  getSubscriptions: async () => api.get('/cms/subscriptions'),
};
