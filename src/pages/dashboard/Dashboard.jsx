import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, AlertTriangle, Activity, Eye, Camera, Wifi, WifiOff,
  Plus, ArrowRight, Clock, Zap, BarChart3, Bell, MapPin, Siren, Volume2
} from 'lucide-react'
import { fetchAgents, updateAgentLiveData } from '../../app/features/agentSlice'
import { useSocket } from '../../hooks/useSocket'
import { getAgentStreamUrl } from '../../services/agentService'
import { THREAT_COLORS } from '../../utils/constants'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
})

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { list: agents } = useSelector((state) => state.agents)
  const { user } = useSelector((state) => state.auth)
  const liveData = useSelector((state) => state.agents.liveData)
  const { connected, joinAgent, leaveAgent, onAgentUpdate, onIncidentAlert } = useSocket()

  // Live threat feed — stores recent suspicious/critical detections
  const [threatFeed, setThreatFeed] = useState([])

  const addToFeed = useCallback((entry) => {
    setThreatFeed(prev => [entry, ...prev].slice(0, 30))
  }, [])

  useEffect(() => { dispatch(fetchAgents()) }, [dispatch])

  useEffect(() => {
    const streaming = agents.filter(a => a.status === 'streaming')
    streaming.forEach(a => joinAgent(a.id))

    const unsub = onAgentUpdate((data) => {
      dispatch(updateAgentLiveData(data))
      // Add to feed if suspicious or critical
      if (data.threat_label === 'suspicious' || data.threat_label === 'critical') {
        const agent = agents.find(a => a.id === data.agent_id)
        addToFeed({
          id: `${data.agent_id}-${Date.now()}`,
          agent_id: data.agent_id,
          agent_name: agent?.name || data.agent_id,
          agent_location: agent?.location || '',
          threat_label: data.threat_label,
          confidence: data.confidence,
          description: data.scene_description || data.gemini_description,
          reasoning: data.reasoning || '',
          detected_objects: data.detected_objects || data.yolo_objects || [],
          timestamp: data.timestamp || new Date().toISOString(),
        })
      }
    })

    const unsubAlert = onIncidentAlert((data) => {
      toast.error(`CRITICAL: ${data.description || 'Threat detected'}`, { duration: 6000 })
    })

    return () => { streaming.forEach(a => leaveAgent(a.id)); unsub(); unsubAlert() }
  }, [agents, joinAgent, leaveAgent, onAgentUpdate, onIncidentAlert, dispatch, addToFeed])

  const totalAgents = agents.length
  const activeAgents = agents.filter(a => a.status === 'streaming').length
  const criticalCount = Object.values(liveData).filter(d => d.threat_label === 'critical').length
  const suspiciousCount = Object.values(liveData).filter(d => d.threat_label === 'suspicious').length

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto">

      {/* ─── Welcome Banner ─── */}
      <motion.div {...anim(0)}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e2235] to-[#2a2d45] p-6 md:p-8">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-400/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-300 text-xs font-semibold tracking-wide uppercase mb-1">{greeting}</p>
              <h1 className="text-xl md:text-2xl font-bold text-white">{user?.name || 'Welcome back'}</h1>
              <p className="text-slate-400 text-sm mt-1 max-w-md">
                {activeAgents > 0
                  ? `${activeAgents} camera${activeAgents > 1 ? 's' : ''} actively monitoring. All systems operational.`
                  : 'No cameras active. Add an agent in Settings to start monitoring.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${connected ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'}`}>
                {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {connected ? 'LIVE' : 'OFFLINE'}
              </div>
              {totalAgents === 0 && (
                <Button size="sm" onClick={() => navigate('/settings')} className="bg-primary-500 hover:bg-primary-600">
                  <Plus className="w-3.5 h-3.5" /> Add Agent
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Agents', value: totalAgents, icon: Camera, iconBg: 'bg-primary-500/10', iconColor: 'text-primary-500' },
          { label: 'Active Now', value: activeAgents, icon: Activity, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
          { label: 'Suspicious', value: suspiciousCount, icon: AlertTriangle, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' },
          { label: 'Critical', value: criticalCount, icon: ShieldCheck, iconBg: 'bg-red-500/10', iconColor: 'text-red-500' },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...anim(0.05 + i * 0.04)}>
            <div className="bg-white rounded-2xl border border-surface-200/60 p-4 flex items-center gap-3.5 shadow-soft">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800 leading-none">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Quick Actions (when no agents) ─── */}
      {agents.length === 0 && (
        <motion.div {...anim(0.25)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: 'Add Camera Agent', desc: 'Connect a webcam or RTSP stream', icon: Plus, path: '/settings', color: 'text-primary-500' },
              { title: 'Upload Video', desc: 'Analyze a video file with 3 AI models', icon: Zap, path: '/live-feed', color: 'text-amber-500' },
              { title: 'View Analytics', desc: 'Check incident trends and stats', icon: BarChart3, path: '/analytics', color: 'text-emerald-500' },
            ].map((action) => (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="bg-white rounded-2xl border border-surface-200/60 p-5 text-left hover:border-primary-200 hover:shadow-card transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">{action.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{action.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Agent Cards + Threat Feed Side by Side ─── */}
      {agents.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Agent Cards — 2/3 width */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary-500" /> Camera Agents
              </h2>
              <button
                onClick={() => navigate('/settings')}
                className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} liveData={liveData[agent.id]} index={i} />
              ))}
            </div>
          </div>

          {/* ─── Live Threat Feed — 1/3 width ─── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Siren className="w-4 h-4 text-red-500" /> Live Threat Feed
              </h2>
              {threatFeed.length > 0 && (
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md animate-pulse-soft">
                  {threatFeed.length} ALERTS
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-surface-200/60 shadow-soft overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto divide-y divide-surface-100">
                {threatFeed.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShieldCheck className="w-10 h-10 mx-auto text-emerald-200 mb-3" />
                    <p className="text-sm font-semibold text-slate-400">All clear</p>
                    <p className="text-[11px] text-slate-300 mt-1">No suspicious activity detected</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {threatFeed.map((item) => (
                      <ThreatFeedItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Row ─── */}
      {agents.length > 0 && (
        <motion.div {...anim(0.3)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-surface-200/60 p-5 shadow-soft">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Upload & Analyze Video', path: '/live-feed', icon: Camera },
                  { label: 'View Alert History', path: '/alerts', icon: Bell },
                  { label: 'Analytics Dashboard', path: '/analytics', icon: BarChart3 },
                  { label: 'Manage Workflows', path: '/workflows', icon: Activity },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-surface-50 hover:text-slate-800 transition-all group text-left"
                  >
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    <span className="flex-1 font-medium">{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200/60 p-5 shadow-soft">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> System Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'WebSocket', value: connected ? 'Connected' : 'Disconnected', ok: connected },
                  { label: 'YOLO v8', value: 'Active', ok: true },
                  { label: 'Gemini AI', value: 'Active', ok: true },
                  { label: 'Threat Model', value: 'Disabled', ok: false },
                ].map((item) => (
                  <div key={item.label} className="bg-surface-50 rounded-xl p-3.5 text-center">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-2 ${item.ok ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <p className="text-xs font-bold text-slate-700">{item.value}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

/* ─── Threat Feed Item ─── */
const ThreatFeedItem = ({ item }) => {
  const colors = THREAT_COLORS[item.threat_label] || THREAT_COLORS.safe
  const isCritical = item.threat_label === 'critical'
  const time = new Date(item.timestamp)
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`p-3.5 ${isCritical ? 'bg-red-50/40' : 'bg-amber-50/30'} hover:bg-surface-50 transition-colors`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}>
            {isCritical ? <Siren className="w-3 h-3 text-white" /> : <AlertTriangle className="w-3 h-3 text-white" />}
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${colors.text}`}>
            {item.threat_label}
          </span>
          <span className="text-[10px] font-bold text-slate-500">
            {(item.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">{timeStr}</span>
      </div>

      {/* Agent info */}
      <div className="flex items-center gap-1 mb-1.5">
        <Camera className="w-3 h-3 text-slate-400" />
        <span className="text-[11px] font-semibold text-slate-600">{item.agent_name}</span>
        {item.agent_location && (
          <>
            <span className="text-slate-300 mx-0.5">·</span>
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] text-slate-400">{item.agent_location}</span>
          </>
        )}
      </div>

      {/* Scene description (Gemini) */}
      {item.description && item.description !== 'Skipped (frame skip)' && (
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-1.5">
          {item.description}
        </p>
      )}

      {/* Reasoning — why Gemini flagged this */}
      {item.reasoning && (
        <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-md px-1.5 py-1 leading-snug line-clamp-2 mb-1.5">
          <span className="font-bold">Why: </span>{item.reasoning}
        </p>
      )}

      {/* Detected objects */}
      {item.detected_objects?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.detected_objects.slice(0, 3).map((obj, i) => (
            <span key={i} className="text-[9px] bg-white text-slate-500 px-1.5 py-0.5 rounded font-semibold border border-surface-200/60">
              {obj.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ─── Agent Card ─── */
const AgentCard = ({ agent, liveData, index }) => {
  const threat = liveData?.threat_label || 'safe'
  const colors = THREAT_COLORS[threat] || THREAT_COLORS.safe
  const isStreaming = agent.status === 'streaming'

  const ringClass = isStreaming && threat === 'critical'
    ? 'ring-2 ring-red-400/40'
    : isStreaming && threat === 'suspicious'
      ? 'ring-2 ring-amber-400/30'
      : ''

  return (
    <motion.div {...anim(0.1 + index * 0.04)}>
      <div className={`bg-white rounded-2xl border border-surface-200/60 overflow-hidden shadow-soft transition-all duration-300 ${ringClass}`}>
        <div className="aspect-video bg-[#0d0f1a] relative overflow-hidden">
          {isStreaming ? (
            <img src={`${getAgentStreamUrl(agent.id)}?t=${Date.now()}`} alt={agent.name} className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Camera className="w-8 h-8 text-slate-700/30 mb-1.5" />
              <p className="text-[9px] font-bold text-slate-700/30 tracking-[0.2em]">OFFLINE</p>
            </div>
          )}

          <div className="absolute top-0 left-0 right-0 p-2 flex items-start justify-between">
            {isStreaming && (
              <div className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md ${colors.bg} ${colors.text}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle ${colors.dot} ${threat === 'critical' ? 'animate-pulse-soft' : ''}`} />
                {threat} {liveData?.confidence ? `${(liveData.confidence * 100).toFixed(0)}%` : ''}
              </div>
            )}
            <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide ${isStreaming ? 'bg-emerald-500/20 text-emerald-400 backdrop-blur-md' : 'bg-white/5 text-slate-600'}`}>
              {isStreaming ? 'LIVE' : 'OFF'}
            </div>
          </div>

          {liveData?.inference_time_ms && (
            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/50 text-[8px] font-mono text-white/60 backdrop-blur-sm">
              {liveData.inference_time_ms}ms
            </div>
          )}
        </div>

        <div className="p-3.5 space-y-1.5">
          <h3 className="font-bold text-[13px] text-slate-800">{agent.name}</h3>
          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {agent.location || 'No location'}
          </p>

          {(liveData?.scene_description || liveData?.gemini_description) && (liveData?.scene_description || liveData?.gemini_description) !== 'Skipped (frame skip)' && (
            <p className="text-[11px] text-slate-500 bg-surface-50 rounded-lg p-2 leading-relaxed line-clamp-2 border border-surface-200/40 mt-2">
              {liveData.scene_description || liveData.gemini_description}
            </p>
          )}

          {liveData?.reasoning && (
            <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-md px-1.5 py-1 leading-snug line-clamp-2 mt-1.5">
              <span className="font-bold">Why: </span>{liveData.reasoning}
            </p>
          )}

          {(liveData?.detected_objects?.length > 0 || liveData?.yolo_objects?.length > 0) && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(liveData.detected_objects || liveData.yolo_objects).slice(0, 4).map((obj, i) => (
                <span key={i} className="text-[9px] bg-surface-100 text-slate-500 px-1.5 py-0.5 rounded-md font-semibold">
                  {obj.label}
                </span>
              ))}
              {(liveData.detected_objects || liveData.yolo_objects).length > 4 && (
                <span className="text-[9px] text-slate-400 px-1 py-0.5 font-medium">+{(liveData.detected_objects || liveData.yolo_objects).length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
