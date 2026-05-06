import { LogOut, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { useProfile } from '../../features/auth/useProfile'
import { NotificationsBell } from '../../features/notifications/NotificationsBell'

export function Topbar({
  title,
  subtitle,
  rightAction,
}: {
  title: string
  subtitle?: string
  rightAction?: ReactNode
}) {
  const { signOut } = useAuth()
  const { data: profile } = useProfile()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-bg px-7">
      <div className="min-w-0">
        <h1 className="font-display truncate text-lg font-bold tracking-tightish text-text">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-9 min-w-[280px] items-center gap-2 rounded-xl border border-border bg-subtle px-3 text-muted md:flex">
          <Search size={15} />
          <span className="text-xs">Buscar…</span>
          <span className="ml-auto rounded border border-border px-1.5 py-px text-[10px] font-semibold">
            ⌘K
          </span>
        </div>

        {profile && <NotificationsBell profile={profile} />}

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
