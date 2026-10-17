import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

/** Neumorphic toggle: inset track, raised knob (raised -> inset when off). */
export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  const id = useId()

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'neu-inset relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1',
          'transition-colors duration-200',
          'disabled:pointer-events-none disabled:opacity-55',
          checked && 'bg-primary-soft',
        )}
      >
        <span
          className={cn(
            'inline-block size-5 rounded-full transition-transform duration-200',
            checked
              ? 'translate-x-5 bg-primary'
              : 'translate-x-0 bg-surface shadow-[2px_2px_4px_var(--shadow-dark),-1px_-1px_3px_var(--shadow-light)]',
          )}
        />
      </button>
      {label ? (
        <label htmlFor={id} className="cursor-pointer text-sm text-text">
          {label}
        </label>
      ) : null}
    </span>
  )
}
