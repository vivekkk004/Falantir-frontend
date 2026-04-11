import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, ThumbsUp, ThumbsDown, Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import { getIncidents, acknowledgeIncident, submitFeedback, triggerManualAlert } from '../../services/detectionService'
import { THREAT_COLORS } from '../../utils/constants'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

const Alerts = () => {
  const [incidents, setIncidents] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const perPage = 15

  const loadIncidents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getIncidents({ page, per_page: perPage })
      setIncidents(data.incidents || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Failed to load incidents:', err)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { loadIncidents() }, [loadIncidents])

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeIncident(id)
      setIncidents(prev => prev.map(inc => inc._id === id ? { ...inc, acknowledged: true } : inc))
      toast.success('Incident acknowledged')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleFeedback = async (incidentId, verdict) => {
    try {
      await submitFeedback({ incident_id: incidentId, verdict })
      toast.success(`Marked as ${verdict}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleManualAlert = async () => {
    try {
      await triggerManualAlert('Manual security alert triggered from Falantir dashboard.')
      toast.success('Manual alert sent')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alert History</h1>
          <p className="text-sm text-slate-400 mt-1">{total} total incidents</p>
        </div>
        <Button size="sm" variant="danger" onClick={handleManualAlert}>
          <Bell className="w-4 h-4 mr-2" /> Manual Alert
        </Button>
      </motion.div>

      {/* Incident List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="text-center py-16">
            <p className="text-slate-300 text-sm animate-pulse">Loading incidents...</p>
          </Card>
        ) : incidents.length === 0 ? (
          <Card className="text-center py-16">
            <CheckCircle className="w-10 h-10 mx-auto text-green-200 mb-3" />
            <p className="text-slate-400 font-medium">No incidents recorded</p>
          </Card>
        ) : (
          incidents.map((inc, i) => {
            const colors = THREAT_COLORS[inc.threat_label] || THREAT_COLORS.safe
            return (
              <motion.div key={inc._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <Card className={`p-4 border-l-4 ${colors.border}`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Snapshot */}
                    {inc.snapshot && (
                      <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={`data:image/jpeg;base64,${inc.snapshot}`} alt="snapshot" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {inc.threat_label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {(inc.confidence * 100).toFixed(1)}%
                        </span>
                        {inc.acknowledged && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600">ACK</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{inc.scene_description || inc.gemini_description || '—'}</p>
                      {inc.reasoning && (
                        <p className="mt-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded px-1.5 py-1 leading-snug line-clamp-2">
                          <span className="font-bold">Why: </span>{inc.reasoning}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-400">Agent: {inc.agent_id || '—'}</span>
                        <span className="text-[10px] text-slate-400">
                          {inc.timestamp ? new Date(inc.timestamp).toLocaleString() : '—'}
                        </span>
                        {inc.provider_used && (
                          <span className="text-[10px] text-slate-400 font-mono">· {inc.provider_used}</span>
                        )}
                      </div>
                      {(inc.detected_objects || inc.yolo_objects)?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(inc.detected_objects || inc.yolo_objects).slice(0, 4).map((obj, j) => (
                            <span key={j} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                              {obj.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                      {!inc.acknowledged && (
                        <button
                          onClick={() => handleAcknowledge(inc._id)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => handleFeedback(inc._id, 'correct')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" /> Correct
                      </button>
                      <button
                        onClick={() => handleFeedback(inc._id, 'false_positive')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <ThumbsDown className="w-3 h-3" /> False +
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Alerts
