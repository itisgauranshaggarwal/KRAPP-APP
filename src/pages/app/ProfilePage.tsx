import {
  AtSign,
  Camera,
  Check,
  Info,
  Mail,
  MessageCircle,
  Monitor,
  Moon,
  Sun,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'

import { SafetyNotice } from '@/components/shared/SafetyNotice'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
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
  const { currentUser, updateProfile, isAvailableUsername, contacts, conversations, incomingRequests } =
    useAppData()
  const { mode, setMode } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(currentUser.displayName)
  const [username, setUsername] = useState(currentUser.username)
  const [email, setEmail] = useState(currentUser.email ?? '')
  const [bio, setBio] = useState(currentUser.bio ?? '')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function pickAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateProfile({ avatarUrl: url })
  }

  function save() {
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

    updateProfile({
      displayName: displayName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      bio: bio.trim(),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const themes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="relative flex h-full flex-col">
      <div aria-hidden className="app-texture pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative z-10 flex-1 overflow-y-auto scroll-soft">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-5 pb-24 lg:pb-8">
          {/* Hero */}
          <section className="neu-raised overflow-hidden rounded-2xl">
            <div className="brand-gradient relative h-28">
              <div aria-hidden className="app-texture absolute inset-0 opacity-30" />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(255,255,255,0.35),transparent_60%)]"
              />
            </div>

            <div className="px-5 pb-5">
              <div className="relative -mt-12 inline-flex">
                <span className="brand-gradient inline-flex rounded-full p-[3px] ring-4 ring-[var(--surface)]">
                  <Avatar
                    name={currentUser.displayName}
                    username={currentUser.username}
                    src={currentUser.avatarUrl}
                    size="xl"
                    className="ring-0"
                  />
                </span>
                <IconButton
                  label="Change profile picture"
                  size="sm"
                  variant="primary"
                  className="absolute -right-0.5 -bottom-0.5"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="size-4" />
                </IconButton>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={pickAvatar}
                />
              </div>

              <div className="mt-3">
                <h2 className="text-xl font-bold tracking-[-0.02em] text-text">
                  {currentUser.displayName}
                </h2>
                <p className="text-sm text-muted">@{currentUser.username}</p>
                {currentUser.bio ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{currentUser.bio}</p>
                ) : null}
              </div>

              <p className="mt-3 text-xs text-faint">
                Your picture and profile are only visible to people who have accepted your request.
              </p>
            </div>
          </section>

          {/* Stats */}
          <section className="neu-raised grid grid-cols-3 divide-x divide-line rounded-2xl py-3.5">
            <Stat icon={Users} label="Contacts" value={contacts.length} />
            <Stat icon={MessageCircle} label="Chats" value={conversations.length} />
            <Stat icon={UserPlus} label="Pending" value={incomingRequests.length} accent />
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
              leadingIcon={<AtSign className="size-4.5" />}
            />

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              hint="Used for your account only. Never shown to other people."
              leadingIcon={<Mail className="size-4.5" />}
            />

            <div>
              <label
                htmlFor="profile-bio"
                className="mb-2 block text-xs font-semibold tracking-wide text-muted uppercase"
              >
                Bio <span className="font-normal text-faint normal-case">(optional)</span>
              </label>
              <textarea
                id="profile-bio"
                rows={2}
                maxLength={140}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A line about you"
                className={cn(
                  'neu-inset w-full resize-none rounded-xl px-3.5 py-3 text-sm text-text',
                  'placeholder:text-faint focus-visible:outline-none scroll-soft',
                  'transition-[outline-color] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ring)]',
                )}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button variant="primary" onClick={save}>
                Save changes
              </Button>
              {saved ? (
                <span className="inline-flex animate-rise items-center gap-1.5 text-sm font-medium text-success">
                  <Check className="size-4" aria-hidden />
                  Saved
                </span>
              ) : null}
            </div>
          </Section>

          {/* Appearance */}
          <Section title="Appearance">
            <div className="neu-inset flex gap-1 rounded-xl p-1">
              {themes.map(({ value, label, icon: Icon }) => {
                const active = mode === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    aria-pressed={active}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold',
                      'transition-[box-shadow,color,background-color,filter] duration-150',
                      active
                        ? 'brand-gradient text-primary-contrast glow-brand'
                        : 'text-muted hover:text-text',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* About */}
          <Section
            title="About"
            icon={Info}
            subtitle="KRAPP APP · v0.1.0 · Phase 1 (UI)"
          >
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
        onClose={() => setConfirmDelete(false)}
        title="Delete your account?"
        description="This permanently removes your profile, contacts and conversations. This can't be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(false)}>
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
    <section className="neu-raised flex flex-col gap-4 rounded-2xl p-5">
      <div>
        <h3
          className={cn(
            'flex items-center gap-2 text-xs font-semibold tracking-wide uppercase',
            danger ? 'text-danger' : 'text-muted',
          )}
        >
          {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
          {title}
        </h3>
        {subtitle ? <p className="mt-1 text-xs text-faint">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof Users
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <Icon className={cn('size-4', accent && value > 0 ? 'text-accent' : 'text-faint')} aria-hidden />
      <span className="text-lg font-bold tracking-[-0.02em] text-text tabular-nums">{value}</span>
      <span className="text-[11px] font-medium tracking-wide text-muted uppercase">{label}</span>
    </div>
  )
}
