import { cn } from '@/lib/utils'

export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  withWordmark?: boolean
  className?: string
}

const marks = {
  sm: 'size-8 rounded-lg text-base',
  md: 'size-9 rounded-lg text-lg',
  lg: 'size-14 rounded-xl text-3xl',
} as const

const words = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
} as const

/** Solid accent square with a white K. Flat — no gradients, no glow. */
export function AppLogo({ size = 'md', withWordmark = false, className }: AppLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg bg-primary font-bold text-primary-contrast',
          marks[size],
        )}
        aria-hidden
      >
        <span className="translate-y-px">K</span>
      </span>
      {withWordmark ? (
        <span className={cn('font-semibold tracking-[-0.02em] text-text', words[size])}>
          KRAPP
        </span>
      ) : null}
      <span className="sr-only">KRAPP</span>
    </span>
  )
}
