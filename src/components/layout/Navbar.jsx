import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Bell, Search, UserCircle, LogOut, ShieldCheck } from 'lucide-react'
import { logoutUser } from '../../app/features/authSlice'
import { useState } from 'react'
import { useSocket } from '../../hooks/useSocket'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { profile } = useSelector((state) => state.user)
  const currentUser = profile || user
  const [showMenu, setShowMenu] = useState(false)
  const { connected } = useSocket()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-surface-200/60 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Left — Mobile logo + Search */}
      <div className="flex items-center gap-4">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Falantir</span>
        </div>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm bg-surface-50 border border-surface-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-slate-700 placeholder-slate-300 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Connection status */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse-soft' : 'bg-slate-300'}`} />
          {connected ? 'LIVE' : 'OFFLINE'}
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-danger rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-200 mx-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-surface-50 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 leading-tight">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 capitalize">{currentUser?.role || 'user'}</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
              {currentUser?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-11 w-44 bg-white rounded-xl shadow-elevated border border-surface-200/60 py-1.5 z-50 animate-scale-in">
                <Link
                  to="/profile"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-slate-600 hover:bg-surface-50 hover:text-slate-800 transition-colors"
                >
                  <UserCircle className="w-4 h-4" /> My Profile
                </Link>
                <hr className="my-1 border-surface-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
