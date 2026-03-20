// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Application
export const APP_NAME = 'ShopGuard'
export const APP_DESCRIPTION = 'AI-Powered Shoplifting Detection System'

// Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
}

// Detection Status
export const DETECTION_STATUS = {
  SHOPLIFTING: 'Shoplifting',
  NOT_SHOPLIFTING: 'Not Shoplifting',
  LOADING: 'Loading...',
}

// Alert Severity
export const ALERT_SEVERITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
}
