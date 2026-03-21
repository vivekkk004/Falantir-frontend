// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

// Application
export const APP_NAME = 'Falantir'
export const APP_DESCRIPTION = 'Autonomous AI Security Agent System'

// Roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
}

// Threat Levels
export const THREAT_LEVELS = {
  SAFE: 'safe',
  SUSPICIOUS: 'suspicious',
  CRITICAL: 'critical',
}

export const THREAT_COLORS = {
  safe: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
  suspicious: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' },
  critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LIVE_FEED: '/live-feed',
  ANALYTICS: '/analytics',
  ALERTS: '/alerts',
  SETTINGS: '/settings',
  USERS: '/users',
  PROFILE: '/profile',
}
