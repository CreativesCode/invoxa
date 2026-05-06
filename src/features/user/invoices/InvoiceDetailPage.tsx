import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Download, Edit3, FileText, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import { openExternalUrl } from '../../../lib/native/openUrl'
import type { InvoiceStatus } from '../../../types/invoice'
import { RequestNumberChangeModal } from './RequestNumberChangeModal'
import {
  getInvoicePdfSignedUrl,
  useGenerateInvoicePdf,
  useInvoice,
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

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: invoice, isLoading, error } = useInvoice(id)
  const generatePdf = useGenerateInvoicePdf()
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [requestModalOpen, setRequestModalOpen] = useState(false)

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
          to="/app/invoices"
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
      subtitle={format(
        new Date(invoice.period_start + 'T00:00:00'),
        "MMMM 'de' yyyy",
        { locale: es },
      )}
      breadcrumbs={[
        { label: 'Mi facturación' },
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
        to="/app/invoices"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-text-sec"
      >
        <ArrowLeft size={13} /> Volver a facturas
      </Link>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              title="Detalle por proyecto"
              description={`${invoice.items.length} ${invoice.items.length === 1 ? 'ítem' : 'ítems'}`}
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
                        tone={item.payment_type === 'hourly' ? 'blue' : 'violet'}
                      >
                        {item.payment_type === 'hourly'
                          ? 'Por hora'
                          : 'Fijo mensual'}
                      </Pill>
                    </div>
                    <p className="mt-1 text-xs text-muted">{item.description}</p>
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
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Datos de la factura" />
            <CardBody className="space-y-2.5 text-sm">
              <Row label="Número" mono>
                {invoice.invoice_number}
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
              <Row label="Estado">
                <Pill tone={STATUS_TONE[invoice.status]} dot>
                  {STATUS_LABEL[invoice.status]}
                </Pill>
              </Row>
            </CardBody>
          </Card>

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
                <div className="rounded-card border border-dashed border-border bg-subtle p-4 text-center">
                  <FileText size={20} className="mx-auto text-muted" />
                  <p className="mt-2 text-xs text-muted">
                    Aún no se ha generado el PDF para esta factura.
                  </p>
                </div>
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

          <Card>
            <CardHeader title="Acciones" />
            <CardBody className="space-y-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<Edit3 size={14} />}
                onClick={() => setRequestModalOpen(true)}
              >
                Solicitar cambio de consecutivo
              </Button>
              <p className="text-xs text-muted">
                Tu solicitud quedará pendiente hasta que un admin la apruebe.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <RequestNumberChangeModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        invoiceId={invoice.id}
        currentNumber={invoice.invoice_number}
      />
    </AppShell>
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
