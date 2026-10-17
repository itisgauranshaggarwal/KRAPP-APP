import { Check, CheckCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { MessageStatus } from '@/types'

/**
 * Delivery ticks (only shown on your own messages, which sit on the brand
 * gradient — so they are tuned for a light-on-violet contrast).
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
      <span className={cn('inline-flex text-white/60', className)} title="Sending">
        <Check className="size-3.5" aria-hidden />
      </span>
    )
  }

  if (status === 'sent') {
    return (
      <span className={cn('inline-flex text-white/80', className)} title="Sent">
        <Check className="size-3.5" aria-hidden />
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex text-white/80', className, status === 'seen' && 'text-[#a9e7ff]')}
      title={status === 'seen' ? 'Seen' : 'Delivered'}
    >
      <CheckCheck className="size-3.5" aria-hidden />
    </span>
  )
}
