import type { ReactNode } from 'react'

import { AppLogo } from '@/components/shared/AppLogo'
import { SafetyNotice } from '@/components/shared/SafetyNotice'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-y-auto bg-bg px-4 py-8 scroll-soft">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center gap-3 text-center">
          <AppLogo size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
        </div>

        <div className="neu-raised rounded-3xl p-6">{children}</div>

        {footer ? <div className="mt-5 text-center text-sm text-muted">{footer}</div> : null}

        <SafetyNotice className="mt-6" />
      </div>
    </div>
  )
}
