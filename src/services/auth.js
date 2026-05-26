import { api } from './api';

export const authService = {
  sendOtp: async (mobile) => {
    return api.post('/auth/send-otp', { mobile });
  },

  verifyOtp: async (mobile, otp) => {
    const res = await api.post('/auth/verify-otp', { mobile, otp });
    const token = res.data?.accessToken || res.accessToken || res.token;
    const refreshToken = res.data?.refreshToken || res.refreshToken;
    if (token) api.setToken(token);
    if (refreshToken) localStorage.setItem('dc_refresh_token', refreshToken);
    return res;
  },

  loginEmail: async (email, password) => {
    const res = await api.post('/auth/login-email', { email, password });
    const token = res.data?.accessToken || res.accessToken || res.token;
    const refreshToken = res.data?.refreshToken || res.refreshToken;
    if (token) api.setToken(token);
    if (refreshToken) localStorage.setItem('dc_refresh_token', refreshToken);
    return res;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('dc_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const res = await api.post('/auth/refresh-token', { refreshToken });
    const token = res.data?.accessToken || res.accessToken || res.token;
    if (token) api.setToken(token);
    return res;
  },

  getMe: async () => {
    return api.get('/auth/me');
  },

  updateProfile: async (data) => {
    return api.patch('/auth/profile', data);
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('dc_refresh_token');
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (_) { /* ignore logout errors */ }
    api.setToken(null);
  },
};
