import { ROLES } from './constants'

export const hasRole = (user, role) => {
  if (!user || !user.role) return false
  return user.role === role
}

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN)
export const isManager = (user) => hasRole(user, ROLES.MANAGER)
export const isUser = (user) => hasRole(user, ROLES.USER)

export const hasPermission = (user, requiredRoles = []) => {
  if (!user || !user.role) return false
  return requiredRoles.includes(user.role)
}
