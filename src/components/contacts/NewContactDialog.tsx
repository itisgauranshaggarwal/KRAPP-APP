import { Search, UserPlus, UserRound } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { useAppData } from '@/store/AppDataProvider'
import type { User } from '@/types'

type Step = 'search' | 'confirm' | 'done'

export interface NewContactDialogProps {
  /** Optional custom trigger; defaults to a neumorphic icon button. */
  trigger?: React.ReactNode
}

export function NewContactDialog({ trigger }: NewContactDialogProps) {
  const { searchUsers, sendInvite, outgoingRequests } = useAppData()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)
  const [intro, setIntro] = useState('')
  const [step, setStep] = useState<Step>('search')
  const introId = useId()

  const results = submitted ? searchUsers(query) : []

  function reset() {
    setQuery('')
    setSubmitted(false)
    setSelected(null)
    setIntro('')
    setStep('search')
  }

  function close() {
    setOpen(false)
    // Delay reset so the closing animation does not show empty content.
    window.setTimeout(reset, 200)
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
  }

  function handleSend() {
    if (!selected) return
    sendInvite(selected, intro)
    setStep('done')
  }

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <IconButton label="New contact" onClick={() => setOpen(true)}>
          <UserPlus className="size-5" />
        </IconButton>
      )}

      <Modal
        open={open}
        onClose={close}
        title={step === 'done' ? 'Request sent' : 'New contact'}
        description={
          step === 'search'
            ? 'Search for a friend by their username.'
            : step === 'confirm'
              ? 'Add a short message to introduce yourself.'
              : undefined
        }
      >
        {step === 'search' ? (
          <>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSubmitted(false)
                }}
                placeholder="username"
                aria-label="Search by username"
                leadingIcon={<Search className="size-4.5" />}
              />
              <Button type="submit" variant="primary">
                Search
              </Button>
            </form>

            <div className="mt-4">
              {!submitted ? (
                <p className="px-1 py-6 text-center text-sm text-faint">
                  Type a username and press enter to search.
                </p>
              ) : results.length === 0 ? (
                <EmptyState
                  icon={UserRound}
                  title="No user found"
                  description={`Nobody matches "${query.trim()}". Check the spelling or ask them for their exact username.`}
                />
              ) : (
                <ul className="flex flex-col gap-1">
                  {results.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(user)
                          setStep('confirm')
                        }}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left',
                          'transition-colors duration-150 hover:bg-surface-2',
                        )}
                      >
                        <Avatar name={user.displayName} username={user.username} src={user.avatarUrl} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-text">
                            {user.displayName}
                          </span>
                          <span className="block truncate text-sm text-muted">@{user.username}</span>
                        </span>
                        <UserPlus className="size-4.5 text-primary" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : null}

        {step === 'confirm' && selected ? (
          <div className="flex flex-col gap-4">
            <div className="neu-flat flex items-center gap-3 rounded-xl p-3">
              <Avatar
                name={selected.displayName}
                username={selected.username}
                src={selected.avatarUrl}
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-text">{selected.displayName}</p>
                <p className="truncate text-sm text-muted">@{selected.username}</p>
              </div>
            </div>

            <div>
              <label htmlFor={introId} className="mb-2 block text-sm font-medium text-muted">
                Introduction <span className="text-faint">(optional, one message)</span>
              </label>
              <textarea
                id={introId}
                rows={3}
                maxLength={280}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Hi! We met at…"
                className={cn(
                  'neu-inset w-full resize-none rounded-xl px-3.5 py-3 text-sm text-text',
                  'placeholder:text-faint focus-visible:outline-none scroll-soft',
                  'transition-[outline-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]',
                )}
              />
              <p className="mt-1.5 text-xs text-faint">
                They&apos;ll see this before accepting. You can&apos;t send more until they accept.
              </p>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setStep('search')}>
                Back
              </Button>
              <Button variant="primary" onClick={handleSend}>
                Send request
              </Button>
            </div>
          </div>
        ) : null}

        {step === 'done' && selected ? (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <Avatar
              name={selected.displayName}
              username={selected.username}
              src={selected.avatarUrl}
              size="xl"
            />
            <div>
              <p className="font-medium text-text">Request sent to {selected.displayName}</p>
              <p className="mt-1 text-sm text-muted">
                You&apos;ll be able to chat once they accept.
              </p>
            </div>
            <Button variant="primary" onClick={close} className="mt-2">
              Done
            </Button>
          </div>
        ) : null}

        {step === 'search' && outgoingRequests.length > 0 ? (
          <p className="mt-4 text-center text-xs text-faint">
            {outgoingRequests.length} pending request{outgoingRequests.length > 1 ? 's' : ''} ·
            manage them in Requests
          </p>
        ) : null}
      </Modal>
    </>
  )
}
