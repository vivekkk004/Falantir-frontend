import { getSoundEnabled } from './localStorage'

// Lazily-created shared AudioContext. Browsers require a prior user
// gesture before audio can play, so creation is deferred and any
// failure is swallowed (best-effort alarm).
let _ctx = null

const getCtx = () => {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!_ctx) _ctx = new AC()
  return _ctx
}

/**
 * Play a short two-tone alarm using the Web Audio API.
 * No audio asset is bundled. No-op when sound is disabled by the user
 * or when the browser hasn't allowed audio yet.
 */
export const playAlarm = () => {
  if (!getSoundEnabled()) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const tones = [
      { freq: 880, start: 0, dur: 0.18 },
      { freq: 1320, start: 0.22, dur: 0.24 },
    ]
    tones.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + start)
      gain.gain.exponentialRampToValueAtTime(0.25, now + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + dur)
    })
  } catch {
    // audio not allowed yet — ignore
  }
}
