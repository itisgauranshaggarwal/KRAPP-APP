import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useSession } from '@/lib/session'

/** Redirects to the login screen when signed out, remembering where the user was headed. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useSession()
  const location = useLocation()

  if (isLoading) return <div className="min-h-screen bg-bg" aria-busy="true" />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

/** Keeps the auth screens out of reach once signed in. */
export function RequireGuest({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) return <div className="min-h-screen bg-bg" aria-busy="true" />

  if (isAuthenticated) {
    return <Navigate to="/chats" replace />
  }

  return children
}
