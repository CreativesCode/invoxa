import { useQuery } from '@tanstack/react-query'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { supabase } from '../../../lib/supabase/client'
import type { InvoiceWithUser } from '../../../types/invoice'

export type AdminDashboardStats = {
  activeUsers: number
  pendingInvoiceRequests: number
  generatedThisMonth: number
  paidThisMonth: number
  pendingNumberChangeRequests: number
}

/**
 * Returns the headline KPIs the admin dashboard renders. All counts use
 * `head: true` to skip downloading rows — we only care about the count.
 *
 * "Generadas / Pagadas" use the calendar month (1st .. last day) of `today`
 * matched against `period_start`, since invoices reference their billing
 * period rather than the issue date.
 */
export function useAdminDashboardStats(today = new Date()) {
  const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')

  return useQuery<AdminDashboardStats>({
    queryKey: ['admin-dashboard-stats', monthStart],
    queryFn: async () => {
      const [
        { count: activeUsers },
        { count: pendingRequests },
        { count: generated },
        { count: paid },
        { count: pendingNumberChanges },
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active')
          .eq('role', 'user'),
        supabase
          .from('invoice_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('invoices')
          .select('id', { count: 'exact', head: true })
          .gte('period_start', monthStart)
          .lte('period_start', monthEnd)
          .in('status', ['generated', 'sent', 'reviewed', 'approved']),
        supabase
          .from('invoices')
          .select('id', { count: 'exact', head: true })
          .gte('period_start', monthStart)
          .lte('period_start', monthEnd)
          .eq('status', 'paid'),
        supabase
          .from('invoice_number_change_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ])

      return {
        activeUsers: activeUsers ?? 0,
        pendingInvoiceRequests: pendingRequests ?? 0,
        generatedThisMonth: generated ?? 0,
        paidThisMonth: paid ?? 0,
        pendingNumberChangeRequests: pendingNumberChanges ?? 0,
      }
    },
  })
}

/** Latest invoices across the org for the activity feed. */
export function useRecentInvoices(limit = 8) {
  return useQuery<InvoiceWithUser[]>({
    queryKey: ['admin-recent-invoices', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(
          '*, user:profiles(id, full_name, email, user_code)',
        )
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data ?? []) as InvoiceWithUser[]
    },
  })
}
