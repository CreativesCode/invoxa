import { z } from 'zod'

export const compensationSchema = z
  .object({
    payment_type: z.enum(['hourly', 'fixed']),
    hourly_rate: z.number().min(0).optional(),
    monthly_rate: z.number().min(0).optional(),
    currency: z.string().min(2).max(8),
  })
  .superRefine((data, ctx) => {
    if (data.payment_type === 'hourly') {
      if (data.hourly_rate == null || data.hourly_rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hourly_rate'],
          message: 'Ingresa una tarifa por hora mayor a 0',
        })
      }
    } else if (data.payment_type === 'fixed') {
      if (data.monthly_rate == null || data.monthly_rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthly_rate'],
          message: 'Ingresa una tarifa fija mensual mayor a 0',
        })
      }
    }
  })

export type CompensationFormValues = z.infer<typeof compensationSchema>

export const assignMemberSchema = z
  .object({
    user_id: z.string().uuid('Selecciona un usuario'),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
    payment_type: z.enum(['hourly', 'fixed']),
    hourly_rate: z.number().min(0).optional(),
    monthly_rate: z.number().min(0).optional(),
    currency: z.string().min(2).max(8),
  })
  .superRefine((data, ctx) => {
    if (data.payment_type === 'hourly') {
      if (data.hourly_rate == null || data.hourly_rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['hourly_rate'],
          message: 'Ingresa una tarifa por hora mayor a 0',
        })
      }
    } else if (data.payment_type === 'fixed') {
      if (data.monthly_rate == null || data.monthly_rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['monthly_rate'],
          message: 'Ingresa una tarifa fija mensual mayor a 0',
        })
      }
    }
  })

export type AssignMemberFormValues = z.infer<typeof assignMemberSchema>

export const CURRENCIES: { value: string; label: string }[] = [
  { value: 'USD', label: 'USD — Dólar' },
  { value: 'COP', label: 'COP — Peso colombiano' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'MXN', label: 'MXN — Peso mexicano' },
]
