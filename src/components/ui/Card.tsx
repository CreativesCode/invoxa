import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-card border border-border bg-surface shadow-card ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  action,
  description,
}: {
  title: ReactNode
  action?: ReactNode
  description?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 md:gap-4 md:px-5 md:py-4">
      <div>
        <h3 className="font-display text-sm font-bold text-text md:text-base">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-[11px] text-muted md:mt-1 md:text-xs">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

export function CardBody({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`p-4 md:p-5 ${className}`}>{children}</div>
}
