// API Configuration
// This file manages API endpoints for different environments

const getApiBaseUrl = (): string => {
  // Check if we're in production (Netlify)
  if (import.meta.env.PROD) {
    // Production API URL - will be set via Netlify environment variables
    return import.meta.env.VITE_API_BASE_URL || 'https://bookmehere-backend.onrender.com/api';
  }
  
  // Development API URL
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
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
