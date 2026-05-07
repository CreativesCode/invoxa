import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { ReactNode } from 'react'

const ONE_DAY = 1000 * 60 * 60 * 24

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // gcTime must be ≥ maxAge below or persisted entries get evicted before
      // the persister rehydrates them.
      gcTime: ONE_DAY,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'invoxa-query-cache',
  // Bumping this string invalidates every persisted cache on next load —
  // useful when query shapes change.
  serialize: JSON.stringify,
  deserialize: JSON.parse,
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_DAY,
        // Tie cache to a build version so a deploy that changes query keys
        // doesn't read stale shapes from a prior install.
        buster: import.meta.env.VITE_BUILD_ID ?? 'dev',
        dehydrateOptions: {
          // Only persist successful queries; don't cache errors.
          shouldDehydrateQuery: (query) => query.state.status === 'success',
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
