import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/pages/auth/AuthLayout'

interface Errors {
  username?: string
  password?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: Errors = {}
    if (!username.trim()) next.username = 'Enter your username'
    if (!password) next.password = 'Enter your password'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    // Phase 3 will call Supabase Auth here.
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      navigate('/chats')
    }, 450)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep the conversation going"
      footer={
        <>
          New to KRAPP?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Username"
          name="username"
          autoComplete="username"
          placeholder="your username"
          leadingIcon={<UserIcon className="size-4.5" />}
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
          {submitting ? 'Signing in' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  )
}
