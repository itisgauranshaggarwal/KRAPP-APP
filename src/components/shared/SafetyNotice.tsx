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
        'hairline flex items-start gap-2.5 rounded-xl bg-surface-2/60 p-3.5 text-xs leading-relaxed text-muted',
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
