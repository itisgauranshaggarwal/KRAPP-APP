import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex animate-fade flex-col items-center justify-center gap-4 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="brand-gradient-soft hairline relative flex size-16 items-center justify-center rounded-2xl">
        <Icon className="size-7 text-primary" aria-hidden />
      </span>
      <div>
        <p className="font-semibold tracking-[-0.01em] text-text">{title}</p>
        {description ? (
          <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
