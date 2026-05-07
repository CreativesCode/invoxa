import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// Set ANALYZE=1 before `npm run build` to emit dist/stats.html with a
// treemap of the bundle. Off by default so CI builds don't pay the cost.
const enableVisualizer = process.env.ANALYZE === '1'

// Pre-compression generates `.gz`/`.br` siblings next to every asset. We
// only emit them on Vercel (where they save edge CPU on cold-start). Android
// Gradle (`mergeDebugAssets`) rejects `foo.js` + `foo.js.gz` as duplicate
// resources, so we MUST NOT generate them in any build that gets packaged
// into an APK/IPA — Ionic Cloud (Appflow), local `npm run native:*`, etc.
//
// Vercel sets `VERCEL=1` automatically in its build environment. Appflow
// does not expose that var, so its builds skip compression by default —
// no per-environment config needed there.
const enableCompression = process.env.VERCEL === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    enableVisualizer
      ? visualizer({
          filename: 'dist/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : null,
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
    // `.br` directly without compressing on the fly. Disabled when building
    // for Capacitor (SKIP_COMPRESS=1) because Android Gradle rejects the
    // sibling `.gz`/`.br` files as duplicate resources.
    enableCompression
      ? compression({
          algorithms: ['gzip', 'brotliCompress'],
          threshold: 1024,
          deleteOriginalAssets: false,
        })
      : null,
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
