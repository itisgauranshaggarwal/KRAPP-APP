import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  /** Optional node rendered before the title (e.g. an avatar). */
  leading?: ReactNode
  /** Show a back button (mobile push screens). */
  back?: boolean
  onBack?: () => void
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  leading,
  back = false,
  onBack,
  actions,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex items-center gap-2.5 border-b border-line bg-surface px-3 py-2.5',
        'sm:px-4',
        className,
      )}
    >
      {back ? (
        <IconButton
          label="Go back"
          size="sm"
          variant="ghost"
          onClick={() => (onBack ? onBack() : navigate(-1))}
        >
          <ArrowLeft className="size-5" />
        </IconButton>
      ) : null}

      {leading ? <div className="shrink-0">{leading}</div> : null}

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] leading-6 font-semibold tracking-[-0.01em] text-text">
          {title}
        </h1>
        {subtitle ? (
          <div className="truncate text-[13px] text-muted">{subtitle}</div>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </header>
  )
}
