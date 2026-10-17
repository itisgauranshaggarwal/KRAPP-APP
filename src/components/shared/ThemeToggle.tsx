import { Moon, Sun } from 'lucide-react'

import { IconButton } from '@/components/ui/IconButton'
import { useTheme } from '@/lib/theme'

/** Light/dark quick toggle. "System" mode is selectable in Profile settings. */
export function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <IconButton
      label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="neu"
      onClick={toggle}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </IconButton>
  )
}
