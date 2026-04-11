import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import Landing from '../pages/landing/Landing'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import Monitor from '../pages/monitor/Monitor'
import Alerts from '../pages/alerts/Alerts'
import Analytics from '../pages/analytics/Analytics'
import WorkflowBuilder from '../pages/workflow/WorkflowBuilder'
import Users from '../pages/users/Users'
import Profile from '../pages/profile/Profile'
import Settings from '../pages/settings/Settings'

/**
 * Root route picker.
 * Guests see the marketing landing page. Logged-in users are redirected
 * straight to their dashboard so they don't hit a marketing wall post-login.
 */
const RootRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <Landing />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing — open to everyone, auto-redirects logged-in users */}
      <Route path="/" element={<RootRoute />} />

      {/* Public Routes — block if already authenticated */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Private Routes — require authentication */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-feed" element={<Monitor />} />
        <Route path="/monitor" element={<Monitor />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/workflows" element={<WorkflowBuilder />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback — unknown routes land on the landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
