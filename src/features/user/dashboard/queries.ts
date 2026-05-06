import { useQuery } from '@tanstack/react-query'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { supabase } from '../../../lib/supabase/client'
import type { Invoice } from '../../../types/invoice'

export type UserDashboardProject = {
  project_id: string
  project_name: string
  payment_type: 'hourly' | 'fixed'
  currency: string
  hourly_rate: number | null
  monthly_rate: number | null
  hours_this_month: number
}

export type UserDashboardStats = {
  activeProjects: number
  hoursThisMonth: number
  tasksThisMonth: number
  paidInvoices: number
  hasInvoiceForCurrentPeriod: boolean
  currentPeriodInvoice: Invoice | null
  projects: UserDashboardProject[]
  recentInvoices: Invoice[]
}

/**
 * Computes everything the user dashboard needs in one shot. Doing it as a
 * single hook keeps the dashboard reactive (one loading state) and avoids
 * round-trip-amplifying multiple useQuery calls.
 *
 * Mirrors the shape of `useInvoicePreview` for project enumeration: there is
 * no FK between `compensation_settings` and `user_project_assignments`, so we
 * fetch each separately and intersect by project_id in JS.
 */
export function useUserDashboardData(today = new Date()) {
  const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')

  return useQuery<UserDashboardStats>({
    queryKey: ['user-dashboard', monthStart],
    queryFn: async () => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) {
        return emptyStats()
      }

      const [
        { data: compsRaw },
        { data: assignmentsRaw },
        { data: tasksRaw },
        { count: paidCount },
        { data: currentInvoiceRaw },
        { data: recentInvoicesRaw },
      ] = await Promise.all([
        supabase
          .from('compensation_settings')
          .select(
            'project_id, payment_type, hourly_rate, monthly_rate, currency, project:projects(id, name)',
          )
          .eq('user_id', userId)
          .eq('is_active', true),
        supabase
          .from('user_project_assignments')
          .select('project_id')
          .eq('user_id', userId)
          .eq('is_current', true),
        supabase
          .from('tasks')
          .select('project_id, hours')
          .eq('user_id', userId)
          .gte('task_date', monthStart)
          .lte('task_date', monthEnd),
        supabase
          .from('invoices')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'paid'),
        supabase
          .from('invoices')
          .select('*')
          .eq('user_id', userId)
          .eq('period_start', monthStart)
          .eq('period_end', monthEnd)
          .neq('status', 'cancelled')
          .maybeSingle(),
        supabase
          .from('invoices')
          .select('*')
          .eq('user_id', userId)
          .order('invoice_date', { ascending: false })
          .order('user_invoice_sequence', { ascending: false })
          .limit(3),
      ])

      const currentProjectIds = new Set(
        ((assignmentsRaw ?? []) as { project_id: string }[]).map(
          (a) => a.project_id,
        ),
      )

      const comps = (
        (compsRaw ?? []) as unknown as {
          project_id: string
          payment_type: 'hourly' | 'fixed'
          hourly_rate: number | null
          monthly_rate: number | null
          currency: string
          project: { id: string; name: string }
        }[]
      ).filter((c) => currentProjectIds.has(c.project_id))

      // Aggregate hours by project for the running month.
      const tasks = (tasksRaw ?? []) as {
        project_id: string
        hours: number
      }[]
      const hoursByProject = new Map<string, number>()
      let totalHours = 0
      for (const t of tasks) {
        const prev = hoursByProject.get(t.project_id) ?? 0
        const next = prev + Number(t.hours)
        hoursByProject.set(t.project_id, next)
        totalHours += Number(t.hours)
      }

      const projects: UserDashboardProject[] = comps
        .map((c) => ({
          project_id: c.project_id,
          project_name: c.project.name,
          payment_type: c.payment_type,
          currency: c.currency,
          hourly_rate: c.hourly_rate,
          monthly_rate: c.monthly_rate,
          hours_this_month: hoursByProject.get(c.project_id) ?? 0,
        }))
        .sort((a, b) => a.project_name.localeCompare(b.project_name))

      return {
        activeProjects: projects.length,
        hoursThisMonth: totalHours,
        tasksThisMonth: tasks.length,
        paidInvoices: paidCount ?? 0,
        hasInvoiceForCurrentPeriod: Boolean(currentInvoiceRaw),
        currentPeriodInvoice: (currentInvoiceRaw ?? null) as Invoice | null,
        projects,
        recentInvoices: (recentInvoicesRaw ?? []) as Invoice[],
      }
    },
  })
}

function emptyStats(): UserDashboardStats {
  return {
    activeProjects: 0,
    hoursThisMonth: 0,
    tasksThisMonth: 0,
    paidInvoices: 0,
    hasInvoiceForCurrentPeriod: false,
    currentPeriodInvoice: null,
    projects: [],
    recentInvoices: [],
  }
}
