export type UserRole = 'admin' | 'user'

export type UserStatus = 'active' | 'inactive' | 'invited'

export type Profile = {
  id: string
  full_name: string | null
  email: string
  user_code: string | null
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}
