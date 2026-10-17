import { MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ChatListItem } from '@/components/chat/ChatListItem'
import { NewContactDialog } from '@/components/contacts/NewContactDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'
import { useAppData } from '@/store/AppDataProvider'

export interface ChatListProps {
  activeId?: string
  onSelect: (conversationId: string) => void
}

export function ChatList({ activeId, onSelect }: ChatListProps) {
  const { conversations, currentUser } = useAppData()
  const [query, setQuery] = useState('')

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
      <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
        <Input
          placeholder="Search chats"
          aria-label="Search chats"
          leadingIcon={<Search className="size-4.5" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10"
        />
        <NewContactDialog />
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
          <div className="flex flex-col gap-1">
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
