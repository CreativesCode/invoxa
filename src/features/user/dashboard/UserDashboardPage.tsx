import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  FolderKanban,
  Plus,
  ReceiptText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import { StatCard } from '../../../components/ui/StatCard'
import { isBillingProfileComplete } from '../../../types/billingProfile'
import type {
  Invoice,
  InvoiceStatus,
} from '../../../types/invoice'
import { useProfile } from '../../auth/useProfile'
import { useMyBillingProfile } from '../billing-profile/queries'
import { useMyPendingInvoiceRequests } from '../invoice-requests/queries'
import {
  useUserDashboardData,
  type UserDashboardProject,
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

export function UserDashboardPage() {
  const today = new Date()
  const { data: profile } = useProfile()
  const { data: billingProfile } = useMyBillingProfile()
  const { data: pendingRequests = [] } = useMyPendingInvoiceRequests()
  const { data: dashboard } = useUserDashboardData(today)

  const firstName = profile?.full_name?.split(' ')[0] || profile?.email
  const billingComplete = isBillingProfileComplete(billingProfile)

  const monthCode = format(today, 'MMM', { locale: es }).toUpperCase()
  const yearShort = format(today, 'yy')
  const monthLabel = format(today, "MMMM 'de' yyyy", { locale: es })
  const greeting = getGreeting(today)

  const hourlyTasksMonth = dashboard?.tasksThisMonth ?? 0
  const hours = dashboard?.hoursThisMonth ?? 0
  const hasHourlyProjects = (dashboard?.projects ?? []).some(
    (p) => p.payment_type === 'hourly',
  )

  // Hero state derives from whether the invoice for the current period
  // already exists and what status it's in.
  const heroState = computeHeroState(
    dashboard?.currentPeriodInvoice ?? null,
  )

  return (
    <AppShell
      title={`Hola, ${firstName} 👋`}
      subtitle="Aquí está tu mes en curso"
    >
      {/* Mobile hero — kicker + display title + subtitle */}
      <div className="mb-5 md:hidden">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          {capitalize(monthLabel)}
        </div>
        <h2 className="font-display mt-1.5 text-[28px] font-bold leading-[1.05] tracking-[-0.02em] text-text">
          {greeting}
          {firstName ? `, ${firstName}` : ''}.
        </h2>
        <p className="mt-1.5 text-sm leading-snug text-muted">
          {heroState.subtitle}
        </p>
      </div>

      {pendingRequests.length > 0 && (
        <Link
          to="/app/invoices/new"
          className="mb-4 flex items-start gap-3 rounded-card border border-primary/30 bg-primary/5 px-4 py-3 transition hover:border-primary/50"
        >
          <Bell size={18} className="mt-0.5 flex-shrink-0 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-text">
              {pendingRequests.length === 1
                ? 'Tienes una solicitud de factura pendiente'
                : `Tienes ${pendingRequests.length} solicitudes de factura pendientes`}
            </div>
            <p className="mt-0.5 text-xs text-text-sec capitalize">
              {pendingRequests
                .slice(0, 2)
                .map((r) =>
                  format(
                    new Date(r.period_start + 'T00:00:00'),
                    "MMM yyyy",
                    { locale: es },
                  ),
                )
                .join(' · ')}
              {pendingRequests.length > 2 ? ' · …' : ''}
            </p>
          </div>
          <ArrowRight size={16} className="mt-1 text-text-sec" />
        </Link>
      )}

      {!billingComplete && (
        <Link
          to="/app/billing-profile"
          className="mb-4 flex items-start gap-3 rounded-card border border-amber/30 bg-amber-soft px-4 py-3 transition hover:border-amber/50"
        >
          <AlertTriangle
            size={18}
            className="mt-0.5 flex-shrink-0 text-amber"
          />
          <div className="flex-1">
            <div className="text-sm font-semibold text-text">
              Completa tus datos de facturación
            </div>
            <p className="mt-0.5 text-xs text-text-sec">
              Necesitas razón social, identificación fiscal, email y país antes
              de poder generar facturas.
            </p>
          </div>
          <ArrowRight size={16} className="mt-1 text-text-sec" />
        </Link>
      )}

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-5 text-white shadow-glow md:p-7">
        <svg
          width="500"
          height="500"
          viewBox="0 0 100 100"
          className="absolute -right-44 -top-44 opacity-15"
        >
          <circle cx="50" cy="50" r="48" stroke="#fff" strokeWidth=".4" fill="none" />
          <circle cx="50" cy="50" r="34" stroke="#fff" strokeWidth=".4" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="#fff" strokeWidth=".4" fill="none" />
        </svg>

        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] opacity-90">
            Tu factura del mes
          </div>
          <div className="mt-3 flex items-end gap-6">
            <div className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <div className="text-xs font-bold tracking-[0.08em] opacity-85">
                {monthCode}
              </div>
              <div className="font-display mt-0.5 text-[44px] font-extrabold leading-none">
                {yearShort}
              </div>
            </div>
            <div>
              <div className="font-display text-[28px] font-bold leading-tight tracking-tighter2">
                {heroState.title}
              </div>
              <p className="mt-1.5 text-sm opacity-90">
                {heroState.subtitle}
              </p>
              <p className="mt-1 text-xs opacity-75">{heroState.hint}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {dashboard?.currentPeriodInvoice ? (
              <Link
                to={`/app/invoices/${dashboard.currentPeriodInvoice.id}`}
                className="flex h-11 items-center gap-2 rounded-xl bg-white px-4.5 text-sm font-bold text-primary-dark"
                style={{ paddingLeft: 18, paddingRight: 18 }}
              >
                <Eye size={15} /> Ver factura
              </Link>
            ) : (
              <Link
                to="/app/invoices/new"
                className="flex h-11 items-center gap-2 rounded-xl bg-white px-4.5 text-sm font-bold text-primary-dark"
                style={{ paddingLeft: 18, paddingRight: 18 }}
              >
                <Eye size={15} /> Generar factura
              </Link>
            )}
            <Link
              to="/app/tasks/new"
              className="flex h-11 items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4.5 text-sm font-semibold text-white"
              style={{ paddingLeft: 18, paddingRight: 18 }}
            >
              <Plus size={15} /> Registrar tarea
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
        <StatCard
          label="Proyectos activos"
          value={dashboard?.activeProjects ?? '—'}
          hint="Asignados este mes"
          icon={<FolderKanban size={16} />}
          tone="primary"
        />
        <StatCard
          label="Horas registradas"
          value={hasHourlyProjects ? formatHours(hours) : '—'}
          hint={
            hasHourlyProjects
              ? 'En proyectos por hora'
              : 'No tienes proyectos por hora'
          }
          icon={<Clock size={16} />}
          tone="blue"
        />
        <StatCard
          label="Tareas del mes"
          value={hourlyTasksMonth}
          hint="Registradas en el periodo"
          icon={<FileText size={16} />}
          tone="amber"
        />
        <StatCard
          label="Facturas pagadas"
          value={dashboard?.paidInvoices ?? '—'}
          hint="Histórico"
          icon={<ReceiptText size={16} />}
          tone="green"
        />
      </div>

      {/* Two columns */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Mis proyectos"
              description="Proyectos en los que estás participando"
            />
            <CardBody>
              {(dashboard?.projects ?? []).length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-subtle p-6 text-center">
                  <p className="text-sm text-muted">
                    Aún no tienes proyectos activos. El admin debe asignarte
                    uno para comenzar a facturar.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {(dashboard?.projects ?? []).map((p) => (
                    <ProjectRow key={p.project_id} project={p} />
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Últimas facturas"
            description="Histórico reciente"
          />
          <CardBody className="space-y-3">
            {(dashboard?.recentInvoices ?? []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-subtle p-4 text-center">
                <p className="text-xs text-muted">
                  Aún no has generado facturas.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {dashboard!.recentInvoices.map((inv) => (
                  <RecentInvoiceItem key={inv.id} invoice={inv} />
                ))}
              </ul>
            )}
            <Link
              to="/app/invoices"
              className="flex items-center justify-between rounded-xl border border-border bg-subtle px-4 py-3 text-sm font-semibold text-text-sec hover:bg-primary/5"
            >
              Ver historial completo
              <ArrowRight size={14} />
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader
            title="Checklist para facturar"
            action={
              checklistComplete(
                billingComplete,
                hasHourlyProjects,
                hourlyTasksMonth,
                dashboard?.hasInvoiceForCurrentPeriod ?? false,
              ) ? (
                <Pill tone="green" dot>
                  Listo
                </Pill>
              ) : (
                <Pill tone="amber" dot>
                  Pendiente
                </Pill>
              )
            }
          />
          <CardBody className="space-y-3">
            <ChecklistItem
              done={billingComplete}
              label="Datos de facturación completos"
              hint="Razón social, identificación fiscal, email y país."
              to="/app/billing-profile"
            />
            <ChecklistItem
              done={!hasHourlyProjects || hourlyTasksMonth > 0}
              label="Tareas del mes registradas (si cobras por hora)"
              hint={
                hasHourlyProjects
                  ? `${hourlyTasksMonth} ${hourlyTasksMonth === 1 ? 'tarea' : 'tareas'} este mes.`
                  : 'No aplica para usuarios con tarifa fija mensual.'
              }
              to="/app/tasks"
            />
            <ChecklistItem
              done={dashboard?.hasInvoiceForCurrentPeriod ?? false}
              label="Generar factura mensual"
              hint={
                dashboard?.hasInvoiceForCurrentPeriod
                  ? 'Ya tienes la factura del periodo.'
                  : 'Solo disponible una vez completados los puntos anteriores.'
              }
              to={
                dashboard?.currentPeriodInvoice
                  ? `/app/invoices/${dashboard.currentPeriodInvoice.id}`
                  : '/app/invoices/new'
              }
            />
          </CardBody>
        </Card>
      </div>
    </AppShell>
  )
}

function computeHeroState(invoice: Invoice | null): {
  title: string
  subtitle: string
  hint: string
} {
  const today = new Date()
  const monthName = format(today, "MMMM 'de' yyyy", { locale: es })

  if (!invoice) {
    return {
      title: 'Pendiente de generar',
      subtitle: capitalize(`Periodo: ${monthName}`),
      hint: 'Genera tu factura cuando hayas registrado todas tus tareas.',
    }
  }

  const titleByStatus: Record<InvoiceStatus, string> = {
    draft: 'En borrador',
    generated: 'Generada',
    sent: 'Enviada al admin',
    reviewed: 'En revisión',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    paid: 'Pagada',
    cancelled: 'Anulada',
  }

  return {
    title: titleByStatus[invoice.status],
    subtitle: `${invoice.invoice_number} · ${formatCurrency(invoice.total, invoice.currency)}`,
    hint: capitalize(`Periodo: ${monthName}`),
  }
}

function ProjectRow({ project }: { project: UserDashboardProject }) {
  const isHourly = project.payment_type === 'hourly'
  const rate = isHourly ? project.hourly_rate : project.monthly_rate
  return (
    <li className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FolderKanban size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-text">
            {project.project_name}
          </span>
          <Pill tone={isHourly ? 'blue' : 'violet'}>
            {isHourly ? 'Por hora' : 'Fijo mensual'}
          </Pill>
        </div>
        <p className="mt-0.5 text-xs text-muted">
          {rate != null
            ? `${formatCurrency(rate, project.currency)}${isHourly ? ' / h' : ' / mes'}`
            : 'Sin tarifa configurada'}
        </p>
      </div>
      {isHourly && (
        <div className="text-right">
          <div className="font-display tabular text-base font-bold text-text">
            {formatHours(project.hours_this_month)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted">
            este mes
          </div>
        </div>
      )}
    </li>
  )
}

function RecentInvoiceItem({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      to={`/app/invoices/${invoice.id}`}
      className="flex items-start gap-2.5 rounded-xl border border-border bg-subtle px-3 py-2 transition hover:border-primary/40"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-bg text-muted">
        <ReceiptText size={14} />
      </div>
      <div className="min-w-0 flex-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono font-medium text-text">
            {invoice.invoice_number}
          </span>
          <Pill tone={STATUS_TONE[invoice.status]} dot>
            {STATUS_LABEL[invoice.status]}
          </Pill>
        </div>
        <p className="mt-0.5 capitalize text-muted">
          {format(
            new Date(invoice.period_start + 'T00:00:00'),
            "MMM yyyy",
            { locale: es },
          )}{' '}
          · {formatCurrency(invoice.total, invoice.currency)}
        </p>
      </div>
    </Link>
  )
}

function ChecklistItem({
  done,
  label,
  hint,
  to,
}: {
  done: boolean
  label: string
  hint?: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 rounded-xl border border-border bg-subtle px-4 py-3 transition hover:border-primary/40 hover:bg-primary/5"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
          done ? 'bg-green text-white' : 'border-2 border-border-strong bg-bg'
        }`}
      >
        {done && <CheckCircle2 size={14} />}
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold text-text">{label}</div>
        {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
      </div>
      <ArrowRight size={14} className="mt-1 text-muted" />
    </Link>
  )
}

function checklistComplete(
  billingComplete: boolean,
  hasHourly: boolean,
  hourlyTasks: number,
  hasInvoice: boolean,
): boolean {
  if (!billingComplete) return false
  if (hasHourly && hourlyTasks === 0) return false
  return hasInvoice
}

function getGreeting(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Buen día'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatHours(value: number): string {
  return `${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)} h`
}

function formatCurrency(value: number, currency: string) {
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
  return `${formatted} ${currency}`
}
