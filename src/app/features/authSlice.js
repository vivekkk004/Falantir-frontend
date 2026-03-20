import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser as loginAPI, registerUser as registerAPI, logoutUser as logoutAPI } from '../../services/authService'
import { setToken, removeToken, getToken, getUserData, setUserData, removeUserData } from '../../utils/localStorage'

// ─── Thunks ───────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials)
      setToken(data.token)
      setUserData(data.user)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerAPI(userData)
      setToken(data.token)
      setUserData(data.user)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try { await logoutAPI() } catch (_) {}
    removeToken()
    removeUserData()
    return null
  }
)

// ─── Slice ────────────────────────────────────────────────

const initialState = {
  user: getUserData() || null,
  token: getToken() || null,
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    resetAuth: (state) => {
      state.user = null; state.token = null
      state.isAuthenticated = false; state.isLoading = false; state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false; state.isAuthenticated = true
        state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false; state.isAuthenticated = true
        state.user = action.payload.user; state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; state.token = null; state.isAuthenticated = false
      })
  },
})

export const { clearError, resetAuth } = authSlice.actions
export default authSlice.reducer
