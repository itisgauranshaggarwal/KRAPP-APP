import { cn } from '@/lib/utils'

export interface TabItem {
  value: string
  label: string
  count?: number
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/** Segmented neumorphic control (inset track, active pill raised). */
export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('neu-inset flex gap-1 rounded-2xl p-1', className)}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium',
              'transition-[box-shadow,color] duration-150',
              active
                ? 'neu-raised-sm text-primary'
                : 'text-muted hover:text-text',
            )}
          >
            {item.label}
            {typeof item.count === 'number' && item.count > 0 ? (
              <span className="rounded-full bg-primary-soft px-1.5 text-[11px] font-semibold text-primary">
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
