const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export const money = (n: number) => cop.format(n)

export const compact = (n: number) =>
  new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

/** "2026-10-14" -> "14/10/2026" */
export const fmtDate = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`

/** Días desde hoy hasta la fecha ISO (negativo si ya pasó). */
export function daysUntil(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - t.getTime()) / 86_400_000)
}
