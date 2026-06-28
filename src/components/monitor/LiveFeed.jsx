import { useEffect, useMemo, useRef, useState } from 'react'
import { WifiOff, RefreshCw, Loader2 } from 'lucide-react'
import { getAgentStreamUrl } from '../../services/agentService'

const RETRY_DELAY_MS = 3000

/**
 * Continuous MJPEG camera feed.
 *
 * The backend serves a real `multipart/x-mixed-replace` stream, which an
 * <img> plays live as long as its `src` is STABLE. The old call sites used
 * `?t=${Date.now()}` which changed on every React render and forced the
 * browser to tear down + reopen the stream (the "frozen thumbnail" bug).
 * Here the URL only changes when we deliberately reconnect (`nonce`).
 */
const LiveFeed = ({ agentId, agentName = 'Camera', className = '' }) => {
  const [nonce, setNonce] = useState(0)
  const [status, setStatus] = useState('connecting') // connecting | live | error
  const retryTimer = useRef(null)
  const imgRef = useRef(null)

  const src = useMemo(
    () => `${getAgentStreamUrl(agentId)}?r=${nonce}`,
    [agentId, nonce],
  )

  // A new agent or a reconnect means we're (re)connecting.
  useEffect(() => {
    setStatus('connecting')
  }, [src])

  // Clear the retry timer and close the held MJPEG connection on unmount.
  useEffect(() => {
    const img = imgRef.current
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current)
      if (img) img.src = ''
    }
  }, [])

  const handleError = () => {
    setStatus('error')
    if (retryTimer.current) clearTimeout(retryTimer.current)
    retryTimer.current = setTimeout(() => setNonce((n) => n + 1), RETRY_DELAY_MS)
  }

  const handleRetry = () => {
    if (retryTimer.current) clearTimeout(retryTimer.current)
    setNonce((n) => n + 1)
  }

  return (
    <div className={`relative w-full h-full bg-[#0d0f1a] ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={agentName}
        className="w-full h-full object-contain"
        onLoad={() => setStatus('live')}
        onError={handleError}
      />

      {status === 'connecting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0d0f1a]/70 backdrop-blur-sm">
          <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
          <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em]">CONNECTING…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0d0f1a]/85">
          <WifiOff className="w-7 h-7 text-red-400" />
          <p className="text-[10px] font-bold text-slate-300 tracking-[0.15em]">OFFLINE — RECONNECTING…</p>
          <button
            onClick={handleRetry}
            className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}
    </div>
  )
}

export default LiveFeed
