import { getToken, removeToken } from '../utils/localStorage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const apiClient = async (endpoint, { method = 'GET', body = null, headers = {}, isFormData = false } = {}) => {
  const token = getToken()

  const config = {
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...headers,
    },
  }

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  // Handle 401 — auto logout
  if (response.status === 401) {
    removeToken()
    window.location.href = '/login'
    return
  }

  let data
  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    // v2 returns { success, data, error } — v1 returns { detail }
    const message = data?.error || data?.detail || data?.message || 'Something went wrong'
    throw { status: response.status, message }
  }

  // v2 API wraps response in { success, data, error }
  if (data?.success !== undefined) {
    return data.data
  }

  return data
}

export default apiClient
