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
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="neu-inset flex size-16 items-center justify-center rounded-full">
        <Icon className="size-7 text-faint" aria-hidden />
      </span>
      <div>
        <p className="font-medium text-text">{title}</p>
        {description ? (
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
