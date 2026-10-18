import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  currentUser as mockCurrentUser,
  mockContacts,
  mockConversations,
  mockDirectory,
  mockIncomingRequests,
  mockMessages,
  mockOutgoingRequests,
} from '@/data/mock'
import { isSupabaseMode, supabase } from '@/lib/supabase'
import { useSession } from '@/lib/session'
import { fetchAppSnapshot, searchSupabaseUsers } from '@/lib/supabase-data'
import type { Contact, Conversation, Message, User } from '@/types'

type ProfilePatch = Partial<Pick<User, 'displayName' | 'username' | 'email' | 'avatarUrl' | 'bio'>>

interface AppData {
  currentUser: User
  contacts: Contact[]
  incomingRequests: Contact[]
  outgoingRequests: Contact[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  /** False while the mock "initial fetch" is in flight (drives list skeletons). */
  isReady: boolean
  /** Registered accounts matching a username query (excluding self/contacts). */
  searchUsers: (query: string) => Promise<User[]>
  sendInvite: (user: User, introMessage?: string) => Promise<void>
  acceptRequest: (requestId: string) => Promise<void>
  rejectRequest: (requestId: string) => Promise<void>
  /** Optimistic + instant: matches how the realtime send will feel. */
  sendMessage: (conversationId: string, content: string) => void
  /** Get-or-create the 1:1 conversation with a contact. */
  openConversationWith: (user: User) => Promise<string>
  markConversationRead: (conversationId: string) => void
  deleteConversation: (conversationId: string) => Promise<void>
  updateProfile: (patch: ProfilePatch) => Promise<void>
  isAvailableUsername: (username: string) => boolean
}

const AppDataContext = createContext<AppData | null>(null)

/** Simulated latency for "server" actions so loading states are real (Phase 3: remove). */
const LATENCY_MS = 420
const wait = (ms = LATENCY_MS) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

let idCounter = 1000
const nextId = (prefix: string) => `${prefix}-${++idCounter}`

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user: sessionUser } = useSession()

  const [profilePatch, setProfilePatch] = useState<ProfilePatch>({})
  const [contacts, setContacts] = useState<Contact[]>(isSupabaseMode ? [] : mockContacts)
  const [incomingRequests, setIncomingRequests] = useState<Contact[]>(
    isSupabaseMode ? [] : mockIncomingRequests,
  )
  const [outgoingRequests, setOutgoingRequests] = useState<Contact[]>(
    isSupabaseMode ? [] : mockOutgoingRequests,
  )
  const [conversations, setConversations] = useState<Conversation[]>(
    isSupabaseMode ? [] : mockConversations,
  )
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    isSupabaseMode ? {} : mockMessages,
  )
  const [isReady, setIsReady] = useState(!isSupabaseMode)

  // Mock "initial fetch" — lists show skeletons until this resolves.
  useEffect(() => {
    if (isSupabaseMode) return
    const timer = window.setTimeout(() => setIsReady(true), LATENCY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isSupabaseMode || !sessionUser?.id) return
    let mounted = true

    void fetchAppSnapshot(sessionUser.id)
      .then((snapshot) => {
        if (!mounted) return
        setContacts(snapshot.contacts)
        setIncomingRequests(snapshot.incomingRequests)
        setOutgoingRequests(snapshot.outgoingRequests)
        setConversations(snapshot.conversations)
        setMessages(snapshot.messages)
        setIsReady(true)
      })
      .catch(() => {
        if (mounted) setIsReady(true)
      })

    return () => {
      mounted = false
    }
  }, [sessionUser?.id])

  /** The signed-in account drives identity; the rest is mock world state. */
  const currentUser = useMemo<User>(() => {
    const identity = sessionUser
      ? {
          id: sessionUser.id ?? mockCurrentUser.id,
          username: sessionUser.username,
          displayName: sessionUser.displayName,
          email: sessionUser.email ?? mockCurrentUser.email,
        }
      : {
          username: mockCurrentUser.username,
          displayName: mockCurrentUser.displayName,
          email: mockCurrentUser.email,
        }

    return { ...mockCurrentUser, ...identity, ...profilePatch }
  }, [sessionUser, profilePatch])

  const refreshSupabaseData = useCallback(async () => {
    if (!isSupabaseMode || !sessionUser?.id) return
    const snapshot = await fetchAppSnapshot(sessionUser.id)
    setContacts(snapshot.contacts)
    setIncomingRequests(snapshot.incomingRequests)
    setOutgoingRequests(snapshot.outgoingRequests)
    setConversations(snapshot.conversations)
    setMessages(snapshot.messages)
  }, [sessionUser?.id])

  const searchUsers = useCallback(
    async (query: string): Promise<User[]> => {
      if (isSupabaseMode) {
        if (!sessionUser?.id) return []
        return searchSupabaseUsers(query, sessionUser.id)
      }

      const needle = query.trim().toLowerCase().replace(/^@/, '')
      if (!needle) return []
      await wait(320)

      const known = new Set<string>([
        currentUser.id,
        ...contacts.map((c) => c.user.id),
        ...incomingRequests.map((c) => c.user.id),
        ...outgoingRequests.map((c) => c.user.id),
      ])

      return mockDirectory.filter(
        (user) =>
          !known.has(user.id) &&
          (user.username.toLowerCase().includes(needle) ||
            user.displayName.toLowerCase().includes(needle)),
      )
    },
    [currentUser.id, contacts, incomingRequests, outgoingRequests, sessionUser?.id],
  )

  const acceptRequest = useCallback(async (requestId: string) => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const request = incomingRequests.find((item) => item.id === requestId)
      if (!request) return

      const firstParticipant = [currentUser.id, request.user.id].sort()[0]
      const secondParticipant = [currentUser.id, request.user.id].sort()[1]
      const { error: requestError } = await supabase
        .from('contact_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
      if (requestError) throw requestError

      const { error: conversationError } = await supabase.from('conversations').upsert(
        {
          participant_one_id: firstParticipant,
          participant_two_id: secondParticipant,
        },
        { onConflict: 'participant_one_id,participant_two_id' },
      )
      if (conversationError) throw conversationError
      await refreshSupabaseData()
      return
    }

    await wait()
    setIncomingRequests((prev) => {
      const request = prev.find((item) => item.id === requestId)
      if (!request) return prev

      const accepted: Contact = { ...request, status: 'accepted' }
      setContacts((list) => [...list, accepted])

      const conversationId = `conv-${request.user.username}`
      setConversations((list) => [
        {
          id: conversationId,
          user: request.user,
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        },
        ...list,
      ])
      setMessages((list) => ({ ...list, [conversationId]: [] }))

      return prev.filter((item) => item.id !== requestId)
    })
  }, [currentUser.id, incomingRequests, refreshSupabaseData])

  const rejectRequest = useCallback(async (requestId: string) => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase
        .from('contact_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId)
      if (error) throw error
      await refreshSupabaseData()
      return
    }

    await wait(300)
    setIncomingRequests((prev) => prev.filter((item) => item.id !== requestId))
  }, [refreshSupabaseData])

  const sendInvite = useCallback(async (user: User, introMessage?: string) => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const cleanIntro = introMessage?.trim() || null
      const { data: request, error: requestError } = await supabase
        .from('contact_requests')
        .insert({
          requester_id: currentUser.id,
          addressee_id: user.id,
          intro_message: cleanIntro,
        })
        .select('id')
        .single()
      if (requestError || !request) throw requestError ?? new Error('Invite could not be sent.')

      if (cleanIntro) {
        const [firstParticipant, secondParticipant] = [currentUser.id, user.id].sort()
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .upsert(
            { participant_one_id: firstParticipant, participant_two_id: secondParticipant },
            { onConflict: 'participant_one_id,participant_two_id' },
          )
          .select('id')
          .single()
        if (conversationError || !conversation) {
          throw conversationError ?? new Error('Invite conversation could not be created.')
        }

        const { error: messageError } = await supabase.from('messages').insert({
          conversation_id: conversation.id,
          sender_id: currentUser.id,
          type: 'text',
          content: cleanIntro,
          is_intro: true,
        })
        if (messageError) throw messageError
      }

      await refreshSupabaseData()
      return
    }

    await wait()
    const request: Contact = {
      id: nextId('r'),
      user,
      status: 'pending',
      direction: 'outgoing',
      introMessage: introMessage?.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setOutgoingRequests((prev) => [request, ...prev])
  }, [currentUser.id, refreshSupabaseData])

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      const text = content.trim()
      if (!text) return

      const conversation = conversations.find((item) => item.id === conversationId)
      if (!conversation) return

      if (isSupabaseMode) {
        if (!supabase) return
        const message: Message = {
          id: nextId('optimistic'),
          conversationId,
          senderId: currentUser.id,
          type: 'text',
          content: text,
          status: 'sent',
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] ?? []), message],
        }))
        setConversations((prev) =>
          prev
            .map((item) =>
              item.id === conversationId
                ? { ...item, lastMessage: message, updatedAt: message.createdAt }
                : item,
            )
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
        )

        void supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          type: 'text',
          content: text,
        })
        return
      }

      const message: Message = {
        id: nextId('m'),
        conversationId,
        senderId: currentUser.id,
        type: 'text',
        content: text,
        status: 'sent',
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), message],
      }))
      setConversations((prev) =>
        prev
          .map((item) =>
            item.id === conversationId
              ? { ...item, lastMessage: message, updatedAt: message.createdAt }
              : item,
          )
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      )
    },
    [conversations, currentUser.id],
  )

  const openConversationWith = useCallback(
    async (user: User): Promise<string> => {
      const existing = conversations.find((item) => item.user.id === user.id)
      if (existing) return existing.id

      if (isSupabaseMode) {
        if (!supabase) throw new Error('Supabase is not configured.')
        const [firstParticipant, secondParticipant] = [currentUser.id, user.id].sort()
        const { data, error } = await supabase
          .from('conversations')
          .upsert(
            { participant_one_id: firstParticipant, participant_two_id: secondParticipant },
            { onConflict: 'participant_one_id,participant_two_id' },
          )
          .select('id')
          .single()
        if (error || !data) throw error ?? new Error('Conversation could not be opened.')
        await refreshSupabaseData()
        return data.id
      }

      await wait(220)
      const id = `conv-${user.username}`
      setConversations((prev) => [
        { id, user, unreadCount: 0, updatedAt: new Date().toISOString() },
        ...prev,
      ])
      setMessages((prev) => (prev[id] ? prev : { ...prev, [id]: [] }))
      return id
    },
    [conversations, currentUser.id, refreshSupabaseData],
  )

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((item) => (item.id === conversationId ? { ...item, unreadCount: 0 } : item)),
    )
  }, [])

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase.from('conversations').delete().eq('id', conversationId)
      if (error) throw error
      await refreshSupabaseData()
      return
    }

    await wait(300)
    setConversations((prev) => prev.filter((item) => item.id !== conversationId))
    setMessages((prev) => {
      const next = { ...prev }
      delete next[conversationId]
      return next
    })
  }, [refreshSupabaseData])

  const updateProfile = useCallback(async (patch: ProfilePatch) => {
    if (isSupabaseMode) {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: patch.displayName,
          username: patch.username,
          bio: patch.bio,
        })
        .eq('id', currentUser.id)
      if (profileError) throw profileError

      if (patch.email) {
        const { error: authError } = await supabase.auth.updateUser({ email: patch.email })
        if (authError) throw authError
        const { error: accountError } = await supabase
          .from('account_profiles')
          .update({ email: patch.email })
          .eq('id', currentUser.id)
        if (accountError) throw accountError
      }

      setProfilePatch((prev) => ({ ...prev, ...patch }))
      return
    }

    await wait(300)
    setProfilePatch((prev) => ({ ...prev, ...patch }))
  }, [currentUser.id])

  const isAvailableUsername = useCallback(
    (username: string) => {
      const needle = username.trim().toLowerCase()
      if (!needle) return false
      if (needle === currentUser.username.toLowerCase()) return true
      const taken = new Set<string>([
        ...mockDirectory.map((user) => user.username.toLowerCase()),
        ...contacts.map((c) => c.user.username.toLowerCase()),
      ])
      return !taken.has(needle)
    },
    [contacts, currentUser.username],
  )

  const value = useMemo<AppData>(
    () => ({
      currentUser,
      contacts,
      incomingRequests,
      outgoingRequests,
      conversations,
      messages,
      isReady,
      searchUsers,
      sendInvite,
      acceptRequest,
      rejectRequest,
      sendMessage,
      openConversationWith,
      markConversationRead,
      deleteConversation,
      updateProfile,
      isAvailableUsername,
    }),
    [
      currentUser,
      contacts,
      incomingRequests,
      outgoingRequests,
      conversations,
      messages,
      isReady,
      searchUsers,
      sendInvite,
      acceptRequest,
      rejectRequest,
      sendMessage,
      openConversationWith,
      markConversationRead,
      deleteConversation,
      updateProfile,
      isAvailableUsername,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useAppData(): AppData {
  const context = useContext(AppDataContext)
  if (!context) throw new Error('useAppData must be used within an AppDataProvider')
  return context
}
