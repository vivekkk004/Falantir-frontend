import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../api/apiClient'

// Single thunk to fetch everything at once
export const fetchSystemState = createAsyncThunk(
  'detection/fetchState',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient('/detection/state?limit_alerts=5')
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const startDetectionEngine = createAsyncThunk(
  'detection/start',
  async (source, { dispatch }) => {
    await apiClient(`/detection/start?source=${source}`, { method: 'POST' })
    dispatch(fetchSystemState())
  }
)

export const stopDetectionEngine = createAsyncThunk(
  'detection/stop',
  async (_, { dispatch }) => {
    await apiClient('/detection/stop', { method: 'POST' })
    dispatch(fetchSystemState())
  }
)

const detectionSlice = createSlice({
  name: 'detection',
  initialState: {
    isRunning: false,
    stats: null,
    recentAlerts: [],
    isLoading: false,
    lastUpdated: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemState.fulfilled, (state, action) => {
        state.isRunning = action.payload.engine?.running || false
        state.stats = action.payload
        state.recentAlerts = action.payload.recent_alerts || []
        state.lastUpdated = action.payload.server_time
      })
      .addCase(startDetectionEngine.pending, (state) => { state.isLoading = true })
      .addCase(startDetectionEngine.fulfilled, (state) => { state.isLoading = false })
      .addCase(stopDetectionEngine.pending, (state) => { state.isLoading = true })
      .addCase(stopDetectionEngine.fulfilled, (state) => { state.isLoading = false })
  }
})

export default detectionSlice.reducer
