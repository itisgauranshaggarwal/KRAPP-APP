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
        'flex animate-fade flex-col items-center justify-center gap-3 px-6 py-14 text-center',
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-lg bg-surface-3 text-muted">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-sm font-semibold text-text">{title}</p>
        {description ? (
          <p className="mx-auto mt-1 max-w-64 text-[13px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
