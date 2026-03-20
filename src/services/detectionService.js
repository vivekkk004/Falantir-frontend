import apiClient from '../api/apiClient'

// ─── Control ──────────────────────────────────────────────

export const startDetection = async (source = '0') => {
  return await apiClient(`/detection/start?source=${encodeURIComponent(source)}`, {
    method: 'POST',
  })
}

export const stopDetection = async () => {
  return await apiClient('/detection/stop', { method: 'POST' })
}

export const getDetectionStatus = async () => {
  return await apiClient('/detection/status')
}

// ─── Alerts ───────────────────────────────────────────────

export const getAlerts = async ({ limit = 20, status = null } = {}) => {
  const params = new URLSearchParams({ limit })
  if (status) params.append('status', status)
  return await apiClient(`/detection/alerts?${params}`)
}

export const getAlertsFromDB = async ({ limit = 50, status = null } = {}) => {
  const params = new URLSearchParams({ limit })
  if (status) params.append('status', status)
  return await apiClient(`/detection/alerts/db?${params}`)
}

export const saveAlerts = async () => {
  return await apiClient('/detection/alerts/save', { method: 'POST' })
}

// ─── Stats ────────────────────────────────────────────────

export const getDetectionStats = async () => {
  return await apiClient('/detection/stats')
}

// ─── Stream URL (used as img src) ─────────────────────────
export const STREAM_URL = 'http://localhost:8000/api/detection/stream'
