import { cn } from '@/lib/utils'

export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  withWordmark?: boolean
  className?: string
}

const marks = {
  sm: 'size-9 rounded-xl text-lg',
  md: 'size-11 rounded-2xl text-xl',
  lg: 'size-16 rounded-[1.35rem] text-3xl',
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
          'brand-gradient glow-brand relative inline-flex items-center justify-center font-bold text-white',
          'after:absolute after:inset-0 after:rounded-[inherit] after:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.28),transparent)]',
          marks[size],
        )}
        aria-hidden
      >
        <span className="relative drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">K</span>
      </span>
      {withWordmark ? (
        <span
          className={cn('font-bold tracking-tight text-text', words[size])}
        >
          KRAPP
        </span>
      ) : null}
      <span className="sr-only">KRAPP</span>
    </span>
  )
}
