import { useEffect, useMemo, useRef } from 'react'

import { MessageBubble } from '@/components/chat/MessageBubble'
import { cn } from '@/lib/utils'
import { formatDaySeparator } from '@/lib/format'
import type { Message } from '@/types'

interface DayGroup {
  key: string
  label: string
  messages: Message[]
}

function groupByDay(messages: Message[]): DayGroup[] {
  const groups: DayGroup[] = []
  for (const message of messages) {
    const date = new Date(message.createdAt)
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    const last = groups.at(-1)
    if (last && last.key === key) {
      last.messages.push(message)
    } else {
      groups.push({ key, label: formatDaySeparator(message.createdAt), messages: [message] })
    }
  }
  return groups
}

export interface MessageListProps {
  messages: Message[]
  currentUserId: string
  /** Other participant is typing - shows a typing bubble at the end. */
  otherTyping?: boolean
  className?: string
}

export function MessageList({
  messages,
  currentUserId,
  otherTyping = false,
  className,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const groups = useMemo(() => groupByDay(messages), [messages])
  const lastCount = messages.length

  // Keep the view pinned to the newest message.
  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [lastCount, otherTyping])

  return (
    <div
      ref={scrollRef}
      className={cn('flex-1 overflow-y-auto px-3 py-5 scroll-soft sm:px-8', className)}
    >
      <div className="mx-auto flex max-w-3xl flex-col">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col">
            <div className="my-4 flex justify-center">
              <span className="hairline rounded-full bg-surface-2/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted uppercase backdrop-blur-sm">
                {group.label}
              </span>
            </div>
            {group.messages.map((message, index) => {
              const previous = group.messages[index - 1]
              const dense = Boolean(previous) && previous!.senderId === message.senderId
              return (
                <div key={message.id} className={dense ? 'mt-1' : 'mt-2.5'}>
                  <MessageBubble
                    message={message}
                    mine={message.senderId === currentUserId}
                  />
                </div>
              )
            })}
          </div>
        ))}

        {otherTyping ? (
          <div className="mt-2.5 flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-bubble-in px-3.5 py-3 ring-1 ring-[var(--border)]">
              <Dot delay="0ms" />
              <Dot delay="150ms" />
              <Dot delay="300ms" />
              <span className="sr-only">Typing</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 rounded-full bg-muted"
      style={{ animation: 'typing-bounce 1.1s infinite ease-in-out', animationDelay: delay }}
      aria-hidden
    />
  )
}
