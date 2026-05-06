import { z } from 'zod'

export const taskSchema = z.object({
  project_id: z.string().uuid('Selecciona un proyecto'),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(200, 'Máximo 200 caracteres'),
  description: z
    .string()
    .max(1000, 'Máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),
  task_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  hours: z
    .number({ message: 'Ingresa horas válidas' })
    .min(0.25, 'Mínimo 0.25 horas (15 min)')
    .max(24, 'Máximo 24 horas en un día'),
  observations: z
    .string()
    .max(1000, 'Máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),
})

export type TaskFormValues = z.infer<typeof taskSchema>
