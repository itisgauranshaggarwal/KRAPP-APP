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
        'relative flex w-[76px] shrink-0 flex-col items-center gap-1 border-r border-line bg-surface py-4',
        className,
      )}
      aria-label="Main"
    >
      <AppLogo size="md" />

      <div className="mt-5 flex flex-1 flex-col items-center gap-1.5">
        {railItems.map(({ to, label, description, icon: Icon, badge }) => {
          const count = badgeCount(badge)
          return (
            <NavLink key={to} to={to} className="group relative" aria-label={label}>
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'relative inline-flex size-10 items-center justify-center rounded-lg transition-colors duration-150',
                      isActive
                        ? 'bg-primary-soft text-primary'
                        : 'text-muted group-hover:bg-surface-3 group-hover:text-text',
                    )}
                  >
                    <Icon className="size-5" />
                    {count > 0 ? (
                      <span className="absolute -top-1 -right-1 inline-flex min-w-[18px] items-center justify-center rounded-md bg-primary px-1 text-[10px] leading-4 font-semibold text-primary-contrast ring-2 ring-[var(--surface)]">
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

      <NavLink to="/profile" className="group relative mt-1" aria-label="Profile">
        {({ isActive }) => (
          <>
            <span
              className={cn(
                'inline-flex rounded-full p-0.5 transition-colors duration-150',
                isActive ? 'bg-primary-soft' : 'group-hover:bg-surface-3',
              )}
            >
              <Avatar
                name={currentUser.displayName}
                username={currentUser.username}
                src={currentUser.avatarUrl}
                size="sm"
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
        'pointer-events-none absolute top-1/2 left-full z-30 ml-3 -translate-y-1/2',
        'flex flex-col whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-left',
        'opacity-0 shadow-[var(--shadow-pop)]',
        'transition-opacity duration-150 group-hover:opacity-100',
      )}
    >
      <span className="text-[13px] font-semibold text-text">{label}</span>
      <span className="text-xs text-muted">{description}</span>
    </span>
  )
}
