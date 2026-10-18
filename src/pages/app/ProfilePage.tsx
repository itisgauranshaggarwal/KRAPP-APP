import {
  AtSign,
  Camera,
  Check,
  Info,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react'
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import { SafetyNotice } from '@/components/shared/SafetyNotice'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useSession } from '@/lib/session'
import { useTheme } from '@/lib/theme'
import { pushToast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useAppData } from '@/store/AppDataProvider'
import type { ThemeMode } from '@/types'

const USERNAME_PATTERN = /^[a-z0-9._]+$/
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

type FieldErrors = {
  displayName?: string
  username?: string
  email?: string
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { currentUser, updateProfile, isAvailableUsername } = useAppData()
  const { mode, setMode } = useTheme()
  const { signOut, deleteAccount } = useSession()
  const fileRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(currentUser.displayName)
  const [username, setUsername] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email ?? '')
  const [bio, setBio] = useState(currentUser.bio ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isDirty =
    displayName.trim() !== currentUser.displayName ||
    username.trim().toLowerCase() !== currentUser.username ||
    email.trim() !== (currentUser.email ?? '') ||
    bio.trim() !== (currentUser.bio ?? '')

  function pickAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    void updateProfile({ avatarUrl: url })
    pushToast({ title: 'Profile picture updated', tone: 'success' })
  }

  async function save() {
    const next: FieldErrors = {}
    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim()

    if (!displayName.trim()) next.displayName = 'Display name is required'
    if (!cleanUsername) {
      next.username = 'Username is required'
    } else if (!USERNAME_PATTERN.test(cleanUsername)) {
      next.username = 'Use lowercase letters, numbers, dots or underscores'
    } else if (!isAvailableUsername(cleanUsername)) {
      next.username = 'That username is already taken'
    }

    if (!cleanEmail) {
      next.email = 'Email is required'
    } else if (!EMAIL_PATTERN.test(cleanEmail)) {
      next.email = 'Enter a valid email'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSaving(true)
    await updateProfile({
      displayName: displayName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      bio: bio.trim(),
    })
    setSaving(false)
    pushToast({ title: 'Profile saved', tone: 'success' })
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    pushToast({ title: 'Signed out', description: 'See you soon.' })
    navigate('/login', { replace: true })
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await deleteAccount()
      setConfirmDelete(false)
      pushToast({ title: 'Account deleted', description: 'All of your data was removed.' })
      navigate('/login', { replace: true })
    } catch (error) {
      pushToast({
        title: 'Account deletion unavailable',
        description: error instanceof Error ? error.message : 'Try again later.',
        tone: 'danger',
      })
    } finally {
      setDeleting(false)
    }
  }

  const themes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <PageHeader title="Profile" subtitle={`@${currentUser.username}`} />

      <div className="flex-1 overflow-y-auto scroll-soft">
        <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-5 pb-24 lg:pb-8">
          {/* Identity */}
          <section className="rounded-xl border border-line bg-surface p-5">
            <div className="flex items-start gap-4">
              <Avatar
                name={currentUser.displayName}
                username={currentUser.username}
                src={currentUser.avatarUrl}
                size="xl"
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-xl leading-7 font-semibold tracking-[-0.01em] text-text">
                  {currentUser.displayName}
                </h2>
                <p className="text-sm text-muted">@{currentUser.username}</p>
                {currentUser.bio ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{currentUser.bio}</p>
                ) : null}

                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="size-4" aria-hidden />
                  Change photo
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={pickAvatar}
                />
              </div>
            </div>

            <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-faint">
              Your picture and profile are only visible to people who have accepted your request.
            </p>
          </section>

          {/* Account */}
          <Section title="Account" subtitle="How friends find and recognise you">
            <Input
              label="Display name"
              value={displayName}
              maxLength={40}
              onChange={(e) => setDisplayName(e.target.value)}
              error={errors.displayName}
            />

            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              error={errors.username}
              hint="Friends add you with this."
              leadingIcon={<AtSign className="size-4" />}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              hint="Used for your account only. Never shown to other people."
              leadingIcon={<Mail className="size-4" />}
            />

            <div>
              <label
                htmlFor="profile-bio"
                className="mb-1.5 block text-[13px] font-medium text-text"
              >
                Bio <span className="font-normal text-faint">(optional)</span>
              </label>
              <textarea
                id="profile-bio"
                rows={2}
                maxLength={140}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A line about you"
                className={cn(
                  'w-full resize-none rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-sm text-text',
                  'placeholder:text-faint focus-visible:outline-none scroll-soft',
                  'transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-soft',
                )}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button variant="primary" onClick={save} loading={saving} disabled={!isDirty}>
                Save changes
              </Button>
              {!isDirty ? (
                <span className="text-[13px] text-faint">You&apos;re all caught up</span>
              ) : null}
            </div>
          </Section>

          {/* Appearance */}
          <Section title="Appearance">
            <div className="overflow-hidden rounded-lg border border-line">
              {themes.map(({ value, label, icon: Icon }) => {
                const active = mode === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    aria-pressed={active}
                    className={cn(
                      'flex w-full items-center gap-3 border-b border-line px-3.5 py-3 text-left',
                      'transition-colors duration-100 last:border-b-0',
                      active ? 'bg-primary-soft' : 'hover:bg-surface-2',
                    )}
                  >
                    <Icon
                      className={cn('size-4', active ? 'text-primary' : 'text-muted')}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        'flex-1 text-sm',
                        active ? 'font-medium text-text' : 'text-muted',
                      )}
                    >
                      {label}
                    </span>
                    {active ? (
                      <Check className="size-4 shrink-0 text-primary" aria-hidden />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Session */}
          <Section title="Session" subtitle={`Signed in as @${currentUser.username}`}>
            <p className="text-sm leading-relaxed text-muted">
              Signing out keeps your chats and contacts safe on this device.
            </p>
            <div>
              <Button variant="secondary" onClick={handleSignOut} loading={signingOut}>
                <LogOut className="size-4" aria-hidden />
                Sign out
              </Button>
            </div>
          </Section>

          {/* About */}
          <Section title="About" icon={Info} subtitle="KRAPP APP · v0.1.0 · Phase 2 (UX)">
            <SafetyNotice />
          </Section>

          {/* Danger zone */}
          <Section title="Danger zone" danger>
            <p className="text-sm leading-relaxed text-muted">
              Deleting your account removes your profile, contacts and messages. This can&apos;t be
              undone.
            </p>
            <div>
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-4" aria-hidden />
                Delete account
              </Button>
            </div>
          </Section>
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => {
          if (!deleting) setConfirmDelete(false)
        }}
        title="Delete your account?"
        description="This permanently removes your profile, contacts and conversations. This can't be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount} loading={deleting}>
              Delete account
            </Button>
          </>
        }
      />
    </div>
  )
}

function Section({
  title,
  subtitle,
  icon: Icon,
  danger = false,
  children,
}: {
  title: string
  subtitle?: string
  icon?: typeof Info
  danger?: boolean
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-xl border bg-surface p-5',
        danger ? 'border-danger/30' : 'border-line',
      )}
    >
      <div>
        <h3
          className={cn(
            'flex items-center gap-2 text-[13px] font-semibold',
            danger ? 'text-danger' : 'text-muted',
          )}
        >
          {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
          {title}
        </h3>
        {subtitle ? <p className="mt-0.5 text-xs text-faint">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}
