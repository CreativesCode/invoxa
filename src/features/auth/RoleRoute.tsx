import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { UserRole } from '../../types/profile'
import { useProfile } from './useProfile'

export function RoleRoute({
  role,
  children,
}: {
  role: UserRole
  children: ReactNode
}) {
  const { data: profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Cargando perfil…
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-red-600">
        No se pudo cargar tu perfil. Contacta al administrador.
      </div>
    )
  }

  if (profile.role !== role) {
    const fallback = profile.role === 'admin' ? '/admin/dashboard' : '/app/dashboard'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
