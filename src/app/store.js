import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import userReducer from './features/userSlice'
import detectionReducer from './features/detectionSlice'
import agentReducer from './features/agentSlice'
import notificationsReducer from './features/notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    detection: detectionReducer,
    agents: agentReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
})
