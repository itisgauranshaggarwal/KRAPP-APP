import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/utils'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const maxWidths = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
} as const

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape + lock scroll while open.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus into the dialog.
    const timeout = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input, textarea, button, [href], [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    }, 20)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      window.clearTimeout(timeout)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'neu-raised relative z-10 w-full rounded-t-3xl p-5 sm:rounded-3xl',
          maxWidths[size],
          'max-h-[90vh] overflow-y-auto scroll-soft',
          className,
        )}
      >
        {(title || description) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              {title ? <h2 className="text-lg font-semibold text-text">{title}</h2> : null}
              {description ? (
                <p className="mt-1 text-sm text-muted">{description}</p>
              ) : null}
            </div>
            <IconButton label="Close" size="sm" variant="ghost" onClick={onClose}>
              <X className="size-4.5" />
            </IconButton>
          </div>
        )}

        {children}

        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
