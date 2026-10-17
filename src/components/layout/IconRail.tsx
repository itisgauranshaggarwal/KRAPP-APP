import { NavLink } from 'react-router-dom'

import { navItems } from '@/components/layout/nav'
import { AppLogo } from '@/components/shared/AppLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { useAppData } from '@/store/AppDataProvider'

/** Desktop-only vertical navigation rail. */
export function IconRail({ className }: { className?: string }) {
  const { currentUser, incomingRequests } = useAppData()

  const badgeCount = (key?: string) => (key === 'requests' ? incomingRequests.length : 0)
  // Profile lives at the bottom of the rail next to the theme toggle.
  const railItems = navItems.filter((item) => item.to !== '/profile')

  return (
    <nav
      className={cn(
        'relative flex w-[84px] shrink-0 flex-col items-center gap-2 border-r border-line bg-surface py-4',
        className,
      )}
      aria-label="Main"
    >
      <AppLogo size="md" />

      <div className="mt-4 flex flex-1 flex-col items-center gap-2.5">
        {railItems.map(({ to, label, description, icon: Icon, badge }) => {
          const count = badgeCount(badge)
          return (
            <NavLink key={to} to={to} className="group relative" aria-label={label}>
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden
                    className={cn(
                      'absolute top-1/2 -left-3 h-6 w-1 -translate-y-1/2 rounded-full transition-all duration-200',
                      isActive ? 'brand-gradient opacity-100' : 'opacity-0',
                    )}
                  />
                  <span
                    className={cn(
                      'relative inline-flex size-12 items-center justify-center rounded-2xl transition-all duration-200',
                      isActive
                        ? 'brand-gradient glow-brand text-primary-contrast'
                        : 'text-muted group-hover:bg-surface-2 group-hover:text-text group-active:scale-95',
                    )}
                  >
                    <Icon className="size-[22px]" />
                    {count > 0 ? (
                      <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-white ring-2 ring-[var(--bg)]">
                        {count > 99 ? '99+' : count}
                      </span>
                    ) : null}
                  </span>

                  <Tooltip label={label} description={description} />
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      <ThemeToggle />

      <NavLink to="/profile" className="group relative" aria-label="Profile">
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'inline-flex rounded-full p-0.5 transition-all duration-200',
                isActive ? 'brand-gradient' : 'group-hover:scale-105 group-active:scale-95',
              )}
            >
              <Avatar
                name={currentUser.displayName}
                username={currentUser.username}
                src={currentUser.avatarUrl}
                size="md"
                className="ring-2 ring-[var(--bg)]"
              />
            </span>
            <Tooltip label="Profile" description="Your account" />
          </>
        )}
      </NavLink>
    </nav>
  )
}

function Tooltip({ label, description }: { label: string; description: string }) {
  return (
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute top-1/2 left-full z-30 ml-3 -translate-x-1 -translate-y-1/2',
        'flex flex-col whitespace-nowrap rounded-xl bg-surface-2 px-3 py-2 text-left',
        'opacity-0 shadow-[0_10px_28px_-12px_var(--shadow-dark)] ring-1 ring-[var(--border)]',
        'transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100',
      )}
    >
      <span className="text-sm font-semibold text-text">{label}</span>
      <span className="text-xs text-muted">{description}</span>
    </span>
  )
}
