import { Check, Clock, Inbox, UserPlus, X } from 'lucide-react'
import { useState } from 'react'

import { NewContactDialog } from '@/components/contacts/NewContactDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { Tabs } from '@/components/ui/Tabs'
import { formatListTime } from '@/lib/format'
import { useAppData } from '@/store/AppDataProvider'
import type { Contact } from '@/types'

export function RequestsPage() {
  const { incomingRequests, outgoingRequests, acceptRequest, rejectRequest, contacts } = useAppData()
  const [tab, setTab] = useState('received')

  const items = tab === 'received' ? incomingRequests : outgoingRequests

  return (
    <div className="relative flex h-full flex-col">
      <div aria-hidden className="app-texture pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <PageHeader
          title="Requests"
          subtitle={`${contacts.length} ${contacts.length === 1 ? 'contact' : 'contacts'}`}
          actions={<NewContactDialog />}
        />

        <div className="px-4 pt-4">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'received', label: 'Received', count: incomingRequests.length },
              { value: 'sent', label: 'Sent', count: outgoingRequests.length },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 scroll-soft">
          {items.length === 0 ? (
            <EmptyState
              icon={tab === 'received' ? Inbox : UserPlus}
              title={tab === 'received' ? 'No pending requests' : 'No sent requests'}
              description={
                tab === 'received'
                  ? 'When someone adds you, their request shows up here.'
                  : 'Requests you send stay here until they are accepted.'
              }
              action={tab === 'sent' ? <NewContactDialog /> : undefined}
            />
          ) : (
            <ul className="mx-auto flex max-w-2xl flex-col gap-3">
              {items.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => acceptRequest(request.id)}
                  onReject={() => rejectRequest(request.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function RequestCard({
  request,
  onAccept,
  onReject,
}: {
  request: Contact
  onAccept: () => void
  onReject: () => void
}) {
  const isReceived = request.direction === 'incoming'

  return (
    <li className="neu-raised animate-rise rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <Avatar
          name={request.user.displayName}
          username={request.user.username}
          src={request.user.avatarUrl}
          size="lg"
          online={request.user.online}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-text">{request.user.displayName}</p>
              <p className="truncate text-sm text-muted">@{request.user.username}</p>
            </div>
            {isReceived ? (
              <span className="flex shrink-0 items-center gap-1 text-[11px] text-faint">
                <Clock className="size-3.5" aria-hidden />
                {formatListTime(request.createdAt)}
              </span>
            ) : (
              <Badge tone="warning">
                <Clock className="size-3" aria-hidden />
                Pending
              </Badge>
            )}
          </div>

          {request.introMessage ? (
            <p className="mt-2.5 rounded-xl rounded-tl-sm border-l-2 border-primary bg-surface-2/80 px-3 py-2 text-sm text-text">
              {request.introMessage}
            </p>
          ) : null}
        </div>
      </div>

      {isReceived ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onReject}>
            <X className="size-4" aria-hidden />
            Reject
          </Button>
          <Button variant="primary" size="sm" onClick={onAccept}>
            <Check className="size-4" aria-hidden />
            Accept
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-faint">
            Waiting for {request.user.displayName.split(' ')[0]} to accept
          </span>
          <IconButton label="Request pending" variant="neu" size="sm" disabled>
            <Clock className="size-4.5" />
          </IconButton>
        </div>
      )}
    </li>
  )
}
