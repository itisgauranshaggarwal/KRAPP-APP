import { MessageCircle, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ChatListItem } from '@/components/chat/ChatListItem'
import { NewContactDialog } from '@/components/contacts/NewContactDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { useAppData } from '@/store/AppDataProvider'

export interface ChatListProps {
  activeId?: string
  onSelect: (conversationId: string) => void
}

export function ChatList({ activeId, onSelect }: ChatListProps) {
  const { conversations, currentUser } = useAppData()
  const [query, setQuery] = useState('')

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, conversation) => sum + conversation.unreadCount, 0),
    [conversations],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return conversations
    return conversations.filter(
      (conversation) =>
        conversation.user.displayName.toLowerCase().includes(needle) ||
        conversation.user.username.toLowerCase().includes(needle),
    )
  }, [conversations, query])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-[-0.02em] text-text">Chats</h1>
          <p className="mt-0.5 text-xs text-muted">
            {unreadTotal > 0
              ? `${unreadTotal} unread message${unreadTotal > 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        <NewContactDialog />
      </div>

      <div className="px-3 pb-2">
        <Input
          placeholder="Search chats"
          aria-label="Search chats"
          leadingIcon={<Search className="size-4.5" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 scroll-soft">
        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title={query ? 'No chats found' : 'No chats yet'}
            description={
              query
                ? 'Try a different name or username.'
                : 'Add a contact to start your first conversation.'
            }
            action={query ? undefined : <NewContactDialog />}
          />
        ) : (
          <div className="flex flex-col gap-0.5">
            {filtered.map((conversation) => (
              <ChatListItem
                key={conversation.id}
                conversation={conversation}
                currentUserId={currentUser.id}
                active={conversation.id === activeId}
                onClick={() => onSelect(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
