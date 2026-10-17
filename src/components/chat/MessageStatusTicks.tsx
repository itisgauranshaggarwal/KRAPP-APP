import { Check, CheckCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { MessageStatus } from '@/types'

/**
 * Delivery ticks on outgoing messages. They sit on the solid accent bubble,
 * so they are tuned light-on-teal; "seen" shifts to a brighter cyan.
 */
export function MessageStatusTicks({
  status,
  className,
}: {
  status: MessageStatus
  className?: string
}) {
  if (status === 'sending') {
    return (
      <span className={cn('inline-flex text-white/55', className)} title="Sending">
        <Check className="size-3.5" aria-hidden />
      </span>
    )
  }

  if (status === 'sent') {
    return (
      <span className={cn('inline-flex text-white/75', className)} title="Sent">
        <Check className="size-3.5" aria-hidden />
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex text-white/75', className, status === 'seen' && 'text-tick-seen')}
      title={status === 'seen' ? 'Seen' : 'Delivered'}
    >
      <CheckCheck className="size-3.5" aria-hidden />
    </span>
  )
}
