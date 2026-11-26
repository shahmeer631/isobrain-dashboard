import { configureStore, isPlain } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import authReducer from './features/auth/authSlice'

/** Allow browser binary types used by uploads / certificate downloads. */
function isSerializable(value: unknown): boolean {
  if (
    (typeof Blob !== "undefined" && value instanceof Blob) ||
    (typeof File !== "undefined" && value instanceof File) ||
    (typeof FormData !== "undefined" && value instanceof FormData) ||
    (typeof FileList !== "undefined" && value instanceof FileList)
  ) {
    return true
  }
  return isPlain(value)
}

export const makeStore = (preloadedState?: { auth: { token: string | null; isAuthenticated: boolean } }) => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // RTK Query may carry FormData args and Blob responses (cert downloads).
        serializableCheck: {
          isSerializable,
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/PURGE",
            "persist/REGISTER",
          ],
          ignoredActionPaths: [
            "meta.arg",
            "meta.baseQueryMeta",
            "payload.timestamp",
          ],
          ignoredPaths: [baseApi.reducerPath],
        },
      }).concat(baseApi.middleware),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
