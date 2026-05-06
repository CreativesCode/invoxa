import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, ReceiptText, X as XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import { Textarea } from '../../../components/ui/Textarea'
import type {
  InvoiceNumberChangeRequestWithContext,
  InvoiceNumberChangeStatus,
} from '../../../types/invoiceNumberChange'
import {
  useInvoiceNumberChangeRequests,
  useResolveInvoiceNumberChange,
} from '../../invoiceNumberChange/queries'

const STATUS_LABEL: Record<InvoiceNumberChangeStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  applied: 'Aplicada',
}

const STATUS_TONE: Record<
  InvoiceNumberChangeStatus,
  'amber' | 'green' | 'red' | 'muted'
> = {
  pending: 'amber',
  approved: 'green',
  applied: 'green',
  rejected: 'red',
}

type StatusFilter = 'pending' | 'resolved' | 'all'

export function AdminNumberChangeRequestsPage() {
  const [filter, setFilter] = useState<StatusFilter>('pending')
  const { data: allRequests = [], isLoading, error } =
    useInvoiceNumberChangeRequests('all')

  const filtered = useMemo(() => {
    if (filter === 'pending') {
      return allRequests.filter((r) => r.status === 'pending')
    }
    if (filter === 'resolved') {
      return allRequests.filter((r) => r.status !== 'pending')
    }
    return allRequests
  }, [allRequests, filter])

  const pendingCount = useMemo(
    () => allRequests.filter((r) => r.status === 'pending').length,
    [allRequests],
  )

  return (
    <AppShell
      title="Cambios de consecutivo"
      subtitle="Revisa y aprueba solicitudes de los colaboradores"
      breadcrumbs={[
        { label: 'Facturación' },
        { label: 'Cambios consecutivo' },
      ]}
      rightAction={
        pendingCount > 0 ? (
          <Pill tone="amber" dot>
            {pendingCount}{' '}
            {pendingCount === 1 ? 'pendiente' : 'pendientes'}
          </Pill>
        ) : null
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(
            [
              { value: 'pending', label: 'Pendientes' },
              { value: 'resolved', label: 'Resueltas' },
              { value: 'all', label: 'Todas' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === opt.value
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
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((req) => (
              <RequestRow key={req.id} request={req} />
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  )
}

function RequestRow({
  request,
}: {
  request: InvoiceNumberChangeRequestWithContext
}) {
  const resolve = useResolveInvoiceNumberChange()
  const [reviewNotes, setReviewNotes] = useState('')
  const [decisionError, setDecisionError] = useState<string | null>(null)
  const [showNotes, setShowNotes] = useState(false)

  const isPending = request.status === 'pending'

  const handle = async (decision: 'approve' | 'reject') => {
    setDecisionError(null)
    try {
      await resolve.mutateAsync({
        requestId: request.id,
        decision,
        reviewNotes: reviewNotes.trim() || undefined,
      })
      setReviewNotes('')
      setShowNotes(false)
    } catch (err) {
      setDecisionError(
        err instanceof Error ? err.message : 'Error al resolver la solicitud.',
      )
    }
  }

  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs text-text-sec line-through">
              {request.current_invoice_number}
            </span>
            <span className="text-muted">→</span>
            <span className="font-mono text-sm font-medium text-text">
              {request.requested_invoice_number}
            </span>
            <Pill tone={STATUS_TONE[request.status]} dot>
              {STATUS_LABEL[request.status]}
            </Pill>
          </div>

          <p className="mt-1.5 text-xs text-muted">
            <span className="font-medium text-text-sec">
              {request.requester?.full_name || request.requester?.email}
            </span>{' '}
            · solicitó el{' '}
            {format(new Date(request.created_at), "d MMM yyyy · HH:mm", {
              locale: es,
            })}
          </p>

          {request.reason && (
            <p className="mt-2 text-xs text-text-sec">
              <span className="font-semibold">Motivo:</span> {request.reason}
            </p>
          )}

          <Link
            to={`/admin/invoices/${request.invoice_id}`}
            className="mt-2 inline-block text-xs font-medium text-primary hover:text-primary-dark"
          >
            Ver factura →
          </Link>

          {!isPending && request.review_notes && (
            <p className="mt-2 rounded-card border border-border bg-subtle px-2.5 py-1.5 text-xs text-text-sec">
              <span className="font-semibold">Nota:</span>{' '}
              {request.review_notes}
            </p>
          )}

          {!isPending && request.reviewed_at && (
            <p className="mt-1.5 text-[11px] text-muted">
              Resuelta el{' '}
              {format(
                new Date(request.reviewed_at),
                "d MMM yyyy · HH:mm",
                { locale: es },
              )}
            </p>
          )}
        </div>

        {isPending && !showNotes && (
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<XIcon size={13} />}
              onClick={() => {
                setShowNotes(true)
              }}
              disabled={resolve.isPending}
            >
              Resolver
            </Button>
          </div>
        )}
      </div>

      {isPending && showNotes && (
        <div className="mt-3 space-y-2.5 rounded-card border border-border bg-subtle p-3">
          <Textarea
            label="Nota para el colaborador (opcional)"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Ej. Aplicado tras verificar duplicado…"
          />
          {decisionError && (
            <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
              {decisionError}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              leftIcon={<Check size={13} />}
              onClick={() => handle('approve')}
              disabled={resolve.isPending}
            >
              {resolve.isPending ? 'Aplicando…' : 'Aprobar y aplicar'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<XIcon size={13} />}
              onClick={() => handle('reject')}
              disabled={resolve.isPending}
            >
              Rechazar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowNotes(false)
                setReviewNotes('')
                setDecisionError(null)
              }}
              disabled={resolve.isPending}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}

function EmptyState({ filter }: { filter: StatusFilter }) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ReceiptText size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        {filter === 'pending'
          ? 'No hay solicitudes pendientes'
          : 'Sin resultados'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {filter === 'pending'
          ? 'Cuando un colaborador pida un cambio de consecutivo aparecerá aquí.'
          : 'Cambia el filtro para ver otras solicitudes.'}
      </p>
    </div>
  )
}
