import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Play, Square, Maximize2, RefreshCw } from 'lucide-react'
import { startDetection, stopDetection, getDetectionStatus, STREAM_URL } from '../../services/detectionService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const cameras = [
  { id: '0', label: 'Webcam (Default)' },
  { id: 'res/inout1.mp4', label: 'Sample Video 1' },
  { id: 'res/input2.mp4', label: 'Sample Video 2' },
]

const Monitor = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState(null)
  const [selectedSource, setSelectedSource] = useState('res/inout1.mp4')
  const [loading, setLoading] = useState(false)
  const [streamKey, setStreamKey] = useState(Date.now())
  const [fullscreen, setFullscreen] = useState(false)

  const pollStatus = useCallback(async () => {
    try {
      const s = await getDetectionStatus()
      setStatus(s)
      setIsRunning(s.running)
    } catch {}
  }, [])

  useEffect(() => {
    pollStatus()
    const timer = setInterval(pollStatus, 3000)
    return () => clearInterval(timer)
  }, [pollStatus])

  const handleStart = async () => {
    setLoading(true)
    try {
      await startDetection(selectedSource)
      setIsRunning(true)
      setStreamKey(Date.now())
      toast.success('Detection started!')
    } catch (e) {
      toast.error(e.message || 'Failed to start detection')
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    setLoading(true)
    try {
      await stopDetection()
      setIsRunning(false)
      toast('Detection stopped', { icon: '⏹' })
    } catch (e) {
      toast.error(e.message || 'Failed to stop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Live Monitor</h1>
          <p className="text-slate-500 text-sm mt-1">YOLOv8 Shoplifting Detection</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            disabled={isRunning}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          {isRunning ? (
            <Button variant="outline" size="sm" onClick={handleStop} isLoading={loading}>
              <Square className="w-4 h-4" /> Stop
            </Button>
          ) : (
            <Button size="sm" onClick={handleStart} isLoading={loading}>
              <Play className="w-4 h-4" /> Start
            </Button>
          )}
        </div>
      </motion.div>

      {/* Main Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isRunning ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-100'}`}>
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                {isRunning ? `Live — ${status?.source || selectedSource}` : 'Offline'}
              </span>
              {status && isRunning && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.status === 'Shoplifting' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                  {status.status} {status.confidence > 0 && `(${status.confidence}%)`}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setStreamKey(Date.now()) }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors" title="Refresh stream">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setFullscreen(!fullscreen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isRunning ? (
            <img
              key={streamKey}
              src={STREAM_URL}
              alt="Live Detection Feed"
              className={`w-full rounded-xl bg-slate-900 object-contain ${fullscreen ? 'fixed inset-0 z-50 w-screen h-screen rounded-none' : ''}`}
              style={{ minHeight: fullscreen ? '100vh' : 360 }}
              onClick={() => fullscreen && setFullscreen(false)}
            />
          ) : (
            <div className="bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-3" style={{ minHeight: 360 }}>
              <Camera className="w-14 h-14 text-slate-600" />
              <p className="text-slate-400 text-sm font-medium">Select a source and press Start</p>
              <p className="text-slate-600 text-xs">Webcam (0) or Sample Video files</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stat strip */}
      {status && isRunning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-4">
          {[
            { label: 'Frames Processed', value: status.stats?.total_frames ?? 0 },
            { label: 'Shoplifting Events', value: status.stats?.shoplifting_count ?? 0 },
            { label: 'Normal Events', value: status.stats?.not_shoplifting_count ?? 0 },
          ].map((s) => (
            <Card key={s.label} className="text-center py-3">
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default Monitor
