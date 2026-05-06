import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import type { Invoice, InvoiceStatus } from '../../../types/invoice'
import { useMyInvoices } from './queries'

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: 'Borrador',
  generated: 'Generada',
  sent: 'Enviada',
  reviewed: 'Revisada',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  paid: 'Pagada',
  cancelled: 'Anulada',
}

const STATUS_TONE: Record<InvoiceStatus, 'muted' | 'blue' | 'amber' | 'green' | 'red'> = {
  draft: 'muted',
  generated: 'blue',
  sent: 'blue',
  reviewed: 'amber',
  approved: 'green',
  paid: 'green',
  rejected: 'red',
  cancelled: 'muted',
}

export function InvoicesListPage() {
  const navigate = useNavigate()
  const { data: invoices = [], isLoading, error } = useMyInvoices()

  return (
    <AppShell
      title="Mis facturas"
      subtitle="Histórico de facturas generadas"
      breadcrumbs={[{ label: 'Mi facturación' }, { label: 'Facturas' }]}
      rightAction={
        <Button
          size="md"
          leftIcon={<Plus size={15} strokeWidth={2.4} />}
          onClick={() => navigate('/app/invoices/new')}
        >
          Generar factura
        </Button>
      }
    >
      <Card>
        {isLoading ? (
          <CardBody className="py-12 text-center text-sm text-muted">
            Cargando…
          </CardBody>
        ) : error ? (
          <CardBody className="py-12 text-center text-sm text-red">
            Error: {(error as Error).message}
          </CardBody>
        ) : invoices.length === 0 ? (
          <CardBody>
            <EmptyState onGenerate={() => navigate('/app/invoices/new')} />
          </CardBody>
        ) : (
          <ul className="divide-y divide-border">
            {invoices.map((inv) => (
              <InvoiceRow
                key={inv.id}
                invoice={inv}
                onClick={() => navigate(`/app/invoices/${inv.id}`)}
              />
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  )
}

function InvoiceRow({
  invoice,
  onClick,
}: {
  invoice: Invoice
  onClick: () => void
}) {
  const periodLabel = format(
    new Date(invoice.period_start + 'T00:00:00'),
    "MMMM 'de' yyyy",
    { locale: es },
  )

  return (
    <li
      onClick={onClick}
      className="flex cursor-pointer items-center gap-4 px-5 py-4 transition hover:bg-subtle/60"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-card bg-subtle text-muted">
        <FileText size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-medium text-text">
            {invoice.invoice_number}
          </span>
          <Pill tone={STATUS_TONE[invoice.status]} dot>
            {STATUS_LABEL[invoice.status]}
          </Pill>
        </div>
        <p className="mt-1 text-xs capitalize text-muted">
          {periodLabel} · Emitida el{' '}
          {format(new Date(invoice.invoice_date + 'T00:00:00'), 'd MMM yyyy', {
            locale: es,
          })}
        </p>
      </div>

      <div className="flex flex-col items-end">
        <div className="font-display tabular text-lg font-medium text-text">
          {formatCurrency(invoice.total, invoice.currency)}
        </div>
        <ChevronRight size={14} className="mt-0.5 text-muted" />
      </div>
    </li>
  )
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileText size={22} />
      </div>
      <h3 className="font-display mt-4 text-lg text-text">
        Aún no has generado facturas
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        Cuando termines de registrar tus horas o sea fin de mes, genera tu
        factura mensual con un solo click.
      </p>
      <Button
        size="md"
        leftIcon={<Plus size={15} strokeWidth={2.4} />}
        className="mt-5"
        onClick={onGenerate}
      >
        Generar mi primera factura
      </Button>
    </div>
  )
}

function formatCurrency(value: number, currency: string) {
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
  return `${formatted} ${currency}`
}
