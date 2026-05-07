import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from './app/providers/QueryProvider'
import { AppRouter } from './app/router/AppRouter'
import { AuthProvider } from './features/auth/AuthProvider'
import { bootstrapNative } from './lib/native/bootstrap'
import { isNative } from './lib/native/platform'
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

// Register the Workbox-generated service worker on web only. Inside Capacitor
// the WebView serves files from file:// where SWs are blocked (and pointless —
// the APK/IPA already bundles every asset locally).
if (!isNative() && 'serviceWorker' in navigator && import.meta.env.PROD) {
  void import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  })
}
