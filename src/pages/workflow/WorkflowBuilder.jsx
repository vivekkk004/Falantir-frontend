import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Workflow, Plus, Trash2, ChevronDown, ChevronUp, Zap, Bell, Mail, MessageSquare } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

const TRIGGER_OPTIONS = [
  { value: 'critical', label: 'Critical threat detected', icon: Zap, color: 'text-red-500' },
  { value: 'suspicious', label: 'Suspicious activity detected', icon: Zap, color: 'text-amber-500' },
  { value: 'any_threat', label: 'Any threat detected', icon: Zap, color: 'text-blue-500' },
]

const ACTION_OPTIONS = [
  { value: 'sms', label: 'Send SMS', icon: MessageSquare, color: 'text-green-500' },
  { value: 'email', label: 'Send Email', icon: Mail, color: 'text-blue-500' },
  { value: 'call', label: 'Make Voice Call', icon: Bell, color: 'text-purple-500' },
]

const defaultRule = () => ({
  id: Date.now(),
  name: '',
  trigger: 'critical',
  action: 'sms',
  target: '',
  location: '',
  enabled: true,
  expanded: true,
})

const WorkflowBuilder = () => {
  const [rules, setRules] = useState([
    { id: 1, name: 'Alert Manager on Critical', trigger: 'critical', action: 'sms', target: '+1234567890', location: 'All locations', enabled: true, expanded: false },
  ])

  const addRule = () => {
    setRules(prev => [...prev, defaultRule()])
  }

  const removeRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id))
    toast.success('Rule removed')
  }

  const updateRule = (id, field, value) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const toggleExpand = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, expanded: !r.expanded } : r))
  }

  const saveRules = () => {
    localStorage.setItem('falantir_workflow_rules', JSON.stringify(rules))
    toast.success('Workflow rules saved')
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Workflow Builder</h1>
          <p className="text-sm text-slate-400 mt-1">Define custom alert response rules</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={addRule}>
            <Plus className="w-4 h-4 mr-1" /> Add Rule
          </Button>
          <Button size="sm" onClick={saveRules}>Save All</Button>
        </div>
      </motion.div>

      {rules.length === 0 ? (
        <Card className="text-center py-16">
          <Workflow className="w-10 h-10 mx-auto text-slate-200 mb-3" />
          <p className="text-slate-400 font-medium">No rules configured</p>
          <p className="text-xs text-slate-300 mt-1">Add a rule to define automated alert responses</p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {rules.map((rule, i) => {
              const trigger = TRIGGER_OPTIONS.find(t => t.value === rule.trigger) || TRIGGER_OPTIONS[0]
              const action = ACTION_OPTIONS.find(a => a.value === rule.action) || ACTION_OPTIONS[0]

              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="p-0 overflow-hidden">
                    {/* Header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                      onClick={() => toggleExpand(rule.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <div className="flex items-center gap-2">
                          <trigger.icon className={`w-4 h-4 ${trigger.color}`} />
                          <span className="text-sm font-medium text-slate-700 truncate">
                            {rule.name || `Rule ${i + 1}`}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          IF {trigger.label} THEN {action.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeRule(rule.id) }}
                          className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {rule.expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {rule.expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-4">
                            <Input
                              label="Rule Name"
                              placeholder="e.g. Alert Store Manager"
                              value={rule.name}
                              onChange={(e) => updateRule(rule.id, 'name', e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-slate-600 mb-1.5 block">When (Trigger)</label>
                                <select
                                  value={rule.trigger}
                                  onChange={(e) => updateRule(rule.id, 'trigger', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                >
                                  {TRIGGER_OPTIONS.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-slate-600 mb-1.5 block">Then (Action)</label>
                                <select
                                  value={rule.action}
                                  onChange={(e) => updateRule(rule.id, 'action', e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                                >
                                  {ACTION_OPTIONS.map(a => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <Input
                              label="Target (phone/email)"
                              placeholder={rule.action === 'email' ? 'manager@store.com' : '+1234567890'}
                              value={rule.target}
                              onChange={(e) => updateRule(rule.id, 'target', e.target.value)}
                            />

                            <Input
                              label="Location Filter (optional)"
                              placeholder="All locations, or specific agent location"
                              value={rule.location}
                              onChange={(e) => updateRule(rule.id, 'location', e.target.value)}
                            />

                            <div className="flex items-center justify-between pt-2">
                              <label className="text-sm text-slate-600 font-medium">Enabled</label>
                              <button
                                onClick={() => updateRule(rule.id, 'enabled', !rule.enabled)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-primary-500' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default WorkflowBuilder
