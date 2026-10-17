import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Mock session layer (Phase 2).
 *
 * Phase 3 replaces the body of these functions with Supabase Auth calls
 * (`signInWithPassword`, `signUp`, `signOut`) — the surface stays the same,
 * so pages and route guards do not need to change. Flip `MOCK_AUTH` off then.
 */

export const MOCK_AUTH = true

export const MIN_PASSWORD = 5

const STORAGE_KEY = 'krapp.session'
/** Simulated network latency so loading states are real (Phase 3: remove). */
const LATENCY_MS = 500

export interface SessionUser {
  username: string
  displayName: string
  email?: string
}

export interface SignInInput {
  username: string
  password: string
}

export interface SignUpInput {
  displayName: string
  username: string
  email: string
  password: string
}

interface SessionContextValue {
  user: SessionUser | null
  isAuthenticated: boolean
  signIn: (input: SignInInput) => Promise<SessionUser>
  signUp: (input: SignUpInput) => Promise<SessionUser>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

const wait = (ms = LATENCY_MS) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** "aria.malik" -> "Aria Malik" (fallback display name for mock sign-in). */
function nameFromUsername(username: string): string {
  return username
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.username === 'string' && typeof candidate.displayName === 'string'
}

function readStoredUser(): SessionUser | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isSessionUser(parsed) ? parsed : null
  } catch {
    return null
  }
}

function persist(user: SessionUser | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable - session simply won't persist */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readStoredUser())

  const signIn = useCallback(async ({ username, password }: SignInInput) => {
    await wait()
    const clean = username.trim().toLowerCase()
    // Mock rule: any username works, the password just has to be well-formed.
    if (!clean || password.length < MIN_PASSWORD) {
      throw new Error("That username and password don't match. Check both and try again.")
    }
    const next: SessionUser = {
      username: clean,
      displayName: nameFromUsername(clean),
    }
    setUser(next)
    persist(next)
    return next
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    await wait()
    if (!input.username.trim() || input.password.length < MIN_PASSWORD) {
      throw new Error('That account could not be created. Check the form and try again.')
    }
    const next: SessionUser = {
      username: input.username.trim().toLowerCase(),
      displayName: input.displayName.trim(),
      email: input.email.trim(),
    }
    setUser(next)
    persist(next)
    return next
  }, [])

  const signOut = useCallback(async () => {
    await wait(250)
    setUser(null)
    persist(null)
  }, [])

  const deleteAccount = useCallback(async () => {
    await wait(600)
    setUser(null)
    persist(null)
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({ user, isAuthenticated: user !== null, signIn, signUp, signOut, deleteAccount }),
    [user, signIn, signUp, signOut, deleteAccount],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}
