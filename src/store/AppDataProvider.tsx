import {
  createContext,
  useCallback,
  useContext,
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
import type { Contact, Conversation, Message, User } from '@/types'

interface AppData {
  currentUser: User
  contacts: Contact[]
  incomingRequests: Contact[]
  outgoingRequests: Contact[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  /** Registered accounts matching a username query (excluding self/contacts). */
  searchUsers: (query: string) => User[]
  sendInvite: (user: User, introMessage?: string) => void
  acceptRequest: (requestId: string) => void
  rejectRequest: (requestId: string) => void
  sendMessage: (conversationId: string, content: string) => void
  markConversationRead: (conversationId: string) => void
  deleteConversation: (conversationId: string) => void
  updateProfile: (patch: Partial<Pick<User, 'displayName' | 'username' | 'avatarUrl' | 'bio'>>) => void
  isAvailableUsername: (username: string) => boolean
}

const AppDataContext = createContext<AppData | null>(null)

let idCounter = 1000
const nextId = (prefix: string) => `${prefix}-${++idCounter}`

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [incomingRequests, setIncomingRequests] = useState<Contact[]>(mockIncomingRequests)
  const [outgoingRequests, setOutgoingRequests] = useState<Contact[]>(mockOutgoingRequests)
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)

  const searchUsers = useCallback(
    (query: string): User[] => {
      const needle = query.trim().toLowerCase().replace(/^@/, '')
      if (!needle) return []

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
    [currentUser.id, contacts, incomingRequests, outgoingRequests],
  )

  const acceptRequest = useCallback((requestId: string) => {
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
  }, [])

  const rejectRequest = useCallback((requestId: string) => {
    setIncomingRequests((prev) => prev.filter((item) => item.id !== requestId))
  }, [])

  const sendInvite = useCallback((user: User, introMessage?: string) => {
    const request: Contact = {
      id: nextId('r'),
      user,
      status: 'pending',
      direction: 'outgoing',
      introMessage: introMessage?.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setOutgoingRequests((prev) => [request, ...prev])
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      const text = content.trim()
      if (!text) return

      const conversation = conversations.find((item) => item.id === conversationId)
      if (!conversation) return

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

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((item) => (item.id === conversationId ? { ...item, unreadCount: 0 } : item)),
    )
  }, [])

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations((prev) => prev.filter((item) => item.id !== conversationId))
    setMessages((prev) => {
      const next = { ...prev }
      delete next[conversationId]
      return next
    })
  }, [])

  const updateProfile = useCallback<AppData['updateProfile']>((patch) => {
    setCurrentUser((prev) => ({ ...prev, ...patch }))
  }, [])

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
      searchUsers,
      sendInvite,
      acceptRequest,
      rejectRequest,
      sendMessage,
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
      searchUsers,
      sendInvite,
      acceptRequest,
      rejectRequest,
      sendMessage,
      markConversationRead,
      deleteConversation,
      updateProfile,
      isAvailableUsername,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData(): AppData {
  const context = useContext(AppDataContext)
  if (!context) throw new Error('useAppData must be used within an AppDataProvider')
  return context
}
