import { UserRound } from 'lucide-react'
import { useState } from 'react'

import { cn, initials as toInitials } from '@/lib/utils'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Fallback = 'icon' | 'initials'

const sizes: Record<Size, string> = {
  xs: 'size-7 text-[10px]',
  sm: 'size-9 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-14 text-base',
  xl: 'size-24 text-2xl',
}

const iconSizes: Record<Size, string> = {
  xs: 'size-3.5',
  sm: 'size-4.5',
  md: 'size-5.5',
  lg: 'size-7',
  xl: 'size-12',
}

export interface AvatarProps {
  name: string
  username?: string
  src?: string | null
  size?: Size
  /** `icon` = WhatsApp-style silhouette (default), `initials` = colored letters. */
  fallback?: Fallback
  online?: boolean
  className?: string
}

export function Avatar({
  name,
  username,
  src,
  size = 'md',
  fallback = 'icon',
  online = false,
  className,
}: AvatarProps) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(src) && !broken

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'neu-inset-sm inline-flex items-center justify-center overflow-hidden rounded-full',
          'font-semibold text-muted',
          sizes[size],
        )}
      >
        {showImage ? (
          <img
            src={src ?? undefined}
            alt={name}
            className="size-full object-cover"
            loading="lazy"
            onError={() => setBroken(true)}
          />
        ) : fallback === 'initials' ? (
          <span aria-hidden>{toInitials(username || name)}</span>
        ) : (
          <UserRound className={cn('text-faint', iconSizes[size])} aria-hidden />
        )}
      </span>

      {online ? (
        <span
          className={cn(
            'absolute right-0 bottom-0 rounded-full bg-online ring-2',
            'ring-[var(--bg)]',
            size === 'lg' || size === 'xl' ? 'size-3.5' : 'size-2.5',
          )}
          title="online"
        >
          <span className="sr-only">Online</span>
        </span>
      ) : null}
    </span>
  )
}
