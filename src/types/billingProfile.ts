export type BillingProfile = {
  id: string
  user_id: string
  legal_name: string | null
  tax_id: string | null
  address: string | null
  city: string | null
  country: string | null
  billing_email: string | null
  bank_name: string | null
  bank_account: string | null
  payment_method: string | null
  default_invoice_notes: string | null
  created_at: string
  updated_at: string
}

export type BillingProfileInput = {
  legal_name: string
  tax_id: string
  address: string | null
  city: string | null
  country: string | null
  billing_email: string
  bank_name: string | null
  bank_account: string | null
  payment_method: string | null
  default_invoice_notes: string | null
}

/**
 * A profile is considered "complete enough" to generate invoices when these
 * fields are filled. This mirrors the rule from docs/instructions.md §14:
 *   "Solo usuarios con perfil de facturación completo pueden generar facturas."
 */
export function isBillingProfileComplete(
  profile: BillingProfile | null | undefined,
): boolean {
  if (!profile) return false
  return Boolean(
    profile.legal_name &&
      profile.tax_id &&
      profile.billing_email &&
      profile.country,
  )
}
