import axios from 'axios';

// Prefer same-origin /api calls in production and let Vercel proxy them to the
// backend. VITE_API_BASE_URL remains available as an explicit override.
export const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || '')
  .replace(/\/+$/, '')    // strip trailing slash(es)
  .replace(/\/api$/, ''); // tolerate if the URL already ends with /api

const API_BASE = `${API_ORIGIN}/api`;

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  signup: (email, name, password) =>
    client.post('/auth/signup', { email, name, password }),
  login: (email, password) =>
    client.post('/auth/login', { email, password }),
  getMe: () => client.get('/auth/me')
};

// Brands
export const brands = {
  create: (data) => client.post('/brands', data),
  list: () => client.get('/brands'),
  get: (brandId) => client.get(`/brands/${brandId}`),
  update: (brandId, data) => client.put(`/brands/${brandId}`, data)
};

// Content
export const content = {
  generate: (brandId, contentType, platform, topic, tone, length, hashtags, cta, generateImage) =>
    client.post('/content/generate', {
      brandId,
      contentType,
      platform,
      topic,
      tone,
      length,
      hashtags,
      cta,
      generateImage
    }),
  create: (data) => client.post('/content', data),
  list: (filters) => client.get('/content', { params: filters }),
  get: (contentId) => client.get(`/content/${contentId}`),
  update: (contentId, data) => client.patch(`/content/${contentId}`, data),
  delete: (contentId) => client.delete(`/content/${contentId}`),
  publish: (contentId, platform) =>
    client.post(`/content/${contentId}/publish`, { contentId, platform }),
  schedule: (contentId, scheduledFor) =>
    client.post(`/content/${contentId}/schedule`, { contentId, scheduledFor }),
  getAnalytics: (contentId) =>
    client.get(`/content/${contentId}/analytics`)
};

// Images
export const images = {
  regenerate: (contentId, versionIndex) =>
    client.post('/images/regenerate', { contentId, versionIndex })
};

// Analytics
export const analytics = {
  getDashboardStats: () => client.get('/dashboard/stats'),
  get: (brandId) => client.get(`/analytics/${brandId}`)
};

// Publishing (legacy)
export const publishing = {
  getMetaOAuthUrl: () => client.get('/meta/oauth-url'),
  publishInstagram: (contentId, brandId) =>
    client.post('/publish/instagram', { contentId, brandId }),
  publishFacebook: (contentId, brandId) =>
    client.post('/publish/facebook', { contentId, brandId })
};

export default client;
