import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Button } from '../../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { CompensationFields } from './CompensationFields'
import {
  useAssignment,
  useUpdateCompensation,
} from './membersQueries'
import {
  compensationSchema,
  type CompensationFormValues,
} from './memberSchema'
import { useProject } from './queries'

export function EditAssignmentPage() {
  const { id, userId } = useParams<{ id: string; userId: string }>()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const { data: project } = useProject(id)
  const { data, isLoading, error } = useAssignment(id, userId)
  const updateComp = useUpdateCompensation(id ?? '', userId ?? '')

  const form = useForm<CompensationFormValues>({
    resolver: zodResolver(compensationSchema),
    defaultValues: {
      payment_type: 'hourly',
      currency: 'USD',
      hourly_rate: undefined,
      monthly_rate: undefined,
    },
  })

  useEffect(() => {
    if (data?.compensation) {
      form.reset({
        payment_type: data.compensation.payment_type,
        currency: data.compensation.currency,
        hourly_rate: data.compensation.hourly_rate ?? undefined,
        monthly_rate: data.compensation.monthly_rate ?? undefined,
      })
    }
  }, [data, form])

  if (isLoading) {
    return (
      <AppShell title="Cargando…">
        <div className="px-5 py-12 text-center text-sm text-muted">
          Cargando…
        </div>
      </AppShell>
    )
  }

  if (error || !data) {
    return (
      <AppShell title="Asignación no encontrada">
        <Link
          to={`/admin/projects/${id}/members`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text-sec"
        >
          <ArrowLeft size={13} /> Volver a colaboradores
        </Link>
        <Card>
          <CardBody>
            <p className="text-sm text-red">
              {error
                ? (error as Error).message
                : 'No se encontró la asignación.'}
            </p>
          </CardBody>
        </Card>
      </AppShell>
    )
  }

  const submit = form.handleSubmit(async (values) => {
    setServerError(null)
    try {
      await updateComp.mutateAsync({
        payment_type: values.payment_type,
        hourly_rate: values.hourly_rate ?? null,
        monthly_rate: values.monthly_rate ?? null,
        currency: values.currency,
      })
      navigate(`/admin/projects/${id}/members`, { replace: true })
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al actualizar.',
      )
    }
  })

  return (
    <AppShell
      title={`Editar compensación`}
      subtitle={`${data.user.full_name || data.user.email} · ${project?.name ?? ''}`}
      breadcrumbs={[
        { label: 'Operación' },
        { label: 'Proyectos' },
        { label: project?.name ?? '' },
        { label: 'Colaboradores' },
        { label: data.user.full_name || data.user.email },
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
            title="Compensación"
            description="Modifica la modalidad o tarifa para esta asignación."
          />
          <CardBody>
            <form onSubmit={submit} className="space-y-5">
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
                    ? 'Guardando…'
                    : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  )
}
