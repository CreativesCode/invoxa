import { ChevronRight, FolderKanban, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Pill } from '../../../components/ui/Pill'
import { useProjects } from './queries'

export function ProjectsListPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')
  const { data: projects = [], isLoading, error } = useProjects()

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false
      if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [projects, filter, search])

  return (
    <AppShell
      title="Proyectos"
      subtitle="Gestiona los proyectos de Informage Studios"
      breadcrumbs={[{ label: 'Operación' }, { label: 'Proyectos' }]}
      rightAction={
        <Button
          size="md"
          leftIcon={<Plus size={15} strokeWidth={2.6} />}
          onClick={() => navigate('/admin/projects/new')}
        >
          Nuevo proyecto
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="flex h-9 min-w-[260px] flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:flex-initial">
          <Search size={14} className="text-muted" />
          <input
            type="text"
            placeholder="Buscar proyecto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex rounded-xl border border-border bg-surface p-1">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-sec hover:text-text'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'active' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-muted">
            Cargando proyectos…
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-red">
            Error: {(error as Error).message}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyProjectsState hasFilter={filter !== 'all' || search !== ''} />
        ) : (
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-subtle text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Proyecto</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Colaboradores</th>
                  <th className="px-5 py-3 font-semibold">Creado</th>
                  <th className="w-10 px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/admin/projects/${p.id}`)}
                    className="cursor-pointer transition hover:bg-subtle"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FolderKanban size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-text">
                            {p.name}
                          </div>
                          {p.description && (
                            <div className="mt-0.5 line-clamp-1 max-w-md text-xs text-muted">
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Pill tone={p.status === 'active' ? 'green' : 'muted'} dot>
                        {p.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Pill>
                    </td>
                    <td className="px-5 py-3.5 text-text-sec">
                      {p.member_count}
                    </td>
                    <td className="px-5 py-3.5 text-text-sec">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AppShell>
  )
}

function EmptyProjectsState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <FolderKanban size={22} />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-text">
        {hasFilter ? 'Sin resultados' : 'Aún no hay proyectos'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted">
        {hasFilter
          ? 'Intenta ajustar los filtros o la búsqueda.'
          : 'Crea tu primer proyecto para empezar a asignar colaboradores y generar facturas.'}
      </p>
      {!hasFilter && (
        <Link
          to="/admin/projects/new"
          className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-glow hover:bg-primary-dark"
        >
          <Plus size={15} strokeWidth={2.6} /> Nuevo proyecto
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
