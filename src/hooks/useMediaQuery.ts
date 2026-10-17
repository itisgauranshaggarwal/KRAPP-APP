import { useSyncExternalStore } from 'react'

function subscribe(query: string, listener: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const list = window.matchMedia(query)
  list.addEventListener('change', listener)
  return () => list.removeEventListener('change', listener)
}

/** Subscribe to a CSS media query without effects. SSR-safe (false when unavailable). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (listener) => subscribe(query, listener),
    () => (typeof window === 'undefined' || !window.matchMedia ? false : window.matchMedia(query).matches),
    () => false,
  )
}

/** Tailwind `lg` breakpoint (1024px). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
