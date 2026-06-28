import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bell, Volume2, VolumeX, CheckCheck, Trash2, AlertTriangle, Siren } from 'lucide-react'
import { markAllRead, clearNotifications } from '../../app/features/notificationsSlice'
import { getSoundEnabled, setSoundEnabled } from '../../utils/localStorage'
import { THREAT_COLORS } from '../../utils/constants'

const timeAgo = (ts) => {
  const t = new Date(ts).getTime()
  if (!t) return ''
  const s = Math.floor((Date.now() - t) / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const NotificationCenter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, unreadCount } = useSelector((state) => state.notifications)
  const [open, setOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(getSoundEnabled())

  const handleToggleOpen = () => {
    const next = !open
    setOpen(next)
    if (next && unreadCount > 0) dispatch(markAllRead())
  }

  const toggleSound = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
  }

  const openAlerts = () => {
    setOpen(false)
    navigate('/alerts')
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleOpen}
        aria-label="Notifications"
        className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-accent-danger rounded-full ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-elevated border border-surface-200/60 z-50 animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-surface-100">
              <p className="text-sm font-bold text-slate-700">
                Alerts {unreadCount > 0 && <span className="text-primary-500">({unreadCount})</span>}
              </p>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={toggleSound}
                  aria-label={soundOn ? 'Mute alert sound' : 'Unmute alert sound'}
                  title={soundOn ? 'Mute alert sound' : 'Unmute alert sound'}
                  className="p-1.5 rounded-md hover:bg-surface-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => dispatch(markAllRead())}
                  aria-label="Mark all read"
                  title="Mark all read"
                  className="p-1.5 rounded-md hover:bg-surface-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => dispatch(clearNotifications())}
                  aria-label="Clear all notifications"
                  title="Clear all"
                  className="p-1.5 rounded-md hover:bg-surface-100 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-surface-100">
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                  <p className="text-xs text-slate-400">No alerts yet</p>
                </div>
              ) : (
                items.map((n) => {
                  const colors = THREAT_COLORS[n.threat_label] || THREAT_COLORS.safe
                  const isCritical = n.threat_label === 'critical'
                  return (
                    <button
                      key={n.id}
                      onClick={openAlerts}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-surface-50 transition-colors flex gap-2.5 ${!n.read ? 'bg-primary-50/40' : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}>
                        {isCritical ? <Siren className="w-3.5 h-3.5 text-white" /> : <AlertTriangle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-extrabold uppercase ${colors.text}`}>{n.threat_label}</span>
                          <span className="text-[10px] text-slate-400 truncate">· {n.agent_name}</span>
                          <span className="ml-auto text-[10px] text-slate-300 flex-shrink-0">{timeAgo(n.timestamp)}</span>
                        </div>
                        {n.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.description}</p>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter
