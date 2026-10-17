import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'ghost' | 'primary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  ghost: 'bg-transparent text-muted hover:bg-surface-3 hover:text-text',
  primary: 'bg-primary text-primary-contrast hover:bg-primary-hover active:bg-primary-active',
  danger: 'bg-danger text-white hover:bg-danger-hover',
}

const sizes: Record<Size, string> = {
  sm: 'size-8 rounded-md',
  md: 'size-9 rounded-md',
  lg: 'size-11 rounded-lg',
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Required for accessibility when the button has no visible text. */
  label: string
  loading?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant = 'ghost', size = 'md', label, loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        'transition-colors duration-100',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        children
      )}
    </button>
  )
})
