import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileVideo, AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react'
import { uploadVideo } from '../../services/detectionService'
import { useSelector } from 'react-redux'
import { getAgentStreamUrl } from '../../services/agentService'
import { THREAT_COLORS } from '../../utils/constants'
import Card from '../../components/ui/Card'
import VideoAnalysisViewer from '../../components/monitor/VideoAnalysisViewer'

const Monitor = () => {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const { list: agents } = useSelector((state) => state.agents)
  const liveData = useSelector((state) => state.agents.liveData)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setUploading(true)
    setResult(null)
    setError(null)
    setVideoFile(file)

    try {
      const data = await uploadVideo(file)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer?.files?.[0])
  }

  const handleInputChange = (e) => {
    handleFile(e.target?.files?.[0])
  }

  const colors = result ? (THREAT_COLORS[result.threat_label] || THREAT_COLORS.safe) : null

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Live Feed</h1>
        <p className="text-sm text-slate-400 mt-1">Upload video for analysis or monitor live agents</p>
      </motion.div>

      {/* Video Upload */}
      <Card>
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary-500" /> Video Upload & Analysis
        </h2>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
            dragOver ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
          }`}
          onClick={() => document.getElementById('video-input').click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Running 3 AI models in parallel...</p>
              <p className="text-xs text-slate-400">YOLO + Gemini + Threat Classifier</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FileVideo className="w-10 h-10 text-slate-300" />
              <p className="text-sm text-slate-500 font-medium">Drag & drop a video file here</p>
              <p className="text-xs text-slate-400">or click to browse — MP4, AVI, MOV</p>
            </div>
          )}
          <input id="video-input" type="file" accept="video/*" className="hidden" onChange={handleInputChange} />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-sm text-red-600">
            <X className="w-4 h-4" /> {error}
          </div>
        )}

        <VideoAnalysisViewer videoFile={videoFile} uploading={uploading} result={result} />

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {result.threat_label === 'critical' ? (
                    <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
                  ) : (
                    <CheckCircle className={`w-5 h-5 ${colors.text}`} />
                  )}
                  <span className={`font-black uppercase ${colors.text}`}>{result.threat_label}</span>
                </div>
                <span className={`text-sm font-bold ${colors.text}`}>{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <p className="text-sm text-slate-700 italic">{result.scene_description || result.gemini_description}</p>
              {result.reasoning && (
                <p className="mt-2 text-xs text-slate-700 bg-white/60 border border-slate-200/60 rounded-md px-2 py-1.5 leading-snug">
                  <span className="font-bold text-slate-800">Why flagged: </span>{result.reasoning}
                </p>
              )}
              {result.provider_used && (
                <p className="mt-1.5 text-[10px] text-slate-500 font-mono">
                  Analyzed by {result.provider_used} ({result.model || 'unknown'})
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { val: result.frames_analyzed, label: 'Frames' },
                { val: `${result.inference_time_ms}ms`, label: 'Peak Inference' },
                { val: (result.detected_objects || result.yolo_objects)?.length || 0, label: 'Objects' },
                { val: `${result.probabilities?.critical ? (result.probabilities.critical * 100).toFixed(0) : 0}%`, label: 'Risk Score' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-slate-800">{s.val}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{s.label}</p>
                </div>
              ))}
            </div>

            {(result.detected_objects || result.yolo_objects)?.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2">Detected Objects</p>
                <div className="flex flex-wrap gap-1.5">
                  {(result.detected_objects || result.yolo_objects).map((obj, i) => (
                    <span
                      key={i}
                      title={obj.action || ''}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium"
                    >
                      {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                      {obj.action && <span className="ml-1 text-amber-600">• {obj.action}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </Card>

      {/* Active Feeds */}
      {agents.filter(a => a.status === 'streaming').length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Active Agent Feeds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.filter(a => a.status === 'streaming').map((agent) => {
              const live = liveData[agent.id]
              return (
                <Card key={agent.id} className="overflow-hidden p-0">
                  <div className="aspect-video bg-black">
                    <img src={`${getAgentStreamUrl(agent.id)}?t=${Date.now()}`} alt={agent.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-800">{agent.name}</p>
                      <p className="text-xs text-slate-400">{agent.location}</p>
                    </div>
                    {live && (
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${THREAT_COLORS[live.threat_label]?.bg} ${THREAT_COLORS[live.threat_label]?.text}`}>
                        {live.threat_label}
                      </span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Monitor
