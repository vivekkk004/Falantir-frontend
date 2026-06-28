import { createSlice } from '@reduxjs/toolkit'
import { getNotifications, setNotifications } from '../../utils/localStorage'

const MAX = 50

const persisted = getNotifications()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: persisted,
    unreadCount: persisted.filter((n) => !n.read).length,
  },
  reducers: {
    // payload: { id, agent_id, agent_name, threat_label, confidence,
    //            description, reasoning, timestamp, read }
    addNotification: (state, action) => {
      const n = action.payload
      if (n.id && state.items.some((it) => it.id === n.id)) return // de-dupe
      state.items.unshift(n)
      if (state.items.length > MAX) state.items = state.items.slice(0, MAX)
      state.unreadCount = state.items.filter((it) => !it.read).length
      setNotifications(state.items)
    },
    markAllRead: (state) => {
      state.items = state.items.map((it) => ({ ...it, read: true }))
      state.unreadCount = 0
      setNotifications(state.items)
    },
    clearNotifications: (state) => {
      state.items = []
      state.unreadCount = 0
      setNotifications(state.items)
    },
  },
})

export const { addNotification, markAllRead, clearNotifications } =
  notificationsSlice.actions
export default notificationsSlice.reducer
