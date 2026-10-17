import { Check, CheckCheck } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { CountBadge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { formatListTime } from '@/lib/format'
import type { Conversation, MessageStatus } from '@/types'

export interface ChatListItemProps {
  conversation: Conversation
  active: boolean
  currentUserId: string
  onClick: () => void
}

function PreviewTicks({ status }: { status: MessageStatus }) {
  if (status === 'seen') return <CheckCheck className="size-3.5 text-primary" aria-hidden />
  if (status === 'delivered') return <CheckCheck className="size-3.5" aria-hidden />
  if (status === 'sent') return <Check className="size-3.5" aria-hidden />
  return <Check className="size-3.5 opacity-60" aria-hidden />
}

export function ChatListItem({
  conversation,
  active,
  currentUserId,
  onClick,
}: ChatListItemProps) {
  const { user, lastMessage, unreadCount } = conversation
  const mine = lastMessage?.senderId === currentUserId

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-150',
        active ? 'neu-inset' : 'hover:bg-surface-2',
      )}
    >
      <Avatar
        name={user.displayName}
        username={user.username}
        src={user.avatarUrl}
        online={user.online}
        size="lg"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium text-text">{user.displayName}</span>
          <span className={cn('shrink-0 text-[11px]', unreadCount > 0 ? 'text-primary' : 'text-faint')}>
            {lastMessage ? formatListTime(lastMessage.createdAt) : ''}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1 text-sm text-muted">
            {mine ? <PreviewTicks status={lastMessage?.status ?? 'sent'} /> : null}
            <span className="truncate">{lastMessage?.content ?? 'Say hi 👋'}</span>
          </span>
          <CountBadge count={unreadCount} />
        </div>
      </div>
    </button>
  )
}
