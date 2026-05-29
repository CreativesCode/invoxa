import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import { extractFunctionError } from '../../../lib/supabase/functionError'
import type { Project } from '../../../types/project'
import type { Task, TaskInput, TaskWithProject } from '../../../types/task'

const TASKS_KEY = 'my-tasks' as const

export function useMyHourlyProjects() {
  return useQuery<Project[]>({
    queryKey: ['my-hourly-projects'],
    queryFn: async () => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) return []

      const { data, error } = await supabase
        .from('compensation_settings')
        .select('project:projects(*)')
        .eq('user_id', userId)
        .eq('payment_type', 'hourly')
        .eq('is_active', true)

      if (error) throw error
      return ((data ?? []) as unknown as { project: Project }[])
        .map((r) => r.project)
        .filter((p): p is Project => Boolean(p))
    },
  })
}

export function useMyTasks({
  periodStart,
  periodEnd,
  projectId,
}: {
  periodStart: string
  periodEnd: string
  projectId?: string
}) {
  return useQuery<TaskWithProject[]>({
    queryKey: [TASKS_KEY, periodStart, periodEnd, projectId ?? 'all'],
    queryFn: async () => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) return []

      let q = supabase
        .from('tasks')
        .select('*, project:projects(id, name)')
        .eq('user_id', userId)
        .gte('task_date', periodStart)
        .lte('task_date', periodEnd)
        .order('task_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (projectId) q = q.eq('project_id', projectId)

      const { data, error } = await q
      if (error) throw error
      return (data ?? []) as TaskWithProject[]
    },
  })
}

export function useTask(id: string | undefined) {
  return useQuery<TaskWithProject | null>({
    queryKey: ['task', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('tasks')
        .select('*, project:projects(id, name)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as TaskWithProject
    },
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: TaskInput) => {
      const { data: userResult } = await supabase.auth.getUser()
      const userId = userResult?.user?.id
      if (!userId) throw new Error('No autenticado')

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          project_id: input.project_id,
          name: input.name,
          description: input.description,
          task_date: input.task_date,
          hours: input.hours,
          observations: input.observations,
        })
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

export function useUpdateTask(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: TaskInput) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          project_id: input.project_id,
          name: input.name,
          description: input.description,
          task_date: input.task_date,
          hours: input.hours,
          observations: input.observations,
        })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Task
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] })
      qc.invalidateQueries({ queryKey: ['task', id] })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

// =============================================================================
// Tasks report PDF — worked-hours justification grouped by project
// =============================================================================

type TasksReportPdfResponse = {
  success: boolean
  pdf_path: string
}

/**
 * Generates (server-side, via Edge Function) the monthly tasks report PDF for
 * the current user — all tasks in the period, grouped into one section per
 * project — and returns its storage path in the `reports` bucket. Mirrors the
 * invoice PDF flow.
 */
export function useGenerateTasksReportPdf() {
  return useMutation<
    TasksReportPdfResponse,
    Error,
    { periodStart: string; periodEnd: string }
  >({
    mutationFn: async ({ periodStart, periodEnd }) => {
      const { data, error } =
        await supabase.functions.invoke<TasksReportPdfResponse>(
          'generate-tasks-report-pdf',
          {
            body: { period_start: periodStart, period_end: periodEnd },
          },
        )
      if (error) throw new Error(await extractFunctionError(error))
      if (!data) throw new Error('Sin respuesta del servidor')
      return data
    },
  })
}

/**
 * Creates a short-lived signed URL for a tasks report PDF stored in the
 * `reports` private bucket. Returns null if it couldn't be signed.
 */
export async function getTasksReportPdfSignedUrl(
  pdfPath: string,
  expiresInSeconds = 60,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('reports')
    .createSignedUrl(pdfPath, expiresInSeconds)
  if (error || !data) return null
  return data.signedUrl
}
