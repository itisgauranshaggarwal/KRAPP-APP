const MS_MINUTE = 60 * 1000
const MS_HOUR = 60 * MS_MINUTE
const MS_DAY = 24 * MS_HOUR

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a) === startOfDay(b)
}

/** `14:05` - clock time used inside message bubbles. */
export function formatClock(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** WhatsApp-style list timestamp: clock today, `Yesterday`, weekday, else date. */
export function formatListTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (isSameDay(date, now)) return formatClock(iso)
  if (diff < 2 * MS_DAY) return 'Yesterday'
  if (diff < 7 * MS_DAY) return date.toLocaleDateString(undefined, { weekday: 'short' })
  return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' })
}

/** Day separator label inside a conversation. */
export function formatDaySeparator(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (isSameDay(date, now)) return 'Today'
  if (diff < 2 * MS_DAY) return 'Yesterday'
  if (diff < 7 * MS_DAY) return date.toLocaleDateString(undefined, { weekday: 'long' })
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Presence text: `online` or `last seen 12 min ago`. */
export function formatPresence(user: { online?: boolean; lastSeenAt?: string | null }): string {
  if (user.online) return 'online'
  if (!user.lastSeenAt) return 'offline'

  const diff = Date.now() - new Date(user.lastSeenAt).getTime()
  if (diff < MS_MINUTE) return 'last seen just now'
  if (diff < MS_HOUR) return `last seen ${Math.floor(diff / MS_MINUTE)} min ago`
  if (diff < MS_DAY) return `last seen ${Math.floor(diff / MS_HOUR)} h ago`
  return `last seen ${new Date(user.lastSeenAt).toLocaleDateString()}`
}

/** `0:42` voice-note duration. */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/** Human file size, e.g. `1.4 MB`. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}
