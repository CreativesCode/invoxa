import { z } from 'zod'

/**
 * Invite form values. The "initial assignment" block (project + compensation)
 * is fully optional: leaving `project_id` empty skips it entirely. When a
 * project is picked, the rest of the comp fields become required and follow
 * the same per-modality rules used in `assignMemberSchema`.
 */
export const inviteUserSchema = z
  .object({
    email: z.string().email('Email inválido'),
    full_name: z.string().min(2, 'Mínimo 2 caracteres'),
    user_code: z
      .string()
      .max(8, 'Máximo 8 caracteres')
      .regex(/^[A-Z0-9]*$/, 'Solo mayúsculas y números')
      .optional()
      .or(z.literal('')),
    role: z.enum(['user', 'admin']),

    project_id: z.string().uuid('Proyecto inválido').optional().or(z.literal('')),
    payment_type: z.enum(['hourly', 'fixed']).optional(),
    hourly_rate: z.number().min(0).optional(),
    monthly_rate: z.number().min(0).optional(),
    currency: z.string().min(2).max(8).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.project_id || data.project_id.length === 0) return

    if (!data.payment_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payment_type'],
        message: 'Selecciona la modalidad de pago',
      })
    }
    if (!data.currency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['currency'],
        message: 'Selecciona una moneda',
      })
    }
    if (
      data.payment_type === 'hourly' &&
      (data.hourly_rate == null || data.hourly_rate <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['hourly_rate'],
        message: 'Ingresa una tarifa por hora mayor a 0',
      })
    }
    if (
      data.payment_type === 'fixed' &&
      (data.monthly_rate == null || data.monthly_rate <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['monthly_rate'],
        message: 'Ingresa una tarifa fija mensual mayor a 0',
      })
    }
  })

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>
