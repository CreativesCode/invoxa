import { formatRelativeEs } from '../../lib/dates/relative'
import { Bell, CheckCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Profile } from '../../types/profile'
import type { AppNotification } from '../../types/notification'
import { getNotificationHref } from './helpers'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from './queries'

export function NotificationsBell({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data: notifications = [], isLoading } = useNotifications(20)
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.read_at).length

  // Cierra el dropdown al click fuera o con Escape.
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleItemClick = (n: AppNotification) => {
    if (!n.read_at) markRead.mutate(n.id)
    const href = getNotificationHref(n, profile.role)
    setOpen(false)
    if (href) navigate(href)
  }

  const seeAllHref =
    profile.role === 'admin' ? '/admin/notifications' : '/app/notifications'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-subtle text-text"
        aria-label="Notificaciones"
        aria-expanded={open}
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 border-subtle bg-red px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-2 top-[calc(var(--safe-area-top)+56px)] z-50 max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-surface shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-[360px]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="text-sm font-bold text-text">Notificaciones</div>
              <div className="text-[11px] text-muted">
                {unreadCount > 0
                  ? `${unreadCount} sin leer`
                  : 'Todo al día'}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-text-sec hover:bg-subtle"
              >
                <CheckCheck size={13} />
                Marcar todo como leído
              </button>
            )}
          </div>

          <div className="scrollbar-thin max-h-[420px] overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-6 text-center text-xs text-muted">
                Cargando…
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-muted">
                Aún no tienes notificaciones.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleItemClick(n)}
                  className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-subtle ${
                    !n.read_at ? 'bg-primary/5' : ''
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                      !n.read_at ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-text">
                      {n.title}
                    </div>
                    {n.body && (
                      <div className="mt-0.5 line-clamp-2 text-[11px] text-text-sec">
                        {n.body}
                      </div>
                    )}
                    <div className="mt-1 text-[10px] text-muted">
                      {formatRelativeEs(n.created_at, { addSuffix: true })}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate(seeAllHref)
            }}
            className="block w-full border-t border-border bg-bg px-4 py-2.5 text-center text-[11px] font-semibold text-primary hover:bg-subtle"
          >
            Ver todas
          </button>
        </div>
      )}
    </div>
  )
}
