import { Info, MoreVertical, Phone, Search, Video } from 'lucide-react'
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

  useEffect(() => {
    onOpen?.()
  }, [conversation.id, onOpen])

  return (
    <div className="flex h-full min-w-0 flex-col bg-bg">
      <PageHeader
        back
        title={user.displayName}
        subtitle={formatPresence(user)}
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
  )
}

/** Right-hand welcome panel shown on desktop when no chat is selected. */
export function ChatViewPlaceholder() {
  const { currentUser } = useAppData()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-bg px-8 text-center">
      <Avatar
        name={currentUser.displayName}
        username={currentUser.username}
        src={currentUser.avatarUrl}
        size="xl"
      />
      <div>
        <p className="text-lg font-medium text-text">
          Welcome, {currentUser.displayName.split(' ')[0]}
        </p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Select a chat to start messaging, or add a friend with the new contact button.
        </p>
      </div>
    </div>
  )
}
