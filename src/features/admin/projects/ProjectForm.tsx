import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Field } from '../../../components/ui/Field'
import { Textarea } from '../../../components/ui/Textarea'
import type { Project } from '../../../types/project'
import { projectSchema, type ProjectFormValues } from './projectSchema'

export function ProjectForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: Partial<Project>
  onSubmit: (values: ProjectFormValues) => Promise<void>
  submitLabel: string
}) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      status: initialValues?.status ?? 'active',
    },
  })

  const status = watch('status')

  const submit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Error desconocido al guardar.',
      )
    }
  })

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field
        label="Nombre del proyecto"
        placeholder="Ej. Plataforma e-commerce"
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Descripción"
        rows={4}
        maxLength={500}
        placeholder="Describe brevemente el objetivo del proyecto"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-sec">
          Estado
        </label>
        <div className="flex gap-2">
          {(['active', 'inactive'] as const).map((s) => {
            const isSelected = status === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setValue('status', s, { shouldDirty: true })}
                className={`flex-1 rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-subtle hover:border-border-strong'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      s === 'active' ? 'bg-green' : 'bg-muted'
                    }`}
                  />
                  <span className="text-sm font-semibold text-text">
                    {s === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {s === 'active'
                    ? 'Aparece en asignaciones y permite generar facturas.'
                    : 'Oculto para nuevas asignaciones, no se ven en facturación.'}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {serverError && (
        <p className="rounded-md bg-red/10 px-3 py-2 text-xs text-red">
          {serverError}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          leftIcon={<Save size={15} strokeWidth={2.4} />}
        >
          {isSubmitting ? 'Guardando…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
