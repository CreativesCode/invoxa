type Division = {
  amount: number
  singular: string
  plural: string
}

const DIVISIONS: Division[] = [
  { amount: 60, singular: 'segundo', plural: 'segundos' },
  { amount: 60, singular: 'minuto', plural: 'minutos' },
  { amount: 24, singular: 'hora', plural: 'horas' },
  { amount: 30, singular: 'día', plural: 'días' },
  { amount: 12, singular: 'mes', plural: 'meses' },
  { amount: Number.POSITIVE_INFINITY, singular: 'año', plural: 'años' },
]

/**
 * Spanish-only relative-time formatter, e.g. "hace 5 minutos", "en 2 horas".
 * Drop-in for `formatDistanceToNow(date, { addSuffix: true, locale: es })`
 * for the notifications use case — avoids pulling date-fns' pluralisation
 * tables into the bundle.
 */
export function formatRelativeEs(
  date: Date | string | number,
  options: { addSuffix?: boolean } = {},
): string {
  const target = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const diffSec = (Date.now() - target.getTime()) / 1000
  const past = diffSec >= 0
  let value = Math.abs(diffSec)

  for (const division of DIVISIONS) {
    if (value < division.amount) {
      const rounded = Math.max(1, Math.round(value))
      const noun = rounded === 1 ? division.singular : division.plural
      const core = `${rounded} ${noun}`
      if (!options.addSuffix) return core
      return past ? `hace ${core}` : `en ${core}`
    }
    value /= division.amount
  }
  return ''
}
