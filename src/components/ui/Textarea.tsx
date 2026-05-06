import { forwardRef, useEffect, useRef, useState } from 'react'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  hint?: string
  /**
   * Whether to show the live character counter. Defaults to `true` when
   * `maxLength` is provided. Set to `false` to hide it explicitly.
   */
  showCounter?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error,
      hint,
      showCounter,
      maxLength,
      className = '',
      id,
      onChange,
      ...rest
    },
    forwardedRef,
  ) {
    const [length, setLength] = useState(0)
    const internalRef = useRef<HTMLTextAreaElement | null>(null)
    const textareaId = id || rest.name
    const counterEnabled = showCounter ?? Boolean(maxLength)

    // Forward ref + keep our own.
    const handleRef = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    }

    // Sync length with the DOM value on every render.
    // Catches programmatic value updates (e.g. RHF reset()) that don't fire
    // change events. Cheap because setState bails when the value is unchanged.
    useEffect(() => {
      const el = internalRef.current
      if (el) setLength(el.value.length)
    })

    // Counter color shifts as user approaches the limit.
    let counterTone = 'text-muted'
    if (maxLength) {
      const ratio = length / maxLength
      if (ratio >= 1) counterTone = 'text-amber'
      else if (ratio >= 0.9) counterTone = 'text-text-sec'
    }

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-text-sec"
          >
            {label}
          </label>
        )}
        <textarea
          ref={handleRef}
          id={textareaId}
          maxLength={maxLength}
          onChange={(e) => {
            setLength(e.target.value.length)
            onChange?.(e)
          }}
          {...rest}
          className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm font-medium text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? 'border-red/60' : 'border-border'
          } ${className}`}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {error ? (
              <p className="text-xs text-red">{error}</p>
            ) : hint ? (
              <p className="text-xs text-muted">{hint}</p>
            ) : null}
          </div>
          {counterEnabled && (
            <span className={`tabular text-xs ${counterTone}`}>
              {length}
              {maxLength ? `/${maxLength}` : ''}
            </span>
          )}
        </div>
      </div>
    )
  },
)
