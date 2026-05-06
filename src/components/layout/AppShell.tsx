import type { ReactNode } from 'react'
import { useProfile } from '../../features/auth/useProfile'
import { useNotificationsRealtime } from '../../features/notifications/useNotificationsRealtime'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

type Crumb = { label: string }

export function AppShell({
  title,
  subtitle,
  breadcrumbs,
  rightAction,
  children,
}: {
  title: string
  subtitle?: string
  breadcrumbs?: Crumb[]
  rightAction?: ReactNode
  children: ReactNode
}) {
  const { data: profile } = useProfile()
  useNotificationsRealtime()

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted">
        Cargando…
      </div>
    )
  }

  return (
    <div
      className="flex h-screen bg-subtle text-text"
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'var(--safe-area-bottom)',
      }}
    >
      <Sidebar profile={profile} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
        />
        <main className="scrollbar-thin flex-1 overflow-y-auto p-6">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center gap-1.5 text-[11px] text-muted"
            >
              {breadcrumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span>/</span>}
                  <span>{c.label}</span>
                </span>
              ))}
            </nav>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
