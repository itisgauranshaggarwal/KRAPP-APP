import { Check, Clock, Inbox, UserPlus, X } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { NewContactDialog } from '@/components/contacts/NewContactDialog'
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
    <div className="flex h-full flex-col">
      <PageHeader
        title="Requests"
        subtitle={`${contacts.length} contacts`}
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
          <ul className="mx-auto flex max-w-2xl flex-col gap-2">
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
    <li className="neu-raised rounded-3xl p-4">
      <div className="flex items-start gap-3">
        <Avatar
          name={request.user.displayName}
          username={request.user.username}
          src={request.user.avatarUrl}
          size="lg"
          online={request.user.online}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-text">{request.user.displayName}</span>
            <span className="truncate text-sm text-muted">@{request.user.username}</span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-faint">
            <Clock className="size-3.5" aria-hidden />
            {formatListTime(request.createdAt)}
          </div>

          {request.introMessage ? (
            <p className="mt-2 rounded-2xl bg-surface-2/70 px-3 py-2 text-sm text-text">
              {request.introMessage}
            </p>
          ) : null}
        </div>

        {!isReceived ? (
          <Badge tone="warning">
            <Clock className="size-3" aria-hidden />
            Pending
          </Badge>
        ) : null}
      </div>

      {isReceived ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={onReject}>
            <X className="size-4" aria-hidden />
            Reject
          </Button>
          <Button variant="primary" onClick={onAccept}>
            <Check className="size-4" aria-hidden />
            Accept
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex justify-end">
          <IconButton label="Request pending" variant="neu" disabled>
            <Clock className="size-5" />
          </IconButton>
        </div>
      )}
    </li>
  )
}
