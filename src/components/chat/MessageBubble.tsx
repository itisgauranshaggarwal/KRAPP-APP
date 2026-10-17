import { cn } from '@/lib/utils'
import { formatClock } from '@/lib/format'
import type { Message } from '@/types'

import { MessageStatusTicks } from '@/components/chat/MessageStatusTicks'

export interface MessageBubbleProps {
  message: Message
  mine: boolean
  /** Whether the delivery ticks should be shown (only for outgoing text). */
  showTicks?: boolean
}

export function MessageBubble({ message, mine, showTicks = true }: MessageBubbleProps) {
  return (
    <div className={cn('flex w-full animate-rise', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'relative max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed sm:max-w-[68%]',
          mine
            ? 'rounded-br-md brand-gradient text-bubble-out-text shadow-[0_8px_20px_-10px_var(--primary)]'
            : 'rounded-bl-md bg-bubble-in text-bubble-in-text ring-1 ring-[var(--border)]',
        )}
      >
        {message.isIntro ? (
          <p
            className={cn(
              'mb-1 flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase',
              mine ? 'text-white/85' : 'text-primary',
            )}
          >
            Invite message
          </p>
        ) : null}

        <p className="break-words whitespace-pre-wrap">{message.content}</p>

        <div
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-[11px] tabular-nums',
            mine ? 'text-white/75' : 'text-faint',
          )}
        >
          <span>{formatClock(message.createdAt)}</span>
          {mine && showTicks ? <MessageStatusTicks status={message.status} /> : null}
        </div>
      </div>
    </div>
  )
}
