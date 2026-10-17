import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { ChatView } from '@/components/chat/ChatView'
import { ChatViewPlaceholder } from '@/components/chat/ChatView'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { MessageCircleOff } from 'lucide-react'
import { useAppData } from '@/store/AppDataProvider'

/** Desktop right-hand placeholder when the /chats index route is active. */
export function ChatsIndexPage() {
  return <ChatViewPlaceholder />
}

export function ChatDetailPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const { conversations, markConversationRead } = useAppData()
  const conversation = conversations.find((item) => item.id === conversationId)

  const handleOpen = useCallback(() => {
    if (conversationId) markConversationRead(conversationId)
  }, [conversationId, markConversationRead])

  if (!conversation) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader back title="Chat" />
        <EmptyState
          icon={MessageCircleOff}
          title="Conversation not found"
          description="It may have been deleted. Head back to your chats."
        />
      </div>
    )
  }

  return <ChatView conversation={conversation} onOpen={handleOpen} />
}
