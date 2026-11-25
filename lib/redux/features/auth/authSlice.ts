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

/** Localhost is HTTP — `secure: true` cookies often won't set/clear correctly. */
function accessTokenCookieOptions(): Cookies.CookieAttributes {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:";
  return {
    path: "/",
    sameSite: "lax",
    ...(secure ? { secure: true } : {}),
  };
}

function clearAccessTokenCookie() {
  const opts = accessTokenCookieOptions();
  Cookies.remove("accessToken", opts);
  // Also clear legacy variants (older secure/strict sets) so middleware stops seeing them
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("accessToken", {
    path: "/",
    secure: true,
    sameSite: "strict",
  });
  Cookies.remove("accessToken", {
    path: "/",
    secure: true,
    sameSite: "lax",
  });
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
      Cookies.set(
        "accessToken",
        action.payload.accessToken,
        accessTokenCookieOptions(),
      )
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      clearAccessTokenCookie()
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
          Cookies.set(
            "accessToken",
            payload.data.accessToken,
            accessTokenCookieOptions(),
          )
        }
      }
    )
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
