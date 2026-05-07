import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle2, Clock, Send, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import type {
  InvoiceRequestStatus,
  InvoiceRequestWithUser,
} from '../../../types/invoiceRequest'
import { NewInvoiceRequestModal } from './NewInvoiceRequestModal'
import { useAdminInvoiceRequests, useRequestInvoice } from './queries'

const STATUS_LABEL: Record<InvoiceRequestStatus, string> = {
  pending: 'Pendiente',
  completed: 'Completada',
  expired: 'Expirada',
}

const STATUS_TONE: Record<
  InvoiceRequestStatus,
  'amber' | 'green' | 'muted'
> = {
  pending: 'amber',
  completed: 'green',
  expired: 'muted',
}

type StatusFilter = InvoiceRequestStatus | 'all'

export function AdminInvoiceRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)

  const { data: requests = [], isLoading, error } = useAdminInvoiceRequests({
    status: statusFilter,
  })

  const stats = useMemo(() => {
    let pending = 0
    let completed = 0
    let expired = 0
    for (const r of requests) {
      if (r.status === 'pending') pending += 1
      else if (r.status === 'completed') completed += 1
      else if (r.status === 'expired') expired += 1
    }
    return { pending, completed, expired }
  }, [requests])

  return (
    <AppShell
      title="Solicitudes de factura"
      subtitle="Recordatorios enviados a los colaboradores"
      breadcrumbs={[{ label: 'Facturación' }, { label: 'Solicitudes' }]}
      rightAction={
        <Button
          size="md"
          leftIcon={<Send size={14} />}
          onClick={() => setModalOpen(true)}
          aria-label="Nueva solicitud"
        >
          <span className="hidden sm:inline">Nueva solicitud</span>
        </Button>
      }
    >
      {/* Quick stats */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MiniStat
          icon={<Clock size={14} />}
          label="Pendientes"
          value={stats.pending}
          tone="amber"
        />
        <MiniStat
          icon={<CheckCircle2 size={14} />}
          label="Completadas"
          value={stats.completed}
          tone="green"
        />
        <MiniStat
          icon={<XCircle size={14} />}
          label="Expiradas"
          value={stats.expired}
          tone="muted"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        {/* Mobile: chips */}
        <div className="scrollbar-none -mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 sm:hidden">
          {(
            [
              { value: 'all', label: 'Todas' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'completed', label: 'Completadas' },
              { value: 'expired', label: 'Expiradas' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`flex-shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === opt.value
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-surface text-text-sec hover:border-border-strong'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Desktop: segmented */}
        <div className="hidden rounded-xl border border-border bg-surface p-1 sm:flex">
          {(
            [
              { value: 'all', label: 'Todas' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'completed', label: 'Completadas' },
              { value: 'expired', label: 'Expiradas' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === opt.value
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-sec hover:text-text'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-muted">
            Cargando solicitudes…
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-red">
            Error: {(error as Error).message}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            hasFilter={statusFilter !== 'all'}
            onCreate={() => setModalOpen(true)}
          />
        ) : (
          <ul className="divide-y divide-border">
            {requests.map((req) => (
              <RequestRow key={req.id} request={req} />
            ))}
          </ul>
        )}
      </Card>

      <NewInvoiceRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  )
}

function RequestRow({ request }: { request: InvoiceRequestWithUser }) {
  const resend = useRequestInvoice()
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResend = async () => {
    setResendError(null)
    try {
      await resend.mutateAsync({
        userId: request.user_id,
        periodStart: request.period_start,
        periodEnd: request.period_end,
      })
    } catch (err) {
      setResendError(
        err instanceof Error ? err.message : 'Error al reenviar.',
      )
    }
  }

  return (
    <li className="flex flex-wrap items-start gap-3 px-5 py-4">
      <Avatar name={request.user?.full_name || request.user?.email || '?'} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-text">
            {request.user?.full_name || request.user?.email}
          </span>
          <Pill tone={STATUS_TONE[request.status]} dot>
            {STATUS_LABEL[request.status]}
          </Pill>
        </div>
        <p className="mt-1 text-xs text-muted">
          {request.user?.email}
          {request.user?.user_code ? ` · ${request.user.user_code}` : ''}
        </p>
        <p className="mt-2 text-xs text-text-sec capitalize">
          Periodo:{' '}
          {format(
            new Date(request.period_start + 'T00:00:00'),
            "MMMM 'de' yyyy",
            { locale: es },
          )}
        </p>
        <p className="mt-1 text-[11px] text-muted">
          Enviada{' '}
          {request.sent_at
            ? format(new Date(request.sent_at), "d MMM yyyy · HH:mm", {
                locale: es,
              })
            : '—'}
          {request.completed_at &&
            ` · Completada ${format(
              new Date(request.completed_at),
              "d MMM yyyy",
              { locale: es },
            )}`}
        </p>
        {resendError && (
          <p className="mt-1.5 rounded-card bg-red-soft px-2.5 py-1.5 text-xs text-red">
            {resendError}
          </p>
        )}
      </div>

      {request.status === 'pending' && (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Send size={12} />}
          onClick={handleResend}
          disabled={resend.isPending}
        >
          {resend.isPending ? 'Enviando…' : 'Reenviar'}
        </Button>
      )}
    </li>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white">
      {initials}
    </div>
  )
}

function MiniStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'amber' | 'green' | 'muted'
}) {
  const toneClass =
    tone === 'amber'
      ? 'bg-amber/10 text-amber'
      : tone === 'green'
        ? 'bg-green/10 text-green'
        : 'bg-subtle text-text-sec'
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${toneClass}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="font-display tabular text-xl font-bold text-text">
          {value}
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  hasFilter,
  onCreate,
}: {
  hasFilter: boolean
  onCreate: () => void
}) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Send size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        {hasFilter ? 'Sin resultados' : 'Aún no has enviado solicitudes'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {hasFilter
          ? 'Cambia el filtro para ver más resultados.'
          : 'Envía un recordatorio a tus colaboradores para que generen su factura del periodo.'}
      </p>
      {!hasFilter && (
        <Button
          size="md"
          leftIcon={<Send size={14} />}
          className="mt-5"
          onClick={onCreate}
        >
          Nueva solicitud
        </Button>
      )}
    </div>
  )
}
