import { Bell, LogOut, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'

type Crumb = { label: string }

export function Topbar({
  title,
  subtitle,
  breadcrumbs,
  rightAction,
}: {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
  rightAction?: ReactNode
}) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-bg px-7">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <span>{c.label}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display text-lg font-bold tracking-tightish text-text">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-9 min-w-[280px] items-center gap-2 rounded-xl border border-border bg-subtle px-3 text-muted md:flex">
          <Search size={15} />
          <span className="text-xs">Buscar…</span>
          <span className="ml-auto rounded border border-border px-1.5 py-px text-[10px] font-semibold">
            ⌘K
          </span>
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-subtle text-text"
          aria-label="Notificaciones"
        >
          <Bell size={17} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-subtle bg-red" />
        </button>

        {rightAction}

        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-text-sec hover:bg-subtle"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
