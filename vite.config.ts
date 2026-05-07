import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
