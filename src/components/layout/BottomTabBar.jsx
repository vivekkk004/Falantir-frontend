import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Camera, AlertTriangle, BarChart2, Settings } from 'lucide-react'

const tabs = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Feed', path: '/live-feed', icon: Camera },
  { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
  { label: 'Stats', path: '/analytics', icon: BarChart2 },
  { label: 'More', path: '/settings', icon: Settings },
]

const BottomTabBar = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-white/5 z-50 safe-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors relative ${
                isActive ? 'text-primary-400' : 'text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-primary-500 rounded-full" />
                )}
                <tab.icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-bold ${isActive ? 'text-primary-400' : 'text-slate-600'}`}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomTabBar
