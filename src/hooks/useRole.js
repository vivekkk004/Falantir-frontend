import { useSelector } from 'react-redux'
import { isAdmin, isManager, hasPermission } from '../utils/permissions'

const useRole = () => {
  const { user } = useSelector((state) => state.auth)

  return {
    role: user?.role || null,
    isAdmin: isAdmin(user),
    isManager: isManager(user),
    checkPermission: (requiredRoles) => hasPermission(user, requiredRoles),
  }
}

export default useRole
