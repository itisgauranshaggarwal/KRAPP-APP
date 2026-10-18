import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { AppLogo } from '@/components/shared/AppLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('KRAPP UI error', error, info.componentStack)
  }

  handleReset = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="flex min-h-screen flex-col bg-bg px-4 py-5 sm:px-6 sm:py-8">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <AppLogo size="md" withWordmark />
          <ThemeToggle />
        </header>
        <section className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center text-center">
          <span className="flex size-14 items-center justify-center rounded-xl bg-danger-soft text-danger">
            <TriangleAlert className="size-7" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-text">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            KRAPP hit an unexpected problem. Reloading is usually enough to get back to your chats.
          </p>
          <Button variant="primary" className="mt-6" onClick={this.handleReset}>
            <RefreshCw className="size-4" aria-hidden />
            Reload KRAPP
          </Button>
        </section>
      </main>
    )
  }
}
