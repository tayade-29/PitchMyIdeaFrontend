import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'https://backend-pitchmyidea.onrender.com/api/ideas'

const initialState = {
  ideas: [],
  currentIdea: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}

// Create new idea
export const createIdea = createAsyncThunk(
  'ideas/create',
  async (ideaData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.post(API_URL, ideaData, config)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get all ideas
export const getIdeas = createAsyncThunk(
  'ideas/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get ideas by category
// Update the getIdeasByCategory endpoint
export const getIdeasByCategory = createAsyncThunk(
  'ideas/getByCategory',
  async (category, thunkAPI) => {
    try {
      // Use encoded category parameter
      const response = await axios.get(`${API_URL}/explore/${encodeURIComponent(category)}`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Toggle like
export const toggleLike = createAsyncThunk(
  'ideas/toggleLike',
  async (ideaId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.put(`${API_URL}/${ideaId}/like`, {}, config)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Toggle bookmark
export const toggleBookmark = createAsyncThunk(
  'ideas/toggleBookmark',
  async (ideaId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.put(`${API_URL}/${ideaId}/bookmark`, {}, config)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
    setCurrentIdea: (state, action) => {
      state.currentIdea = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIdea.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createIdea.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ideas.unshift(action.payload)
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getIdeas.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getIdeas.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.ideas = action.payload
      })
      .addCase(getIdeas.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getIdeasByCategory.fulfilled, (state, action) => {
        state.ideas = action.payload
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.ideas.findIndex(idea => idea._id === action.payload._id)
        if (index !== -1) {
          state.ideas[index] = action.payload
        }
      })
  }
})

export const { reset, setCurrentIdea } = ideaSlice.actions
export default ideaSlice.reducer