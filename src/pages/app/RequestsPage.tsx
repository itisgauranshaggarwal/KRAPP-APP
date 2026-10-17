import { Check, Clock, Inbox, UserPlus, X } from 'lucide-react'
import { useState } from 'react'

import { NewContactDialog } from '@/components/contacts/NewContactDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { formatListTime } from '@/lib/format'
import { pushToast } from '@/lib/toast'
import { useAppData } from '@/store/AppDataProvider'
import type { Contact } from '@/types'

export function RequestsPage() {
  const { incomingRequests, outgoingRequests, acceptRequest, rejectRequest, contacts, isReady } =
    useAppData()
  const [tab, setTab] = useState('received')

  const items = tab === 'received' ? incomingRequests : outgoingRequests

  async function handleAccept(request: Contact) {
    const firstName = request.user.displayName.split(' ')[0]
    await acceptRequest(request.id)
    pushToast({
      title: `${firstName} is now a contact`,
      description: 'Say hi — your chat is ready.',
      tone: 'success',
    })
  }

  async function handleReject(request: Contact) {
    await rejectRequest(request.id)
    pushToast({ title: `Request from ${request.user.displayName} declined` })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
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
        {!isReady ? (
          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-line bg-surface">
            <SkeletonRows rows={2} />
          </div>
        ) : items.length === 0 ? (
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
          <ul className="mx-auto flex max-w-2xl flex-col overflow-hidden rounded-xl border border-line bg-surface">
            {items.map((request) => (
              <RequestRow
                key={request.id}
                request={request}
                onAccept={() => handleAccept(request)}
                onReject={() => handleReject(request)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function RequestRow({
  request,
  onAccept,
  onReject,
}: {
  request: Contact
  onAccept: () => Promise<void>
  onReject: () => Promise<void>
}) {
  const isReceived = request.direction === 'incoming'
  const [busy, setBusy] = useState<'accept' | 'reject' | null>(null)

  async function run(action: 'accept' | 'reject', handler: () => Promise<void>) {
    setBusy(action)
    try {
      await handler()
    } finally {
      setBusy(null)
    }
  }

  return (
    <li className="animate-rise border-b border-line p-4 last:border-b-0">
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
              <p className="truncate text-[15px] leading-5 font-semibold text-text">
                {request.user.displayName}
              </p>
              <p className="truncate text-sm text-muted">@{request.user.username}</p>
            </div>
            {isReceived ? (
              <span className="flex shrink-0 items-center gap-1 text-[11px] tabular-nums text-faint">
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
            <p className="mt-2.5 rounded-r-md rounded-l-none border-l-2 border-primary bg-surface-2 px-3 py-2 text-sm leading-relaxed text-text">
              {request.introMessage}
            </p>
          ) : null}
        </div>
      </div>

      {isReceived ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => run('reject', onReject)}
            loading={busy === 'reject'}
            disabled={busy !== null}
          >
            <X className="size-4" aria-hidden />
            Reject
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => run('accept', onAccept)}
            loading={busy === 'accept'}
            disabled={busy !== null}
          >
            <Check className="size-4" aria-hidden />
            Accept
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-faint">
            Waiting for {request.user.displayName.split(' ')[0]} to accept
          </span>
          <IconButton label="Request pending" variant="ghost" size="sm" disabled>
            <Clock className="size-4" />
          </IconButton>
        </div>
      )}
    </li>
  )
}
