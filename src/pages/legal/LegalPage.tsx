import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AppLogo } from '@/components/shared/AppLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

type LegalKind = 'terms' | 'privacy'

const content: Record<LegalKind, { title: string; intro: string; sections: { title: string; body: string }[] }> = {
  terms: {
    title: 'Terms of service',
    intro: 'KRAPP is a small hobby project for simple 1:1 conversations.',
    sections: [
      {
        title: 'Use it thoughtfully',
        body: 'Use KRAPP lawfully and respectfully. Do not impersonate people, harass others, or use the service to harm anyone.',
      },
      {
        title: 'No guarantees',
        body: 'This project is provided as-is for experimentation. Availability, message delivery, privacy, and data retention are not guaranteed.',
      },
      {
        title: 'Your responsibility',
        body: 'You are responsible for the account details and content you choose to share. Do not share anything you would not want exposed online.',
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    intro: 'This hobby project collects only the information needed to provide the chat experience.',
    sections: [
      {
        title: 'What we store',
        body: 'KRAPP may store your account identity, profile details, contact requests, and messages in the connected Supabase project.',
      },
      {
        title: 'What we do not promise',
        body: 'No secure messaging or complete confidentiality is guaranteed. This is not an end-to-end encrypted service.',
      },
      {
        title: 'Stay safe',
        body: 'Do not share passwords, financial details, private documents, or other sensitive personal data. Be a good neighbour.',
      },
    ],
  },
}

export function LegalPage({ kind }: { kind: LegalKind }) {
  const page = content[kind]

  return (
    <main className="min-h-screen overflow-y-auto bg-bg px-4 py-5 scroll-soft sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/login" aria-label="Back to login">
            <AppLogo size="md" withWordmark />
          </Link>
          <ThemeToggle />
        </div>

        <article className="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-8">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
            <ArrowLeft className="size-4" aria-hidden />
            Back to KRAPP
          </Link>
          <div className="mt-6 flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text">{page.title}</h1>
              <p className="mt-1 text-sm leading-relaxed text-muted">{page.intro}</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-sm font-semibold text-text">{section.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 border-t border-line pt-4 text-xs leading-relaxed text-faint">
            Last updated October 2026. This is a plain-language hobby-project notice, not legal advice.
          </p>
        </article>
      </div>
    </main>
  )
}

export function TermsPage() {
  return <LegalPage kind="terms" />
}

export function PrivacyPage() {
  return <LegalPage kind="privacy" />
}
