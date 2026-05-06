import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import { extractFunctionError } from '../../../lib/supabase/functionError'
import type {
  InvoiceRequestStatus,
  InvoiceRequestWithUser,
} from '../../../types/invoiceRequest'

export type AdminInvoiceRequestFilters = {
  status?: InvoiceRequestStatus | 'all'
  periodStart?: string | null
  periodEnd?: string | null
}

export function useAdminInvoiceRequests(filters: AdminInvoiceRequestFilters) {
  return useQuery<InvoiceRequestWithUser[]>({
    queryKey: ['admin-invoice-requests', filters],
    queryFn: async () => {
      let query = supabase
        .from('invoice_requests')
        .select(
          '*, user:profiles!invoice_requests_user_id_fkey(id, full_name, email, user_code), requester:profiles!invoice_requests_requested_by_fkey(id, full_name, email)',
        )
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.periodStart) {
        query = query.gte('period_start', filters.periodStart)
      }
      if (filters.periodEnd) {
        query = query.lte('period_end', filters.periodEnd)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as InvoiceRequestWithUser[]
    },
  })
}

type SinglePayload = {
  userId: string
  periodStart: string
  periodEnd: string
}

export function useRequestInvoice() {
  const qc = useQueryClient()
  return useMutation<{ success: true; request_id: string }, Error, SinglePayload>(
    {
      mutationFn: async ({ userId, periodStart, periodEnd }) => {
        const { data, error } = await supabase.functions.invoke<{
          success: true
          request_id: string
        }>('request-invoice', {
          body: {
            user_id: userId,
            period_start: periodStart,
            period_end: periodEnd,
          },
        })
        if (error) {
          const ctx = (error as unknown as { context?: { error?: string } })
            .context
          throw new Error(ctx?.error || error.message)
        }
        if (!data) throw new Error('Sin respuesta del servidor')
        return data
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['admin-invoice-requests'] })
        qc.invalidateQueries({ queryKey: ['my-invoice-requests'] })
      },
    },
  )
}

type BulkPayload = {
  userIds?: string[]
  periodStart: string
  periodEnd: string
}

export type BulkSummary = {
  created: number
  refreshed: number
  skipped: {
    user_id: string
    reason:
      | 'invoice_already_exists'
      | 'user_inactive'
      | 'no_active_projects'
      | 'user_not_found'
  }[]
}

export function useRequestInvoicesBulk() {
  const qc = useQueryClient()
  return useMutation<
    { success: true; summary: BulkSummary },
    Error,
    BulkPayload
  >({
    mutationFn: async ({ userIds, periodStart, periodEnd }) => {
      const { data, error } = await supabase.functions.invoke<{
        success: true
        summary: BulkSummary
      }>('request-invoices-bulk', {
        body: {
          user_ids: userIds,
          period_start: periodStart,
          period_end: periodEnd,
        },
      })
      if (error) {
        throw new Error(await extractFunctionError(error))
      }
      if (!data) throw new Error('Sin respuesta del servidor')
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-invoice-requests'] })
      qc.invalidateQueries({ queryKey: ['my-invoice-requests'] })
    },
  })
}
