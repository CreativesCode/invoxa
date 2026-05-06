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
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2.5">
        {icon && (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneIconBg[tone]}`}
          >
            {icon}
          </div>
        )}
        <span className="text-xs font-medium text-muted">{label}</span>
      </div>
      <div className="font-display mt-3 text-3xl font-extrabold tracking-tighter2 text-text">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  )
}
