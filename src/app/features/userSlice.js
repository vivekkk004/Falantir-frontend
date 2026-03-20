import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMe, updateMe, getAllUsers } from '../../services/userService'

// ─── Thunks ───────────────────────────────────────────────

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      return await getMe()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user')
    }
  }
)

export const updateCurrentUser = createAsyncThunk(
  'user/updateMe',
  async (userData, { rejectWithValue }) => {
    try {
      return await updateMe(userData)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'user/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllUsers()
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users')
    }
  }
)

// ─── Slice ────────────────────────────────────────────────

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    allUsers: [],
    isLoading: false,
    updateLoading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Me
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Me
      .addCase(updateCurrentUser.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.updateLoading = false
        state.profile = action.payload
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload
      })

      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.allUsers = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearUserError } = userSlice.actions
export default userSlice.reducer
