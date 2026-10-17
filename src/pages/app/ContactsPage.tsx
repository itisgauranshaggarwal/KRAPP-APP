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
import { useAppData } from '@/store/AppDataProvider'
import type { Contact } from '@/types'

export function ContactsPage() {
  const navigate = useNavigate()
  const { contacts, conversations, deleteConversation } = useAppData()
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Contact | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return contacts
    return contacts.filter(
      (contact) =>
        contact.user.displayName.toLowerCase().includes(needle) ||
        contact.user.username.toLowerCase().includes(needle),
    )
  }, [contacts, query])

  function openChat(contact: Contact) {
    const existing = conversations.find((item) => item.user.id === contact.user.id)
    if (existing) {
      navigate(`/chats/${existing.id}`)
    }
  }

  function confirmDelete() {
    if (!pendingDelete) return
    const existing = conversations.find((item) => item.user.id === pendingDelete.user.id)
    if (existing) deleteConversation(existing.id)
    setPendingDelete(null)
  }

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} ${contacts.length === 1 ? 'person' : 'people'}`}
        actions={<NewContactDialog />}
      />

      <div className="px-4 pt-4">
        <Input
          placeholder="Search contacts"
          aria-label="Search contacts"
          leadingIcon={<Search className="size-4.5" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-3 scroll-soft">
        {filtered.length === 0 ? (
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
          <ul className="mx-auto flex max-w-2xl flex-col gap-2">
            {filtered.map((contact) => (
              <li
                key={contact.id}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-150 hover:bg-surface-2"
              >
                <Avatar
                  name={contact.user.displayName}
                  username={contact.user.username}
                  src={contact.user.avatarUrl}
                  size="lg"
                  online={contact.user.online}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text">{contact.user.displayName}</p>
                  <p className="truncate text-sm text-muted">@{contact.user.username}</p>
                </div>
                <IconButton
                  label={`Message ${contact.user.displayName}`}
                  variant="neu"
                  onClick={() => openChat(contact)}
                >
                  <MessageCircle className="size-5" />
                </IconButton>
                <IconButton
                  label={`Remove ${contact.user.displayName}`}
                  variant="ghost"
                  onClick={() => setPendingDelete(contact)}
                >
                  <Trash2 className="size-5" />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete conversation?"
        description={
          pendingDelete
            ? `This removes your chat with ${pendingDelete.user.displayName}. This can't be undone.`
            : undefined
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  )
}
