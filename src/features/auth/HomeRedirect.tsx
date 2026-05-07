import { Navigate } from 'react-router-dom'
import { isNative } from '../../lib/native/platform'
import { LandingPage } from '../landing/LandingPage'
import { useAuth } from './AuthProvider'
import { useProfile } from './useProfile'

export function HomeRedirect() {
  const { session, loading: authLoading } = useAuth()
  const { data: profile, isLoading: profileLoading, error } = useProfile()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Cargando…
      </div>
    )
  }

  // Unauthenticated visitor: on the web we render the marketing landing
  // directly at "/" so it's the canonical URL for SEO. On the native shell
  // (Capacitor) the landing must never appear — go straight to login.
  if (!session) {
    if (isNative()) return <Navigate to="/login" replace />
    return <LandingPage />
  }

  if (profileLoading) {
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
