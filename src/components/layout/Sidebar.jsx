import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { ShieldCheck, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { logoutUser } from '../../app/features/authSlice'
import { sidebarSections } from './SidebarData'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 230 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-full bg-gradient-to-b from-[#1e2235] to-[#161929] flex-col overflow-hidden flex-shrink-0 hidden md:flex"
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-white tracking-tight whitespace-nowrap text-[15px]"
            >
              Falantir
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 w-6 h-6 bg-dark-800 border border-white/10 rounded-full flex items-center justify-center text-slate-500 hover:text-primary-400 hover:border-primary-500/50 transition-all z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-2.5 space-y-6">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group relative ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary-500 rounded-r-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.12 }}
                              className="whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2.5 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0 text-slate-600 group-hover:text-red-400" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}

export default Sidebar
