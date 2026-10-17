import { useEffect, useState } from 'react'

/** Subscribe to a CSS media query. SSR-safe (defaults to false when unavailable). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const list = window.matchMedia(query)
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)

    setMatches(list.matches)
    list.addEventListener('change', listener)
    return () => list.removeEventListener('change', listener)
  }, [query])

  return matches
}

/** Tailwind `lg` breakpoint (1024px). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
