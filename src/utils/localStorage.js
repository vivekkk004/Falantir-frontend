// ─── Token Management ─────────────────────────────────────

const TOKEN_KEY = 'shopguard_token'
const USER_KEY = 'shopguard_user'

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

// ─── User Data ────────────────────────────────────────────

export const setUserData = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUserData = () => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY)
}

// ─── Clear All ────────────────────────────────────────────

export const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ─── Notifications (durable alert history) ────────────────

const NOTIFICATIONS_KEY = 'shopguard_notifications'
const MAX_NOTIFICATIONS = 50

export const getNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const setNotifications = (items) => {
  try {
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify((items || []).slice(0, MAX_NOTIFICATIONS)),
    )
  } catch {
    // ignore quota / serialization errors
  }
}

// ─── Sound preference (alarm on critical alerts) ──────────

const SOUND_KEY = 'shopguard_sound'

export const getSoundEnabled = () => {
  const v = localStorage.getItem(SOUND_KEY)
  return v === null ? true : v === 'true' // default ON
}

export const setSoundEnabled = (enabled) => {
  localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false')
}
