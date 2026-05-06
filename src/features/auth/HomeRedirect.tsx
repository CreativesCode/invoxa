import { Navigate } from 'react-router-dom'
import { useProfile } from './useProfile'

export function HomeRedirect() {
  const { data: profile, isLoading, error } = useProfile()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Cargando…
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

  const target = profile.role === 'admin' ? '/admin/dashboard' : '/app/dashboard'
  return <Navigate to={target} replace />
}
