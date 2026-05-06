import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase/client'
import { extractFunctionError } from '../../lib/supabase/functionError'
import type {
  InvoiceNumberChangeRequestWithContext,
  InvoiceNumberChangeStatus,
  InvoiceNumberHistoryEntry,
} from '../../types/invoiceNumberChange'

// =============================================================================
// Read queries
// =============================================================================

/**
 * Lists change requests visible to the current session.
 * - User session: only their own requests (RLS enforces that).
 * - Admin session: all of them.
 *
 * `status` filters server-side; pass `'all'` to skip filter.
 */
export function useInvoiceNumberChangeRequests(
  status: InvoiceNumberChangeStatus | 'all' = 'all',
) {
  return useQuery<InvoiceNumberChangeRequestWithContext[]>({
    queryKey: ['invoice-number-change-requests', status],
    queryFn: async () => {
      let query = supabase
        .from('invoice_number_change_requests')
        .select(
          '*, invoice:invoices(id, invoice_number, user_id, total, currency), requester:profiles!invoice_number_change_requests_requested_by_fkey(id, full_name, email)',
        )
        .order('created_at', { ascending: false })

      if (status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as InvoiceNumberChangeRequestWithContext[]
    },
  })
}

export function useInvoiceNumberChangeRequest(id: string | undefined) {
  return useQuery<InvoiceNumberChangeRequestWithContext | null>({
    queryKey: ['invoice-number-change-request', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('invoice_number_change_requests')
        .select(
          '*, invoice:invoices(id, invoice_number, user_id, total, currency), requester:profiles!invoice_number_change_requests_requested_by_fkey(id, full_name, email)',
        )
        .eq('id', id)
        .single()
      if (error) throw error
      return data as InvoiceNumberChangeRequestWithContext
    },
  })
}

/** History of consecutive number changes applied to a single invoice. */
export function useInvoiceNumberHistory(invoiceId: string | undefined) {
  return useQuery<InvoiceNumberHistoryEntry[]>({
    queryKey: ['invoice-number-history', invoiceId],
    enabled: Boolean(invoiceId),
    queryFn: async () => {
      if (!invoiceId) return []
      const { data, error } = await supabase
        .from('invoice_number_history')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('changed_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as InvoiceNumberHistoryEntry[]
    },
  })
}

// =============================================================================
// Mutations
// =============================================================================

type RequestPayload = {
  invoiceId: string
  requestedInvoiceNumber: string
  reason: string
}

/**
 * User requests a change to one of their own invoices' numbers. Goes through
 * an Edge Function that records the request and notifies admins.
 */
export function useRequestInvoiceNumberChange() {
  const qc = useQueryClient()
  return useMutation<{ success: true; request_id: string }, Error, RequestPayload>(
    {
      mutationFn: async ({
        invoiceId,
        requestedInvoiceNumber,
        reason,
      }) => {
        const { data, error } = await supabase.functions.invoke<{
          success: true
          request_id: string
        }>('request-invoice-number-change', {
          body: {
            invoice_id: invoiceId,
            requested_invoice_number: requestedInvoiceNumber,
            reason,
          },
        })
        if (error) {
          throw new Error(await extractFunctionError(error))
        }
        if (!data) throw new Error('Sin respuesta del servidor')
        return data
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['invoice-number-change-requests'] })
      },
    },
  )
}

type ResolvePayload = {
  requestId: string
  decision: 'approve' | 'reject'
  reviewNotes?: string
}

/**
 * Admin approves or rejects a user-submitted request. On approval the SQL
 * function applies the change atomically and writes the history row.
 */
export function useResolveInvoiceNumberChange() {
  const qc = useQueryClient()
  return useMutation<
    { success: true; status: InvoiceNumberChangeStatus },
    Error,
    ResolvePayload
  >({
    mutationFn: async ({ requestId, decision, reviewNotes }) => {
      const { data, error } = await supabase.functions.invoke<{
        success: true
        status: InvoiceNumberChangeStatus
      }>('resolve-invoice-number-change', {
        body: {
          request_id: requestId,
          decision,
          review_notes: reviewNotes,
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
      qc.invalidateQueries({ queryKey: ['invoice-number-change-requests'] })
      qc.invalidateQueries({ queryKey: ['admin-invoices'] })
      qc.invalidateQueries({ queryKey: ['admin-invoice'] })
      qc.invalidateQueries({ queryKey: ['invoice'] })
      qc.invalidateQueries({ queryKey: ['my-invoices'] })
      qc.invalidateQueries({ queryKey: ['invoice-number-history'] })
    },
  })
}
