// ─── Date Formatting ──────────────────────────────────────

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`
}

// ─── String Helpers ───────────────────────────────────────

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str, maxLength = 50) => {
  if (!str) return ''
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

// ─── Confidence Formatting ────────────────────────────────

export const formatConfidence = (confidence) => {
  return `${(confidence * 100).toFixed(1)}%`
}

// ─── Classname Helper ─────────────────────────────────────

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
