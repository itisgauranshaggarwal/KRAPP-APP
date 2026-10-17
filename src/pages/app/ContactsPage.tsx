import { MessageCircle, Search, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { NewContactDialog } from '@/components/contacts/NewContactDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SkeletonRows } from '@/components/ui/Skeleton'
import { pushToast } from '@/lib/toast'
import { useAppData } from '@/store/AppDataProvider'
import type { Contact } from '@/types'

export function ContactsPage() {
  const navigate = useNavigate()
  const { contacts, conversations, deleteConversation, openConversationWith, isReady } = useAppData()
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null)
  const [opening, setOpening] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const sorted = [...contacts].sort((a, b) =>
      a.user.displayName.localeCompare(b.user.displayName),
    )
    if (!needle) return sorted
    return sorted.filter(
      (contact) =>
        contact.user.displayName.toLowerCase().includes(needle) ||
        contact.user.username.toLowerCase().includes(needle),
    )
  }, [contacts, query])

  async function openChat(contact: Contact) {
    setOpening(contact.id)
    try {
      const conversationId = await openConversationWith(contact.user)
      navigate(`/chats/${conversationId}`)
    } finally {
      setOpening(null)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const contact = pendingDelete
    setDeleting(true)
    try {
      const existing = conversations.find((item) => item.user.id === contact.user.id)
      if (existing) await deleteConversation(existing.id)
      pushToast({
        title: 'Conversation deleted',
        description: `Your chat with ${contact.user.displayName} was removed.`,
      })
    } finally {
      setDeleting(false)
      setPendingDelete(null)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} ${contacts.length === 1 ? 'person' : 'people'}`}
        actions={<NewContactDialog />}
      />

      <div className="px-4 pt-4">
        <Input
          placeholder="Search contacts"
          aria-label="Search contacts"
          leadingIcon={<Search className="size-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 scroll-soft">
        {!isReady ? (
          <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-line bg-surface">
            <SkeletonRows rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? 'No contacts found' : 'No contacts yet'}
            description={
              query
                ? 'Try a different name or username.'
                : 'Search a username and send a request to get started.'
            }
            action={query ? undefined : <NewContactDialog />}
          />
        ) : (
          <ul className="mx-auto flex max-w-2xl flex-col overflow-hidden rounded-xl border border-line bg-surface">
            {filtered.map((contact) => (
              <li
                key={contact.id}
                className="group flex items-center gap-3 border-b border-line px-4 py-2.5 transition-colors duration-100 last:border-b-0 hover:bg-surface-2"
              >
                <Avatar
                  name={contact.user.displayName}
                  username={contact.user.username}
                  src={contact.user.avatarUrl}
                  size="lg"
                  online={contact.user.online}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] leading-5 font-medium text-text">
                    {contact.user.displayName}
                  </p>
                  <p className="truncate text-sm text-muted">@{contact.user.username}</p>
                </div>
                <IconButton
                  label={`Message ${contact.user.displayName}`}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary-soft hover:text-primary"
                  loading={opening === contact.id}
                  onClick={() => openChat(contact)}
                >
                  <MessageCircle className="size-4.5" />
                </IconButton>
                <IconButton
                  label={`Remove ${contact.user.displayName}`}
                  variant="ghost"
                  size="sm"
                  className="hover:text-danger"
                  onClick={() => setPendingDelete(contact)}
                >
                  <Trash2 className="size-4.5" />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => {
          if (!deleting) setPendingDelete(null)
        }}
        title="Delete conversation?"
        description={
          pendingDelete
            ? `This removes your chat with ${pendingDelete.user.displayName}. This can't be undone.`
            : undefined
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={deleting}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  )
}
