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

/** Underline tabs — text-led, no container chrome. */
export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex gap-5 border-b border-line', className)}>
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
              'relative -mb-px flex items-center gap-1.5 pb-2.5 text-sm',
              'transition-colors duration-100',
              active
                ? 'border-b-2 border-primary font-semibold text-text'
                : 'border-b-2 border-transparent font-medium text-muted hover:text-text',
            )}
          >
            {item.label}
            {typeof item.count === 'number' && item.count > 0 ? (
              <span
                className={cn(
                  'rounded-md px-1 py-px text-[11px] leading-4 font-semibold',
                  active ? 'bg-primary-soft text-primary' : 'bg-surface-3 text-muted',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
