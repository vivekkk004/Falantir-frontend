import apiClient from '../api/apiClient'

export const getMe = async () => {
  return await apiClient('/users/me')
}

export const updateMe = async (userData) => {
  return await apiClient('/users/me', {
    method: 'PUT',
    body: userData,
  })
}

export const getAllUsers = async () => {
  return await apiClient('/users/')
}

export const getUserById = async (userId) => {
  return await apiClient(`/users/${userId}`)
}
