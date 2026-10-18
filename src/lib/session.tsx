import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

import { isSupabaseMode, supabase } from '@/lib/supabase'

/**
 * Mock session layer (Phase 2).
 *
 * Phase 3 replaces the body of these functions with Supabase Auth calls
 * (`signInWithPassword`, `signUp`, `signOut`) — the surface stays the same,
 * so pages and route guards do not need to change. Flip `MOCK_AUTH` off then.
 */

export const MOCK_AUTH = !isSupabaseMode

export const MIN_PASSWORD = 5

const STORAGE_KEY = 'krapp.session'
/** Simulated network latency so loading states are real (Phase 3: remove). */
const LATENCY_MS = 500

export interface SessionUser {
  id?: string
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
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (input: SignInInput) => Promise<SessionUser>
  signUp: (input: SignUpInput) => Promise<SessionUser>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

const wait = (ms = LATENCY_MS) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

async function loadSupabaseUser(userId: string): Promise<SessionUser> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const [{ data: profile, error: profileError }, { data: account, error: accountError }] =
    await Promise.all([
      supabase.from('profiles').select('username, display_name').eq('id', userId).single(),
      supabase.from('account_profiles').select('email').eq('id', userId).single(),
    ])

  if (profileError || accountError || !profile || !account) {
    throw new Error('Your profile could not be loaded. Check that the Phase 3 migration ran.')
  }

  return {
    id: userId,
    username: profile.username,
    displayName: profile.display_name,
    email: account.email,
  }
}

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
  const [user, setUser] = useState<SessionUser | null>(() =>
    isSupabaseMode ? null : readStoredUser(),
  )
  const [isLoading, setIsLoading] = useState(isSupabaseMode)

  useEffect(() => {
    if (!isSupabaseMode || !supabase) {
      setIsLoading(false)
      return
    }

    let mounted = true
    const client = supabase

    async function hydrate() {
      const { data, error } = await client.auth.getSession()
      if (error) throw error
      const nextUser = data.session ? await loadSupabaseUser(data.session.user.id) : null
      if (mounted) {
        setUser(nextUser)
        setIsLoading(false)
      }
    }

    void hydrate().catch(() => {
      if (mounted) setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void (async () => {
          const nextUser = session ? await loadSupabaseUser(session.user.id) : null
          if (mounted) {
            setUser(nextUser)
            setIsLoading(false)
          }
        })().catch(() => {
          if (mounted) setIsLoading(false)
        })
      }, 0)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async ({ username, password }: SignInInput) => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const cleanUsername = username.trim().toLowerCase()
      const { data: matches, error: lookupError } = await supabase.rpc(
        'resolve_username_email',
        { p_username: cleanUsername },
      )
      const match = Array.isArray(matches) ? matches[0] : matches
      if (lookupError || !match?.email) {
        throw new Error("That username and password don't match. Check both and try again.")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: match.email,
        password,
      })
      if (error || !data.user) throw new Error(error?.message ?? 'Unable to sign in.')

      const next = await loadSupabaseUser(data.user.id)
      setUser(next)
      return next
    }

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
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        options: {
          data: {
            display_name: input.displayName.trim(),
            username: input.username.trim().toLowerCase(),
          },
        },
      })
      if (error || !data.user) throw new Error(error?.message ?? 'Unable to create account.')
      if (!data.session) {
        throw new Error(
          'Account created, but no session was returned. Turn off email confirmation in Supabase Auth settings.',
        )
      }

      const next = await loadSupabaseUser(data.user.id)
      setUser(next)
      return next
    }

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
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      return
    }

    await wait(250)
    setUser(null)
    persist(null)
  }, [])

  const deleteAccount = useCallback(async () => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase.functions.invoke('delete-account')
      if (error) throw new Error('Account deletion is not configured on this Supabase project yet.')
      await supabase.auth.signOut()
      setUser(null)
      return
    }

    await wait(600)
    setUser(null)
    persist(null)
  }, [])

  const value = useMemo<SessionContextValue>(
    () => ({ user, isLoading, isAuthenticated: user !== null, signIn, signUp, signOut, deleteAccount }),
    [user, isLoading, signIn, signUp, signOut, deleteAccount],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within a SessionProvider')
  return context
}
