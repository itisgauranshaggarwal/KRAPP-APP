import { Info, MessageCircle, MoreVertical, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'

import { MessageInput } from '@/components/chat/MessageInput'
import { MessageList } from '@/components/chat/MessageList'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { pushToast } from '@/lib/toast'
import { formatPresence } from '@/lib/format'
import { isSupabaseMode, supabase } from '@/lib/supabase'
import { useAppData } from '@/store/AppDataProvider'
import type { Conversation } from '@/types'

export interface ChatViewProps {
  conversation: Conversation
  /** Called once when the chat is opened (used to mark it read). */
  onOpen?: () => void
}

export function ChatView({ conversation, onOpen }: ChatViewProps) {
  const { currentUser, messages, sendMessage, deleteConversation } = useAppData()
  const navigate = useNavigate()
  const thread = messages[conversation.id] ?? []
  const lastMessageId = thread.at(-1)?.id
  const { user } = conversation
  const [otherTyping, setOtherTyping] = useState(false)
  const [otherOnline, setOtherOnline] = useState(Boolean(user.online))
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [infoOpen, setInfoOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const searchMatches = searchQuery.trim()
    ? thread.filter((message) => message.content.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : []
  const visibleThread = searchOpen && searchQuery.trim() ? searchMatches : thread

  useEffect(() => {
    if (!isSupabaseMode || !supabase) return

    const client = supabase
    const channel = client
      .channel(`krapp-chat:${conversation.id}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.userId !== currentUser.id) setOtherTyping(Boolean(payload?.typing))
      })
      .on('presence', { event: 'sync' }, () => {
        const states = channel.presenceState()
        const online = Object.values(states).some((presences) =>
          (presences as Array<{ userId?: string }>).some((presence) => presence.userId === user.id),
        )
        setOtherOnline(online)
      })

    channelRef.current = channel
    setOtherTyping(false)
    void channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ userId: currentUser.id })
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        pushToast({
          title: 'Realtime connection interrupted',
          description: 'New messages will appear after the connection recovers.',
          tone: 'danger',
        })
      }
    })

    return () => {
      channelRef.current = null
      setOtherTyping(false)
      void client.removeChannel(channel)
    }
  }, [conversation.id, currentUser.id, user.id])

  const handleTypingChange = useCallback((typing: boolean) => {
    const channel = channelRef.current
    if (!channel) return
    void channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUser.id, typing },
    })
  }, [currentUser.id])

  const isOnline = otherOnline

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteConversation(conversation.id)
      setDeleteOpen(false)
      navigate('/chats')
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    onOpen?.()
  }, [conversation.id, lastMessageId, onOpen])

  return (
    <div className="flex h-full min-w-0 flex-col bg-bg">
      <PageHeader
        back
        leading={
          <Avatar
            name={user.displayName}
            username={user.username}
            src={user.avatarUrl}
            size="md"
            online={isOnline}
          />
        }
        title={user.displayName}
        subtitle={
          <span className={isOnline ? 'font-medium text-online' : undefined}>
            {formatPresence({ ...user, online: isOnline })}
          </span>
        }
        actions={
          <>
            <IconButton
              label="Search in chat"
              size="sm"
              variant="ghost"
              onClick={() => {
                setSearchOpen((open) => !open)
                setMoreOpen(false)
              }}
            >
              <Search className="size-5" />
            </IconButton>
            <IconButton label="Chat info" size="sm" variant="ghost" onClick={() => setInfoOpen(true)}>
              <Info className="size-5" />
            </IconButton>
            <IconButton label="More options" size="sm" variant="ghost" onClick={() => setMoreOpen(true)}>
              <MoreVertical className="size-5" />
            </IconButton>
          </>
        }
      />

      {searchOpen ? (
        <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2 sm:px-6">
          <Input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search messages"
            aria-label="Search messages"
            leadingIcon={<Search className="size-4" />}
            className="h-9"
          />
          {searchQuery.trim() ? (
            <span className="shrink-0 text-xs text-muted">
              {searchMatches.length} result{searchMatches.length === 1 ? '' : 's'}
            </span>
          ) : null}
          <IconButton
            label="Close message search"
            size="sm"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          >
            <X className="size-4" />
          </IconButton>
        </div>
      ) : null}

      <MessageList
        messages={visibleThread}
        currentUserId={currentUser.id}
        otherTyping={otherTyping}
      />

      <MessageInput
        onSend={(text) => {
          void sendMessage(conversation.id, text).catch(() => {
            pushToast({
              title: 'Message not sent',
              description: 'Check your connection and try again.',
              tone: 'danger',
            })
          })
        }}
        onTypingChange={handleTypingChange}
      />

      <Modal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Chat info"
        description="Your private 1:1 connection."
      >
        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-2 p-3">
          <Avatar name={user.displayName} username={user.username} src={user.avatarUrl} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-medium text-text">{user.displayName}</p>
            <p className="truncate text-sm text-muted">@{user.username}</p>
            <p className="mt-1 text-xs text-faint">{isOnline ? 'Online now' : 'Offline'}</p>
          </div>
        </div>
        {user.bio ? <p className="mt-4 text-sm leading-relaxed text-muted">{user.bio}</p> : null}
      </Modal>

      <Modal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="Conversation options"
        description="Manage this conversation."
      >
        <Button
          variant="danger"
          className="w-full"
          onClick={() => {
            setMoreOpen(false)
            setDeleteOpen(true)
          }}
        >
          Delete conversation
        </Button>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => {
          if (!deleting) setDeleteOpen(false)
        }}
        title="Delete conversation?"
        description="This removes the conversation and its messages. This can't be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  )
}

/** Right-hand welcome panel shown on desktop when no chat is selected. */
export function ChatViewPlaceholder() {
  const { currentUser } = useAppData()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-bg px-8 text-center">
      <div className="flex animate-rise flex-col items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <MessageCircle className="size-7" />
        </span>
        <div>
          <p className="text-base font-semibold tracking-[-0.01em] text-text">
            Welcome back, {currentUser.displayName.split(' ')[0]}
          </p>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
            Pick a conversation on the left, or start a new one with the new contact button.
          </p>
        </div>
      </div>
    </div>
  )
}
