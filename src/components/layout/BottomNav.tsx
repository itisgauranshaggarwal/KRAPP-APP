import { NavLink } from 'react-router-dom'

import { navItems } from '@/components/layout/nav'
import { cn } from '@/lib/utils'
import { useAppData } from '@/store/AppDataProvider'

/** Mobile-only bottom navigation bar. */
export function BottomNav({ className }: { className?: string }) {
  const { incomingRequests } = useAppData()

  return (
    <nav
      className={cn(
        'relative flex items-stretch justify-around border-t border-line bg-surface px-2 pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      aria-label="Main"
    >
      {navItems.map(({ to, label, icon: Icon, badge }) => {
        const count = badge === 'requests' ? incomingRequests.length : 0
        return (
          <NavLink
            key={to}
            to={to}
            className="relative flex flex-1 flex-col items-center gap-1 px-2 pt-2.5 pb-2 text-[11px] font-medium"
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-0 h-1 w-9 rounded-b-full transition-all duration-200',
                    isActive ? 'brand-gradient opacity-100' : 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'relative inline-flex size-10 items-center justify-center rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-muted active:scale-90 active:bg-surface-2',
                  )}
                >
                  <Icon className={cn('transition-transform duration-200', isActive && 'scale-105')} />
                  {count > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white ring-2 ring-[var(--bg)]">
                      {count > 99 ? '99+' : count}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'font-semibold text-primary' : 'text-muted',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
