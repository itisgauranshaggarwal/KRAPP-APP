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
    <div className={cn('flex w-full', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'relative max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-[2px_2px_6px_var(--shadow-dark)] sm:max-w-[65%]',
          mine
            ? 'rounded-br-md bg-bubble-out text-bubble-out-text'
            : 'rounded-bl-md bg-bubble-in text-text',
        )}
      >
        {message.isIntro ? (
          <p
            className={cn(
              'mb-1 flex items-center gap-1 text-[11px] font-medium',
              mine ? 'text-white/80' : 'text-primary',
            )}
          >
            Invite message
          </p>
        ) : null}

        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        <div
          className={cn(
            'mt-1 flex items-center justify-end gap-1 text-[11px]',
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
