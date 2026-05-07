import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA: precache the built assets so repeat visits load offline / from
    // disk. The runtime registration is gated by `isNative()` in main.tsx —
    // we never register the SW inside Capacitor (file:// scheme + SW don't
    // mix well and the native shell already caches everything in the APK).
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // we register manually from main.tsx (web only)
      // Use the manifest committed to public/ so we keep a single source of
      // truth for icons, theme color, etc.
      manifest: false,
      workbox: {
        // Precache the whole built bundle (vite hashes files, so they're safe
        // to cache forever).
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        // SPA fallback — any nav request not matching a precache entry falls
        // back to index.html so React Router can take over.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          // Stale-while-revalidate for the OG image (changes infrequently).
          {
            urlPattern: /\/og-image\.png$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'og-image' },
          },
        ],
        // Don't cache the dev-only HMR or sourcemaps.
        globIgnores: ['**/sw.js', '**/workbox-*.js', '**/*.map'],
      },
    }),
    // Pre-compress static assets so the host (Vercel) can serve `.gz` /
    // `.br` directly without compressing on the fly. Capacitor reads files
    // from `file://` and won't negotiate Content-Encoding, so the extra
    // `.gz`/`.br` files are inert there — only the original is loaded.
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      threshold: 1024,
      deleteOriginalAssets: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split vendor packages into stable, long-cacheable chunks. When we
        // ship a code change only the app chunk invalidates — Capacitor and
        // the browser keep the vendor chunks in cache.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined

          if (
            id.includes('/react-router') ||
            id.includes('/react-router-dom/') ||
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('/scheduler/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('@tanstack/react-query')) return 'vendor-query'
          if (
            id.includes('react-hook-form') ||
            id.includes('@hookform') ||
            id.includes('/zod/')
          ) {
            return 'vendor-forms'
          }
          if (id.includes('date-fns')) return 'vendor-date'
          if (id.includes('lucide-react')) return 'vendor-icons'
          if (id.includes('@capacitor')) return 'vendor-capacitor'

          return undefined
        },
      },
    },
  },
})
