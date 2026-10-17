import { useId } from 'react'

import { cn } from '@/lib/utils'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

/** Flat toggle: neutral track, solid accent knob when on. */
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
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5',
          'transition-colors duration-150',
          'disabled:pointer-events-none disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-surface-3 border border-line-strong',
        )}
      >
        <span
          className={cn(
            'inline-block size-5 rounded-full transition-transform duration-150',
            checked
              ? 'translate-x-5 bg-white shadow-none'
              : 'translate-x-0 bg-white border border-line-strong',
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
