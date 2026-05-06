export type ProjectStatus = 'active' | 'inactive'

export type Project = {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export type ProjectWithStats = Project & {
  member_count: number
}

export type ProjectInput = {
  name: string
  description?: string | null
  status: ProjectStatus
}
