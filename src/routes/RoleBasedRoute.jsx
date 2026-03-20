import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { hasPermission } from '../utils/permissions'

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth)

  if (!hasPermission(user, allowedRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleBasedRoute
