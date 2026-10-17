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

/**
 * Flat bubbles: outgoing = solid accent with white text, incoming = white with
 * a hairline. Small tail corners (4px) keep them distinct without roundness.
 */
export function MessageBubble({ message, mine, showTicks = true }: MessageBubbleProps) {
  return (
    <div className={cn('flex w-full animate-rise', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'relative max-w-[80%] rounded-xl px-3 py-2 leading-[1.5] shadow-none sm:max-w-[68%]',
          mine
            ? 'rounded-br-[4px] bg-bubble-out text-bubble-out-text'
            : 'rounded-bl-[4px] border border-line bg-bubble-in text-bubble-in-text',
        )}
      >
        {message.isIntro ? (
          <p
            className={cn(
              'mb-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase',
              mine ? 'text-white/75' : 'text-primary',
            )}
          >
            Invite message
          </p>
        ) : null}

        <p className="break-words whitespace-pre-wrap text-sm">{message.content}</p>

        <div
          className={cn(
            'mt-0.5 flex items-center justify-end gap-1 text-[11px] tabular-nums',
            mine ? 'text-white/80' : 'text-faint',
          )}
        >
          <span>{formatClock(message.createdAt)}</span>
          {mine && showTicks ? <MessageStatusTicks status={message.status} /> : null}
        </div>
      </div>
    </div>
  )
}
