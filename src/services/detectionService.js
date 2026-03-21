import apiClient from '../api/apiClient'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// ─── Models Status ───────────────────────────────────────

export const getModelsStatus = async () => {
  return await apiClient('/detection/models')
}

// ─── Video Upload ────────────────────────────────────────

export const uploadVideo = async (file) => {
  const formData = new FormData()
  formData.append('video', file)
  return await apiClient('/detection/upload', {
    method: 'POST',
    body: formData,
    isFormData: true,
  })
}

// ─── Incidents ───────────────────────────────────────────

export const getIncidents = async ({ page = 1, per_page = 20, agent_id = null } = {}) => {
  const params = new URLSearchParams({ page, per_page })
  if (agent_id) params.append('agent_id', agent_id)
  return await apiClient(`/detection/incidents?${params}`)
}

export const acknowledgeIncident = async (incidentId) => {
  return await apiClient(`/detection/incidents/${incidentId}/acknowledge`, { method: 'POST' })
}

// ─── RL Feedback ─────────────────────────────────────────

export const submitFeedback = async ({ incident_id, verdict, correct_label = null }) => {
  return await apiClient('/detection/feedback', {
    method: 'POST',
    body: { incident_id, verdict, correct_label },
  })
}

// ─── Stats & Analytics ──────────────────────────────────

export const getStats = async () => {
  return await apiClient('/detection/stats')
}

export const getDailyAnalytics = async (days = 30) => {
  return await apiClient(`/detection/analytics/daily?days=${days}`)
}

// ─── Manual Alert ────────────────────────────────────────

export const triggerManualAlert = async (message) => {
  return await apiClient('/detection/alert/manual', {
    method: 'POST',
    body: { message },
  })
}

// ─── Legacy (v1 compatibility) ───────────────────────────

export const STREAM_URL = `${API_BASE}/detection/stream`

export const startDetection = async (source = '0') => {
  return await apiClient(`/detection/start?source=${encodeURIComponent(source)}`, { method: 'POST' })
}

export const stopDetection = async () => {
  return await apiClient('/detection/stop', { method: 'POST' })
}

export const getDetectionStatus = async () => {
  return await apiClient('/detection/status')
}

export const getAlerts = async ({ limit = 20, status = null } = {}) => {
  const params = new URLSearchParams({ limit })
  if (status) params.append('status', status)
  return await apiClient(`/detection/alerts?${params}`)
}
