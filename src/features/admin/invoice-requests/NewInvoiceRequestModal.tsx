import { endOfMonth, format, startOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { Send, Users, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { MonthPicker } from '../../../components/ui/MonthPicker'
import type { Profile } from '../../../types/profile'
import { useUsers } from '../users/queries'
import { useRequestInvoicesBulk, type BulkSummary } from './queries'

type Mode = 'all-active' | 'select'

const SKIP_REASON_LABEL: Record<BulkSummary['skipped'][number]['reason'], string> = {
  invoice_already_exists: 'Ya tiene factura del periodo',
  user_inactive: 'Usuario inactivo',
  no_active_projects: 'Sin proyectos activos',
  user_not_found: 'Usuario no encontrado',
}

export function NewInvoiceRequestModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [mode, setMode] = useState<Mode>('all-active')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [period, setPeriod] = useState(() => new Date())
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<BulkSummary | null>(null)

  const { data: users = [] } = useUsers()
  const requestBulk = useRequestInvoicesBulk()

  const isPending = requestBulk.isPending

  const periodStart = format(startOfMonth(period), 'yyyy-MM-dd')
  const periodEnd = format(endOfMonth(period), 'yyyy-MM-dd')

  const activeUsers = useMemo(
    () => users.filter((u) => u.role === 'user' && u.status === 'active'),
    [users],
  )

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return activeUsers
    const q = search.toLowerCase()
    return activeUsers.filter((u) => {
      const haystack = `${u.full_name ?? ''} ${u.email} ${u.user_code ?? ''}`
      return haystack.toLowerCase().includes(q)
    })
  }, [activeUsers, search])

  if (!open) return null

  const handleClose = () => {
    setSelectedIds([])
    setSearch('')
    setError(null)
    setSummary(null)
    setMode('all-active')
    onClose()
  }

  const toggleUser = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const handleSubmit = async () => {
    setError(null)
    setSummary(null)

    if (mode === 'select' && selectedIds.length === 0) {
      setError('Selecciona al menos un colaborador.')
      return
    }

    try {
      const result = await requestBulk.mutateAsync({
        userIds: mode === 'select' ? selectedIds : undefined,
        periodStart,
        periodEnd,
      })
      setSummary(result.summary)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al enviar las solicitudes.',
      )
    }
  }

  const userById = (id: string) => users.find((u) => u.id === id)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 px-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-xl flex-col rounded-card border border-border bg-surface shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-display text-base font-bold text-text">
              Solicitar facturas
            </h3>
            <p className="mt-1 text-xs text-muted">
              Envía un recordatorio para que los colaboradores generen sus
              facturas del periodo.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-text"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {summary ? (
          <SummaryView
            summary={summary}
            getUser={userById}
            onClose={handleClose}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="space-y-4 px-5 py-4">
              {/* Period */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-sec">
                  Periodo
                </label>
                <MonthPicker value={period} onChange={setPeriod} />
                <p className="mt-1.5 text-xs text-muted capitalize">
                  {format(startOfMonth(period), "d 'de' MMM", { locale: es })}{' '}
                  →{' '}
                  {format(endOfMonth(period), "d 'de' MMM yyyy", {
                    locale: es,
                  })}
                </p>
              </div>

              {/* Mode toggle */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-sec">
                  Destinatarios
                </label>
                <div className="flex rounded-xl border border-border bg-bg p-1">
                  <ModeButton
                    active={mode === 'all-active'}
                    onClick={() => setMode('all-active')}
                    label="Todos los activos"
                  />
                  <ModeButton
                    active={mode === 'select'}
                    onClick={() => setMode('select')}
                    label="Selección manual"
                  />
                </div>
                {mode === 'all-active' && (
                  <p className="mt-2 text-xs text-muted">
                    Se enviará a todos los colaboradores activos con proyectos
                    asignados ({activeUsers.length}).
                  </p>
                )}
              </div>

              {/* User selector */}
              {mode === 'select' && (
                <div className="flex min-h-0 flex-col">
                  <input
                    type="text"
                    placeholder="Buscar colaborador…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 h-9 rounded-xl border border-border bg-bg px-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/20"
                  />
                  <div className="max-h-[260px] overflow-y-auto rounded-xl border border-border">
                    {filteredUsers.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-muted">
                        No hay colaboradores que coincidan.
                      </p>
                    ) : (
                      <ul className="divide-y divide-border">
                        {filteredUsers.map((u) => (
                          <li key={u.id}>
                            <label className="flex cursor-pointer items-start gap-3 px-3 py-2.5 hover:bg-subtle">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(u.id)}
                                onChange={() => toggleUser(u.id)}
                                className="mt-0.5 h-4 w-4 accent-primary"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-text">
                                  {u.full_name || u.email}
                                </div>
                                <div className="mt-0.5 text-xs text-muted">
                                  {u.email}
                                  {u.user_code ? ` · ${u.user_code}` : ''}
                                </div>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {selectedIds.length > 0 && (
                    <p className="mt-2 text-xs text-text-sec">
                      {selectedIds.length}{' '}
                      {selectedIds.length === 1
                        ? 'colaborador seleccionado'
                        : 'colaboradores seleccionados'}
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-2 border-t border-border px-5 py-4">
              <Button
                fullWidth
                size="md"
                leftIcon={<Send size={14} />}
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? 'Enviando…' : 'Enviar solicitudes'}
              </Button>
              <Button
                fullWidth
                variant="ghost"
                size="md"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active ? 'bg-primary/10 text-primary' : 'text-text-sec hover:text-text'
      }`}
    >
      {label}
    </button>
  )
}

function SummaryView({
  summary,
  getUser,
  onClose,
}: {
  summary: BulkSummary
  getUser: (id: string) => Profile | undefined
  onClose: () => void
}) {
  const totalSent = summary.created + summary.refreshed
  return (
    <div className="px-5 py-5">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
          <Users size={20} />
        </div>
        <h4 className="font-display mt-3 text-base font-bold text-text">
          {totalSent === 0
            ? 'No se envió ninguna solicitud'
            : `${totalSent} ${
                totalSent === 1 ? 'solicitud enviada' : 'solicitudes enviadas'
              }`}
        </h4>
        <p className="mt-1 text-xs text-muted">
          {summary.created} nuevas · {summary.refreshed} actualizadas ·{' '}
          {summary.skipped.length} omitidas
        </p>
      </div>

      {summary.skipped.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold text-text-sec">
            Omitidos
          </p>
          <ul className="max-h-[180px] space-y-1.5 overflow-y-auto">
            {summary.skipped.map((s) => {
              const u = getUser(s.user_id)
              return (
                <li
                  key={s.user_id}
                  className="flex items-center justify-between rounded-card border border-border bg-subtle px-3 py-2 text-xs"
                >
                  <span className="font-semibold text-text">
                    {u?.full_name || u?.email || s.user_id}
                  </span>
                  <span className="text-muted">
                    {SKIP_REASON_LABEL[s.reason]}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <Button
        fullWidth
        size="md"
        className="mt-5"
        onClick={onClose}
      >
        Cerrar
      </Button>
    </div>
  )
}
