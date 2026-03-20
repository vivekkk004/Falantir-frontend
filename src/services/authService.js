import apiClient from '../api/apiClient'

export const loginUser = async (credentials) => {
  return await apiClient('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export const registerUser = async (userData) => {
  return await apiClient('/auth/register', {
    method: 'POST',
    body: userData,
  })
}

export const logoutUser = async () => {
  return await apiClient('/auth/logout', {
    method: 'POST',
  })
}

export const refreshToken = async () => {
  return await apiClient('/auth/refresh', {
    method: 'POST',
  })
}
