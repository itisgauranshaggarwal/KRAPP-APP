import { ShieldCheck } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Hobby-project disclaimer. Shown on the auth screens and in Profile → About.
 * Kept short and friendly, per product requirements.
 */
export function SafetyNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-line bg-surface-2 px-3.5 py-3 text-xs leading-relaxed text-muted',
        className,
      )}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <span>
        KRAPP is a hobby project, provided as-is. We are not responsible for data leakage. Please
        don&apos;t share sensitive personal info, and be a good neighbour.
      </span>
    </p>
  )
}
