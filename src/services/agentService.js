import apiClient from '../api/apiClient'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const getAgents = async () => {
  return await apiClient('/agents/')
}

export const createAgent = async ({ name, location, camera_uri }) => {
  return await apiClient('/agents/', {
    method: 'POST',
    body: { name, location, camera_uri },
  })
}

export const deleteAgent = async (agentId) => {
  return await apiClient(`/agents/${agentId}`, { method: 'DELETE' })
}

export const startAgentStream = async (agentId) => {
  return await apiClient(`/agents/${agentId}/start`, { method: 'POST' })
}

export const stopAgentStream = async (agentId) => {
  return await apiClient(`/agents/${agentId}/stop`, { method: 'POST' })
}

export const getAgentStatus = async (agentId) => {
  return await apiClient(`/agents/${agentId}/status`)
}

export const getAgentStreamUrl = (agentId) => {
  return `${API_BASE}/agents/${agentId}/stream`
}
