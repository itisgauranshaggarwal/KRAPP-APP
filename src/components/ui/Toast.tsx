import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'

import { IconButton } from '@/components/ui/IconButton'
import { dismissToast, useToasts, type ToastTone } from '@/lib/toast'
import { cn } from '@/lib/utils'

const toneStyles: Record<ToastTone, { icon: typeof Info; colour: string }> = {
  default: { icon: Info, colour: 'text-muted' },
  success: { icon: CircleCheck, colour: 'text-success' },
  danger: { icon: CircleAlert, colour: 'text-danger' },
}

/**
 * Toast viewport. Mounted once at the app root; toasts are pushed with
 * `pushToast(...)` from anywhere.
 */
export function ToastViewport() {
  const toasts = useToasts()

  return (
    <ol
      aria-live="polite"
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed inset-x-3 z-[60] flex flex-col gap-2',
        // Sit above the mobile bottom nav; plain corner offset on desktop.
        'bottom-[calc(4.25rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80',
        toasts.length === 0 && 'hidden',
      )}
    >
      {toasts.map((toast) => {
        const { icon: Icon, colour } = toneStyles[toast.tone]
        return (
          <li
            key={toast.id}
            role={toast.tone === 'danger' ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto flex animate-rise items-start gap-2.5 rounded-lg border border-line',
              'bg-surface px-3.5 py-3 shadow-[var(--shadow-pop)]',
            )}
          >
            <Icon className={cn('mt-0.5 size-4 shrink-0', colour)} aria-hidden />

            <div className="min-w-0 flex-1">
              <p className="text-sm leading-5 font-medium text-text">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{toast.description}</p>
              ) : null}
            </div>

            <IconButton
              label="Dismiss notification"
              size="sm"
              variant="ghost"
              className="-mt-0.5 -mr-1.5 size-7"
              onClick={() => dismissToast(toast.id)}
            >
              <X className="size-3.5" />
            </IconButton>
          </li>
        )
      })}
    </ol>
  )
}
