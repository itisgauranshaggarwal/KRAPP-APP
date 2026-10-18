import { ArrowLeft, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AppLogo } from '@/components/shared/AppLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { useSession } from '@/lib/session'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useSession()

  return (
    <main className="flex min-h-screen flex-col bg-bg px-4 py-5 sm:px-6 sm:py-8">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <button type="button" onClick={() => navigate(isAuthenticated ? '/chats' : '/login')}>
          <AppLogo size="md" withWordmark />
        </button>
        <ThemeToggle />
      </header>

      <section className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center">
        <div className="relative flex size-28 items-center justify-center rounded-2xl border border-line bg-surface shadow-[var(--shadow-soft)]">
          <span className="absolute -top-4 rounded-md bg-primary px-2 py-1 text-xs font-semibold tracking-[0.12em] text-primary-contrast">
            404
          </span>
          <Compass className="size-12 text-primary" aria-hidden />
        </div>
        <p className="mt-8 text-sm font-semibold tracking-[0.12em] text-primary uppercase">Wrong turn</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-text">This page is not here.</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          The link may be outdated, or the page may have moved. Let&apos;s get you back to a useful place.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button variant="primary" onClick={() => navigate(isAuthenticated ? '/chats' : '/login')}>
            {isAuthenticated ? 'Back to chats' : 'Go to sign in'}
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4" aria-hidden />
            Go back
          </Button>
        </div>
        <p className={cn('mt-10 text-xs text-faint', isAuthenticated && 'hidden')}>
          KRAPP is a small hobby project. Be a good neighbour.
        </p>
      </section>
    </main>
  )
}
