import {
  Camera,
  Check,
  Info,
  Monitor,
  Moon,
  Sun,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
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

export function ProfilePage() {
  const { currentUser, updateProfile, isAvailableUsername } = useAppData()
  const { mode, setMode } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(currentUser.displayName)
  const [username, setUsername] = useState(currentUser.username)
  const [errors, setErrors] = useState<{ displayName?: string; username?: string }>({})
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function pickAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateProfile({ avatarUrl: url })
  }

  function save() {
    const next: typeof errors = {}
    const cleanUsername = username.trim().toLowerCase()

    if (!displayName.trim()) next.displayName = 'Display name is required'
    if (!cleanUsername) {
      next.username = 'Username is required'
    } else if (!USERNAME_PATTERN.test(cleanUsername)) {
      next.username = 'Use lowercase letters, numbers, dots or underscores'
    } else if (!isAvailableUsername(cleanUsername)) {
      next.username = 'That username is already taken'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    updateProfile({ displayName: displayName.trim(), username: cleanUsername })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const themes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Profile" subtitle="Manage how others see you" />

      <div className="flex-1 overflow-y-auto p-4 scroll-soft">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          {/* Identity */}
          <section className="neu-raised flex flex-col items-center gap-3 rounded-3xl p-6">
            <div className="relative">
              <Avatar
                name={currentUser.displayName}
                username={currentUser.username}
                src={currentUser.avatarUrl}
                size="xl"
                online={currentUser.online}
              />
              <IconButton
                label="Change profile picture"
                size="sm"
                variant="primary"
                className="absolute -right-1 -bottom-1"
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

            <div className="text-center">
              <p className="text-lg font-semibold text-text">{currentUser.displayName}</p>
              <p className="text-sm text-muted">@{currentUser.username}</p>
            </div>

            <p className="max-w-sm text-center text-xs text-faint">
              Your picture is only visible to people who have accepted your request.
            </p>
          </section>

          {/* Details */}
          <section className="neu-raised flex flex-col gap-4 rounded-3xl p-5">
            <h2 className="text-sm font-semibold text-muted">Details</h2>

            <Input
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={errors.displayName}
            />

            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              error={errors.username}
              hint="Friends add you with this."
            />

            <div>
              <Input label="Email" value={currentUser.email ?? ''} readOnly disabled />
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-warning">
                <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
                Email can&apos;t be changed later.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="primary" onClick={save}>
                {saved ? (
                  <>
                    <Check className="size-4" aria-hidden /> Saved
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </div>
          </section>

          {/* Appearance */}
          <section className="neu-raised flex flex-col gap-3 rounded-3xl p-5">
            <h2 className="text-sm font-semibold text-muted">Appearance</h2>
            <div className="neu-inset flex gap-1 rounded-2xl p-1">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium',
                    'transition-[box-shadow,color] duration-150',
                    mode === value ? 'neu-raised-sm text-primary' : 'text-muted hover:text-text',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* About */}
          <section className="neu-raised flex flex-col gap-3 rounded-3xl p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-muted">
              <Info className="size-4" aria-hidden />
              About
            </h2>
            <SafetyNotice />
            <p className="text-xs text-faint">KRAPP APP · v0.1.0 · Phase 1 (UI)</p>
          </section>

          {/* Danger zone */}
          <section className="neu-raised flex flex-col gap-3 rounded-3xl p-5">
            <h2 className="text-sm font-semibold text-danger">Danger zone</h2>
            <p className="text-sm text-muted">
              Deleting your account removes your profile, contacts and messages. This can&apos;t be
              undone.
            </p>
            <div>
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-4" aria-hidden />
                Delete account
              </Button>
            </div>
          </section>
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
