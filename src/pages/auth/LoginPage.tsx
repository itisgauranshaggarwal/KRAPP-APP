import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { MIN_PASSWORD, MOCK_AUTH, useSession } from '@/lib/session'
import { AuthLayout } from '@/pages/auth/AuthLayout'

interface Errors {
  username?: string
  password?: string
}

interface LocationState {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useSession()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: Errors = {}
    if (!username.trim()) next.username = 'Enter your username'
    if (!password) next.password = 'Enter your password'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      await signIn({ username, password })
      const from = (location.state as LocationState | null)?.from
      navigate(from && from !== '/login' ? from : '/chats', { replace: true })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep the conversation going"
      footer={
        <>
          New to KRAPP?{' '}
          <Link
            to="/signup"
            className="inline-block py-1.5 font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-danger/35 bg-danger-soft px-3 py-2 text-[13px] leading-relaxed text-danger"
          >
            {formError}
          </p>
        ) : null}

        <Input
          label="Username"
          name="username"
          autoComplete="username"
          placeholder="your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          autoFocus
        />

        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
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
          {submitting ? 'Signing in' : 'Sign in'}
        </Button>

        {MOCK_AUTH && import.meta.env.DEV ? (
          <p className="text-[12px] leading-relaxed text-text-faint">
            Demo build: any username signs in — the password only needs {MIN_PASSWORD}+ characters.
          </p>
        ) : null}
      </form>
    </AuthLayout>
  )
}
