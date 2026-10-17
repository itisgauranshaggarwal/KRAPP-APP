import { Info, MessageCircle, MoreVertical, Phone, Search, Video } from 'lucide-react'
import { useEffect } from 'react'

import { MessageInput } from '@/components/chat/MessageInput'
import { MessageList } from '@/components/chat/MessageList'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { formatPresence } from '@/lib/format'
import { useAppData } from '@/store/AppDataProvider'
import type { Conversation } from '@/types'

export interface ChatViewProps {
  conversation: Conversation
  /** Called once when the chat is opened (used to mark it read). */
  onOpen?: () => void
}

export function ChatView({ conversation, onOpen }: ChatViewProps) {
  const { currentUser, messages, sendMessage } = useAppData()
  const thread = messages[conversation.id] ?? []
  const { user } = conversation
  const isOnline = Boolean(user.online)

  useEffect(() => {
    onOpen?.()
  }, [conversation.id, onOpen])

  return (
    <div className="relative flex h-full min-w-0 flex-col">
      <div aria-hidden className="app-texture pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <PageHeader
          back
          leading={
            <Avatar
              name={user.displayName}
              username={user.username}
              src={user.avatarUrl}
              size="md"
              online={user.online}
            />
          }
          title={user.displayName}
          subtitle={
            <span className={isOnline ? 'font-medium text-online' : undefined}>
              {formatPresence(user)}
            </span>
          }
          actions={
            <>
              <IconButton
                label="Search in chat"
                size="sm"
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                <Search className="size-5" />
              </IconButton>
              <IconButton
                label="Voice call"
                size="sm"
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                <Phone className="size-5" />
              </IconButton>
              <IconButton
                label="Video call"
                size="sm"
                variant="ghost"
                className="hidden sm:inline-flex"
              >
                <Video className="size-5" />
              </IconButton>
              <IconButton label="Chat info" size="sm" variant="ghost">
                <Info className="size-5" />
              </IconButton>
              <IconButton label="More options" size="sm" variant="ghost">
                <MoreVertical className="size-5" />
              </IconButton>
            </>
          }
        />

        <MessageList messages={thread} currentUserId={currentUser.id} />

        <MessageInput onSend={(text) => sendMessage(conversation.id, text)} />
      </div>
    </div>
  )
}

/** Right-hand welcome panel shown on desktop when no chat is selected. */
export function ChatViewPlaceholder() {
  const { currentUser } = useAppData()

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <div aria-hidden className="app-texture pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative flex animate-rise flex-col items-center gap-4">
        <span className="brand-gradient glow-brand flex size-20 items-center justify-center rounded-[1.6rem]">
          <MessageCircle className="size-9 text-white" />
        </span>
        <div>
          <p className="text-lg font-semibold tracking-[-0.01em] text-text">
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
