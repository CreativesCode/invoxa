import type { ReactNode } from 'react'

type Tone = 'primary' | 'amber' | 'red' | 'green' | 'blue' | 'violet' | 'muted'

const toneSoft: Record<Tone, string> = {
  primary: 'bg-primary/15 text-primary',
  amber: 'bg-amber/15 text-amber',
  red: 'bg-red/15 text-red',
  green: 'bg-green/15 text-green',
  blue: 'bg-blue/15 text-blue',
  violet: 'bg-violet/15 text-violet',
  muted: 'bg-subtle2 text-text-sec',
}

const toneSolid: Record<Tone, string> = {
  primary: 'bg-primary text-white',
  amber: 'bg-amber text-white',
  red: 'bg-red text-white',
  green: 'bg-green text-white',
  blue: 'bg-blue text-white',
  violet: 'bg-violet text-white',
  muted: 'bg-text text-white',
}

export function Pill({
  children,
  tone = 'primary',
  solid = false,
  dot = false,
}: {
  children: ReactNode
  tone?: Tone
  solid?: boolean
  dot?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        solid ? toneSolid[tone] : toneSoft[tone]
      }`}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {children}
    </span>
  )
}
