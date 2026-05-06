import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from './app/providers/QueryProvider'
import { AppRouter } from './app/router/AppRouter'
import { AuthProvider } from './features/auth/AuthProvider'
import { bootstrapNative } from './lib/native/bootstrap'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryProvider>
  </StrictMode>,
)

// Configure the native shell after React is mounted. Safe no-op on web.
void bootstrapNative()
