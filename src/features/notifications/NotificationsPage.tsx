import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatRelativeEs } from '../../lib/dates/relative'
import { Bell, CheckCheck, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useProfile } from '../auth/useProfile'
import type { AppNotification } from '../../types/notification'
import { getNotificationHref } from './helpers'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from './queries'

export function NotificationsPage() {
  const { data: profile } = useProfile()
  const { data: notifications = [], isLoading, error } = useNotifications(100)
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const navigate = useNavigate()

  const unreadCount = notifications.filter((n) => !n.read_at).length
  const breadcrumbs =
    profile?.role === 'admin'
      ? [{ label: 'Admin' }, { label: 'Notificaciones' }]
      : [{ label: 'Mi cuenta' }, { label: 'Notificaciones' }]

  const handleClick = (n: AppNotification) => {
    if (!profile) return
    if (!n.read_at) markRead.mutate(n.id)
    const href = getNotificationHref(n, profile.role)
    if (href) navigate(href)
  }

  return (
    <AppShell
      title="Notificaciones"
      subtitle="Eventos importantes de tu cuenta"
      breadcrumbs={breadcrumbs}
      rightAction={
        unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            leftIcon={<CheckCheck size={14} />}
            aria-label="Marcar todo como leído"
          >
            <span className="hidden sm:inline">Marcar todo como leído</span>
          </Button>
        ) : undefined
      }
    >
      <Card>
        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-muted">
            Cargando notificaciones…
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-red">
            Error: {(error as Error).message}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => handleClick(n)}
                  className={`flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-subtle/60 ${
                    !n.read_at ? 'bg-primary/5' : ''
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-card ${
                      !n.read_at
                        ? 'bg-primary/10 text-primary'
                        : 'bg-subtle text-muted'
                    }`}
                  >
                    <Bell size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text">
                        {n.title}
                      </span>
                      {!n.read_at && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    {n.body && (
                      <p className="mt-1 text-xs text-text-sec">{n.body}</p>
                    )}
                    <p className="mt-1.5 text-[11px] text-muted">
                      {formatRelativeEs(n.created_at, { addSuffix: true })}{' '}
                      ·{' '}
                      {format(new Date(n.created_at), 'd MMM yyyy · HH:mm', {
                        locale: es,
                      })}
                    </p>
                  </div>
                  <ChevronRight size={14} className="mt-1 text-muted" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Bell size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        Sin notificaciones
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Aquí aparecerán las solicitudes de factura, cambios de estado y
        actualizaciones importantes de tu cuenta.
      </p>
    </div>
  )
}
