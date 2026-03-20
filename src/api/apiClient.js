import { getToken, removeToken } from '../utils/localStorage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const apiClient = async (endpoint, { method = 'GET', body = null, headers = {} } = {}) => {
  const token = getToken()

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
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
    // FastAPI returns errors as { detail: "..." }
    const message = data?.detail || data?.message || 'Something went wrong'
    throw { status: response.status, message }
  }

  return data
}

export default apiClient
