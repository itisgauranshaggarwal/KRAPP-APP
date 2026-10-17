import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'primary' | 'neu' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary:
    'brand-gradient text-primary-contrast glow-brand hover:brightness-[1.07] active:translate-y-px active:brightness-95',
  neu: 'neu-press text-text hover:text-primary',
  ghost: 'bg-transparent text-muted hover:text-text hover:bg-surface-2',
  danger:
    'bg-danger text-white hover:brightness-110 active:translate-y-px shadow-[0_8px_18px_-10px_var(--danger)]',
  outline: 'bg-transparent text-text border border-line-strong hover:bg-surface-2',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-[15px] gap-2.5 rounded-xl',
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
        'inline-flex select-none items-center justify-center font-medium tracking-[-0.01em]',
        'transition-[box-shadow,background-color,color,transform,filter] duration-150',
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
