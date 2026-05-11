export function daysSince(isoDate: string): number {
  const start = new Date(isoDate)
  start.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate)
  target.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000)
}

/** Next occurrence of a recurring date (birthday, yearly anniversary) */
export function nextOccurrence(isoDate: string): Date {
  const d = new Date(isoDate)
  const now = new Date()
  const thisYear = new Date(now.getFullYear(), d.getMonth(), d.getDate())
  return thisYear > now ? thisYear : new Date(now.getFullYear() + 1, d.getMonth(), d.getDate())
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short',
  })
}

export function formatRelative(isoDatetime: string): string {
  const diff = Date.now() - new Date(isoDatetime).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  <  1) return 'baru saja'
  if (mins  < 60) return `${mins}m lalu`
  if (hours < 24) return `${hours}j lalu`
  if (days  <  7) return `${days}h lalu`
  return formatShortDate(isoDatetime)
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
