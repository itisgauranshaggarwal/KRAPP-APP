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
  if (status === 'seen') return <CheckCheck className="size-4 shrink-0 text-primary" aria-hidden />
  if (status === 'delivered') return <CheckCheck className="size-4 shrink-0 text-faint" aria-hidden />
  if (status === 'sent') return <Check className="size-4 shrink-0 text-faint" aria-hidden />
  return <Check className="size-4 shrink-0 text-faint/70" aria-hidden />
}

/**
 * Information-dense list row: name / time on top, preview + unread below,
 * hairline separator between rows, accent tint for the active chat.
 */
export function ChatListItem({
  conversation,
  active,
  currentUserId,
  onClick,
}: ChatListItemProps) {
  const { user, lastMessage, unreadCount } = conversation
  const mine = lastMessage?.senderId === currentUserId
  const unread = unreadCount > 0

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'group flex w-full items-center gap-3 border-b border-line px-4 py-2.5 text-left',
        'transition-colors duration-100',
        active ? 'bg-primary-soft' : 'hover:bg-surface-2 active:bg-surface-3',
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
          <span
            className={cn(
              'truncate text-[15px] leading-5 text-text',
              unread ? 'font-semibold' : 'font-medium',
            )}
          >
            {user.displayName}
          </span>
          <span
            className={cn(
              'shrink-0 text-[11px] tabular-nums',
              unread ? 'font-semibold text-primary' : 'text-faint',
            )}
          >
            {lastMessage ? formatListTime(lastMessage.createdAt) : ''}
          </span>
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span
            className={cn(
              'flex min-w-0 items-center gap-1 text-[13.5px] leading-5',
              unread ? 'font-medium text-text' : 'text-muted',
            )}
          >
            {mine ? <PreviewTicks status={lastMessage?.status ?? 'sent'} /> : null}
            <span className="truncate">{lastMessage?.content ?? 'Say hi to start chatting'}</span>
          </span>
          {unread ? (
            <CountBadge count={unreadCount} className="shrink-0" />
          ) : null}
        </div>
      </div>
    </button>
  )
}
