import { Check, ShieldCheck } from 'lucide-react'
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

const highlights = ['Private 1:1 chats', 'No feed, no strangers', 'Works on any screen']

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-full items-center justify-center overflow-y-auto bg-bg p-4 scroll-soft sm:p-6">
      {/* Brand atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 size-[30rem] rounded-full bg-primary/25 blur-[110px]" />
        <div className="absolute -right-24 -bottom-40 size-[26rem] rounded-full bg-accent/20 blur-[110px]" />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 grid w-full max-w-4xl gap-6 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel (desktop only) */}
        <aside className="brand-gradient relative hidden overflow-hidden rounded-3xl p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div aria-hidden className="app-texture absolute inset-0 opacity-25" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,255,255,0.3),transparent_55%)]"
          />

          <div className="relative flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/95 text-xl font-bold text-primary shadow-lg">
              K
            </span>
            <span className="text-lg font-bold tracking-tight">KRAPP</span>
          </div>

          <div className="relative">
            <h2 className="text-3xl leading-tight font-bold tracking-[-0.02em]">
              Chat one-to-one,
              <br />
              without the noise.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
              Simple, fast conversations with the people you actually know.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm font-medium">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/20">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck className="size-4 shrink-0" aria-hidden />
            Free hobby project · be a good neighbour
          </p>
        </aside>

        {/* Form column */}
        <div className="w-full self-center">
          <div className="mb-6 flex flex-col items-center gap-3 text-center lg:mb-5">
            <AppLogo size="lg" className="lg:hidden" />
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.02em] text-text">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
            </div>
          </div>

          <div className="neu-raised rounded-2xl p-6 sm:p-7">{children}</div>

          {footer ? <div className="mt-5 text-center text-sm text-muted">{footer}</div> : null}

          <SafetyNotice className="mt-6 lg:hidden" />
        </div>
      </div>
    </div>
  )
}
