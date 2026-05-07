import { useEffect, useState } from 'react'

/**
 * Fallback for lazy-loaded route chunks. Stays invisible for the first 180 ms
 * so cached chunks (instant) don't flash a spinner; after that, fades in a
 * cream-toned spinner over the app background.
 */
export function RouteFallback() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 180)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando"
      className="flex h-screen items-center justify-center bg-bg"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'var(--safe-area-bottom)',
      }}
    >
      <div
        className={`h-8 w-8 rounded-full border-2 border-border border-t-primary transition-opacity duration-200 ${
          show ? 'animate-spin opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
