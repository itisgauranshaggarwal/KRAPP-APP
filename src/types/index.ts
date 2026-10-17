export type ThemeMode = 'light' | 'dark' | 'system'

export interface User {
  id: string
  username: string
  displayName: string
  /** Only present for the signed-in user; never exposed to others in the UI. */
  email?: string
  avatarUrl?: string | null
  bio?: string
  /** ISO timestamp of last activity, used for presence ("last seen"). */
  lastSeenAt?: string | null
  online?: boolean
}

export type ContactStatus = 'pending' | 'accepted' | 'rejected'
export type ContactDirection = 'incoming' | 'outgoing'

export interface Contact {
  id: string
  user: User
  status: ContactStatus
  direction: ContactDirection
  /** The single optional message attached when an invite is sent. */
  introMessage?: string
  createdAt: string
}

export type MessageType = 'text' | 'image' | 'voice' | 'file'
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  type: MessageType
  content: string
  mediaUrl?: string | null
  /** e.g. voice duration in seconds, image dimensions, file name/size. */
  metadata?: Record<string, unknown>
  status: MessageStatus
  /** True for the one message allowed before a contact request is accepted. */
  isIntro?: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  user: User
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}
