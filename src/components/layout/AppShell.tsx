import { Outlet, useMatch } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'
import { IconRail } from '@/components/layout/IconRail'
import { cn } from '@/lib/utils'

/**
 * Responsive app frame.
 * - Desktop (lg+): icon rail + routed content.
 * - Mobile: routed content + bottom navigation (hidden while a chat is open).
 */
export function AppShell() {
  // On mobile a full-screen chat hides the bottom nav.
  const chatOpen = Boolean(useMatch('/chats/:conversationId'))

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-bg">
      {/* Soft brand atmosphere behind the app surface. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 size-[26rem] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -top-32 right-[-6rem] size-80 rounded-full bg-accent/15 blur-[100px]" />
      </div>

      <IconRail className="relative z-10 hidden lg:flex" />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
        <BottomNav className={cn('lg:hidden', chatOpen && 'hidden')} />
      </div>
    </div>
  )
}
