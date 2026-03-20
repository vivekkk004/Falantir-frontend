import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { AlertTriangle, Camera, Activity, Eye, ShieldCheck, Play, Square } from 'lucide-react'
import { fetchCurrentUser } from '../../app/features/userSlice'
import { fetchSystemState, startDetectionEngine, stopDetectionEngine } from '../../app/features/detectionSlice'
import { STREAM_URL } from '../../services/detectionService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { profile } = useSelector((state) => state.user)
  const { isRunning, stats, recentAlerts, isLoading } = useSelector((state) => state.detection)

  const loadData = useCallback(() => {
    dispatch(fetchSystemState())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCurrentUser())
    loadData()
    const interval = setInterval(loadData, 4000) // Poll every 4s for stability
    return () => clearInterval(interval)
  }, [dispatch, loadData])

  const handleToggle = async () => {
    if (isRunning) {
      await dispatch(stopDetectionEngine())
      toast('Detection Stopped', { icon: '⏹' })
    } else {
      await dispatch(startDetectionEngine('res/inout1.mp4'))
      toast.success('Detection Started!')
    }
  }

  const statCards = [
    { label: 'Alerts (DB)', val: stats?.db?.total_alerts ?? 0, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Confirmed', val: stats?.db?.shoplifting_alerts ?? 0, icon: ShieldCheck, color: 'text-amber-600 bg-amber-50' },
    { label: 'Session Frames', val: stats?.engine?.stats?.total_frames ?? 0, icon: Camera, color: 'text-blue-600 bg-blue-50' },
    { label: 'Incident Hits', val: stats?.engine?.stats?.shoplifting_count ?? 0, icon: Activity, color: 'text-green-600 bg-green-50' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">ShopGuard Dashboard</h1>
        <Button size="sm" variant={isRunning ? 'outline' : 'primary'} onClick={handleToggle} isLoading={isLoading}>
          {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Stop System' : 'Launch System'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{stat.val}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="flex items-center justify-between p-4 bg-white border-b border-slate-50">
            <h2 className="flex items-center gap-2 font-bold text-slate-800"><Eye className="w-4 h-4 text-primary-500" /> Live Feed</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isRunning ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
               {isRunning ? 'ACTIVE' : 'OFFLINE'}
            </span>
          </div>
          <div className="aspect-video bg-black relative">
            {isRunning ? (
              <img src={`${STREAM_URL}?t=${stats?.server_time}`} alt="Stream" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-700">
                <Camera className="w-12 h-12 opacity-10 mb-2" />
                <p className="text-xs font-bold opacity-30">CAMERA SYSTEM OFFLINE</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-4 px-1"><Activity className="w-4 h-4 text-red-500" /> Log</h2>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[360px] pr-1">
            {recentAlerts.map((a, i) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-800">{a.status}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{new Date(a.timestamp).toLocaleTimeString()}</p>
                </div>
                <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 h-fit rounded-lg">{a.confidence}%</span>
              </div>
            ))}
            {recentAlerts.length === 0 && <p className="text-center py-20 text-slate-300 text-xs font-bold">WAITING FOR DATA...</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
