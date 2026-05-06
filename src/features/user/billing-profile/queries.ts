import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import type { BillingProfile, BillingProfileInput } from '../../../types/billingProfile'

const billingProfileKey = (userId: string) =>
  ['billing-profile', userId] as const

export function useMyBillingProfile() {
  return useQuery<BillingProfile | null>({
    queryKey: ['billing-profile', 'me'],
    queryFn: async () => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) return null

      const { data, error } = await supabase
        .from('user_billing_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      return (data ?? null) as BillingProfile | null
    },
  })
}

export function useUpsertBillingProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: BillingProfileInput) => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) throw new Error('No autenticado')

      const payload = {
        user_id: userId,
        legal_name: input.legal_name,
        tax_id: input.tax_id,
        address: input.address ?? null,
        city: input.city ?? null,
        country: input.country ?? null,
        billing_email: input.billing_email,
        bank_name: input.bank_name ?? null,
        bank_account: input.bank_account ?? null,
        payment_method: input.payment_method ?? null,
        default_invoice_notes: input.default_invoice_notes ?? null,
      }

      const { data, error } = await supabase
        .from('user_billing_profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()

      if (error) throw error
      return data as BillingProfile
    },
    onSuccess: (data) => {
      qc.setQueryData(['billing-profile', 'me'], data)
      qc.invalidateQueries({ queryKey: billingProfileKey(data.user_id) })
    },
  })
}
