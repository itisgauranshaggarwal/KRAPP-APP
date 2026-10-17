import { NavLink } from 'react-router-dom'

import { navItems } from '@/components/layout/nav'
import { AppLogo } from '@/components/shared/AppLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { useAppData } from '@/store/AppDataProvider'

/** Desktop-only vertical icon navigation rail (WhatsApp Web style). */
export function IconRail({ className }: { className?: string }) {
  const { currentUser, incomingRequests } = useAppData()

  const badgeCount = (key?: string) =>
    key === 'requests' ? incomingRequests.length : 0

  return (
    <nav
      className={cn(
        'flex w-[76px] shrink-0 flex-col items-center gap-3 border-r border-line py-4',
        className,
      )}
      aria-label="Main"
    >
      <AppLogo size="md" />

      <div className="mt-2 flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ to, label, icon: Icon, badge }) => {
          const count = badgeCount(badge)
          return (
            <NavLink
              key={to}
              to={to}
              title={label}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  'relative inline-flex size-12 items-center justify-center rounded-2xl transition-colors duration-150',
                  isActive ? 'neu-inset text-primary' : 'text-muted hover:text-text',
                )
              }
            >
              <Icon className="size-5.5" />
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-contrast">
                  {count > 99 ? '99+' : count}
                </span>
              ) : null}
              <span className="sr-only">{label}</span>
            </NavLink>
          )
        })}
      </div>

      <ThemeToggle />

      <NavLink
        to="/profile"
        title="Profile"
        aria-label="Profile"
        className={({ isActive }) =>
          cn('rounded-full transition-transform duration-150', isActive && 'scale-95')
        }
      >
        <Avatar
          name={currentUser.displayName}
          username={currentUser.username}
          src={currentUser.avatarUrl}
          size="md"
          online={currentUser.online}
        />
      </NavLink>
    </nav>
  )
}
