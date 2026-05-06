import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import type { InvoiceRequest } from '../../../types/invoiceRequest'

/**
 * Returns the current user's pending invoice requests, newest first.
 * RLS already restricts to the user's own rows, but the explicit
 * `auth.uid()` filter keeps the query intent obvious.
 */
export function useMyPendingInvoiceRequests() {
  return useQuery<InvoiceRequest[]>({
    queryKey: ['my-invoice-requests', 'pending'],
    queryFn: async () => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) return []

      const { data, error } = await supabase
        .from('invoice_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data ?? []) as InvoiceRequest[]
    },
  })
}
