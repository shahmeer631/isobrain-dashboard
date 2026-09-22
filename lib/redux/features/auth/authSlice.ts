import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { authApi } from './authApi'

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.token = action.payload.accessToken
      state.isAuthenticated = true
      Cookies.set('accessToken', action.payload.accessToken, { secure: true, sameSite: 'strict' })
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      Cookies.remove('accessToken')
    },
  },
  extraReducers: (builder) => {
    // Automatically hook to RTK Query login mutation fulfilled status
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        if (payload.success && payload.data?.accessToken) {
          state.token = payload.data.accessToken
          state.isAuthenticated = true
          Cookies.set('accessToken', payload.data.accessToken, { secure: true, sameSite: 'strict' })
        }
      }
    )
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
