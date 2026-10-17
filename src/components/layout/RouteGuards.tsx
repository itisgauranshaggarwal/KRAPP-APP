import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useSession } from '@/lib/session'

/** Redirects to the login screen when signed out, remembering where the user was headed. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

/** Keeps the auth screens out of reach once signed in. */
export function RequireGuest({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession()

  if (isAuthenticated) {
    return <Navigate to="/chats" replace />
  }

  return children
}
