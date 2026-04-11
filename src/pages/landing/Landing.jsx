import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
  AnimatePresence,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Cpu,
  Brain,
  Eye,
  Zap,
  Camera,
  Activity,
  Bell,
  BarChart3,
  Smartphone,
  Wifi,
  GitBranch,
  MessageSquareQuote,
  ThumbsUp,
  ThumbsDown,
  Check,
  X,
  Layers,
  Database,
  Mail,
  Phone,
  Clock,
  Gauge,
  DollarSign,
  Shield,
  Radar,
  Lock,
  Scale,
  TrendingDown,
  AlertCircle,
} from 'lucide-react'

/* ══════════════════════════════════════════════════════
   Falantir Landing — Light · Indigo · AI animations
   Typography scale tuned down, colors dialed up, icons +++
   ══════════════════════════════════════════════════════ */

/* ══════════════ ATOMS ══════════════ */

const NeuralBackground = () => {
  const cols = 10
  const rows = 6

  const nodes = useMemo(() => {
    const out = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jx = (((r * cols + c) * 9301 + 49297) % 233280) / 233280
        const jy = (((r * cols + c) * 17 + 5) % 100) / 100
        out.push({
          id: `${r}-${c}`,
          x: (c / (cols - 1)) * 100 + (jx - 0.5) * 4,
          y: (r / (rows - 1)) * 100 + (jy - 0.5) * 4,
        })
      }
    }
    return out
  }, [])

  const edges = useMemo(() => {
    const out = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        if (c < cols - 1) out.push([i, i + 1])
        if (r < rows - 1) out.push([i, i + cols])
      }
    }
    return out
  }, [])

  const pulseEdges = useMemo(() => {
    const picks = []
    for (let k = 0; k < 8; k++) picks.push(edges[(k * 17 + 3) % edges.length])
    return picks
  }, [edges])

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#4c6ef5" strokeWidth="0.08" strokeOpacity="0.22">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
        ))}
      </g>
      {pulseEdges.map(([a, b], i) => (
        <motion.circle
          key={`p-${i}`}
          r="0.4"
          fill="#4c6ef5"
          initial={{ cx: nodes[a].x, cy: nodes[a].y, opacity: 0 }}
          animate={{
            cx: [nodes[a].x, nodes[b].x],
            cy: [nodes[a].y, nodes[b].y],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
      <g fill="#4c6ef5">
        {nodes.map((n, i) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r="0.3"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: (i % 8) * 0.2 }}
          />
        ))}
      </g>
    </svg>
  )
}

const CursorSpotlight = () => {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.5 })

  useEffect(() => {
    const onMove = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      className="fixed pointer-events-none z-[1] mix-blend-multiply"
      style={{
        left: sx,
        top: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: 520,
        height: 520,
        background:
          'radial-gradient(circle, rgba(76,110,245,0.10) 0%, rgba(245,158,11,0.04) 35%, transparent 65%)',
      }}
    />
  )
}

const TiltCard = ({ children, className = '', intensity = 5 }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [intensity, -intensity]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-intensity, intensity]), { stiffness: 200, damping: 20 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________01AIΣ∴◈◇⬡'
const ScrambleText = ({ text, delay = 0, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [display, setDisplay] = useState(text.replace(/./g, ' '))

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const queue = text.split('').map((char, i) => ({
      from: ' ',
      to: char,
      start: Math.floor(i * 2 + Math.random() * 6),
      end: Math.floor(i * 2 + 20 + Math.random() * 10),
      char: '',
    }))

    let animId
    const update = () => {
      let output = ''
      let complete = 0
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i]
        if (frame >= q.end) { complete++; output += q.to }
        else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          output += q.char
        } else output += q.from
      }
      setDisplay(output)
      if (complete < queue.length) { frame++; animId = requestAnimationFrame(update) }
    }

    const timeout = setTimeout(() => { animId = requestAnimationFrame(update) }, delay * 1000)
    return () => { clearTimeout(timeout); if (animId) cancelAnimationFrame(animId) }
  }, [inView, text, delay])

  return <span ref={ref} className={className}>{display}</span>
}

const CountUp = ({ to, duration = 1.6, prefix = '', suffix = '', decimals = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    })
    return () => controls.stop()
  }, [inView, to, duration, decimals, mv])

  return <span ref={ref} className="tabular-nums">{prefix}{display}{suffix}</span>
}

const Typewriter = ({ text, speed = 12, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [shown, setShown] = useState('')

  useEffect(() => {
    if (!inView) return
    let i = 0
    const id = setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [inView, text, speed])

  return (
    <span ref={ref} className={className}>
      {shown}
      {inView && shown.length < text.length && (
        <span className="inline-block w-[0.4ch] h-[1em] bg-primary-600 ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  )
}

const DataFlowDivider = () => (
  <div className="relative h-px bg-stone-200 overflow-hidden">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
        animate={{ left: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'linear' }}
      />
    ))}
  </div>
)

/* Shared section header: eyebrow number + icon + title + subtitle */
const SectionHeader = ({ num, label, icon: Icon, title, accent, subtitle, align = 'left' }) => (
  <div className={`mb-12 md:mb-16 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    <div className={`flex items-center gap-2.5 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
      <div className="w-7 h-7 rounded-md bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-primary-600" />
      </div>
      <span className="text-[10px] font-mono text-stone-500 tracking-[0.18em] font-semibold uppercase">
        {num} / {label}
      </span>
      <div className="w-8 h-px bg-stone-300" />
    </div>
    <motion.h2
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.03em] leading-[1.05] text-stone-900"
    >
      {title}
      {accent && (
        <>
          <br />
          <span className="bg-gradient-to-r from-primary-600 to-amber-500 bg-clip-text text-transparent">
            {accent}
          </span>
        </>
      )}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mt-5 text-sm md:text-base text-stone-500 max-w-xl leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
)

/* ══════════════ LIVE DEMO ══════════════ */
const LiveDemo = () => {
  const [cycle, setCycle] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 14000)
    return () => clearInterval(id)
  }, [])

  const boxes = [
    { id: 'person', label: 'person', x: 36, y: 18, w: 26, h: 68, delay: 1.4, tone: 'safe' },
    { id: 'bag', label: 'bag · concealing', x: 42, y: 58, w: 14, h: 22, delay: 2.6, tone: 'alert' },
    { id: 'shelf', label: 'shelf', x: 2, y: 38, w: 22, h: 44, delay: 3.4, tone: 'safe' },
    { id: 'exit', label: 'exit sign', x: 78, y: 6, w: 18, h: 12, delay: 4.0, tone: 'safe' },
  ]

  const threatStates = [
    { from: 0, label: 'ANALYZING', dot: 'bg-stone-400', text: 'text-stone-600', border: 'border-stone-300', bar: 'bg-stone-300', pct: 0 },
    { from: 2.2, label: 'SAFE', dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-400', bar: 'bg-emerald-500', pct: 95 },
    { from: 3.6, label: 'SUSPICIOUS', dot: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-400', bar: 'bg-amber-500', pct: 78 },
  ]

  const [threatIdx, setThreatIdx] = useState(0)
  useEffect(() => {
    setThreatIdx(0)
    const timers = threatStates.slice(1).map((s, i) => setTimeout(() => setThreatIdx(i + 1), s.from * 1000))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle])

  const threat = threatStates[threatIdx]

  return (
    <div key={cycle} className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-4">
      <div className="relative aspect-[16/10] bg-stone-950 rounded-xl overflow-hidden ring-1 ring-stone-200 shadow-[0_24px_70px_-25px_rgba(76,110,245,0.35)]">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)' }}
        />
        <div className="absolute left-[2%] top-[38%] w-[22%] h-[44%] border border-white/10 rounded-sm" />
        <div className="absolute left-[76%] top-[56%] w-[22%] h-[38%] border border-white/10 rounded-sm" />
        <div className="absolute left-[38%] top-[78%] right-[10%] h-[2px] bg-white/10" />

        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '100%', opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 2, ease: 'linear' }}
          className="absolute inset-x-0 h-px bg-primary-400 shadow-[0_0_28px_3px_rgba(76,110,245,0.75)]"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.5, 0.2] }}
          transition={{ duration: 3, delay: 1.2 }}
          className="absolute left-[49%] top-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="relative w-14 h-14">
            <div className="absolute inset-x-0 top-1/2 h-px bg-primary-400/60" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-primary-400/60" />
            <div className="absolute inset-0 border border-primary-400/60 rounded-full" />
          </div>
        </motion.div>

        {boxes.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: b.delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${b.tone === 'alert' ? 'border-amber-400' : 'border-emerald-400'} border-[1.5px] rounded-[2px]`}
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
          >
            <div
              className={`absolute -top-[18px] left-0 px-1.5 py-[1px] text-[9px] font-mono font-semibold tracking-tight whitespace-nowrap ${b.tone === 'alert' ? 'bg-amber-400 text-stone-900' : 'bg-emerald-400 text-stone-900'}`}
            >
              {b.label}
            </div>
          </motion.div>
        ))}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={threat.label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={`px-2 py-0.5 bg-white/95 backdrop-blur-sm ${threat.text} text-[9px] font-bold tracking-[0.18em] border ${threat.border} rounded-[2px] flex items-center gap-1.5`}
            >
              <span className={`w-1 h-1 rounded-full ${threat.dot} animate-pulse`} />
              {threat.label}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-1 text-[9px] font-mono text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        </div>

        <div className="absolute top-3 right-3 text-[9px] font-mono text-white/50 text-right leading-tight">
          <div>AGENT-01 · STOREFRONT</div>
          <div className="text-white/30">640×360 · 0.5 fps</div>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between text-[8px] font-mono text-white/50 mb-1">
            <span>confidence</span>
            <span>{threatIdx === 0 ? '—' : threat.pct / 100}</span>
          </div>
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              key={threat.label}
              initial={{ width: 0 }}
              animate={{ width: `${threat.pct}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full ${threat.bar}`}
            />
          </div>
        </div>
      </div>

      <div className="bg-white ring-1 ring-stone-200 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-stone-600 overflow-hidden shadow-[0_24px_70px_-25px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-200">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-primary-600" />
            <span className="text-primary-700 font-bold tracking-wide text-[10px]">
              gemini-2.5-flash-lite
            </span>
          </div>
          <span className="text-stone-400 text-[9px]">POST /analyze</span>
        </div>

        <pre className="whitespace-pre-wrap break-words text-stone-700 text-[10px]">
          <Typewriter
            speed={9}
            text={`{
  "threat_label": "suspicious",
  "confidence": 0.78,
  "scene_description":
    "A person near a shelf is
     concealing an item in a
     shoulder bag while glancing
     toward the exit.",
  "reasoning":
    "Furtive concealment motion
     combined with exit-directed
     gaze pattern.",
  "detected_objects": [
    { "label": "person", ... },
    { "label": "bag", ... }
  ]
}`}
          />
        </pre>
      </div>
    </div>
  )
}

/* ══════════════ DASHBOARD PREVIEW (used in bento) ══════════════ */
const DashboardPreviewMock = () => {
  const cameras = [
    { id: 1, label: 'Entrance', threat: 'safe', pct: 92 },
    { id: 2, label: 'Aisle 3', threat: 'suspicious', pct: 78 },
    { id: 3, label: 'Checkout', threat: 'safe', pct: 96 },
    { id: 4, label: 'Storage', threat: 'safe', pct: 89 },
  ]
  const feed = [
    { agent: 'Aisle 3', threat: 'suspicious', time: '2s ago' },
    { agent: 'Entrance', threat: 'safe', time: '18s ago' },
    { agent: 'Checkout', threat: 'safe', time: '42s ago' },
  ]
  const tones = {
    safe: { bg: 'bg-emerald-50', ring: 'ring-emerald-200', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    suspicious: { bg: 'bg-amber-50', ring: 'ring-amber-200', dot: 'bg-amber-500', text: 'text-amber-700' },
  }

  return (
    <div className="relative bg-stone-50 rounded-lg ring-1 ring-stone-200 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-stone-200 bg-white">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 mx-2 h-3.5 bg-stone-100 rounded text-[7px] font-mono text-stone-400 flex items-center justify-center">
          falantir.app/dashboard
        </div>
      </div>

      <div className="flex h-[220px]">
        <div className="w-[46px] bg-[#12141f] flex flex-col items-center py-2.5 gap-1 flex-shrink-0">
          <div className="w-5 h-5 rounded bg-primary-600 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />
          </div>
          {[Activity, Camera, Bell, BarChart3, Cpu].map((Icon, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded flex items-center justify-center ${i === 0 ? 'bg-primary-500/20' : ''}`}
            >
              <Icon className={`w-2.5 h-2.5 ${i === 0 ? 'text-primary-400' : 'text-white/30'}`} />
            </div>
          ))}
        </div>

        <div className="flex-1 p-2 flex flex-col gap-1.5 min-w-0">
          <div className="flex gap-1">
            {[
              { v: 4, l: 'agents', c: 'text-stone-700' },
              { v: 4, l: 'live', c: 'text-emerald-600' },
              { v: 1, l: 'alert', c: 'text-amber-600' },
            ].map((s) => (
              <div key={s.l} className="flex-1 bg-white rounded px-1.5 py-1 ring-1 ring-stone-200/60">
                <p className={`text-xs font-bold ${s.c} leading-none`}>{s.v}</p>
                <p className="text-[6px] text-stone-400 uppercase mt-0.5 tracking-wide">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 flex gap-1.5 min-h-0">
            <div className="grid grid-cols-2 gap-1 flex-1">
              {cameras.map((cam, i) => {
                const t = tones[cam.threat]
                return (
                  <motion.div
                    key={cam.id}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className={`relative rounded overflow-hidden ring-1 ${t.ring}`}
                  >
                    <div className="aspect-video bg-stone-900 relative">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 2px)' }}
                      />
                      <div className={`absolute inset-x-[18%] inset-y-[22%] border ${cam.threat === 'suspicious' ? 'border-amber-400' : 'border-emerald-400'} rounded-sm`} />
                      <div className={`absolute top-0.5 left-0.5 ${t.bg} ${t.text} text-[6px] font-bold uppercase tracking-wider px-1 py-[1px] rounded-[2px] flex items-center gap-0.5`}>
                        <motion.span
                          className={`w-0.5 h-0.5 rounded-full ${t.dot}`}
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        {cam.threat}
                      </div>
                      <div className="absolute top-0.5 right-0.5 text-[6px] font-mono text-white/50">
                        {cam.pct}%
                      </div>
                      <div className="absolute bottom-0.5 left-0.5 text-[6px] font-mono text-white/70">
                        {cam.label}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="w-[88px] bg-white rounded ring-1 ring-stone-200/60 p-1 flex flex-col gap-1 flex-shrink-0">
              <p className="text-[6px] font-bold text-stone-400 uppercase tracking-wider px-0.5">
                Live feed
              </p>
              {feed.map((f, i) => {
                const t = tones[f.threat]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    className={`${t.bg} rounded px-1 py-0.5 ring-1 ${t.ring}`}
                  >
                    <p className={`text-[6px] font-bold ${t.text} leading-tight`}>{f.agent}</p>
                    <p className="text-[5px] text-stone-400 leading-tight">{f.time}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════ BENTO FEATURES ══════════════ */
const BentoFeatures = () => {
  return (
    <section
      className="py-24 md:py-32 relative"
      style={{
        background: 'linear-gradient(180deg, #fafaf9 0%, rgba(240,244,255,0.4) 50%, #fafaf9 100%)',
      }}
    >
      {/* Decorative floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[8%] w-10 h-10 rounded-xl bg-white ring-1 ring-primary-200/60 flex items-center justify-center shadow-lg shadow-primary-600/5"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-4 h-4 text-primary-600" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-[6%] w-10 h-10 rounded-xl bg-white ring-1 ring-amber-200/60 flex items-center justify-center shadow-lg shadow-amber-500/5"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Brain className="w-4 h-4 text-amber-600" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <SectionHeader
          num="02"
          label="CAPABILITIES"
          icon={Layers}
          title="A full security"
          accent="operations platform."
          subtitle="Not just detection — Falantir ships with incident history, RL feedback, workflow automation, multi-agent orchestration, and a mobile-first PWA."
        />

        <div className="grid grid-cols-12 auto-rows-[170px] gap-4">
          {/* A — Big: dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7 }}
            className="col-span-12 lg:col-span-7 row-span-2 group"
          >
            <TiltCard className="h-full">
              <div className="h-full bg-white ring-1 ring-stone-200 rounded-2xl p-5 md:p-6 flex flex-col overflow-hidden relative transition-all duration-300 group-hover:ring-primary-300 group-hover:shadow-[0_24px_60px_-20px_rgba(76,110,245,0.25)]">
                {/* Decorative corner glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-200/25 rounded-full blur-3xl pointer-events-none" />

                <div className="mb-4 flex items-start justify-between relative">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-50 rounded-full mb-2">
                      <span className="w-1 h-1 rounded-full bg-primary-600 animate-pulse" />
                      <p className="text-[9px] font-mono text-primary-700 tracking-[0.15em] font-bold">
                        MULTI-AGENT
                      </p>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 tracking-tight leading-tight">
                      Live command center
                    </h3>
                    <p className="mt-1.5 text-xs text-stone-500 leading-relaxed max-w-md">
                      Watch every camera agent in real time. Threat, reasoning, and
                      objects stream via WebSocket.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-600/20">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex items-end relative">
                  <div className="w-full">
                    <DashboardPreviewMock />
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* B — Explainable */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="col-span-12 lg:col-span-5 row-span-1 group"
          >
            <TiltCard className="h-full">
              <div className="h-full bg-gradient-to-br from-amber-50 to-white ring-1 ring-amber-200/60 rounded-2xl p-5 overflow-hidden relative transition-all duration-300 group-hover:ring-amber-400 group-hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.25)]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full mb-1.5 ring-1 ring-amber-200/60">
                      <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                      <p className="text-[9px] font-mono text-amber-700 tracking-[0.15em] font-bold">
                        EXPLAINABLE AI
                      </p>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-stone-900 tracking-tight">
                      Every alert comes with reasoning
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <MessageSquareQuote className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm border-l-2 border-amber-400 rounded-r-md px-2.5 py-2">
                  <p className="text-[10px] text-amber-900 leading-relaxed font-medium">
                    "Furtive concealment motion combined with exit-directed gaze — person appears to hide merchandise in a bag."
                  </p>
                  <p className="text-[8px] text-amber-700 mt-1 font-mono">
                    gemini-2.5-flash-lite · 0.78
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* C — RL feedback */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="col-span-12 lg:col-span-5 row-span-1 group"
          >
            <TiltCard className="h-full">
              <div className="h-full bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-200/60 rounded-2xl p-5 overflow-hidden relative transition-all duration-300 group-hover:ring-emerald-400 group-hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.25)]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full mb-1.5 ring-1 ring-emerald-200/60">
                      <ThumbsUp className="w-2.5 h-2.5 text-emerald-600" />
                      <p className="text-[9px] font-mono text-emerald-700 tracking-[0.15em] font-bold">
                        RL FEEDBACK
                      </p>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-stone-900 tracking-tight">
                      Learns from your corrections
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ThumbsUp className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { label: 'Aisle 3 · suspicious', verdict: 'correct', time: '2m' },
                    { label: 'Entrance · safe', verdict: 'correct', time: '5m' },
                    { label: 'Storage · suspicious', verdict: 'false', time: '8m' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-md px-2 py-1 text-[9px] ring-1 ring-stone-200/40"
                    >
                      <span className="text-stone-600 font-medium truncate">{row.label}</span>
                      <div className="flex items-center gap-1.5">
                        {row.verdict === 'correct' ? (
                          <ThumbsUp className="w-2.5 h-2.5 text-emerald-500" />
                        ) : (
                          <ThumbsDown className="w-2.5 h-2.5 text-red-500" />
                        )}
                        <span className="text-stone-400 font-mono">{row.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* D — Workflows */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1 group"
          >
            <TiltCard className="h-full">
              <div className="h-full bg-white ring-1 ring-stone-200 rounded-2xl p-5 overflow-hidden relative transition-all duration-300 group-hover:ring-primary-300 group-hover:shadow-[0_20px_50px_-20px_rgba(76,110,245,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-50 rounded-full ring-1 ring-primary-100">
                    <GitBranch className="w-2.5 h-2.5 text-primary-600" />
                    <p className="text-[9px] font-mono text-primary-700 tracking-[0.15em] font-bold">
                      WORKFLOWS
                    </p>
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2 tracking-tight">
                  Custom response rules
                </h3>
                <div className="space-y-0.5 text-[9px] font-mono bg-stone-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-stone-500">
                    <span className="text-primary-600 font-bold">if</span>
                    <span>threat = critical</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 pl-3">
                    <span className="text-primary-600 font-bold">→</span>
                    <span>sms + call</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500">
                    <span className="text-primary-600 font-bold">elif</span>
                    <span>threat = suspicious</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 pl-3">
                    <span className="text-primary-600 font-bold">→</span>
                    <span>email alert</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* E — PWA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1 group"
          >
            <TiltCard className="h-full">
              <div className="h-full bg-gradient-to-br from-amber-50 via-white to-primary-50/40 ring-1 ring-stone-200 rounded-2xl p-5 overflow-hidden relative transition-all duration-300 group-hover:ring-amber-300 group-hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full ring-1 ring-amber-200/60">
                    <Smartphone className="w-2.5 h-2.5 text-amber-600" />
                    <p className="text-[9px] font-mono text-amber-700 tracking-[0.15em] font-bold">
                      MOBILE PWA
                    </p>
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2 tracking-tight">
                  Installable on any device
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
                  Service worker, offline support, mobile tab bar. Works on iOS, Android, desktop.
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 flex-1 bg-amber-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                    />
                  </div>
                  <span className="text-[8px] font-mono text-amber-600 font-bold">READY</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* F — WebSocket */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="col-span-12 md:col-span-12 lg:col-span-4 row-span-1 group"
          >
            <TiltCard className="h-full">
              <div className="h-full bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-200/60 rounded-2xl p-5 overflow-hidden relative transition-all duration-300 group-hover:ring-emerald-400 group-hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.2)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full ring-1 ring-emerald-200/60">
                    <Wifi className="w-2.5 h-2.5 text-emerald-600" />
                    <p className="text-[9px] font-mono text-emerald-700 tracking-[0.15em] font-bold">
                      REAL-TIME
                    </p>
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-3 tracking-tight">
                  Sub-second WebSocket push
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative w-2.5 h-2.5">
                    <div className="absolute inset-0 rounded-full bg-emerald-500" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 font-mono">
                    agent_update · incident_alert
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════ BIG NUMBERS ══════════════ */
const BigNumbers = () => {
  const stats = [
    {
      value: 97.4, suffix: '%', decimals: 1, label: 'frames skipped', note: 'by the motion gate on real test video',
      color: 'text-primary-600', bg: 'bg-primary-50', ring: 'ring-primary-200/60', icon: TrendingDown,
    },
    {
      value: 2.0, suffix: 's', decimals: 1, label: 'inference latency', note: 'gemini-2.5-flash-lite, steady state',
      color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-200/60', icon: Gauge,
    },
    {
      value: 0.0001, prefix: '$', decimals: 4, label: 'per analyzed frame', note: 'structured JSON call incl. image',
      color: 'text-emerald-500', bg: 'bg-emerald-50', ring: 'ring-emerald-200/60', icon: DollarSign,
    },
    {
      value: 1500, suffix: '/day', decimals: 0, label: 'free tier budget', note: 'zero-cost development & demo',
      color: 'text-primary-600', bg: 'bg-primary-50', ring: 'ring-primary-200/60', icon: Clock,
    },
  ]

  return (
    <section className="py-24 md:py-32 relative bg-white">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #e7e5e4 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <SectionHeader
          num="03"
          label="THE MATH"
          icon={BarChart3}
          title="Measured,"
          accent="not projected."
          subtitle="Every number below is pulled from real benchmarks on the actual test suite. No marketing rounding."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group"
            >
              <TiltCard intensity={4}>
                <div className="relative bg-white ring-1 ring-stone-200 rounded-2xl p-6 overflow-hidden transition-all duration-300 group-hover:ring-stone-300 group-hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.12)]">
                  <div className={`absolute -top-12 -right-12 w-32 h-32 ${s.bg} rounded-full blur-2xl opacity-70`} />

                  <div className="relative flex items-start justify-between mb-5">
                    <div className={`w-9 h-9 rounded-xl ${s.bg} ring-1 ${s.ring} flex items-center justify-center`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <span className="text-[9px] font-mono text-stone-400 tracking-wider font-bold">
                      0{i + 1}
                    </span>
                  </div>

                  <p className="relative text-4xl md:text-5xl font-black tracking-[-0.03em] text-stone-900 leading-none mb-4">
                    <CountUp
                      to={s.value}
                      prefix={s.prefix || ''}
                      decimals={s.decimals}
                    />
                    <span className={s.color}>{s.suffix}</span>
                  </p>

                  <div className="relative">
                    <p className="text-xs font-bold text-stone-900">{s.label}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{s.note}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════ ANIMATED PIPELINE ══════════════ */
const AnimatedPipeline = () => {
  const stages = [
    { num: '01', icon: Eye, title: 'Camera feed', desc: 'RTSP, webcam, or uploaded footage.', tech: 'opencv', color: 'from-stone-500 to-stone-700', ring: 'ring-stone-200', glow: 'rgba(120,113,108,0.15)' },
    { num: '02', icon: Zap, title: 'Motion gate', desc: 'MOG2 background subtraction, fully local.', tech: 'cv2.mog2', color: 'from-amber-400 to-amber-600', ring: 'ring-amber-200', glow: 'rgba(245,158,11,0.2)' },
    { num: '03', icon: Brain, title: 'VLM analysis', desc: 'One Gemini call returns everything.', tech: 'gemini-2.5-flash-lite', color: 'from-primary-500 to-primary-700', ring: 'ring-primary-200', glow: 'rgba(76,110,245,0.25)' },
    { num: '04', icon: Cpu, title: 'Agent action', desc: 'Log, push, notify — in real time.', tech: 'socketio · twilio', color: 'from-emerald-400 to-emerald-600', ring: 'ring-emerald-200', glow: 'rgba(16,185,129,0.2)' },
  ]

  return (
    <section
      className="py-24 md:py-32 relative"
      style={{
        background:
          'linear-gradient(180deg, #fafaf9 0%, rgba(255,251,235,0.6) 50%, #fafaf9 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <SectionHeader
          num="04"
          label="PIPELINE"
          icon={Radar}
          title="Four tiers,"
          accent="one structured call."
          subtitle="Each frame flows through a lean, observable pipeline. No wasted GPU cycles, no black-box steps."
        />

        <div className="relative">
          <svg
            className="hidden lg:block absolute top-[44px] left-0 right-0 w-full h-2 pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 8"
          >
            <motion.line
              x1="60" y1="4" x2="940" y2="4"
              stroke="#e7e5e4"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
            <motion.circle
              r="3"
              fill="#4c6ef5"
              initial={{ cx: 60 }}
              whileInView={{ cx: [60, 940] }}
              viewport={{ once: true }}
              transition={{ duration: 3, delay: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {stages.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative flex items-center justify-center mb-6">
                  <div className={`w-[82px] h-[82px] rounded-full bg-white ring-2 ${s.ring} flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-105`}
                    style={{ boxShadow: `0 0 0 0 ${s.glow}` }}
                  >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <span className="absolute top-0 right-[calc(50%-52px)] text-[9px] font-mono font-bold text-stone-400 tracking-widest">
                    {s.num}
                  </span>
                </div>
                <div className="text-center px-2">
                  <h3 className="text-base font-bold text-stone-900 mb-1.5 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-2 max-w-[26ch] mx-auto">
                    {s.desc}
                  </p>
                  <span className="inline-block text-[9px] font-mono text-primary-600 bg-white ring-1 ring-primary-100 px-2 py-0.5 rounded-full">
                    {s.tech}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Teacher-Student callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-primary-50 via-white to-amber-50/60 border border-primary-200/50 rounded-2xl p-6 md:p-7 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-600/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 bg-white rounded-full ring-1 ring-primary-200/60">
                  <span className="w-1 h-1 rounded-full bg-primary-600 animate-pulse" />
                  <p className="text-[9px] font-mono text-primary-700 tracking-[0.18em] font-bold">
                    TEACHER → STUDENT
                  </p>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-stone-900 mb-2 tracking-tight">
                  Gemini trains your local model for free.
                </h4>
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-2xl">
                  Use Gemini as a <span className="text-primary-700 font-semibold">teacher</span> to
                  auto-label surveillance footage, then distill that into a{' '}
                  <span className="text-primary-700 font-semibold">MobileNetV3 student</span> trained
                  on Colab's free GPU. Offline Tier 2 fallback — zero ongoing cost.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ══════════════ ARCHITECTURE DIAGRAM ══════════════ */
const ArchitectureDiagram = () => {
  const nodes = [
    { id: 'cam1', x: 120, y: 60, w: 120, h: 40, label: 'Camera', tone: 'neutral' },
    { id: 'cam2', x: 280, y: 60, w: 120, h: 40, label: 'Camera', tone: 'neutral' },
    { id: 'cam3', x: 440, y: 60, w: 120, h: 40, label: 'Camera', tone: 'neutral' },
    { id: 'upload', x: 680, y: 60, w: 200, h: 40, label: 'Upload video', tone: 'neutral' },

    { id: 'motion', x: 180, y: 200, w: 200, h: 52, label: 'Motion gate', sub: 'cv2.MOG2', tone: 'amber' },
    { id: 'gemini', x: 540, y: 200, w: 260, h: 52, label: 'Gemini 2.5 Flash Lite', sub: 'structured output', tone: 'primary' },

    { id: 'mongo', x: 60, y: 340, w: 180, h: 48, label: 'MongoDB', sub: 'incidents · analytics', tone: 'neutral' },
    { id: 'socket', x: 300, y: 340, w: 200, h: 48, label: 'WebSocket push', sub: 'flask-socketio', tone: 'neutral' },
    { id: 'twilio', x: 560, y: 340, w: 180, h: 48, label: 'Twilio SMS/call', tone: 'neutral' },
    { id: 'smtp', x: 800, y: 340, w: 140, h: 48, label: 'Email', tone: 'neutral' },

    { id: 'react', x: 340, y: 470, w: 320, h: 56, label: 'React dashboard (PWA)', sub: 'live · responsive · installable', tone: 'amber' },
  ]

  const connections = [
    { from: 'cam1', to: 'motion', pulse: 0 },
    { from: 'cam2', to: 'motion', pulse: 0.3 },
    { from: 'cam3', to: 'motion', pulse: 0.6 },
    { from: 'upload', to: 'gemini', pulse: 0.1 },
    { from: 'motion', to: 'gemini', pulse: 0.9 },
    { from: 'gemini', to: 'mongo', pulse: 1.2 },
    { from: 'gemini', to: 'socket', pulse: 1.4 },
    { from: 'gemini', to: 'twilio', pulse: 1.6 },
    { from: 'gemini', to: 'smtp', pulse: 1.8 },
    { from: 'socket', to: 'react', pulse: 2.0 },
  ]

  const getNode = (id) => nodes.find((n) => n.id === id)
  const getCenter = (n) => ({ cx: n.x + n.w / 2, cy: n.y + n.h / 2 })

  return (
    <section
      className="py-24 md:py-32 relative border-t border-stone-200"
      style={{
        background: 'linear-gradient(180deg, #fafaf9 0%, rgba(240,244,255,0.5) 50%, #fafaf9 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          num="05"
          label="ARCHITECTURE"
          icon={Shield}
          title="Every piece,"
          accent="working together."
          subtitle="From camera input to user notification, data flows through a resilient, observable pipeline. Each node is replaceable and fails gracefully."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1 }}
          className="relative bg-white ring-1 ring-stone-200 rounded-2xl p-4 md:p-8 overflow-hidden shadow-[0_24px_70px_-30px_rgba(76,110,245,0.18)]"
        >
          <div
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #e7e5e4 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <svg
            viewBox="0 0 1000 600"
            className="relative w-full h-auto max-h-[520px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Connections */}
            {connections.map((c, i) => {
              const from = getNode(c.from)
              const to = getNode(c.to)
              const fc = getCenter(from)
              const tc = getCenter(to)
              const x1 = fc.cx
              const y1 = from.y + from.h
              const x2 = tc.cx
              const y2 = to.y
              const midY = (y1 + y2) / 2
              const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`

              return (
                <g key={`c-${i}`}>
                  <motion.path
                    d={path}
                    fill="none"
                    stroke="#e7e5e4"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                  />
                  <motion.circle
                    r="3.5"
                    fill="#4c6ef5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: c.pulse + 2, ease: 'easeInOut' }}
                  >
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${c.pulse + 2}s`}
                      path={path}
                    />
                  </motion.circle>
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map((n, i) => {
              const toneMap = {
                primary: { fill: '#4c6ef5', stroke: '#4c6ef5', text: '#fff', sub: 'rgba(255,255,255,0.75)' },
                amber: { fill: '#fff', stroke: '#f59e0b', text: '#78350f', sub: '#d97706' },
                neutral: { fill: '#fff', stroke: '#d6d3d1', text: '#1c1917', sub: '#78716c' },
              }
              const tone = toneMap[n.tone] || toneMap.neutral

              return (
                <motion.g
                  key={n.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    rx="8"
                    fill={tone.fill}
                    stroke={tone.stroke}
                    strokeWidth="1.5"
                  />
                  {n.tone === 'primary' && (
                    <motion.rect
                      x={n.x - 3}
                      y={n.y - 3}
                      width={n.w + 6}
                      height={n.h + 6}
                      rx="10"
                      fill="none"
                      stroke="#4c6ef5"
                      strokeWidth="1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <text
                    x={n.x + n.w / 2}
                    y={n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 4)}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Inter, system-ui, sans-serif"
                    fill={tone.text}
                  >
                    {n.label}
                  </text>
                  {n.sub && (
                    <text
                      x={n.x + n.w / 2}
                      y={n.y + n.h / 2 + 13}
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="ui-monospace, Menlo, monospace"
                      fill={tone.sub}
                    >
                      {n.sub}
                    </text>
                  )}
                </motion.g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono text-stone-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              live data pulse
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-stone-300" />
              pipeline connection
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-primary-500" />
              VLM core
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm border border-amber-500" />
              user-facing
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ══════════════ COMPARISON ══════════════ */
const CompareOld = () => {
  const rows = [
    {
      topic: 'Understanding',
      icon: Brain,
      old: 'Records pixels to disk. A camera is a passive eye.',
      new: 'Understands scenes with a vision-language model that describes context in natural language.',
    },
    {
      topic: 'Response time',
      icon: Clock,
      old: 'Incidents reviewed hours or days later, if at all.',
      new: 'Real-time autonomous alerts with sub-second WebSocket push to the dashboard.',
    },
    {
      topic: 'Decisions',
      icon: AlertCircle,
      old: 'Rule-based motion triggers cause constant false positives.',
      new: 'Gemini explains every decision in one sentence before you\'re notified.',
    },
    {
      topic: 'Scaling',
      icon: Scale,
      old: 'More cameras = more guards reviewing footage.',
      new: 'One model serves any number of cameras. ~$17/mo per camera at 8 hrs/day.',
    },
    {
      topic: 'Resilience',
      icon: Lock,
      old: 'If the recorder fails, you lose everything.',
      new: 'Three-tier fallback: Gemini → local MobileNetV3 → safe-mode. Never silently down.',
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionHeader
          num="06"
          label="WHY IT MATTERS"
          icon={Scale}
          title="CCTV records."
          accent="Falantir watches."
          subtitle="A side-by-side look at why passive surveillance isn't enough anymore."
        />

        {/* Column headers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          <div className="lg:col-span-2" />
          <div className="lg:col-span-5">
            <div className="bg-stone-100 border border-stone-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-stone-500" />
              </div>
              <div>
                <p className="text-[9px] font-mono text-stone-400 tracking-[0.18em] font-bold">
                  TRADITIONAL
                </p>
                <h3 className="text-sm font-bold text-stone-500 line-through decoration-stone-300 decoration-2">
                  Passive CCTV
                </h3>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/40 border border-primary-200 rounded-xl p-4 flex items-center gap-3 shadow-[0_12px_32px_-16px_rgba(76,110,245,0.3)]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-600/25">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-mono text-primary-600 tracking-[0.18em] font-bold">
                  FALANTIR v2.1
                </p>
                <h3 className="text-sm font-bold text-stone-900">Autonomous AI agent</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {rows.map((row, i) => (
            <motion.div
              key={row.topic}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
            >
              <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-3 lg:gap-1 lg:pt-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center flex-shrink-0">
                  <row.icon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-[9px] font-mono text-stone-400 tracking-wider">0{i + 1}</p>
                  <p className="text-xs font-bold text-stone-900">{row.topic}</p>
                </div>
              </div>

              <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-2.5 h-2.5 text-stone-500" />
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">{row.old}</p>
              </div>

              <div className="lg:col-span-5 bg-white border border-primary-100 rounded-xl p-4 flex items-start gap-2.5 shadow-[0_4px_20px_-10px_rgba(76,110,245,0.25)] hover:shadow-[0_8px_28px_-12px_rgba(76,110,245,0.35)] transition-shadow">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">{row.new}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════ MARQUEE STACK ══════════════ */
const MarqueeStack = () => {
  const items = [
    { name: 'gemini-2.5-flash-lite', color: 'text-primary-600' },
    { name: 'flask-socketio', color: 'text-stone-900' },
    { name: 'mongodb', color: 'text-emerald-600' },
    { name: 'react 18', color: 'text-stone-900' },
    { name: 'vite', color: 'text-amber-500' },
    { name: 'tailwindcss', color: 'text-primary-600' },
    { name: 'framer-motion', color: 'text-stone-900' },
    { name: 'opencv', color: 'text-emerald-600' },
    { name: 'pytorch', color: 'text-amber-500' },
    { name: 'twilio', color: 'text-stone-900' },
    { name: 'mobilenetv3', color: 'text-primary-600' },
    { name: 'recharts', color: 'text-emerald-600' },
  ]
  const loop = [...items, ...items]

  return (
    <section className="py-20 md:py-24 border-t border-stone-200 overflow-hidden relative bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-md bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-primary-600" />
          </div>
          <span className="text-[10px] font-mono text-stone-500 tracking-[0.18em] font-semibold uppercase">
            07 / STACK
          </span>
          <div className="w-8 h-px bg-stone-300" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-[-0.03em] text-stone-900">
          Built on the best open source.
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {loop.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.02em] ${item.color} flex items-center gap-8 flex-shrink-0`}
            >
              <span>{item.name}</span>
              <span className="text-primary-500 text-4xl md:text-5xl leading-none select-none">◆</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ══════════════ MAIN LANDING ══════════════ */
const Landing = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-primary-200 selection:text-stone-900 relative overflow-x-hidden">
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 origin-left z-[60]"
      />

      <CursorSpotlight />

      {/* ══ Top bar ══ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50/85 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-md flex items-center justify-center shadow-md shadow-primary-600/20 relative">
              <div className="w-2 h-2 bg-white rounded-sm" />
              <motion.div
                className="absolute inset-0 rounded-md ring-2 ring-primary-500"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-sm font-bold tracking-tight">Falantir</span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-stone-500 tracking-wider">
              v2.1
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-stone-500">
            <a href="#demo" className="hover:text-stone-900 transition-colors">Demo</a>
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#numbers" className="hover:text-stone-900 transition-colors">Numbers</a>
            <a href="#arch" className="hover:text-stone-900 transition-colors">Architecture</a>
            <a href="#why" className="hover:text-stone-900 transition-colors">Why</a>
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/login"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="group text-xs font-semibold text-white bg-stone-900 hover:bg-primary-600 px-3.5 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md hover:shadow-primary-600/20"
            >
              Get started
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ═════════════ HERO ═════════════ */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <NeuralBackground />
        </div>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[860px] h-[460px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(76,110,245,0.09) 0%, transparent 60%)',
          }}
        />

        {/* Floating feature badges (ambient decoration) */}
        <motion.div
          className="hidden lg:block absolute top-[28%] right-[6%] bg-white ring-1 ring-stone-200 rounded-xl px-3 py-2 shadow-lg shadow-stone-900/5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1.6 },
            x: { duration: 0.6, delay: 1.6 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-900">Live monitoring</p>
              <p className="text-[9px] font-mono text-stone-500">4 agents online</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:block absolute top-[52%] right-[10%] bg-white ring-1 ring-stone-200 rounded-xl px-3 py-2 shadow-lg shadow-stone-900/5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 1.8 },
            x: { duration: 0.6, delay: 1.8 },
            y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-900">Gemini reasoning</p>
              <p className="text-[9px] font-mono text-stone-500">~2.0s per frame</p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          {/* Metadata row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10 md:mb-14"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="block w-2 h-2 rounded-full bg-primary-600" />
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary-500"
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>
              <p className="text-[10px] font-mono text-stone-500 tracking-[0.18em] uppercase">
                Falantir v2.1 · Final Year AI Project
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-white ring-1 ring-stone-200 rounded-full text-[10px] font-mono text-stone-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              system online
            </div>
          </motion.div>

          {/* Eyebrow chip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-white ring-1 ring-stone-200 rounded-full shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-primary-600" />
            <span className="text-[11px] font-semibold text-stone-700 tracking-wide">
              Powered by Gemini 2.5 Flash Lite
            </span>
          </motion.div>

          {/* Headline (smaller than before) */}
          <h1 className="text-[40px] sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-[-0.035em] leading-[0.95] text-stone-900 max-w-[17ch]">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Surveillance
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                that actually
              </motion.div>
            </div>
            <div className="overflow-hidden relative">
              <motion.div
                initial={{ y: '108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
                className="relative inline-block"
              >
                <ScrambleText
                  text="thinks."
                  delay={1.3}
                  className="bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 bg-clip-text text-transparent"
                />
                <motion.span
                  className="absolute left-0 -bottom-1 md:-bottom-2 h-[5px] md:h-[7px] bg-primary-600/20 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            </div>
          </h1>

          {/* Subtitle + CTA */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-6 md:col-start-1 lg:col-span-5 lg:col-start-1">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="text-sm md:text-base text-stone-600 leading-relaxed"
              >
                Falantir turns ordinary CCTV into a real-time threat detection agent.
                It sees, describes, reasons, and escalates — all in under two seconds per
                frame, powered by a single vision-language model call.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-6 flex items-center gap-4 flex-wrap"
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 bg-stone-900 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-3 rounded-md transition-all duration-200 shadow-lg shadow-stone-900/10 hover:shadow-primary-600/30"
                >
                  Launch dashboard
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <a
                  href="#demo"
                  className="text-sm font-medium text-stone-500 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-primary-600 transition-colors"
                >
                  Watch live demo ↓
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <DataFlowDivider />

      {/* ═════════════ LIVE DEMO ═════════════ */}
      <section id="demo" className="py-20 md:py-24 bg-white border-y border-stone-200 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-10 flex items-baseline justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-primary-600" />
              </div>
              <span className="text-[10px] font-mono text-stone-500 tracking-[0.18em] font-semibold uppercase">
                01 / LIVE DEMO
              </span>
              <div className="w-8 h-px bg-stone-300" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 ring-1 ring-emerald-200/60 rounded-full">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[9px] font-mono text-emerald-700 font-bold tracking-wider">
                  AUTOPLAYING
                </span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-stone-400 hidden md:block">
              actual response from gemini
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8 }}
          >
            <LiveDemo />
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <div id="features"><BentoFeatures /></div>
      <div id="numbers"><BigNumbers /></div>
      <DataFlowDivider />
      <AnimatedPipeline />
      <div id="arch"><ArchitectureDiagram /></div>
      <div id="why"><CompareOld /></div>
      <div id="stack"><MarqueeStack /></div>

      {/* ═════════════ FINAL CTA ═════════════ */}
      <section className="py-24 md:py-32 border-t border-stone-200 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(76,110,245,0.08) 0%, transparent 55%)',
          }}
        />
        {/* Animated floating icons */}
        <motion.div
          className="absolute top-16 left-[12%] w-10 h-10 rounded-xl bg-white ring-1 ring-primary-200/60 flex items-center justify-center shadow-lg shadow-primary-600/5"
          animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Shield className="w-4 h-4 text-primary-600" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-[14%] w-10 h-10 rounded-xl bg-white ring-1 ring-amber-200/60 flex items-center justify-center shadow-lg shadow-amber-500/5"
          animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
          <SectionHeader
            num="08"
            label="START"
            icon={Sparkles}
            title="Ready when"
            accent="you are."
            subtitle="Sign up, start a camera agent, and watch Falantir analyze every meaningful frame in real time."
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 bg-stone-900 hover:bg-primary-600 text-white text-base font-semibold px-7 py-3.5 rounded-md transition-all duration-200 shadow-lg shadow-stone-900/10 hover:shadow-primary-600/30"
            >
              Create free account
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-stone-500 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-primary-600 transition-colors"
            >
              or sign in to an existing account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═════════════ FOOTER ═════════════ */}
      <footer className="border-t border-stone-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] font-mono text-stone-500">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-sm" />
            </div>
            <span>Falantir · v2.1 · Autonomous AI Security Agent</span>
          </div>
          <p>© {new Date().getFullYear()} · Final Year AI Project</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
