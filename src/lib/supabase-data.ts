import { supabase } from '@/lib/supabase'
import type { Contact, Conversation, Message, User } from '@/types'

interface ProfileRow {
  id: string
  username: string
  display_name: string
  bio: string | null
  last_seen_at: string | null
}

interface ContactRow {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'rejected'
  intro_message: string | null
  created_at: string
}

interface ConversationRow {
  id: string
  participant_one_id: string
  participant_two_id: string
  created_at: string
  updated_at: string
}

interface MessageRow {
  id: string
  conversation_id: string
  sender_id: string
  type: 'text' | 'image' | 'voice' | 'file'
  content: string
  media_url: string | null
  media_metadata: Record<string, unknown>
  is_intro: boolean
  status: 'sent' | 'delivered' | 'seen'
  created_at: string
}

interface ReadStateRow {
  conversation_id: string
  last_read_at: string
}

export interface SupabaseSnapshot {
  contacts: Contact[]
  incomingRequests: Contact[]
  outgoingRequests: Contact[]
  conversations: Conversation[]
  messages: Record<string, Message[]>
  readAtByConversation: Record<string, string>
}

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

function toUser(row: ProfileRow): User {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio ?? undefined,
    lastSeenAt: row.last_seen_at,
    online: row.last_seen_at ? Date.now() - Date.parse(row.last_seen_at) < 90_000 : false,
  }
}

function otherUserId(row: ContactRow, currentUserId: string) {
  return row.requester_id === currentUserId ? row.addressee_id : row.requester_id
}

function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    type: row.type,
    content: row.content,
    mediaUrl: row.media_url,
    metadata: row.media_metadata,
    isIntro: row.is_intro,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function fetchAppSnapshot(currentUserId: string): Promise<SupabaseSnapshot> {
  const client = requireSupabase()
  const [
    { data: contactRows, error: contactError },
    { data: conversationRows, error: conversationError },
    { data: readStateRows, error: readStateError },
  ] = await Promise.all([
      client
        .from('contact_requests')
        .select('id, requester_id, addressee_id, status, intro_message, created_at')
        .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`),
      client
        .from('conversations')
        .select('id, participant_one_id, participant_two_id, created_at, updated_at')
        .or(`participant_one_id.eq.${currentUserId},participant_two_id.eq.${currentUserId}`)
        .order('updated_at', { ascending: false }),
      client
        .from('conversation_read_states')
        .select('conversation_id, last_read_at')
        .eq('user_id', currentUserId),
    ])

  if (contactError) throw contactError
  if (conversationError) throw conversationError
  if (readStateError) throw readStateError

  const contacts = (contactRows ?? []) as ContactRow[]
  const acceptedUserIds = new Set(
    contacts
      .filter((contact) => contact.status === 'accepted')
      .map((contact) => otherUserId(contact, currentUserId)),
  )
  const conversations = ((conversationRows ?? []) as ConversationRow[]).filter((conversation) => {
    const otherParticipant =
      conversation.participant_one_id === currentUserId
        ? conversation.participant_two_id
        : conversation.participant_one_id
    return acceptedUserIds.has(otherParticipant)
  })
  const conversationIds = conversations.map((conversation) => conversation.id)
  const userIds = new Set<string>([currentUserId])

  for (const contact of contacts) {
    userIds.add(contact.requester_id)
    userIds.add(contact.addressee_id)
  }
  for (const conversation of conversations) {
    userIds.add(conversation.participant_one_id)
    userIds.add(conversation.participant_two_id)
  }

  const [{ data: profileRows, error: profileError }, { data: messageRows, error: messageError }] =
    await Promise.all([
      client
        .from('profiles')
        .select('id, username, display_name, bio, last_seen_at')
        .in('id', [...userIds]),
      conversationIds.length
        ? client
            .from('messages')
            .select(
              'id, conversation_id, sender_id, type, content, media_url, media_metadata, is_intro, status, created_at',
            )
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ])

  if (profileError) throw profileError
  if (messageError) throw messageError

  const users = new Map(((profileRows ?? []) as ProfileRow[]).map((row) => [row.id, toUser(row)]))
  const messagesByConversation: Record<string, Message[]> = {}
  for (const row of (messageRows ?? []) as MessageRow[]) {
    const message = toMessage(row)
    messagesByConversation[message.conversationId] ??= []
    messagesByConversation[message.conversationId].push(message)
  }

  const toContact = (row: ContactRow): Contact | null => {
    const user = users.get(otherUserId(row, currentUserId))
    return user
      ? {
          id: row.id,
          user,
          status: row.status,
          direction: row.requester_id === currentUserId ? 'outgoing' : 'incoming',
          introMessage: row.intro_message ?? undefined,
          createdAt: row.created_at,
        }
      : null
  }

  const accepted = contacts.filter((row) => row.status === 'accepted').map(toContact).filter(Boolean) as Contact[]
  const incomingRequests = contacts
    .filter((row) => row.status === 'pending' && row.addressee_id === currentUserId)
    .map(toContact)
    .filter(Boolean) as Contact[]
  const outgoingRequests = contacts
    .filter((row) => row.status === 'pending' && row.requester_id === currentUserId)
    .map(toContact)
    .filter(Boolean) as Contact[]

  const mappedConversations = conversations
    .map((row) => {
      const userId = row.participant_one_id === currentUserId ? row.participant_two_id : row.participant_one_id
      const user = users.get(userId)
      if (!user) return null
      const messages = messagesByConversation[row.id] ?? []
      return {
        id: row.id,
        user,
        lastMessage: messages.at(-1),
        unreadCount: 0,
        updatedAt: row.updated_at,
      }
    })
    .filter(Boolean) as Conversation[]
  const readAtByConversation = Object.fromEntries(
    ((readStateRows ?? []) as ReadStateRow[]).map((row) => [row.conversation_id, row.last_read_at]),
  )

  return {
    contacts: accepted,
    incomingRequests,
    outgoingRequests,
    conversations: mappedConversations,
    messages: messagesByConversation,
    readAtByConversation,
  }
}

export async function searchSupabaseUsers(query: string, currentUserId: string): Promise<User[]> {
  const client = requireSupabase()
  const needle = query.trim().toLowerCase().replace(/^@/, '')
  if (!needle) return []

  const { data, error } = await client
    .from('profiles')
    .select('id, username, display_name, bio, last_seen_at')
    .or(`username.ilike.%${needle}%,display_name.ilike.%${needle}%`)
    .neq('id', currentUserId)
    .limit(20)

  if (error) throw error
  return ((data ?? []) as ProfileRow[]).map(toUser)
}
