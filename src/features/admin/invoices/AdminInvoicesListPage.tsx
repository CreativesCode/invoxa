import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronRight, FileText, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Card } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import { Select } from '../../../components/ui/Select'
import type { InvoiceStatus, InvoiceWithUser } from '../../../types/invoice'
import { useProjects } from '../projects/queries'
import { useUsers } from '../users/queries'
import { useAdminInvoices } from './queries'

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

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  ...(Object.keys(STATUS_LABEL) as InvoiceStatus[]).map((s) => ({
    value: s,
    label: STATUS_LABEL[s],
  })),
]

export function AdminInvoicesListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>(
    'all',
  )
  const [userFilter, setUserFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [periodStart, setPeriodStart] = useState<string>('')
  const [periodEnd, setPeriodEnd] = useState<string>('')

  const { data: invoices = [], isLoading, error } = useAdminInvoices({
    status: statusFilter,
    userId: userFilter,
    projectId: projectFilter,
    periodStart: periodStart || null,
    periodEnd: periodEnd || null,
    search,
  })

  const { data: users = [] } = useUsers()
  const { data: projects = [] } = useProjects()

  const userOptions = useMemo(
    () => [
      { value: 'all', label: 'Todos los usuarios' },
      ...users.map((u) => ({
        value: u.id,
        label: u.full_name || u.email,
      })),
    ],
    [users],
  )

  const projectOptions = useMemo(
    () => [
      { value: 'all', label: 'Todos los proyectos' },
      ...projects.map((p) => ({ value: p.id, label: p.name })),
    ],
    [projects],
  )

  const hasActiveFilters =
    statusFilter !== 'all' ||
    userFilter !== 'all' ||
    projectFilter !== 'all' ||
    periodStart !== '' ||
    periodEnd !== '' ||
    search !== ''

  const clearFilters = () => {
    setStatusFilter('all')
    setUserFilter('all')
    setProjectFilter('all')
    setPeriodStart('')
    setPeriodEnd('')
    setSearch('')
  }

  const totals = useMemo(() => {
    const byCurrency = new Map<string, number>()
    for (const inv of invoices) {
      byCurrency.set(
        inv.currency,
        (byCurrency.get(inv.currency) ?? 0) + Number(inv.total),
      )
    }
    return Array.from(byCurrency.entries())
  }, [invoices])

  return (
    <AppShell
      title="Facturas"
      subtitle="Todas las facturas del equipo"
      breadcrumbs={[{ label: 'Facturación' }, { label: 'Facturas' }]}
    >
      {/* Search + clear */}
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <div className="flex h-9 w-full flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:w-auto sm:min-w-[260px] sm:flex-initial">
          <Search size={14} className="text-muted" />
          <input
            type="text"
            placeholder="Buscar por número, usuario o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-text-sec hover:bg-subtle"
          >
            <X size={13} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as InvoiceStatus | 'all')
          }
        />
        <Select
          options={userOptions}
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />
        <Select
          options={projectOptions}
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        />
        <DateField
          label="Desde"
          value={periodStart}
          onChange={setPeriodStart}
        />
        <DateField label="Hasta" value={periodEnd} onChange={setPeriodEnd} />
      </div>

      {/* Totals strip */}
      {totals.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted">
            {invoices.length}{' '}
            {invoices.length === 1 ? 'factura' : 'facturas'} ·
          </span>
          {totals.map(([currency, total]) => (
            <span
              key={currency}
              className="font-display tabular rounded-full bg-subtle px-2.5 py-1 font-medium text-text"
            >
              {formatCurrency(total, currency)}
            </span>
          ))}
        </div>
      )}

      <Card>
        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-muted">
            Cargando facturas…
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-red">
            Error: {(error as Error).message}
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState hasFilter={hasActiveFilters} />
        ) : (
          <>
            {/* Mobile: card list */}
            <ul className="divide-y divide-border md:hidden">
              {invoices.map((inv) => (
                <InvoiceCard
                  key={inv.id}
                  invoice={inv}
                  onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                />
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-subtle text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Número</th>
                    <th className="px-5 py-3 font-semibold">Colaborador</th>
                    <th className="px-5 py-3 font-semibold">Periodo</th>
                    <th className="px-5 py-3 font-semibold">Estado</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                    <th className="w-10 px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <InvoiceRow
                      key={inv.id}
                      invoice={inv}
                      onClick={() => navigate(`/admin/invoices/${inv.id}`)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </AppShell>
  )
}

function InvoiceRow({
  invoice,
  onClick,
}: {
  invoice: InvoiceWithUser
  onClick: () => void
}) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer transition hover:bg-subtle"
    >
      <td className="px-5 py-3.5 font-mono text-xs text-text">
        {invoice.invoice_number}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={invoice.user?.full_name || invoice.user?.email || '?'} />
          <div>
            <div className="font-semibold text-text">
              {invoice.user?.full_name || '—'}
            </div>
            <div className="mt-0.5 text-xs text-muted">
              {invoice.user?.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-text-sec">
        <span className="capitalize">
          {format(
            new Date(invoice.period_start + 'T00:00:00'),
            "MMM yyyy",
            { locale: es },
          )}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <Pill tone={STATUS_TONE[invoice.status]} dot>
          {STATUS_LABEL[invoice.status]}
        </Pill>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="font-display tabular text-base font-medium text-text">
          {formatCurrency(invoice.total, invoice.currency)}
        </div>
      </td>
      <td className="px-5 py-3.5 text-muted">
        <ChevronRight size={16} />
      </td>
    </tr>
  )
}

function InvoiceCard({
  invoice,
  onClick,
}: {
  invoice: InvoiceWithUser
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-subtle"
      >
        <Avatar name={invoice.user?.full_name || invoice.user?.email || '?'} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10.5px] uppercase tracking-wide text-muted">
                {invoice.invoice_number}
              </div>
              <div className="mt-0.5 truncate text-sm font-semibold text-text">
                {invoice.user?.full_name || invoice.user?.email || '—'}
              </div>
            </div>
            <Pill tone={STATUS_TONE[invoice.status]} dot>
              {STATUS_LABEL[invoice.status]}
            </Pill>
          </div>
          <div className="mt-2 flex items-end justify-between gap-2">
            <span className="text-[11px] capitalize text-muted">
              {format(
                new Date(invoice.period_start + 'T00:00:00'),
                "MMM yyyy",
                { locale: es },
              )}
            </span>
            <span className="font-display tabular text-sm font-semibold text-text">
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </button>
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

function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3.5">
      <span className="text-xs font-semibold text-text-sec">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-sm font-medium text-text outline-none"
      />
    </div>
  )
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FileText size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        {hasFilter ? 'Sin resultados' : 'Aún no hay facturas'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {hasFilter
          ? 'Ajusta los filtros para ver más resultados.'
          : 'Cuando los colaboradores generen sus facturas aparecerán aquí.'}
      </p>
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
