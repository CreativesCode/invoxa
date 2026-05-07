import type { ReactNode } from 'react'

type Tone = 'primary' | 'amber' | 'red' | 'green' | 'blue' | 'violet'

const toneIconBg: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary',
  amber: 'bg-amber/10 text-amber',
  red: 'bg-red/10 text-red',
  green: 'bg-green/10 text-green',
  blue: 'bg-blue/10 text-blue',
  violet: 'bg-violet/10 text-violet',
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'primary',
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  tone?: Tone
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3.5 md:p-5">
      <div className="flex items-center gap-2 md:gap-2.5">
        {icon && (
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg md:h-8 md:w-8 ${toneIconBg[tone]}`}
          >
            {icon}
          </div>
        )}
        <span className="line-clamp-2 text-[11px] font-medium leading-tight text-muted md:text-xs">
          {label}
        </span>
      </div>
      <div className="font-display mt-2 text-2xl font-extrabold tracking-tighter2 text-text md:mt-3 md:text-3xl">
        {value}
      </div>
      {hint && (
        <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted md:mt-1 md:text-xs">
          {hint}
        </div>
      )}
    </div>
  )
}
