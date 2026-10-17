import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { ChatList } from '@/components/chat/ChatList'
import { cn } from '@/lib/utils'

/**
 * Chats area.
 * - Desktop: chat list column + chat pane side by side.
 * - Mobile: only one column at a time (list, or the open chat via nested route).
 */
export function ChatsScreen() {
  const navigate = useNavigate()
  const { conversationId } = useParams()

  return (
    <div className="flex h-full min-h-0">
      <aside
        className={cn(
          'w-full flex-col border-r border-line bg-surface/50 backdrop-blur-xl lg:flex lg:w-[380px] xl:w-[420px]',
          conversationId ? 'hidden lg:flex' : 'flex',
        )}
      >
        <ChatList
          activeId={conversationId}
          onSelect={(id) => navigate(`/chats/${id}`)}
        />
      </aside>

      <section className={cn('min-w-0 flex-1', conversationId ? 'flex' : 'hidden lg:flex')}>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
