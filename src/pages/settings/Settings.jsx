import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Shield, Monitor, Database, Plus, Trash2, Play, Square, Cpu } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAgents, addAgent, removeAgent, startAgent, stopAgent } from '../../app/features/agentSlice'
import { getModelsStatus } from '../../services/detectionService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

const Toggle = ({ enabled, onClick }) => (
  <button onClick={onClick} className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-slate-200'}`}>
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)

const Settings = () => {
  const dispatch = useDispatch()
  const { list: agents, isLoading } = useSelector((state) => state.agents)
  const [models, setModels] = useState(null)
  const [newAgent, setNewAgent] = useState({ name: '', location: '', camera_uri: '' })
  const [showForm, setShowForm] = useState(false)

  const [settings, setSettings] = useState({
    emailAlerts: true,
    soundAlerts: false,
    autoRecord: true,
    highConfOnly: true,
    showBoxes: true,
    showConf: true,
  })

  useEffect(() => {
    dispatch(fetchAgents())
    getModelsStatus().then(setModels).catch(() => {})
  }, [dispatch])

  const handleAddAgent = async () => {
    if (!newAgent.name.trim() || !newAgent.camera_uri.trim()) {
      toast.error('Name and Camera URI are required')
      return
    }
    try {
      await dispatch(addAgent(newAgent)).unwrap()
      setNewAgent({ name: '', location: '', camera_uri: '' })
      setShowForm(false)
      toast.success('Agent added')
    } catch (err) {
      toast.error(err || 'Failed to add agent')
    }
  }

  const handleDelete = async (id) => {
    try {
      await dispatch(removeAgent(id)).unwrap()
      toast.success('Agent deleted')
    } catch (err) {
      toast.error(err || 'Failed to delete')
    }
  }

  const handleStart = async (id) => {
    try {
      await dispatch(startAgent(id)).unwrap()
      toast.success('Stream started')
    } catch (err) {
      toast.error(err || 'Failed to start')
    }
  }

  const handleStop = async (id) => {
    try {
      await dispatch(stopAgent(id)).unwrap()
      toast('Stream stopped')
    } catch (err) {
      toast.error(err || 'Failed to stop')
    }
  }

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const settingsSections = [
    {
      title: 'Notifications', icon: Bell, color: 'bg-blue-50 text-blue-600',
      items: [
        { label: 'Email Alerts', desc: 'Receive email on detection', key: 'emailAlerts' },
        { label: 'Sound Alerts', desc: 'Play sound on detection', key: 'soundAlerts' },
      ],
    },
    {
      title: 'Detection', icon: Shield, color: 'bg-green-50 text-green-600',
      items: [
        { label: 'Auto Record', desc: 'Record clips on detection', key: 'autoRecord' },
        { label: 'High Confidence Only', desc: 'Alert only above threshold', key: 'highConfOnly' },
      ],
    },
    {
      title: 'Display', icon: Monitor, color: 'bg-purple-50 text-purple-600',
      items: [
        { label: 'Show Bounding Boxes', desc: 'Draw boxes around detections', key: 'showBoxes' },
        { label: 'Show Confidence Score', desc: 'Display confidence percent', key: 'showConf' },
      ],
    },
  ]

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage agents, preferences, and system configuration</p>
      </motion.div>

      {/* ═══ Agent Management ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="font-semibold text-slate-800">Camera Agents</h2>
            </div>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-1" /> Add Agent
            </Button>
          </div>

          {/* New agent form */}
          {showForm && (
            <div className="mb-5 p-4 bg-slate-50 rounded-xl space-y-3">
              <Input label="Agent Name" placeholder="e.g. Front Door Camera" value={newAgent.name} onChange={(e) => setNewAgent(p => ({ ...p, name: e.target.value }))} />
              <Input label="Location" placeholder="e.g. Main Entrance" value={newAgent.location} onChange={(e) => setNewAgent(p => ({ ...p, location: e.target.value }))} />
              <Input label="Camera URI" placeholder="rtsp://... or 0 for webcam" value={newAgent.camera_uri} onChange={(e) => setNewAgent(p => ({ ...p, camera_uri: e.target.value }))} />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddAgent} isLoading={isLoading}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Agent list */}
          <div className="space-y-3">
            {agents.length === 0 ? (
              <p className="text-center py-6 text-slate-300 text-sm">No agents registered</p>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800">{agent.name}</p>
                    <p className="text-[10px] text-slate-400">{agent.location || 'No location'} — {agent.camera_uri}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${agent.status === 'streaming' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      {agent.status === 'streaming' ? 'LIVE' : 'OFF'}
                    </span>
                    {agent.status === 'streaming' ? (
                      <button onClick={() => handleStop(agent.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button onClick={() => handleStart(agent.id)} className="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100">
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(agent.id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* ═══ Preference Toggles ═══ */}
      {settingsSections.map((section, si) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.05 }}>
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${section.color}`}>
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-slate-800">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <Toggle enabled={settings[item.key]} onClick={() => toggle(item.key)} />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {/* ═══ Model Status ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800">AI Models & System</h2>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'API Server', value: 'http://localhost:8000' },
              { label: 'Database', value: 'MongoDB — falantir' },
              {
                label: 'Active Vision Provider',
                value: models?.active_provider
                  ? models.active_provider.toUpperCase()
                  : 'Unknown',
              },
              {
                label: 'Fallback Chain',
                value: Array.isArray(models?.fallback_chain)
                  ? models.fallback_chain.join(' → ')
                  : 'gemini → mobilenetv3 → safe',
              },
              {
                label: 'Gemini',
                value: models?.gemini?.initialized
                  ? `${models.gemini.model} ✓ ready`
                  : models?.gemini?.configured
                    ? `${models.gemini.model} (configured, not warm)`
                    : 'Not configured',
              },
              {
                label: 'Local Student Model',
                value: models?.mobilenetv3?.loaded
                  ? `MobileNetV3 on ${models.mobilenetv3.device}`
                  : 'Not trained yet (fallback skipped)',
              },
              {
                label: 'Motion Gate',
                value: models?.motion_detection?.enabled
                  ? `threshold ${models.motion_detection.threshold} · cooldown ${models.motion_detection.cooldown_frames}f`
                  : 'Disabled',
              },
              { label: 'Version', value: 'Falantir v2.1.0' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-slate-50 last:border-0 gap-3">
                <span className="text-slate-400 flex-shrink-0">{item.label}</span>
                <span className="font-medium text-slate-700 font-mono text-xs bg-slate-50 px-2 py-0.5 rounded text-right truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Settings
