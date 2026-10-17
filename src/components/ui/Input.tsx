import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leadingIcon?: ReactNode
  trailingSlot?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, leadingIcon, trailingSlot, id, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-medium text-text"
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-surface px-3',
          'transition-colors duration-100',
          error
            ? 'border-danger focus-within:ring-2 focus-within:ring-danger-soft'
            : 'border-line-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-soft',
        )}
      >
        {leadingIcon ? <span className="shrink-0 text-faint">{leadingIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-10 w-full min-w-0 bg-transparent text-sm text-text placeholder:text-faint',
            'outline-none focus-visible:ring-2 focus-visible:ring-primary-soft',
            className,
          )}
          {...props}
        />
        {trailingSlot}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
