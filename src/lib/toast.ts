import { useSyncExternalStore } from 'react'

/**
 * Tiny toast store (no context, callable from anywhere — including non-React
 * code later when Supabase calls start failing in Phase 3).
 */

export type ToastTone = 'default' | 'success' | 'danger'

export interface Toast {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
}

/** How long a toast stays on screen before auto-dismissing. */
const DURATION_MS = 4200
/** Keep the viewport uncluttered — older toasts drop off the top. */
const MAX_TOASTS = 3

let toasts: Toast[] = []
const listeners = new Set<() => void>()
const timers = new Map<string, number>()

function emit() {
  for (const listener of listeners) listener()
}

function clearTimer(id: string) {
  const timer = timers.get(id)
  if (timer !== undefined) {
    window.clearTimeout(timer)
    timers.delete(id)
  }
}

export function dismissToast(id: string) {
  clearTimer(id)
  if (!toasts.some((toast) => toast.id === id)) return
  toasts = toasts.filter((toast) => toast.id !== id)
  emit()
}

export function dismissAllToasts() {
  for (const id of timers.keys()) clearTimer(id)
  if (toasts.length === 0) return
  toasts = []
  emit()
}

export function pushToast({ title, description, tone = 'default' }: ToastInput): string {
  const id = `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
  const next = [...toasts, { id, title, description, tone }]

  // Drop the oldest toasts and their timers.
  while (next.length > MAX_TOASTS) {
    const dropped = next.shift()
    if (dropped) clearTimer(dropped.id)
  }

  toasts = next
  timers.set(id, window.setTimeout(() => dismissToast(id), DURATION_MS))
  emit()
  return id
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): Toast[] {
  return toasts
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
