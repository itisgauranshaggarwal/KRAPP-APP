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
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 grid w-full max-w-4xl gap-6 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel (desktop only) — flat ink, accent K mark. */}
        <aside className="hidden flex-col justify-between rounded-xl bg-panel p-8 lg:flex">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-contrast">
              K
            </span>
            <span className="text-lg font-semibold tracking-[-0.01em] text-panel-text">KRAPP</span>
          </div>

          <div>
            <h2 className="text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-panel-text">
              Chat one-to-one,
              <br />
              without the noise.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-panel-muted">
              Simple, fast conversations with the people you actually know.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-panel-muted">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="inline-flex size-5 items-center justify-center rounded-md bg-white/10">
                    <Check className="size-3 text-primary-contrast" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-center gap-2 text-xs text-panel-muted">
            <ShieldCheck className="size-4 shrink-0" aria-hidden />
            Free hobby project · be a good neighbour
          </p>
        </aside>

        {/* Form column */}
        <div className="w-full self-center">
          <div className="mb-6 flex flex-col items-center gap-3 text-center lg:mb-5">
            <AppLogo size="lg" withWordmark className="lg:hidden" />
            <div>
              <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.02em] text-text">
                {title}
              </h1>
              {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 sm:p-7">{children}</div>

          {footer ? <div className="mt-5 text-center text-sm text-muted">{footer}</div> : null}

          <SafetyNotice className="mt-6 lg:hidden" />
        </div>
      </div>
    </div>
  )
}
