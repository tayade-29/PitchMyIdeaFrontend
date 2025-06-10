import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'https://backend-pitchmyidea.onrender.com/api/users'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData)
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData)
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user profile
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.get(`${API_URL}/profile`, config)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const response = await axios.put(`${API_URL}/profile`, userData, config)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user')
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload }
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  }
})

export const { reset } = authSlice.actions
export default authSlice.reducer