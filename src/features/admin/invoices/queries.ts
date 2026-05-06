import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import { extractFunctionError } from '../../../lib/supabase/functionError'
import type {
  InvoiceStatus,
  InvoiceWithItemsAndUser,
  InvoiceWithUser,
} from '../../../types/invoice'

export type AdminInvoiceFilters = {
  status?: InvoiceStatus | 'all'
  userId?: string | 'all'
  projectId?: string | 'all'
  periodStart?: string | null
  periodEnd?: string | null
  search?: string
}

const ADMIN_INVOICES_KEY = (filters: AdminInvoiceFilters) =>
  ['admin-invoices', filters] as const

export function useAdminInvoices(filters: AdminInvoiceFilters) {
  return useQuery<InvoiceWithUser[]>({
    queryKey: ADMIN_INVOICES_KEY(filters),
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select(
          '*, user:profiles(id, full_name, email, user_code)',
        )
        .order('invoice_date', { ascending: false })
        .order('user_invoice_sequence', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters.userId && filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId)
      }
      if (filters.periodStart) {
        query = query.gte('period_start', filters.periodStart)
      }
      if (filters.periodEnd) {
        query = query.lte('period_end', filters.periodEnd)
      }

      const { data, error } = await query
      if (error) throw error

      let rows = (data ?? []) as InvoiceWithUser[]

      // Project filter — needs an extra round trip because invoice_items
      // is the table holding project_id; doing it in JS keeps the SQL
      // simple at the cost of an extra query.
      if (filters.projectId && filters.projectId !== 'all') {
        const invoiceIds = rows.map((r) => r.id)
        if (invoiceIds.length === 0) return rows
        const { data: items } = await supabase
          .from('invoice_items')
          .select('invoice_id')
          .eq('project_id', filters.projectId)
          .in('invoice_id', invoiceIds)
        const matching = new Set(
          ((items ?? []) as { invoice_id: string }[]).map(
            (i) => i.invoice_id,
          ),
        )
        rows = rows.filter((r) => matching.has(r.id))
      }

      // Free-text search across invoice_number / user fields.
      if (filters.search?.trim()) {
        const q = filters.search.trim().toLowerCase()
        rows = rows.filter((r) => {
          const haystack = [
            r.invoice_number,
            r.user?.full_name ?? '',
            r.user?.email ?? '',
            r.user?.user_code ?? '',
          ]
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
      }

      return rows
    },
  })
}

export function useAdminInvoice(id: string | undefined) {
  return useQuery<InvoiceWithItemsAndUser | null>({
    queryKey: ['admin-invoice', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('invoices')
        .select(
          '*, items:invoice_items(*, project:projects(id, name)), user:profiles(id, full_name, email, user_code)',
        )
        .eq('id', id)
        .single()
      if (error) throw error
      return data as InvoiceWithItemsAndUser
    },
  })
}

export function useUpdateInvoiceStatus() {
  const qc = useQueryClient()
  return useMutation<
    void,
    Error,
    { id: string; status: InvoiceStatus }
  >({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-invoices'] })
      qc.invalidateQueries({ queryKey: ['admin-invoice', id] })
      qc.invalidateQueries({ queryKey: ['my-invoices'] })
      qc.invalidateQueries({ queryKey: ['invoice', id] })
    },
  })
}

type ChangeNumberResponse = {
  success: boolean
  invoice_id: string
  new_invoice_number: string
}

/**
 * Admin-only direct invoice number change. Backed by the
 * `change-invoice-number` Edge Function which validates auth and calls
 * `apply_invoice_number_change` (writes history row + updates invoice).
 */
export function useAdminChangeInvoiceNumber() {
  const qc = useQueryClient()
  return useMutation<
    ChangeNumberResponse,
    Error,
    { invoiceId: string; newInvoiceNumber: string; reason?: string }
  >({
    mutationFn: async ({ invoiceId, newInvoiceNumber, reason }) => {
      const { data, error } = await supabase.functions.invoke<
        ChangeNumberResponse
      >('change-invoice-number', {
        body: {
          invoice_id: invoiceId,
          new_invoice_number: newInvoiceNumber,
          reason,
        },
      })
      if (error) {
        throw new Error(await extractFunctionError(error))
      }
      if (!data) throw new Error('Sin respuesta del servidor')
      return data
    },
    onSuccess: (_data, { invoiceId }) => {
      qc.invalidateQueries({ queryKey: ['admin-invoices'] })
      qc.invalidateQueries({ queryKey: ['admin-invoice', invoiceId] })
      qc.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      qc.invalidateQueries({ queryKey: ['my-invoices'] })
      qc.invalidateQueries({ queryKey: ['invoice-number-history'] })
    },
  })
}
