import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn('block animate-pulse rounded-md bg-surface-3', className)}
      aria-hidden
    />
  )
}

/** Placeholder rows for lists (chats, contacts, requests). */
export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col px-3 py-2" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 border-b border-line px-2 py-3 last:border-b-0">
          <Skeleton className="size-11 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
