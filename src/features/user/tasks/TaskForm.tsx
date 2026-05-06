import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Field } from '../../../components/ui/Field'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import type { Project } from '../../../types/project'
import type { Task } from '../../../types/task'
import { taskSchema, type TaskFormValues } from './taskSchema'

function numberOrUndefined(v: unknown): number | undefined {
  if (v === '' || v == null) return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}

export function TaskForm({
  initial,
  projects,
  defaultDate,
  defaultProjectId,
  submitLabel,
  onSubmit,
  disabled = false,
}: {
  initial?: Partial<Task>
  projects: Project[]
  defaultDate?: string
  defaultProjectId?: string
  submitLabel: string
  onSubmit: (values: TaskFormValues) => Promise<void>
  disabled?: boolean
}) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      project_id:
        initial?.project_id ??
        defaultProjectId ??
        (projects[0]?.id ?? ''),
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      task_date:
        initial?.task_date ??
        defaultDate ??
        new Date().toISOString().slice(0, 10),
      hours: initial?.hours ?? 0,
      observations: initial?.observations ?? '',
    },
  })

  const submit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error al guardar.',
      )
    }
  })

  const projectOptions = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }))

  return (
    <form onSubmit={submit} className="space-y-5">
      <Select
        label="Proyecto"
        options={
          projectOptions.length === 0
            ? [{ value: '', label: 'Sin proyectos por hora' }]
            : projectOptions
        }
        error={errors.project_id?.message}
        disabled={disabled || projectOptions.length === 0}
        {...register('project_id')}
      />

      <Field
        label="Nombre de la tarea"
        placeholder="Ej. Implementación de checkout"
        error={errors.name?.message}
        disabled={disabled}
        {...register('name')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Fecha"
          type="date"
          error={errors.task_date?.message}
          disabled={disabled}
          {...register('task_date')}
        />
        <Field
          label="Horas"
          type="number"
          step="0.25"
          min={0.25}
          max={24}
          placeholder="2.5"
          hint="0.25 = 15 min · 1 = una hora"
          error={errors.hours?.message}
          disabled={disabled}
          {...register('hours', { setValueAs: numberOrUndefined })}
        />
      </div>

      <Textarea
        label="Descripción (opcional)"
        rows={3}
        maxLength={1000}
        placeholder="Detalle de lo que hiciste"
        error={errors.description?.message}
        disabled={disabled}
        {...register('description')}
      />

      <Textarea
        label="Observaciones (opcional)"
        rows={2}
        maxLength={1000}
        placeholder="Notas internas, bloqueos, contexto…"
        error={errors.observations?.message}
        disabled={disabled}
        {...register('observations')}
      />

      {serverError && (
        <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
          {serverError}
        </p>
      )}

      {!disabled && (
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || projectOptions.length === 0}
            leftIcon={<Save size={15} />}
          >
            {isSubmitting ? 'Guardando…' : submitLabel}
          </Button>
        </div>
      )}
    </form>
  )
}
