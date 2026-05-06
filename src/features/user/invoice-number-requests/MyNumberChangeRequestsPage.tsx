import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronRight, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Card } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import type {
  InvoiceNumberChangeRequestWithContext,
  InvoiceNumberChangeStatus,
} from '../../../types/invoiceNumberChange'
import { useInvoiceNumberChangeRequests } from '../../invoiceNumberChange/queries'

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

export function MyNumberChangeRequestsPage() {
  const { data: requests = [], isLoading, error } =
    useInvoiceNumberChangeRequests('all')

  return (
    <AppShell
      title="Solicitudes de consecutivo"
      subtitle="Cambios que has solicitado para tus facturas"
      breadcrumbs={[
        { label: 'Mi facturación' },
        { label: 'Solicitudes consecutivo' },
      ]}
    >
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
          <EmptyState />
        ) : (
          <ul className="divide-y divide-border">
            {requests.map((req) => (
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
  return (
    <Link
      to={`/app/invoices/${request.invoice_id}`}
      className="flex items-start gap-4 px-5 py-4 transition hover:bg-subtle/60"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-card bg-subtle text-muted">
        <ReceiptText size={16} />
      </div>
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
        {request.reason && (
          <p className="mt-1.5 line-clamp-2 text-xs text-text-sec">
            {request.reason}
          </p>
        )}
        <p className="mt-1.5 text-xs text-muted">
          Solicitada el{' '}
          {format(new Date(request.created_at), "d MMM yyyy · HH:mm", {
            locale: es,
          })}
          {request.reviewed_at &&
            ` · Resuelta ${format(
              new Date(request.reviewed_at),
              "d MMM yyyy · HH:mm",
              { locale: es },
            )}`}
        </p>
        {request.review_notes && (
          <p className="mt-1.5 rounded-card border border-border bg-subtle px-2.5 py-1.5 text-xs text-text-sec">
            <span className="font-semibold">Nota del admin:</span>{' '}
            {request.review_notes}
          </p>
        )}
      </div>
      <ChevronRight size={14} className="mt-1 text-muted" />
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ReceiptText size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        Aún no tienes solicitudes
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Si necesitas cambiar el número de una factura, ábrela y usa "Solicitar
        cambio de consecutivo".
      </p>
    </div>
  )
}
