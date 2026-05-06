import { z } from 'zod'

const optionalString = z
  .string()
  .max(500, 'Máximo 500 caracteres')
  .optional()
  .or(z.literal(''))

export const billingProfileSchema = z.object({
  legal_name: z.string().min(2, 'Mínimo 2 caracteres').max(200),
  tax_id: z.string().min(3, 'Mínimo 3 caracteres').max(50),
  billing_email: z.string().email('Email inválido'),
  country: z.string().min(2, 'Indica un país'),
  address: optionalString,
  city: optionalString,
  bank_name: optionalString,
  bank_account: optionalString,
  payment_method: optionalString,
  default_invoice_notes: z
    .string()
    .max(1000, 'Máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),
})

export type BillingProfileFormValues = z.infer<typeof billingProfileSchema>
