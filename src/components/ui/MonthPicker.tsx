import { addMonths, format, isSameMonth, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function MonthPicker({
  value,
  onChange,
}: {
  value: Date
  onChange: (next: Date) => void
}) {
  const today = new Date()
  const isCurrent = isSameMonth(value, today)

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 items-center rounded-full border border-border bg-surface">
        <button
          type="button"
          onClick={() => onChange(subMonths(value, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-l-full text-muted hover:bg-subtle hover:text-text"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="font-display min-w-[140px] px-3 text-center text-sm font-medium capitalize text-text">
          {format(value, 'MMMM yyyy', { locale: es })}
        </div>
        <button
          type="button"
          onClick={() => onChange(addMonths(value, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-r-full text-muted hover:bg-subtle hover:text-text"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      {!isCurrent && (
        <button
          type="button"
          onClick={() => onChange(today)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-sec hover:bg-subtle"
        >
          Hoy
        </button>
      )}
    </div>
  )
}
