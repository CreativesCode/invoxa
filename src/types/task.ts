import type { Project } from './project'

export type Task = {
  id: string
  user_id: string
  project_id: string
  invoice_id: string | null
  name: string
  description: string | null
  task_date: string
  hours: number
  observations: string | null
  created_at: string
  updated_at: string
}

export type TaskWithProject = Task & {
  project: Pick<Project, 'id' | 'name'>
}

export type TaskInput = {
  project_id: string
  name: string
  description: string | null
  task_date: string
  hours: number
  observations: string | null
}

export function isTaskBilled(task: Pick<Task, 'invoice_id'>): boolean {
  return task.invoice_id != null
}
