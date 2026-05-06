import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../../components/layout/AppShell'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { useCreateTask, useMyHourlyProjects } from './queries'
import { TaskForm } from './TaskForm'

export function NewTaskPage() {
  const navigate = useNavigate()
  const { data: projects = [], isLoading } = useMyHourlyProjects()
  const createTask = useCreateTask()

  return (
    <AppShell
      title="Nueva tarea"
      subtitle="Registra el trabajo realizado"
      breadcrumbs={[
        { label: 'Mi facturación' },
        { label: 'Tareas' },
        { label: 'Nueva' },
      ]}
    >
      <Link
        to="/app/tasks"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-text-sec"
      >
        <ArrowLeft size={13} /> Volver a tareas
      </Link>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader
            title="Detalles de la tarea"
            description="Las tareas se asocian a un proyecto y suman horas a tu factura mensual."
          />
          <CardBody>
            {isLoading ? (
              <p className="py-6 text-center text-sm text-muted">Cargando…</p>
            ) : (
              <TaskForm
                projects={projects}
                submitLabel="Guardar tarea"
                onSubmit={async (values) => {
                  await createTask.mutateAsync({
                    project_id: values.project_id,
                    name: values.name,
                    description: values.description || null,
                    task_date: values.task_date,
                    hours: values.hours,
                    observations: values.observations || null,
                  })
                  navigate('/app/tasks', { replace: true })
                }}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </AppShell>
  )
}
