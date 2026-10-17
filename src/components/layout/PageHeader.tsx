import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  /** Show a back button (mobile push screens). */
  back?: boolean
  onBack?: () => void
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  back = false,
  onBack,
  actions,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'flex items-center gap-3 border-b border-line px-4 py-3',
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

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-text">{title}</h1>
        {subtitle ? <div className="truncate text-xs text-muted">{subtitle}</div> : null}
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}
