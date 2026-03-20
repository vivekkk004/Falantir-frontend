import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import Card from '../../components/ui/Card'

const weekData = [65, 42, 88, 34, 71, 56, 90]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const max = Math.max(...weekData)

const Analytics = () => {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Detection trends and statistics</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'This Week', value: 24, prev: 18, icon: BarChart2, color: 'text-primary-600 bg-primary-50' },
          { label: 'This Month', value: 91, prev: 74, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'False Positives', value: '8%', prev: '12%', icon: TrendingDown, color: 'text-amber-600 bg-amber-50' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-xs text-slate-400">Prev: {stat.prev}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary-500" /> Weekly Detections
            </h2>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3 h-3" /> This week
            </span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">{val}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / max) * 120}px` }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                  className={`w-full rounded-t-lg ${i === weekData.length - 1 ? 'bg-primary-500' : 'bg-primary-200'}`}
                />
                <span className="text-xs text-slate-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top Locations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <h2 className="font-semibold text-slate-800 mb-4">Top Detection Locations</h2>
          <div className="space-y-3">
            {[
              { name: 'Aisle 3', count: 34, pct: 37 },
              { name: 'Electronics Section', count: 28, pct: 31 },
              { name: 'Main Entrance', count: 19, pct: 21 },
              { name: 'Checkout Area', count: 10, pct: 11 },
            ].map((loc) => (
              <div key={loc.name}>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span>{loc.name}</span>
                  <span className="font-semibold">{loc.count} events ({loc.pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loc.pct}%` }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="h-full rounded-full bg-primary-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Analytics
