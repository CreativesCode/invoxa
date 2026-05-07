import { ChevronRight, Plus, Search, UserPlus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import type { UserRole, UserStatus } from '../../../types/profile'
import { useUsers } from './queries'

type StatusFilter = 'all' | UserStatus
type RoleFilter = 'all' | UserRole

export function UsersListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const { data: users = [], isLoading, error } = useUsers()

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const haystack = `${u.full_name ?? ''} ${u.email} ${u.user_code ?? ''}`
        if (!haystack.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [users, statusFilter, roleFilter, search])

  return (
    <AppShell
      title="Usuarios"
      subtitle="Gestiona colaboradores y permisos"
      breadcrumbs={[{ label: 'Operación' }, { label: 'Usuarios' }]}
      rightAction={
        <Button
          size="md"
          leftIcon={<Plus size={15} strokeWidth={2.6} />}
          onClick={() => navigate('/admin/users/new')}
          aria-label="Invitar usuario"
        >
          <span className="hidden sm:inline">Invitar usuario</span>
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex h-9 w-full flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:w-auto sm:min-w-[260px] sm:flex-initial">
          <Search size={14} className="text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
        </div>

        <SegmentedControl
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Activos' },
            { value: 'invited', label: 'Invitados' },
            { value: 'inactive', label: 'Inactivos' },
          ]}
        />

        <SegmentedControl
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'Usuario' },
          ]}
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-muted">
            Cargando usuarios…
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-red">
            Error: {(error as Error).message}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyUsersState
            hasFilter={
              statusFilter !== 'all' || roleFilter !== 'all' || search !== ''
            }
          />
        ) : (
          <>
            {/* Mobile: card list */}
            <ul className="divide-y divide-border md:hidden">
              {filtered.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-subtle"
                  >
                    <Avatar name={u.full_name || u.email} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-text">
                          {u.full_name || '—'}
                        </span>
                        {u.user_code && (
                          <span className="rounded bg-subtle px-1.5 py-px font-mono text-[10px] text-text-sec">
                            {u.user_code}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-muted">
                        {u.email}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <StatusPill status={u.status} />
                        <Pill tone={u.role === 'admin' ? 'violet' : 'blue'}>
                          {u.role === 'admin' ? 'Admin' : 'Usuario'}
                        </Pill>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="flex-shrink-0 text-muted"
                    />
                  </button>
                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-subtle text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Usuario</th>
                    <th className="px-5 py-3 font-semibold">Rol</th>
                    <th className="px-5 py-3 font-semibold">Estado</th>
                    <th className="px-5 py-3 font-semibold">Código</th>
                    <th className="px-5 py-3 font-semibold">Creado</th>
                    <th className="w-10 px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="cursor-pointer transition hover:bg-subtle"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.full_name || u.email} />
                          <div>
                            <div className="font-semibold text-text">
                              {u.full_name || '—'}
                            </div>
                            <div className="mt-0.5 text-xs text-muted">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Pill tone={u.role === 'admin' ? 'violet' : 'blue'}>
                          {u.role === 'admin' ? 'Admin' : 'Usuario'}
                        </Pill>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={u.status} />
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-text-sec">
                        {u.user_code ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-text-sec">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-muted">
                        <ChevronRight size={16} />
                      </td>
                    </tr>
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

function StatusPill({ status }: { status: UserStatus }) {
  const map = {
    active: { tone: 'green' as const, label: 'Activo' },
    invited: { tone: 'amber' as const, label: 'Invitado' },
    inactive: { tone: 'muted' as const, label: 'Inactivo' },
  }
  const { tone, label } = map[status]
  return (
    <Pill tone={tone} dot>
      {label}
    </Pill>
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

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <>
      {/* Mobile: horizontal scrolling chips */}
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:hidden">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              value === o.value
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-surface text-text-sec hover:border-border-strong'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Desktop: segmented pill control */}
      <div className="hidden rounded-xl border border-border bg-surface p-1 sm:flex">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              value === o.value
                ? 'bg-primary/10 text-primary'
                : 'text-text-sec hover:text-text'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </>
  )
}

function EmptyUsersState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Users size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        {hasFilter ? 'Sin resultados' : 'Aún no hay usuarios'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {hasFilter
          ? 'Ajusta los filtros o la búsqueda.'
          : 'Invita a tu primer colaborador para empezar.'}
      </p>
      {!hasFilter && (
        <Link
          to="/admin/users/new"
          className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-glow hover:bg-primary-dark"
        >
          <UserPlus size={15} strokeWidth={2.6} /> Invitar usuario
        </Link>
      )}
    </div>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
