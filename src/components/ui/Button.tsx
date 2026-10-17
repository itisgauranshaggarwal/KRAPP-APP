import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'primary' | 'neu' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-contrast hover:bg-primary-hover shadow-[3px_3px_8px_var(--shadow-dark),-2px_-2px_6px_var(--shadow-light)] active:translate-y-px',
  neu: 'neu-press text-text hover:text-primary',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-surface-2',
  danger:
    'bg-danger text-white hover:brightness-110 shadow-[3px_3px_8px_var(--shadow-dark),-2px_-2px_6px_var(--shadow-light)] active:translate-y-px',
  outline: 'bg-transparent text-text border border-line-strong hover:bg-surface-2',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-2xl',
  icon: 'h-11 w-11 rounded-xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'neu', size = 'md', loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium',
        'transition-[box-shadow,background-color,color,transform] duration-150',
        'disabled:pointer-events-none disabled:opacity-55',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  )
})
