import { api } from './api';

export const cmsService = {
  // Banners
  getBanners: async (params = {}) => api.get('/cms/banners', params),
  createBanner: async (data) => api.post('/cms/banners', data),
  updateBanner: async (id, data) => api.patch(`/cms/banners/${id}`, data),
  deleteBanner: async (id) => api.delete(`/cms/banners/${id}`),

  // Testimonials
  getTestimonials: async (params = {}) => api.get('/cms/testimonials', params),
  createTestimonial: async (data) => api.post('/cms/testimonials', data),
  updateTestimonial: async (id, data) => api.patch(`/cms/testimonials/${id}`, data),
  deleteTestimonial: async (id) => api.delete(`/cms/testimonials/${id}`),

  // Coupons
  getCoupons: async () => api.get('/cms/coupons'),
  createCoupon: async (data) => api.post('/cms/coupons', data),
  updateCoupon: async (id, data) => api.patch(`/cms/coupons/${id}`, data),
  deleteCoupon: async (id) => api.delete(`/cms/coupons/${id}`),
  validateCoupon: async (code) => api.post('/cms/coupons/validate', { code }),

  // D2C Products
  getD2CProducts: async (params = {}) => api.get('/cms/d2c-products', params),
  getD2CProductBySlug: async (slug) => api.get(`/cms/d2c-products/${slug}`),

  // Subscriptions
  getSubscriptions: async () => api.get('/cms/subscriptions'),
};
