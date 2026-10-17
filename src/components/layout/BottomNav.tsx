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
                    'absolute top-0 h-0.5 w-7 rounded-b-full transition-colors duration-150',
                    isActive ? 'bg-primary' : 'bg-transparent',
                  )}
                />
                <span
                  className={cn(
                    'relative inline-flex size-9 items-center justify-center rounded-lg transition-colors duration-150',
                    isActive
                      ? 'bg-primary-soft text-primary'
                      : 'text-muted active:bg-surface-3',
                  )}
                >
                  <Icon className="size-5" />
                  {count > 0 ? (
                    <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] items-center justify-center rounded-md bg-primary px-1 text-[10px] leading-4 font-semibold text-primary-contrast ring-2 ring-[var(--surface)]">
                      {count > 99 ? '99+' : count}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    'transition-colors duration-150',
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
