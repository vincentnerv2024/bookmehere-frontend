// API Configuration
// This file manages API endpoints for different environments
// Updated: Force HTTPS for production

const getApiBaseUrl = (): string => {
  // Check if we're in production (Netlify)
  if (import.meta.env.PROD) {
    // Production API URL - use HTTPS with self-signed cert (browser will warn but allow)
    return 'https://138.197.159.142/api';
  }
  
  // Development API URL
  return 'http://localhost:3001/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Services
  SERVICES: '/services',
  SERVICE_BY_ID: (id: number) => `/services/${id}`,
  SERVICE_SETTINGS: '/services/settings',
  
  // Masters
  MASTERS: '/masters',
  MASTERS_BY_SERVICE: (serviceId: number) => `/masters/service/${serviceId}`,
  MASTER_AVAILABILITY: (masterId: number, date: string) => `/masters/${masterId}/availability/${date}`,
  
  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id: number) => `/bookings/${id}`,
  
  // Admin
  ADMIN_LOGIN: '/simple-admin/login',
  ADMIN_CHECK: '/simple-admin/check',
  ADMIN_LOGOUT: '/simple-admin/logout',
  
  // User
  USER_LOGIN: '/simple-admin/user-login',
  USER_CHECK: '/simple-admin/user-check',
  USER_LOGOUT: '/simple-admin/logout',
  
  // Auth
  AUTH_GOOGLE: '/auth/google',
  AUTH_CALLBACK: '/auth/google/callback',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Environment info
export const ENV_INFO = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: API_CONFIG.BASE_URL,
  nodeEnv: import.meta.env.MODE,
};
