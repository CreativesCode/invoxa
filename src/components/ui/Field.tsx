import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
  trailing?: ReactNode
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, trailing, className = '', id, ...rest },
  ref,
) {
  const inputId = id || rest.name
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-text-sec"
        >
          {label}
        </label>
      )}
      <div
        className={`flex h-11 items-center gap-2 rounded-xl border bg-surface px-3.5 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 ${
          error ? 'border-red/60' : 'border-border'
        }`}
      >
        <input
          ref={ref}
          id={inputId}
          {...rest}
          className={`flex-1 bg-transparent text-sm font-medium text-text outline-none placeholder:text-muted ${className}`}
        />
        {trailing && <span className="text-muted">{trailing}</span>}
      </div>
      {error ? (
        <p className="text-xs text-red">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
})
