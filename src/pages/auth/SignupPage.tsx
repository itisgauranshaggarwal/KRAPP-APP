import { AtSign, Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import { useAppData } from '@/store/AppDataProvider'

const MIN_PASSWORD = 5

interface Errors {
  displayName?: string
  username?: string
  email?: string
  password?: string
}

const USERNAME_PATTERN = /^[a-z0-9._]+$/

export function SignupPage() {
  const navigate = useNavigate()
  const { isAvailableUsername } = useAppData()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: Errors = {}
    const cleanUsername = username.trim().toLowerCase()

    if (!displayName.trim()) next.displayName = 'Enter a display name'

    if (!cleanUsername) {
      next.username = 'Choose a username'
    } else if (cleanUsername.length < 3) {
      next.username = 'At least 3 characters'
    } else if (!USERNAME_PATTERN.test(cleanUsername)) {
      next.username = 'Use lowercase letters, numbers, dots or underscores'
    } else if (!isAvailableUsername(cleanUsername)) {
      next.username = 'That username is already taken'
    }

    if (!email.trim()) {
      next.email = 'Enter your email'
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Enter a valid email'
    }

    if (!password) {
      next.password = 'Choose a password'
    } else if (password.length < MIN_PASSWORD) {
      next.password = `At least ${MIN_PASSWORD} characters`
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    // Phase 3 will create the account in Supabase here.
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      navigate('/chats')
    }, 500)
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Pick a username friends can find you by"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Display name"
          name="displayName"
          autoComplete="name"
          placeholder="Aria Malik"
          leadingIcon={<UserIcon className="size-4.5" />}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          error={errors.displayName}
          autoFocus
        />

        <Input
          label="Username"
          name="username"
          autoComplete="username"
          placeholder="aria.malik"
          leadingIcon={<AtSign className="size-4.5" />}
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          error={errors.username}
          hint="Friends add you with this. Lowercase letters, numbers, dots or underscores."
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leadingIcon={<AtSign className="size-4.5" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          hint="Used for your account only. You can change it later."
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="At least 5 characters"
          leadingIcon={<Lock className="size-4.5" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          trailingSlot={
            <IconButton
              label={showPassword ? 'Hide password' : 'Show password'}
              size="sm"
              variant="ghost"
              className="size-8"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </IconButton>
          }
        />

        <Button type="submit" variant="primary" size="lg" loading={submitting} className="mt-1">
          {submitting ? 'Creating account' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
