import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import BottomTabBar from '../components/layout/BottomTabBar'
import AlertsListener from '../components/alerts/AlertsListener'
import { fetchAgents } from '../app/features/agentSlice'

const PrivateRoute = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const hasAgents = useSelector((state) => state.agents.list.length > 0)

  // Ensure agents are loaded so AlertsListener can resolve camera names,
  // even when the user deep-links straight to a non-Dashboard page.
  useEffect(() => {
    if (isAuthenticated && !hasAgents) dispatch(fetchAgents())
  }, [isAuthenticated, hasAgents, dispatch])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AlertsListener />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
      <BottomTabBar />
    </div>
  )
}

export default PrivateRoute
