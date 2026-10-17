import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge conditional class names, resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** First letter (or two) of a name, for default avatars. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/** Deterministic soft color for a default avatar, derived from a string. */
export function avatarColor(seed: string): string {
  const palette = [
    '#7c5cff',
    '#a95cff',
    '#ff5c7f',
    '#ff8a5c',
    '#12b5b0',
    '#3b9dff',
    '#f0b429',
    '#e05fa8',
  ]
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return palette[Math.abs(hash) % palette.length]!
}
