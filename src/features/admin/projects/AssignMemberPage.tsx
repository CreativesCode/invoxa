import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Field } from '../../../components/ui/Field'
import { Select } from '../../../components/ui/Select'
import { CompensationFields } from './CompensationFields'
import { useAddMember, useAvailableUsers } from './membersQueries'
import { assignMemberSchema, type AssignMemberFormValues } from './memberSchema'
import { useProject } from './queries'

export function AssignMemberPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const { data: project } = useProject(id)
  const { data: availableUsers = [], isLoading: loadingUsers } =
    useAvailableUsers(id)
  const addMember = useAddMember(id ?? '')

  const today = new Date().toISOString().slice(0, 10)

  const form = useForm<AssignMemberFormValues>({
    resolver: zodResolver(assignMemberSchema),
    defaultValues: {
      user_id: '',
      start_date: today,
      payment_type: 'hourly',
      hourly_rate: undefined,
      monthly_rate: undefined,
      currency: 'USD',
    },
  })

  const submit = form.handleSubmit(async (values) => {
    if (!id) return
    setServerError(null)
    try {
      await addMember.mutateAsync({
        user_id: values.user_id,
        project_id: id,
        start_date: values.start_date,
        payment_type: values.payment_type,
        hourly_rate: values.hourly_rate ?? null,
        monthly_rate: values.monthly_rate ?? null,
        currency: values.currency,
      })
      navigate(`/admin/projects/${id}/members`, { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al asignar colaborador.',
      )
    }
  })

  const userOptions = availableUsers.map((u) => ({
    value: u.id,
    label: `${u.full_name || u.email}${u.user_code ? ` · ${u.user_code}` : ''} — ${u.email}`,
  }))

  return (
    <AppShell
      title="Asignar colaborador"
      subtitle={project ? `Proyecto: ${project.name}` : ''}
      breadcrumbs={[
        { label: 'Operación' },
        { label: 'Proyectos' },
        { label: project?.name ?? '' },
        { label: 'Colaboradores' },
        { label: 'Asignar' },
      ]}
    >
      <Link
        to={`/admin/projects/${id}/members`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text-sec"
      >
        <ArrowLeft size={13} /> Volver a colaboradores
      </Link>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader
            title="Datos de la asignación"
            description="Selecciona al colaborador y configura su compensación inicial."
          />
          <CardBody>
            {loadingUsers ? (
              <p className="py-6 text-center text-sm text-muted">
                Cargando usuarios disponibles…
              </p>
            ) : userOptions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-subtle p-6 text-center text-sm text-muted">
                No hay usuarios disponibles para asignar. Asegúrate de invitar
                colaboradores con estado activo o invitado antes de asignarlos.
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <Select
                  label="Colaborador"
                  placeholder="Selecciona un usuario"
                  options={[
                    { value: '', label: 'Selecciona un usuario' },
                    ...userOptions,
                  ]}
                  error={form.formState.errors.user_id?.message}
                  {...form.register('user_id')}
                />

                <Field
                  label="Fecha de inicio"
                  type="date"
                  error={form.formState.errors.start_date?.message}
                  {...form.register('start_date')}
                />

                <CompensationFields
                  register={form.register}
                  setValue={form.setValue}
                  watch={form.watch}
                  errors={form.formState.errors}
                />

                {serverError && (
                  <p className="rounded-md bg-red/10 px-3 py-2 text-xs text-red">
                    {serverError}
                  </p>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    leftIcon={<Save size={15} strokeWidth={2.4} />}
                  >
                    {form.formState.isSubmitting
                      ? 'Asignando…'
                      : 'Asignar y guardar'}
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  )
}
