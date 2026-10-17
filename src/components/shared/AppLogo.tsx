import { cn } from '@/lib/utils'

export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  withWordmark?: boolean
  className?: string
}

const marks = {
  sm: 'size-9 rounded-xl text-lg',
  md: 'size-11 rounded-2xl text-xl',
  lg: 'size-16 rounded-3xl text-3xl',
} as const

const words = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
} as const

export function AppLogo({ size = 'md', withWordmark = false, className }: AppLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        className={cn(
          'neu-raised inline-flex items-center justify-center font-bold text-primary',
          marks[size],
        )}
        aria-hidden
      >
        K
      </span>
      {withWordmark ? (
        <span className={cn('font-semibold tracking-tight text-text', words[size])}>
          KRAPP
        </span>
      ) : null}
      <span className="sr-only">KRAPP</span>
    </span>
  )
}
