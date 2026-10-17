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
          className="mb-2 block text-xs font-semibold tracking-wide text-muted uppercase"
        >
          {label}
        </label>
      ) : null}

      <div
        className={cn(
          'neu-inset flex items-center gap-2 rounded-xl px-3.5',
          'transition-[box-shadow,outline-color] duration-150',
          'focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[var(--ring)]',
          error && 'outline-2 outline-offset-1 outline-[var(--danger)]',
        )}
      >
        {leadingIcon ? <span className="text-faint">{leadingIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full min-w-0 bg-transparent text-sm text-text placeholder:text-faint',
            'outline-none focus-visible:outline-none',
            className,
          )}
          {...props}
        />
        {trailingSlot}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
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
