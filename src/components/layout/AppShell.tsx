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
    <div className="flex h-full w-full overflow-hidden bg-bg">
      <IconRail className="hidden lg:flex" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
        <BottomNav className={cn('lg:hidden', chatOpen && 'hidden')} />
      </div>
    </div>
  )
}
