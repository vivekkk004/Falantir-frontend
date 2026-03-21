import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, PieChart as PieIcon, Table2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getStats, getDailyAnalytics } from '../../services/detectionService'
import Card from '../../components/ui/Card'

const COLORS = ['#22c55e', '#f59e0b', '#ef4444']

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [daily, setDaily] = useState([])
  const [range, setRange] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [s, d] = await Promise.all([getStats(), getDailyAnalytics(range)])
        setStats(s)
        setDaily(d || [])
      } catch (err) {
        console.error('Analytics load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [range])

  // Transform daily data for bar chart
  const barData = daily.map(d => ({
    date: d.date,
    safe: d.counts?.safe || 0,
    suspicious: d.counts?.suspicious || 0,
    critical: d.counts?.critical || 0,
    total: d.counts?.total || 0,
  }))

  // Pie data from stats
  const pieData = stats ? [
    { name: 'Safe', value: stats.safe_count || 0 },
    { name: 'Suspicious', value: stats.suspicious_count || 0 },
    { name: 'Critical', value: stats.critical_count || 0 },
  ] : []

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Incident trends, threat distribution, and agent performance</p>
      </motion.div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Incidents', val: stats.total_incidents, color: 'text-blue-600 bg-blue-50' },
            { label: 'Critical', val: stats.critical_count, color: 'text-red-600 bg-red-50' },
            { label: 'Suspicious', val: stats.suspicious_count, color: 'text-amber-600 bg-amber-50' },
            { label: 'Safe', val: stats.safe_count, color: 'text-green-600 bg-green-50' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="text-center">
                <p className="text-2xl font-bold text-slate-800">{s.val}</p>
                <p className={`text-[10px] uppercase font-black mt-1 ${s.color.split(' ')[0]}`}>{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bar Chart — Daily Incidents */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary-500" /> Incidents Over Time
            </h2>
            <div className="flex gap-1">
              {[{ label: '7D', val: 7 }, { label: '30D', val: 30 }, { label: '90D', val: 90 }].map(r => (
                <button
                  key={r.val}
                  onClick={() => setRange(r.val)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    range === r.val ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="safe" fill="#22c55e" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="suspicious" fill="#f59e0b" stackId="a" />
                <Bar dataKey="critical" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-300 text-sm">No data yet</div>
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart — Threat Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <PieIcon className="w-4 h-4 text-primary-500" /> Threat Distribution
            </h2>
            {pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-300 text-sm">No data yet</div>
            )}
          </Card>
        </motion.div>

        {/* Agent Performance Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Table2 className="w-4 h-4 text-primary-500" /> Agent Performance
            </h2>
            {stats?.agent_stats?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase text-slate-400 font-bold">
                      <th className="pb-3">Agent</th>
                      <th className="pb-3">Incidents</th>
                      <th className="pb-3">Avg Conf</th>
                      <th className="pb-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.agent_stats.map((a) => (
                      <tr key={a.agent_id} className="text-slate-700">
                        <td className="py-2.5 font-medium">{a.agent_id}</td>
                        <td className="py-2.5">{a.total}</td>
                        <td className="py-2.5">{(a.avg_confidence * 100).toFixed(0)}%</td>
                        <td className="py-2.5 text-xs text-slate-400">
                          {a.last_active ? new Date(a.last_active).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-300 text-sm">No data yet</div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
