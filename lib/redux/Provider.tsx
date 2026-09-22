'use client'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './store'

export default function StoreProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string | null
}) {
  const [store] = useState(() =>
    makeStore({
      auth: {
        token,
        isAuthenticated: !!token,
      },
    })
  )

  return <Provider store={store}>{children}</Provider>
}
