import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  History,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Field } from '../../../components/ui/Field'
import { Pill } from '../../../components/ui/Pill'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { openExternalUrl } from '../../../lib/native/openUrl'
import { useInvoiceNumberHistory } from '../../invoiceNumberChange/queries'
import {
  getInvoicePdfSignedUrl,
  useGenerateInvoicePdf,
} from '../../user/invoices/queries'
import {
  INVOICE_STATUS_TRANSITIONS,
  canTransitionInvoiceStatus,
  isInvoiceStatusTerminal,
  type InvoiceStatus,
} from '../../../types/invoice'
import {
  useAdminChangeInvoiceNumber,
  useAdminInvoice,
  useUpdateInvoiceStatus,
} from './queries'

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

const STATUS_TONE: Record<
  InvoiceStatus,
  'muted' | 'blue' | 'amber' | 'green' | 'red'
> = {
  draft: 'muted',
  generated: 'blue',
  sent: 'blue',
  reviewed: 'amber',
  approved: 'green',
  paid: 'green',
  rejected: 'red',
  cancelled: 'muted',
}

function statusOptionsFor(current: InvoiceStatus) {
  // The current status is always selectable (no-op), then the allowed
  // transitions follow. Anything else is omitted entirely.
  const allowed = new Set<InvoiceStatus>([
    current,
    ...INVOICE_STATUS_TRANSITIONS[current],
  ])
  return (Object.keys(STATUS_LABEL) as InvoiceStatus[])
    .filter((s) => allowed.has(s))
    .map((s) => ({ value: s, label: STATUS_LABEL[s] }))
}

export function AdminInvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: invoice, isLoading, error } = useAdminInvoice(id)
  const { data: history = [] } = useInvoiceNumberHistory(id)

  const updateStatus = useUpdateInvoiceStatus()
  const generatePdf = useGenerateInvoicePdf()
  const changeNumber = useAdminChangeInvoiceNumber()

  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const [statusError, setStatusError] = useState<string | null>(null)
  const [editingNumber, setEditingNumber] = useState(false)
  const [newNumber, setNewNumber] = useState('')
  const [changeReason, setChangeReason] = useState('')
  const [changeError, setChangeError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!invoice?.pdf_url) return
    setPdfError(null)
    setPdfBusy(true)
    try {
      const url = await getInvoicePdfSignedUrl(invoice.pdf_url, 60)
      if (!url) {
        setPdfError('No se pudo abrir el PDF. Intenta regenerarlo.')
        return
      }
      await openExternalUrl(url)
    } finally {
      setPdfBusy(false)
    }
  }

  const handleRegenerate = async () => {
    if (!invoice) return
    setPdfError(null)
    try {
      await generatePdf.mutateAsync(invoice.id)
    } catch (err) {
      setPdfError(
        err instanceof Error ? err.message : 'Error al generar el PDF.',
      )
    }
  }

  const handleStatusChange = async (next: InvoiceStatus) => {
    if (!invoice || next === invoice.status) return
    setStatusError(null)
    try {
      await updateStatus.mutateAsync({ id: invoice.id, status: next })
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : 'Error al cambiar el estado.',
      )
    }
  }

  const startEditNumber = () => {
    if (!invoice) return
    setNewNumber(invoice.invoice_number)
    setChangeReason('')
    setChangeError(null)
    setEditingNumber(true)
  }

  const submitNumberChange = async () => {
    if (!invoice) return
    setChangeError(null)
    const trimmed = newNumber.trim()
    if (!trimmed) {
      setChangeError('El nuevo número no puede estar vacío.')
      return
    }
    if (trimmed === invoice.invoice_number) {
      setChangeError('Debe ser distinto al número actual.')
      return
    }
    try {
      await changeNumber.mutateAsync({
        invoiceId: invoice.id,
        newInvoiceNumber: trimmed,
        reason: changeReason.trim() || undefined,
      })
      setEditingNumber(false)
    } catch (err) {
      setChangeError(
        err instanceof Error ? err.message : 'Error al cambiar el número.',
      )
    }
  }

  if (isLoading) {
    return (
      <AppShell title="Cargando…">
        <div className="px-5 py-12 text-center text-sm text-muted">
          Cargando factura…
        </div>
      </AppShell>
    )
  }

  if (error || !invoice) {
    return (
      <AppShell title="Factura no encontrada">
        <Link
          to="/admin/invoices"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-text-sec"
        >
          <ArrowLeft size={13} /> Volver a facturas
        </Link>
        <Card>
          <CardBody>
            <p className="text-sm text-red">
              {error
                ? (error as Error).message
                : 'No se encontró la factura solicitada.'}
            </p>
          </CardBody>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell
      title={invoice.invoice_number}
      subtitle={`${invoice.user?.full_name || invoice.user?.email} · ${format(
        new Date(invoice.period_start + 'T00:00:00'),
        "MMMM 'de' yyyy",
        { locale: es },
      )}`}
      breadcrumbs={[
        { label: 'Facturación' },
        { label: 'Facturas' },
        { label: invoice.invoice_number },
      ]}
      rightAction={
        <Pill tone={STATUS_TONE[invoice.status]} dot>
          {STATUS_LABEL[invoice.status]}
        </Pill>
      }
    >
      <Link
        to="/admin/invoices"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-text-sec"
      >
        <ArrowLeft size={13} /> Volver a facturas
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Items + totals */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Detalle por proyecto"
              description={`${invoice.items.length} ${
                invoice.items.length === 1 ? 'ítem' : 'ítems'
              }`}
            />
            <ul className="divide-y divide-border">
              {invoice.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-4 px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base font-medium text-text">
                        {item.project.name}
                      </span>
                      <Pill
                        tone={
                          item.payment_type === 'hourly' ? 'blue' : 'violet'
                        }
                      >
                        {item.payment_type === 'hourly'
                          ? 'Por hora'
                          : 'Fijo mensual'}
                      </Pill>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {item.description}
                    </p>
                    <p className="mt-2 font-mono text-xs text-text-sec">
                      {formatNumber(item.quantity)}{' '}
                      {item.payment_type === 'hourly' ? 'h' : '×'} ·{' '}
                      {formatCurrency(item.unit_price, invoice.currency)}
                    </p>
                  </div>
                  <div className="font-display tabular text-base font-medium text-text">
                    {formatCurrency(item.total, invoice.currency)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <div className="font-display tabular text-base text-text">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </div>
              </div>
              {invoice.tax_amount > 0 && (
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-sm text-muted">Impuestos</span>
                  <div className="font-display tabular text-base text-text">
                    {formatCurrency(invoice.tax_amount, invoice.currency)}
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-xs uppercase tracking-[0.08em] text-muted">
                  Total
                </span>
                <div className="font-display tabular text-3xl font-medium text-text">
                  {formatCurrency(invoice.total, invoice.currency)}
                </div>
              </div>
            </div>
          </Card>

          {invoice.notes && (
            <Card>
              <CardHeader title="Observaciones" />
              <CardBody>
                <p className="whitespace-pre-line text-sm text-text-sec">
                  {invoice.notes}
                </p>
              </CardBody>
            </Card>
          )}

          {history.length > 0 && (
            <Card>
              <CardHeader
                title="Historial del consecutivo"
                description={`${history.length} ${history.length === 1 ? 'cambio' : 'cambios'}`}
              />
              <ul className="divide-y divide-border">
                {history.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start gap-3 px-5 py-3.5"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-subtle text-muted">
                      <History size={14} />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-text-sec line-through">
                          {entry.previous_invoice_number}
                        </span>
                        <span className="text-muted">→</span>
                        <span className="font-mono font-semibold text-text">
                          {entry.new_invoice_number}
                        </span>
                      </div>
                      <p className="mt-1 text-muted">
                        {format(
                          new Date(entry.changed_at),
                          "d MMM yyyy · HH:mm",
                          { locale: es },
                        )}
                        {entry.reason ? ` — ${entry.reason}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status management */}
          <Card>
            <CardHeader title="Estado" />
            <CardBody className="space-y-3">
              {isInvoiceStatusTerminal(invoice.status) ? (
                <div className="rounded-card border border-border bg-subtle px-3.5 py-2.5 text-xs text-muted">
                  Esta factura está en un estado final
                  {' ('}
                  <span className="font-medium text-text-sec">
                    {STATUS_LABEL[invoice.status]}
                  </span>
                  {') '}
                  y no admite más cambios de estado.
                </div>
              ) : (
                <Select
                  options={statusOptionsFor(invoice.status)}
                  value={invoice.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as InvoiceStatus)
                  }
                  disabled={updateStatus.isPending}
                  hint="Solo se muestran las transiciones permitidas."
                />
              )}
              {statusError && (
                <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
                  {statusError}
                </p>
              )}

              {!isInvoiceStatusTerminal(invoice.status) && (
                <div className="grid grid-cols-2 gap-2">
                  <QuickStatusButton
                    icon={<Clock size={14} />}
                    label="En revisión"
                    active={invoice.status === 'reviewed'}
                    onClick={() => handleStatusChange('reviewed')}
                    disabled={
                      updateStatus.isPending ||
                      !canTransitionInvoiceStatus(invoice.status, 'reviewed')
                    }
                    tone="amber"
                  />
                  <QuickStatusButton
                    icon={<CheckCircle2 size={14} />}
                    label="Aprobar"
                    active={invoice.status === 'approved'}
                    onClick={() => handleStatusChange('approved')}
                    disabled={
                      updateStatus.isPending ||
                      !canTransitionInvoiceStatus(invoice.status, 'approved')
                    }
                    tone="green"
                  />
                  <QuickStatusButton
                    icon={<XCircle size={14} />}
                    label="Rechazar"
                    active={invoice.status === 'rejected'}
                    onClick={() => handleStatusChange('rejected')}
                    disabled={
                      updateStatus.isPending ||
                      !canTransitionInvoiceStatus(invoice.status, 'rejected')
                    }
                    tone="red"
                  />
                  <QuickStatusButton
                    icon={<CheckCircle2 size={14} />}
                    label="Marcar pagada"
                    active={invoice.status === 'paid'}
                    onClick={() => handleStatusChange('paid')}
                    disabled={
                      updateStatus.isPending ||
                      !canTransitionInvoiceStatus(invoice.status, 'paid')
                    }
                    tone="green"
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Invoice number management */}
          <Card>
            <CardHeader title="Número de factura" />
            <CardBody className="space-y-3">
              {!editingNumber ? (
                <>
                  <div className="rounded-card border border-border bg-subtle px-3.5 py-2.5 font-mono text-sm font-medium text-text">
                    {invoice.invoice_number}
                  </div>
                  <Button
                    fullWidth
                    variant="outline"
                    size="md"
                    leftIcon={<Edit3 size={14} />}
                    onClick={startEditNumber}
                  >
                    Cambiar consecutivo
                  </Button>
                  <p className="text-xs text-muted">
                    El cambio queda registrado en el historial.
                  </p>
                </>
              ) : (
                <>
                  <Field
                    label="Nuevo número"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    placeholder="INF-RCA-2026-0001"
                    className="font-mono"
                  />
                  <Textarea
                    label="Motivo (opcional)"
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Corrección por error en numeración…"
                  />
                  {changeError && (
                    <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
                      {changeError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      fullWidth
                      size="md"
                      onClick={submitNumberChange}
                      disabled={changeNumber.isPending}
                    >
                      {changeNumber.isPending ? 'Guardando…' : 'Aplicar'}
                    </Button>
                    <Button
                      fullWidth
                      variant="ghost"
                      size="md"
                      onClick={() => setEditingNumber(false)}
                      disabled={changeNumber.isPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Invoice meta */}
          <Card>
            <CardHeader title="Datos" />
            <CardBody className="space-y-2.5 text-sm">
              <Row label="Colaborador">
                {invoice.user?.full_name || invoice.user?.email}
              </Row>
              <Row label="Código" mono>
                {invoice.user?.user_code ?? '—'}
              </Row>
              <Row label="Periodo">
                {format(
                  new Date(invoice.period_start + 'T00:00:00'),
                  'd MMM',
                  { locale: es },
                )}
                {' — '}
                {format(
                  new Date(invoice.period_end + 'T00:00:00'),
                  "d MMM yyyy",
                  { locale: es },
                )}
              </Row>
              <Row label="Emitida">
                {format(
                  new Date(invoice.invoice_date + 'T00:00:00'),
                  "d 'de' MMMM yyyy",
                  { locale: es },
                )}
              </Row>
              <Row label="Moneda">{invoice.currency}</Row>
            </CardBody>
          </Card>

          {/* PDF */}
          <Card>
            <CardHeader title="PDF" />
            <CardBody className="space-y-3">
              {invoice.pdf_url ? (
                <Button
                  fullWidth
                  size="md"
                  leftIcon={<Download size={15} />}
                  onClick={handleDownload}
                  disabled={pdfBusy}
                >
                  {pdfBusy ? 'Abriendo…' : 'Descargar PDF'}
                </Button>
              ) : (
                <p className="rounded-card border border-dashed border-border bg-subtle p-4 text-center text-xs text-muted">
                  Aún no se ha generado el PDF para esta factura.
                </p>
              )}

              <Button
                fullWidth
                variant="outline"
                size="md"
                leftIcon={
                  <RefreshCw
                    size={14}
                    className={generatePdf.isPending ? 'animate-spin' : ''}
                  />
                }
                onClick={handleRegenerate}
                disabled={generatePdf.isPending}
              >
                {generatePdf.isPending
                  ? 'Generando…'
                  : invoice.pdf_url
                    ? 'Regenerar PDF'
                    : 'Generar PDF'}
              </Button>

              {pdfError && (
                <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
                  {pdfError}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function QuickStatusButton({
  icon,
  label,
  onClick,
  disabled,
  active,
  tone,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled: boolean
  active: boolean
  tone: 'green' | 'red' | 'amber'
}) {
  const toneClass = active
    ? tone === 'green'
      ? 'bg-green/10 text-green border-green/30'
      : tone === 'red'
        ? 'bg-red/10 text-red border-red/30'
        : 'bg-amber/10 text-amber border-amber/30'
    : 'border-border text-text-sec hover:bg-subtle'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  )
}

function Row({
  label,
  children,
  mono,
}: {
  label: string
  children: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-muted">{label}</span>
      <span
        className={`text-right text-xs text-text-sec ${mono ? 'font-mono' : ''}`}
      >
        {children}
      </span>
    </div>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

function formatCurrency(value: number, currency: string) {
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
  return `${formatted} ${currency}`
}
