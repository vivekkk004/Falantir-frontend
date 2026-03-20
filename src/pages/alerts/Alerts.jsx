import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Camera, Filter, RefreshCw, Download, Save } from 'lucide-react'
import { getAlerts, getAlertsFromDB, saveAlerts } from '../../services/detectionService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import toast from 'react-hot-toast'

const statusColor = {
  Shoplifting: 'bg-red-100 text-red-600',
  'Not Shoplifting': 'bg-green-50 text-green-600',
}

const Alerts = () => {
  const [liveAlerts, setLiveAlerts] = useState([])
  const [dbAlerts, setDbAlerts] = useState([])
  const [filter, setFilter] = useState('All')
  const [view, setView] = useState('live') // 'live' | 'db'
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState(null)

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const [live, db] = await Promise.all([getAlerts({ limit: 50 }), getAlertsFromDB({ limit: 100 })])
      setLiveAlerts(live)
      setDbAlerts(db)
    } catch (e) {
      // not started
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAlerts()
    const timer = setInterval(() => view === 'live' && loadAlerts(), 4000)
    return () => clearInterval(timer)
  }, [loadAlerts, view])

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await saveAlerts()
      toast.success(`${result.saved} alerts saved to database!`)
      await loadAlerts()
    } catch (e) {
      toast.error(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const alerts = view === 'live' ? liveAlerts : dbAlerts
  const filtered = filter === 'All' ? alerts : alerts.filter((a) => a.status === filter)

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alerts</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time detection events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadAlerts} isLoading={loading}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button size="sm" onClick={handleSave} isLoading={saving}>
            <Save className="w-4 h-4" /> Save to DB
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          {/* Tab + Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* View tabs */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden text-xs font-medium">
              <button onClick={() => setView('live')} className={`px-3 py-1.5 transition-colors ${view === 'live' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                Live ({liveAlerts.length})
              </button>
              <button onClick={() => setView('db')} className={`px-3 py-1.5 transition-colors ${view === 'db' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                Saved DB ({dbAlerts.length})
              </button>
            </div>

            {/* Status filter */}
            <div className="flex gap-1.5 items-center ml-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {['All', 'Shoplifting', 'Not Shoplifting'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-slate-400">{filtered.length} events</span>
          </div>

          {/* Alerts list */}
          {loading && filtered.length === 0 ? (
            <div className="flex justify-center py-12"><Loader /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No {filter !== 'All' ? filter : ''} alerts {view === 'live' ? '— start detection first' : 'in database'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.status === 'Shoplifting' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <AlertTriangle className={`w-5 h-5 ${alert.status === 'Shoplifting' ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{alert.status} Detected</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor[alert.status] || 'bg-slate-100 text-slate-500'}`}>
                        {alert.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{alert.camera_label || alert.camera_id}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(alert.timestamp).toLocaleString()}</span>
                    </p>
                  </div>
                  {alert.snapshot && (
                    <img
                      src={`data:image/jpeg;base64,${alert.snapshot}`}
                      alt="snapshot"
                      className="w-14 h-10 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Alert detail modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAlert(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="font-bold text-slate-800 text-lg mb-3">Alert Detail</h3>
            {selectedAlert.snapshot && (
              <img
                src={`data:image/jpeg;base64,${selectedAlert.snapshot}`}
                alt="snapshot"
                className="w-full rounded-xl mb-4 border border-slate-100"
              />
            )}
            <div className="space-y-2 text-sm">
              {[
                ['Status', selectedAlert.status],
                ['Confidence', `${selectedAlert.confidence}%`],
                ['Camera', selectedAlert.camera_label],
                ['Time', new Date(selectedAlert.timestamp).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="font-medium text-slate-700">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedAlert(null)} className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-600 transition-colors">
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Alerts
