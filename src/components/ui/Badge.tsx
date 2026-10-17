import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'primary' | 'danger' | 'warning' | 'success'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-muted',
  primary: 'bg-primary-soft text-primary',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning/15 text-warning',
  success: 'bg-primary-soft text-success',
}

export interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export interface CountBadgeProps {
  count: number
  className?: string
}

/** Unread counter bubble, WhatsApp-style. */
export function CountBadge({ count, className }: CountBadgeProps) {
  if (count <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5',
        'text-[11px] font-semibold text-primary-contrast',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
