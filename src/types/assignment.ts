import type { Profile } from './profile'
import type { Project } from './project'

export type PaymentType = 'hourly' | 'fixed'

export type Assignment = {
  id: string
  user_id: string
  project_id: string
  is_current: boolean
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

export type Compensation = {
  id: string
  user_id: string
  project_id: string
  payment_type: PaymentType
  hourly_rate: number | null
  monthly_rate: number | null
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProjectMember = {
  assignment: Assignment
  user: Pick<Profile, 'id' | 'full_name' | 'email' | 'user_code' | 'status'>
  compensation: Compensation | null
}

export type UserAssignment = {
  assignment: Assignment
  project: Project
  compensation: Compensation | null
}

export type AssignmentInput = {
  user_id: string
  project_id: string
  start_date: string
  payment_type: PaymentType
  hourly_rate?: number | null
  monthly_rate?: number | null
  currency: string
}

export type CompensationInput = {
  payment_type: PaymentType
  hourly_rate?: number | null
  monthly_rate?: number | null
  currency: string
}
