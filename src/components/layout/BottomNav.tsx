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
        'flex items-stretch justify-around border-t border-line bg-surface px-2 pb-[env(safe-area-inset-bottom)]',
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
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-medium',
                'transition-colors duration-150',
                isActive ? 'text-primary' : 'text-muted',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'relative inline-flex size-10 items-center justify-center rounded-xl',
                    isActive && 'neu-inset',
                  )}
                >
                  <Icon className="size-5" />
                  {count > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-contrast">
                      {count > 99 ? '99+' : count}
                    </span>
                  ) : null}
                </span>
                {label}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
