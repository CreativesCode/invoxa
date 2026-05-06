import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, placeholder, id, className = '', ...rest },
  ref,
) {
  const selectId = id || rest.name
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-text-sec"
        >
          {label}
        </label>
      )}
      <div
        className={`relative flex h-11 items-center rounded-xl border bg-surface transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20 ${
          error ? 'border-red/60' : 'border-border'
        }`}
      >
        <select
          ref={ref}
          id={selectId}
          {...rest}
          className={`h-full w-full appearance-none bg-transparent px-3.5 pr-9 text-sm font-medium text-text outline-none ${className}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 text-muted"
        />
      </div>
      {error ? (
        <p className="text-xs text-red">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
})
