import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type Variant = 'neu' | 'ghost' | 'primary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  neu: 'neu-press text-muted hover:text-primary',
  ghost: 'bg-transparent text-muted hover:bg-surface-2 hover:text-text',
  primary:
    'brand-gradient text-primary-contrast glow-brand hover:brightness-[1.07] active:translate-y-px',
  danger: 'bg-danger text-white hover:brightness-110 active:translate-y-px',
}

const sizes: Record<Size, string> = {
  sm: 'size-9 rounded-lg',
  md: 'size-11 rounded-xl',
  lg: 'size-12 rounded-xl',
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Required for accessibility when the button has no visible text. */
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant = 'neu', size = 'md', label, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        'transition-[box-shadow,background-color,color,transform,filter] duration-150',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-55',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
