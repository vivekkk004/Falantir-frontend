import { useSelector, useDispatch } from 'react-redux'
import { loginUser, registerUser, logoutUser, clearError } from '../app/features/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  )

  const login = (credentials) => dispatch(loginUser(credentials))
  const register = (userData) => dispatch(registerUser(userData))
  const logout = () => dispatch(logoutUser())
  const clearAuthError = () => dispatch(clearError())

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  }
}

export default useAuth
