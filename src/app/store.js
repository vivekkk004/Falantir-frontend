import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import userReducer from './features/userSlice'
import detectionReducer from './features/detectionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    detection: detectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
})
