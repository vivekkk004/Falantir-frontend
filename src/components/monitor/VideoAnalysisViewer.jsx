import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Scan } from 'lucide-react'

const BOX_COLORS = {
  safe: 'rgba(34, 197, 94, 0.95)',
  suspicious: 'rgba(245, 158, 11, 0.95)',
  critical: 'rgba(239, 68, 68, 0.95)',
}

const ACTION_KEYWORDS = ['conceal', 'hiding', 'reaching', 'jacket', 'pocket', 'bag']

const isSuspiciousAction = (action = '') => {
  const a = action.toLowerCase()
  return ACTION_KEYWORDS.some((k) => a.includes(k))
}

const VideoAnalysisViewer = ({ videoFile, uploading, result }) => {
  const videoRef = useRef(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [imageReady, setImageReady] = useState(false)

  useEffect(() => {
    if (!videoFile) {
      setVideoUrl(null)
      return
    }
    const url = URL.createObjectURL(videoFile)
    setVideoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [videoFile])

  useEffect(() => {
    if (videoUrl && videoRef.current && uploading) {
      videoRef.current.play().catch(() => {})
    }
  }, [videoUrl, uploading])

  if (!videoFile) return null

  const showResult = !uploading && result?.peak_snapshot_b64
  const detectedObjects = result?.detected_objects || result?.yolo_objects || []
  const threatLabel = result?.threat_label || 'safe'
  const accentColor = BOX_COLORS[threatLabel]

  return (
    <div className="mt-4 mb-2">
      <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video shadow-lg">
        {/* While scanning: play the uploaded video */}
        {!showResult && videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-contain"
            muted
            loop
            playsInline
          />
        )}

        {/* After scan complete: show peak frame snapshot */}
        {showResult && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={`data:image/jpeg;base64,${result.peak_snapshot_b64}`}
            alt="Peak threat frame"
            onLoad={() => setImageReady(true)}
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}

        {/* Scanning animation overlay (while uploading) */}
        {uploading && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-blue-500/10 pointer-events-none" />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_4px_rgba(34,211,238,0.6)] pointer-events-none"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-cyan-400/40">
              <Scan className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider">Analyzing</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-cyan-100 font-mono">
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>vision pipeline running</span>
              </div>
              <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                gemini + mobilenetv3
              </div>
            </div>
            {/* Corner brackets for surveillance feel */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/70" />
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400/70" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400/70" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400/70" />
          </>
        )}

        {/* Bounding boxes (after analysis) */}
        {showResult && imageReady && detectedObjects.length > 0 && (
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <AnimatePresence>
              {detectedObjects.map((obj, i) => {
                const bbox = obj.bbox || [0, 0, 0, 0]
                const [ymin, xmin, ymax, xmax] = bbox
                const width = xmax - xmin
                const height = ymax - ymin
                if (width <= 0 || height <= 0) return null

                const isThreat = isSuspiciousAction(obj.action) || obj.label?.toLowerCase() === 'weapon'
                const boxColor = isThreat ? accentColor : BOX_COLORS[threatLabel]
                const labelText = `${obj.label} ${(obj.confidence * 100).toFixed(0)}%`

                return (
                  <motion.g
                    key={`${obj.label}-${i}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                  >
                    {/* Pulsing outer glow */}
                    <motion.rect
                      x={xmin}
                      y={ymin}
                      width={width}
                      height={height}
                      fill="none"
                      stroke={boxColor}
                      strokeWidth={isThreat ? 6 : 3}
                      opacity={0.4}
                      animate={{ opacity: isThreat ? [0.3, 0.7, 0.3] : 0.4 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {/* Solid inner box */}
                    <rect
                      x={xmin}
                      y={ymin}
                      width={width}
                      height={height}
                      fill="none"
                      stroke={boxColor}
                      strokeWidth={isThreat ? 4 : 2}
                    />
                    {/* Label background */}
                    <rect
                      x={xmin}
                      y={Math.max(0, ymin - 28)}
                      width={Math.min(width, labelText.length * 11 + 20)}
                      height={26}
                      fill={boxColor}
                      rx={3}
                    />
                    <text
                      x={xmin + 8}
                      y={Math.max(18, ymin - 9)}
                      fill="white"
                      fontSize="16"
                      fontWeight="700"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {labelText}
                    </text>
                    {/* Action label below box */}
                    {obj.action && (
                      <text
                        x={xmin + 4}
                        y={ymin + height + 18}
                        fill={boxColor}
                        fontSize="13"
                        fontWeight="600"
                        style={{ fontFamily: 'monospace', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                      >
                        {obj.action.length > 50 ? obj.action.slice(0, 47) + '...' : obj.action}
                      </text>
                    )}
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>
        )}

        {/* Result badge top-right */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg backdrop-blur-md font-bold uppercase text-xs tracking-wider text-white shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            {threatLabel} · {(result.confidence * 100).toFixed(0)}%
          </motion.div>
        )}
      </div>

      {/* Hint line below player */}
      <div className="mt-2 text-[11px] text-slate-400 text-center font-mono">
        {uploading
          ? 'Sampling 12 frames across the video and running them through the vision pipeline...'
          : showResult
          ? `Peak threat frame · ${detectedObjects.length} object${detectedObjects.length === 1 ? '' : 's'} detected`
          : ''}
      </div>
    </div>
  )
}

export default VideoAnalysisViewer
