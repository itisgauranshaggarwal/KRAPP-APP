import { Check, CheckCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { MessageStatus } from '@/types'

/** WhatsApp-style delivery ticks (only shown on your own messages). */
export function MessageStatusTicks({
  status,
  className,
}: {
  status: MessageStatus
  className?: string
}) {
  if (status === 'sending') {
    return (
      <span className={cn('inline-flex', className)} title="Sending">
        <Check className="size-3.5 opacity-60" aria-hidden />
      </span>
    )
  }

  if (status === 'sent') {
    return (
      <span className={cn('inline-flex', className)} title="Sent">
        <Check className="size-3.5" aria-hidden />
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex', className, status === 'seen' && 'text-sky-300')}
      title={status === 'seen' ? 'Seen' : 'Delivered'}
    >
      <CheckCheck className="size-3.5" aria-hidden />
    </span>
  )
}
