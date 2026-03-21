import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAgents, createAgent, deleteAgent, startAgentStream, stopAgentStream } from '../../services/agentService'

export const fetchAgents = createAsyncThunk('agents/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getAgents()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const addAgent = createAsyncThunk('agents/add', async (agentData, { rejectWithValue }) => {
  try {
    return await createAgent(agentData)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const removeAgent = createAsyncThunk('agents/remove', async (agentId, { rejectWithValue }) => {
  try {
    await deleteAgent(agentId)
    return agentId
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const startAgent = createAsyncThunk('agents/start', async (agentId, { rejectWithValue }) => {
  try {
    await startAgentStream(agentId)
    return agentId
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const stopAgent = createAsyncThunk('agents/stop', async (agentId, { rejectWithValue }) => {
  try {
    await stopAgentStream(agentId)
    return agentId
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const agentSlice = createSlice({
  name: 'agents',
  initialState: {
    list: [],
    isLoading: false,
    error: null,
    liveData: {}, // agentId -> latest WebSocket update
  },
  reducers: {
    updateAgentLiveData: (state, action) => {
      const { agent_id, ...data } = action.payload
      state.liveData[agent_id] = data
    },
    clearAgentError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchAgents.fulfilled, (state, action) => { state.isLoading = false; state.list = action.payload || [] })
      .addCase(fetchAgents.rejected, (state, action) => { state.isLoading = false; state.error = action.payload })
      .addCase(addAgent.fulfilled, (state, action) => { state.list.unshift(action.payload) })
      .addCase(removeAgent.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a.id !== action.payload)
        delete state.liveData[action.payload]
      })
      .addCase(startAgent.fulfilled, (state, action) => {
        const agent = state.list.find(a => a.id === action.payload)
        if (agent) agent.status = 'streaming'
      })
      .addCase(stopAgent.fulfilled, (state, action) => {
        const agent = state.list.find(a => a.id === action.payload)
        if (agent) agent.status = 'stopped'
      })
  },
})

export const { updateAgentLiveData, clearAgentError } = agentSlice.actions
export default agentSlice.reducer
