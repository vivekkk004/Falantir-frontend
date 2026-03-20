import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Shield, Monitor, Database, Palette } from 'lucide-react'
import Card from '../../components/ui/Card'

const settingsSections = [
  {
    title: 'Notifications',
    icon: Bell,
    color: 'bg-blue-50 text-blue-600',
    items: [
      { label: 'Email Alerts', desc: 'Receive email on detection', enabled: true },
      { label: 'Sound Alerts', desc: 'Play sound on detection', enabled: false },
    ],
  },
  {
    title: 'Detection',
    icon: Shield,
    color: 'bg-green-50 text-green-600',
    items: [
      { label: 'Auto Record', desc: 'Record clips on detection', enabled: true },
      { label: 'High Confidence Only', desc: 'Alert only above 80% confidence', enabled: true },
    ],
  },
  {
    title: 'Display',
    icon: Monitor,
    color: 'bg-purple-50 text-purple-600',
    items: [
      { label: 'Show Bounding Boxes', desc: 'Draw boxes around detections', enabled: true },
      { label: 'Show Confidence Score', desc: 'Display confidence percent', enabled: true },
    ],
  },
]

const Toggle = ({ enabled }) => (
  <div className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-slate-200'}`}>
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
  </div>
)

const Settings = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure system preferences</p>
      </motion.div>

      {settingsSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.08 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${section.color}`}>
                <section.icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-slate-800">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item, ii) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <Toggle enabled={item.enabled} />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {/* System Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="font-semibold text-slate-800">System Info</h2>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'API Server', value: 'http://localhost:8000' },
              { label: 'Database', value: 'MongoDB — shopguard' },
              { label: 'Model', value: 'YOLOv8 (shoplifting_wights.pt)' },
              { label: 'Version', value: 'ShopGuard v1.0.0' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-400">{item.label}</span>
                <span className="font-medium text-slate-700 font-mono text-xs bg-slate-50 px-2 py-0.5 rounded">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Settings
