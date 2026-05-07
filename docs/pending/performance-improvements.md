# Mejoras de rendimiento (Web + Capacitor)

> Plan incremental para acelerar la carga inicial, reducir el tamaño del bundle y mejorar la respuesta percibida en navegador y en el shell nativo (iOS/Android via Capacitor). Cada bloque está pensado para abordarse de forma independiente — empieza por **P0** y avanza.

**Estado actual (referencia, build de `dist/assets`):**
- `index-*.js` ≈ **815 KB** (sin gzip) en un único chunk → contiene rutas admin + user + landing + supabase-js + react-query + react-router + landing strings.
- `index-*.css` ≈ **27 KB**.
- 30+ rutas importadas de forma estática en [src/app/router/AppRouter.tsx](src/app/router/AppRouter.tsx).
- Sin `manualChunks`, sin compresión, sin PWA/service worker.
- Fuentes de Google cargadas de forma bloqueante desde `index.html`.

---

## P0 — Quick wins (impacto alto, esfuerzo bajo)

### 1. Code splitting por ruta con `React.lazy` ✅ COMPLETADO
**Problema:** [src/app/router/AppRouter.tsx:8-31](src/app/router/AppRouter.tsx#L8-L31) importa estáticamente las 30+ páginas. El usuario que entra a la landing descarga el código de admin y viceversa. En móvil con 4G esto se nota.

**Acción:**
- Convertir cada página de ruta en `React.lazy(() => import('...'))`.
- Envolver `<Routes>` con `<Suspense fallback={<PageSkeleton />}>`.
- Mantener eager-loaded sólo: `HomeRedirect`, `LoginPage`, `ProtectedRoute`, `RoleRoute` (el camino crítico).
- **Excepción importante:** `LandingPage` (1233 líneas en [src/features/landing/LandingPage.tsx](src/features/landing/LandingPage.tsx)) NO debe entrar al bundle del shell nativo. Importarla con `lazy` y, dentro de `HomeRedirect`, hacer `if (isNative()) return <Navigate to="/login" replace />` ANTES de tocar el import — ya está así pero el `import { LandingPage }` estático en [src/features/auth/HomeRedirect.tsx:3](src/features/auth/HomeRedirect.tsx#L3) la mete al bundle igual. Cambiar a `lazy` corta ~30-50 KB del binario nativo.

**Impacto esperado:** −40 a −55% en JS inicial (de ~815 KB a ~350-450 KB en la primera vista).

**Resultado real (build):**
- Chunk inicial: **815 KB → 528 KB** (sin gzip) / **151 KB gzip** → **−35%**.
- Cada página queda como chunk independiente (3-15 KB cada una; `LandingPage` aislada en 27 KB).
- En Capacitor, la `LandingPage` ya **no se descarga** (lazy + redirect a `/login` antes del import).
- Suspense fallback creado en [src/components/ui/RouteFallback.tsx](src/components/ui/RouteFallback.tsx) con delay de 180 ms para evitar flash en chunks cacheados.
- Cambios: [src/app/router/AppRouter.tsx](src/app/router/AppRouter.tsx), [src/features/auth/HomeRedirect.tsx](src/features/auth/HomeRedirect.tsx).

### 2. Configurar `manualChunks` en Vite ✅ COMPLETADO
**Problema:** [vite.config.ts](vite.config.ts) está vacío (sólo `react()`). Todo va a un solo chunk gigante.

**Acción:** En `vite.config.ts`, agregar `build.rollupOptions.output.manualChunks` separando:
- `vendor-react` → `react`, `react-dom`, `react-router-dom`
- `vendor-supabase` → `@supabase/supabase-js`
- `vendor-query` → `@tanstack/react-query`
- `vendor-forms` → `react-hook-form`, `@hookform/resolvers`, `zod`
- `vendor-date` → `date-fns`
- `vendor-icons` → `lucide-react`

Esto **mejora cache hit rate**: cuando subes una versión nueva, sólo invalida el chunk de tu código (no los vendors), así Capacitor + navegador reutilizan los chunks ya cacheados.

**Resultado real (build):**
- App code (`index-*.js`): **27.8 KB / 8.5 KB gzip** (antes era el chunk monolítico).
- Vendors aislados: `vendor-react` (222 KB / 71 KB gzip), `vendor-supabase` (196 KB / 50 KB gzip), `vendor-forms` (101 KB / 30 KB gzip), `vendor-query` (29 KB / 9 KB gzip), `vendor-date` (28 KB / 7.5 KB gzip), `vendor-icons` (10 KB / 3.7 KB gzip), `vendor-capacitor` (11 KB / 4.2 KB gzip).
- En cada release sólo invalida `index-*.js` (~28 KB) — todo el resto reaprovecha cache.
- Desaparece el warning `chunks larger than 500 kB`.
- Cambios: [vite.config.ts](vite.config.ts).

### 3. Compresión Brotli/Gzip al build ✅ COMPLETADO
**Problema:** No hay precompresión. Vercel sirve `br/gzip` automáticamente en web pero **Capacitor sirve archivos crudos del bundle** desde `dist/`.

**Acción:**
- Añadir `vite-plugin-compression` (gzip + brotli) → genera `.br`/`.gz` que Vercel sirve.
- Para Capacitor: el WebView no negocia `Content-Encoding` con archivos `file://`, así que la compresión real ahí viene de los **chunks pequeños** (punto 1+2). No tiene sentido empaquetar `.br` para nativo, pero sí ayuda en web.

**Resultado real (build):**
- Plugin elegido: `vite-plugin-compression2` (mejor mantenido, soporta gzip + brotli en una sola instancia).
- Cada asset > 1 KB ahora tiene `.gz` y `.br` (49 + 49 archivos).
- Ahorros con Brotli: `vendor-react` 222 KB → 61 KB (−73%), `vendor-supabase` 196 KB → 42 KB (−79%), `vendor-forms` 101 KB → 27 KB (−74%), CSS 28 KB → 5.5 KB (−80%).
- Brotli es ~10-15% más pequeño que gzip; Vercel sirve `.br` cuando el navegador lo acepta.
- **Pendiente menor:** los `.br`/`.gz` se incluyen en el APK/IPA de Capacitor (~700 KB extra inertes). Limpiar en `native:sync` cuando se aborde el resto de optimizaciones nativas.
- Cambios: [vite.config.ts](vite.config.ts), [package.json](package.json) (+`vite-plugin-compression2`).

### 4. Self-hostear las fuentes (o preload con `font-display: swap`) ✅ COMPLETADO
**Problema:** [index.html:66-71](index.html#L66-L71) hace `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` que **bloquea el render** hasta resolver DNS + descargar CSS + descargar woff2. En Capacitor, esto requiere conexión y añade ~200-400 ms de TTFP en redes lentas.

**Acción (recomendada — self-host):**
- Descargar los `.woff2` de Geist + Fraunces, ponerlos en `public/fonts/`.
- Declararlos con `@font-face { font-display: swap }` en [src/index.css](src/index.css).
- Añadir `<link rel="preload" as="font" type="font/woff2" crossorigin>` en `index.html` para los pesos críticos (Geist 400/500 + Fraunces 600).
- Eliminar el bloque `preconnect`/`stylesheet` a Google Fonts.
- En Capacitor: las fuentes quedan empaquetadas → cero red, render inmediato.

**Acción mínima (si no quieres self-host):**
- Cambiar a carga no bloqueante: `<link rel="preload" as="style" onload="this.rel='stylesheet'">`.
- Reducir el set: 7 pesos de Fraunces es excesivo; revisa cuáles realmente usas y deja 2-3.

**Resultado real (build):**
- Implementado vía paquetes `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource-variable/fraunces` (variable fonts → un woff2 por familia con todos los pesos).
- Imports en [src/index.css](src/index.css): `wght.css` para Geist y Geist Mono, `opsz.css` para Fraunces (eje opsz que la app usa).
- Eliminados `<link>` y `preconnect` a Google Fonts en [index.html](index.html).
- Tailwind (`tailwind.config.js`) y `index.css` ahora declaran `'Geist Variable'` / `'Fraunces Variable'` / `'Geist Mono Variable'` con fallbacks.
- Vite empaqueta 9 woff2 con hashes; el navegador descarga sólo subset `latin` por `unicode-range` (3 archivos: 28 KB Geist + 67 KB Fraunces + 31 KB Geist Mono = **127 KB**).
- **Antes ~465 KB** vs **ahora ~127 KB** + cero RTT a Google + Capacitor sin conexión.
- Pendiente opcional: `<link rel="preload" as="font">` para los 3 latin críticos (mínima optimización extra; con `font-display: swap` ya no bloquea render).
- Cambios: [package.json](package.json) (+`@fontsource-variable/*`), [src/index.css](src/index.css), [tailwind.config.js](tailwind.config.js), [index.html](index.html).

### 5. Lazy-load de la verificación de sesión en `HomeRedirect` ✅ COMPLETADO
**Problema:** [src/features/auth/HomeRedirect.tsx](src/features/auth/HomeRedirect.tsx) muestra "Cargando…" hasta que `getSession()` y `useProfile()` resuelven. En `bootstrapNative` ([src/lib/native/bootstrap.ts:31](src/lib/native/bootstrap.ts#L31)) el splash se oculta tras `fadeOutDuration: 250` apenas se monta React, así que el usuario nativo ve "Cargando…" varios cientos de ms.

**Acción:**
- En Capacitor: posponer `SplashScreen.hide()` hasta que `useAuth().loading === false` (un evento de "ready"). Así el splash se queda hasta que ya hay algo significativo que mostrar y se evita el parpadeo.
- En web: pintar un skeleton del shell en lugar de el texto "Cargando…" para reducir CLS.

**Resultado real:**
- [src/lib/native/bootstrap.ts](src/lib/native/bootstrap.ts) ya no oculta el splash automáticamente; expone `hideNativeSplash()` (idempotente, no-op en web).
- [src/features/auth/AuthProvider.tsx](src/features/auth/AuthProvider.tsx) llama `hideNativeSplash()` apenas resuelve `getSession()` → splash → login/landing/dashboard sin flash de "Cargando…".
- Red de seguridad: si la sesión no resuelve en 5 s (red caída / Supabase down), el splash se cierra igualmente para no dejar al usuario congelado.
- Web: los placeholders "Cargando…" en [HomeRedirect.tsx](src/features/auth/HomeRedirect.tsx) y [AppShell.tsx](src/components/layout/AppShell.tsx) reemplazados por `<RouteFallback />` (delay de 180 ms anti-flash + spinner consistente).
- Cambios: [src/lib/native/bootstrap.ts](src/lib/native/bootstrap.ts), [src/features/auth/AuthProvider.tsx](src/features/auth/AuthProvider.tsx), [src/features/auth/HomeRedirect.tsx](src/features/auth/HomeRedirect.tsx), [src/components/layout/AppShell.tsx](src/components/layout/AppShell.tsx).

---

## P1 — Mejoras de tamaño y reactividad (esfuerzo medio)

### 6. Tree-shake / verificar `lucide-react` ✅ VERIFICADO (sin acción)
**Problema:** 37 archivos importan iconos (búsqueda en [src/](src)). El paquete `"lucide-react": "^1.14.0"` declarado en [package.json:32](package.json#L32) es **inusual** — la versión oficial actual es `0.x`. Confirma cuál estás usando: si es un fork o versión vieja, probablemente no tree-shake bien y empaquetes los ~1000 iconos.

**Acción:**
- Validar el bundle: `npx vite-bundle-visualizer` o `rollup-plugin-visualizer` y mirar el peso real de `lucide-react`.
- Si pesa > 30 KB en el bundle, migrar a `lucide-react@latest` (named imports tree-shake correctamente) o usar `lucide-react/icons/*` per-icon.
- Alternativa: copiar los ~15-20 iconos que realmente usas como SVG inline (cero dependencia, mejor cache).

**Resultado:** la versión `1.14.0` instalada es la oficial y declara `sideEffects: false`. El chunk `vendor-icons` final pesa **9.73 KB / 3.71 KB gzip** para los 37 archivos importadores → el tree-shaking ya está funcionando óptimamente. No requiere cambios.

### 7. `date-fns` por imports puntuales ✅ COMPLETADO
**Problema:** 18 archivos importan de `date-fns`. Aunque date-fns v4 es tree-shakeable, los locales no siempre lo son (`date-fns/locale/es`).

**Acción:**
- Verificar en el bundle visualizer si `date-fns` está bien tree-shakeado.
- Considerar reemplazar `formatDistanceToNow` (lo más pesado por incluir lógica de pluralización) por una utilidad propia de 30 líneas en [src/lib/dates/](src/lib/dates/), ya que el caso de uso (notificaciones) es muy acotado.
- Si se vuelve necesario, evaluar `dayjs` (~7 KB) que es drop-in para muchos casos.

**Resultado:**
- Tree-shaking de date-fns ya funciona (sólo `format`, `addMonths`, `subMonths`, `isSameMonth`, `startOfMonth`, `endOfMonth` quedan en bundle).
- `formatDistanceToNow` + locale `es` reemplazados por una utilidad de ~30 líneas en [src/lib/dates/relative.ts](src/lib/dates/relative.ts) (`formatRelativeEs`).
- `vendor-date`: **27.79 KB → 25.69 KB** (−2 KB raw / −0.6 KB gzip).
- Cambios: [src/lib/dates/relative.ts](src/lib/dates/relative.ts) (nuevo), [src/features/notifications/NotificationsBell.tsx](src/features/notifications/NotificationsBell.tsx), [src/features/notifications/NotificationsPage.tsx](src/features/notifications/NotificationsPage.tsx).

### 8. Persistencia offline de React Query (esencial para Capacitor) ✅ COMPLETADO
**Problema:** [src/app/providers/QueryProvider.tsx](src/app/providers/QueryProvider.tsx) tiene `staleTime: 30_000` pero **no persiste el cache**. Cada cold-start de la app nativa = todas las queries de cero, aunque el usuario abra la app cinco minutos después.

**Acción:**
- Añadir `@tanstack/query-sync-storage-persister` + `@tanstack/react-query-persist-client`.
- Usar `Preferences` de Capacitor (o `localStorage` en web) como storage.
- Configurar `maxAge: 1000 * 60 * 60 * 24` (24 h) para listas largas (proyectos, usuarios).
- **Beneficio enorme en móvil:** apertura instantánea con datos cacheados, refetch en background.

**Resultado:**
- [src/app/providers/QueryProvider.tsx](src/app/providers/QueryProvider.tsx) ahora usa `PersistQueryClientProvider` con `createSyncStoragePersister` (`localStorage` funciona igual de bien en web y en el WebView de Capacitor — más simple que dos persisters).
- `gcTime` subido a 24 h (necesario para que las entradas no se desalojen antes de que el persister rehidrate).
- `dehydrateOptions.shouldDehydrateQuery` filtra para persistir sólo queries `success` (nunca errores).
- `buster: import.meta.env.VITE_BUILD_ID` invalida la cache en cada deploy si se setea esa env.
- [src/features/auth/AuthProvider.tsx](src/features/auth/AuthProvider.tsx) — `signOut` llama `queryClient.clear()` y borra `invoxa-query-cache` de localStorage para evitar leak entre usuarios.
- Costo: `vendor-query` 29 KB → 33 KB (+4 KB raw / +1 KB gzip). Trade-off muy positivo: cold-start instantáneo, soporte offline en Capacitor.
- Cambios: [package.json](package.json) (+`@tanstack/query-sync-storage-persister`, `@tanstack/react-query-persist-client`, `@capacitor/preferences`), [src/app/providers/QueryProvider.tsx](src/app/providers/QueryProvider.tsx), [src/features/auth/AuthProvider.tsx](src/features/auth/AuthProvider.tsx).

### 9. `BrowserRouter` v7 y `startTransition` ✅ VERIFICADO (sin acción)
**Acción opcional:**
- React Router 7 está en `package.json`. Asegurarse que `Routes` esté configurado con `future={{ v7_startTransition: true }}` para que las navegaciones hagan transiciones concurrentes en lugar de bloquear.
- Esto reduce los "frames perdidos" cuando navegas entre páginas pesadas.

**Resultado:** en `react-router-dom@7.15.0` todas las future flags previas (incluyendo `v7_startTransition`) son comportamiento por defecto. Las navegaciones ya se envuelven en `startTransition` automáticamente — nada que cambiar.

### 10. `Suspense` boundaries por sección ⏸️ DIFERIDO (requiere refactor)
- Envolver el `<main>` de [AppShell.tsx](src/components/layout/AppShell.tsx) con un `<Suspense>` que muestre un skeleton específico de la página (no spinner global) → mejora la sensación de velocidad sin acelerar nada en realidad.

**Por qué se difiere:** cada página actualmente renderiza su propia `<AppShell>` internamente, por lo que el `<Suspense>` del [AppRouter.tsx](src/app/router/AppRouter.tsx) captura toda la pantalla (sidebar incluido) al navegar entre rutas. Para mantener el shell estático y sólo intercambiar el `<main>` se necesita:

1. Crear un `AppShellLayout` que renderice `<AppShell>...<Suspense fallback={<MainSkeleton/>}><Outlet/></Suspense>...</AppShell>`.
2. Convertir las rutas autenticadas a `<Route element={<AppShellLayout/>}>` con `<Outlet/>`.
3. Quitar el `<AppShell>` de cada página (~25 archivos).

Este refactor toca todas las páginas autenticadas — mejor hacerlo en un PR aislado cuando se aborde la mejora de UX de navegación. Por ahora el `RouteFallback` (con delay 180 ms) ya evita el flash en chunks cacheados.

---

## P2 — Específicos de Capacitor / nativo

### 11. `SplashScreen` — control fino del fade ✅ COMPLETADO
- [capacitor.config.ts:26-33](capacitor.config.ts#L26-L33): `launchAutoHide: false` está bien (manual hide), pero el `fadeOutDuration: 250` se ejecuta apenas el JS arranca, no cuando hay UI.
- **Acción:** Mover el `SplashScreen.hide()` a un `useEffect` en `App` (o equivalente) que dispare cuando `auth.loading === false` Y el primer render esté pintado (`requestAnimationFrame` doble). Evita el "flash" de pantalla en blanco entre splash y UI.

**Resultado:** combinado con P0 #5. `hideNativeSplash()` en [src/lib/native/bootstrap.ts](src/lib/native/bootstrap.ts) ahora espera dos `requestAnimationFrame` antes de iniciar el fade — garantiza que el primer frame post-splash ya esté pintado.

### 12. `bundledWebRuntime: false` — ya está ✅
- Capacitor ya no incluye runtime extra, bien.

### 13. `captureInput: true` en Android
- [capacitor.config.ts:17](capacitor.config.ts#L17): correcto para teclado en formularios. Sin cambios.

### 14. Activos nativos (íconos/splash) ✅ VERIFICADO (sin acción)
- `npm run native:assets` regenera con `@capacitor/assets`. Verificar que las imágenes fuente en [resources/](resources/) sean PNG/SVG optimizados (no fotos sin comprimir). PNG > 200 KB en `resources/` se traduce en builds nativas más pesadas.

**Resultado:** [resources/](resources/) tiene `icon.png` (19 KB), `icon-background.png` (23 KB), `icon-foreground.png` (19 KB), `splash.png` y `splash-dark.png` (182 KB cada uno). Tamaños razonables para PNGs sin re-compresión adicional valga la pena.

### 15. WebView "freeze on background" / pre-warming ✅ COMPLETADO
- iOS/Android suspenden el WebView al ir a background. Cuando vuelves, se ejecuta de nuevo el ciclo de auth + queries.
- **Acción:** Listener `App.addListener('appStateChange', …)` en [src/lib/native/bootstrap.ts](src/lib/native/bootstrap.ts) que invalide solo las queries críticas (notificaciones, dashboard) en lugar de un refetch masivo.

**Resultado:** [src/lib/native/bootstrap.ts](src/lib/native/bootstrap.ts) ahora escucha `appStateChange` y al volver a foreground invalida sólo las queries time-sensitive (`notifications`, `user-dashboard`, `admin-dashboard-stats`, `admin-recent-invoices`) con `refetchType: 'active'`. El resto de la cache mantiene su snapshot hasta que expire `staleTime` — evita el refetch storm en resume.

### 16. Realtime de Supabase — coste en batería ✅ COMPLETADO
- [src/features/notifications/useNotificationsRealtime.ts](src/features/notifications/useNotificationsRealtime.ts) abre un canal WebSocket persistente.
- **Acción móvil:** Cerrar el canal cuando la app va a background (`appStateChange === 'inactive'`) y reabrirlo al volver. Mantener WebSocket abierto en background drena batería y, en iOS, suele cortarse igual.

**Resultado:** [src/features/notifications/useNotificationsRealtime.ts](src/features/notifications/useNotificationsRealtime.ts) refactorizado con helpers `subscribe()`/`unsubscribe()`. Sólo en Capacitor (`isNative()`) registra `appStateChange`: `isActive: false → unsubscribe`, `isActive: true → subscribe`. En web mantiene el canal siempre abierto.

### 17. Probar `FastImage` / decodificación asíncrona ✅ VERIFICADO (sin acción)
- Las imágenes inline (SVG en `public/brand/`) están bien. Si añades JPGs grandes (avatares, evidencias), usar `loading="lazy"` + `decoding="async"`.

**Resultado:** la app actualmente sólo usa SVGs (en `public/brand/` y `public/icons.svg`) — no hay JPGs/PNGs grandes en runtime. Aplicar cuando se introduzcan avatares o evidencias.

### 18. Habilitar `WKAppBoundDomains` en iOS (si aplica) ✅ N/A
- Permite que WebView use service workers nativamente en iOS 14+. Útil si llegas al P3 (PWA).

**Resultado:** **no aplica** a esta arquitectura. WKAppBoundDomains habilita SW dentro del WebView de iOS para apps que cargan contenido HTTPS remoto. Capacitor sirve `file://` desde el bundle local — no necesita SW (los assets ya están empaquetados) y por eso el registro del SW está explícitamente bloqueado en Capacitor en [src/main.tsx](src/main.tsx). El SW sólo se activa en la versión web.

---

## P3 — PWA / cacheo agresivo (web)

### 19. Service Worker con Workbox ✅ COMPLETADO
**Problema:** [public/manifest.webmanifest](public/manifest.webmanifest) existe pero no hay SW. Cada visita = descargar todo el bundle de nuevo.

**Acción:**
- `npm i -D vite-plugin-pwa`
- Configurar precache de assets versionados + `runtimeCaching` para fuentes y `og-image.png`.
- `registerType: 'autoUpdate'` para que el SW se actualice silenciosamente.
- **Beneficio:** carga sub-segundo en visitas repetidas; soporte offline parcial.

**Resultado:**
- `vite-plugin-pwa@1.3.0` configurado en [vite.config.ts](vite.config.ts) con `registerType: 'autoUpdate'`, `injectRegister: false`, `manifest: false` (reusa el `public/manifest.webmanifest` existente).
- Precache de `**/*.{js,css,html,svg,png,woff2,webmanifest}` + `navigateFallback: '/index.html'` para SPA + `runtimeCaching` StaleWhileRevalidate para `og-image.png`.
- Build genera `dist/sw.js` (6 KB) y `dist/workbox-*.js` (15 KB) con **83 entries precacheadas (~1.25 MB)**.
- Registro condicional en [src/main.tsx](src/main.tsx): sólo en web (`!isNative()`) y en `PROD` — Capacitor sirve `file://` y no necesita SW.
- Cambios: [vite.config.ts](vite.config.ts), [src/main.tsx](src/main.tsx), [src/vite-env.d.ts](src/vite-env.d.ts) (+`vite-plugin-pwa/client` types), [package.json](package.json) (+`vite-plugin-pwa`).

### 20. `<link rel="modulepreload">` para chunks críticos ✅ VERIFICADO (sin acción)
- Vite ya inyecta `modulepreload` para los chunks que el HTML necesita. Verifica en `dist/index.html` que estén los `vendor-react`, `vendor-router` (después de aplicar #2).

**Resultado:** `dist/index.html` ya inyecta `modulepreload` para `vendor-react`, `vendor-supabase`, `vendor-forms`, `vendor-query`, `vendor-icons`, `vendor-capacitor` y el runtime de rolldown. Funciona automáticamente con `manualChunks`.

### 21. HTTP Headers en Vercel ✅ COMPLETADO
**Acción:** crear/actualizar `vercel.json` con:
- `Cache-Control: public, max-age=31536000, immutable` para `/assets/*` (los hashes ya invalidan).
- `Cache-Control: no-cache` para `/index.html`.
- `Content-Security-Policy` mínimo (defensivo, no de rendimiento, pero aprovecha el toque).

**Resultado:** [vercel.json](vercel.json) creado con:
- `/assets/*` y `*.woff2` → `max-age=31536000, immutable` (hashes invalidan).
- `/sw.js` y `/index.html` → `no-cache, no-store, must-revalidate` (deben actualizarse en cada visita).
- `/manifest.webmanifest` → `max-age=3600` (cambia poco).
- Headers de seguridad globales: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`.
- Rewrite SPA: `^/((?!api/|assets/|.*\..*).*)` → `/` para que React Router maneje rutas.

---

## P4 — Renderizado y React (esfuerzo variable)

> **Política para P4:** todas estas optimizaciones requieren **medir primero** con React DevTools Profiler (o el panel Performance del navegador). Memoizar/virtualizar a ciegas suele añadir complejidad sin beneficio. Aplicar sólo cuando el profiler muestre re-renders evitables o long tasks > 50 ms.

### 22. `useMemo` / `useCallback` en lugares calientes ⏸️ DIFERIDO (medir antes)
- Auditar [src/features/landing/LandingPage.tsx](src/features/landing/LandingPage.tsx) (1233 líneas, varios `useEffect`/`IntersectionObserver`). Si la animación reveal causa jank, considerar `react-intersection-observer` (más eficiente que la implementación manual).

**Estado actual:** la landing usa un `useReveal` propio con `IntersectionObserver` que se desconecta apenas dispara — ya es eficiente. No tocar sin evidencia de jank.

### 23. Virtualización de listas largas ⏸️ DIFERIDO (depende del volumen real)
- Si [InvoicesListPage](src/features/user/invoices/InvoicesListPage.tsx), [TasksListPage](src/features/user/tasks/TasksListPage.tsx), o `UsersListPage` superan ~50 filas en producción, usar `@tanstack/react-virtual` (~5 KB).

**Cuándo aplicar:** cuando una lista en producción supere consistentemente las ~50 filas o el scroll empiece a sentirse pesado. Por ahora no es necesario.

### 24. `React.memo` en celdas de listas ⏸️ DIFERIDO (medir antes)
- Sólo después de medir con React DevTools Profiler. No memoizar a ciegas.

### 25. Debounce de búsquedas/filtros ✅ VERIFICADO (sin acción)
- Cualquier input que dispare query → `useDeferredValue` (React 19 nativo, ya está disponible) en lugar de `setTimeout` manual.

**Estado actual:** los inputs de búsqueda en [ProjectsListPage.tsx](src/features/admin/projects/ProjectsListPage.tsx), [UsersListPage.tsx](src/features/admin/users/UsersListPage.tsx), [AdminInvoicesListPage.tsx](src/features/admin/invoices/AdminInvoicesListPage.tsx) filtran client-side con `useMemo` sobre listas pequeñas — sin red, sin jank perceptible. Aplicar `useDeferredValue` sólo si crecen mucho los datasets.

---

## P5 — Observabilidad (sin esto no sabes si ganaste)

### 26. Web Vitals ✅ COMPLETADO
- Añadir `web-vitals` (~2 KB) y enviar a Vercel Analytics o a una tabla de Supabase.
- Métricas mínimas: **LCP, INP, CLS, TTFB**. Sin estos números, las optimizaciones son a ciegas.

**Resultado:** módulo en [src/lib/observability/webVitals.ts](src/lib/observability/webVitals.ts) reporta `LCP`, `CLS`, `INP`, `TTFB` vía `web-vitals@5`. Se invoca con `import()` dinámico en [src/main.tsx](src/main.tsx) sólo en web (no en Capacitor) → cargado tras el hidrate, no penaliza TTFB. Por defecto loguea a `console.info`. Para enviar a un endpoint real, pasar un `dispatch` propio: `reportWebVitals((m) => fetch('/api/vitals', { method: 'POST', body: JSON.stringify(m) }))`. Toggle de logging extra: `VITE_LOG_WEB_VITALS=1`.

### 27. Bundle visualizer ✅ COMPLETADO
- `rollup-plugin-visualizer` en `vite.config.ts` (modo dev). Genera `stats.html` por cada build → ves exactamente qué pesa.
- **Hacer esto antes de empezar P0** para tener línea base.

**Resultado:** `rollup-plugin-visualizer` configurado en [vite.config.ts](vite.config.ts) detrás de la env var `ANALYZE`. CI builds normales no pagan el costo. Para analizar:

```bash
ANALYZE=1 npm run build
# Abrir dist/stats.html — treemap interactivo con tamaños raw, gzip y brotli
```

### 28. Lighthouse CI ⏸️ DIFERIDO (requiere decisión de CI)
- Correr Lighthouse contra una preview de Vercel en cada PR. Falla si LCP > 2.5 s o si el bundle inicial crece > N KB.

**Por qué se difiere:** depende de la decisión de CI del equipo (GitHub Actions, Vercel Checks, etc.). Esqueleto sugerido para `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse
on: pull_request
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v12
        with:
          urls: ${{ steps.preview.outputs.url }}
          uploadArtifacts: true
          temporaryPublicStorage: true
          configPath: ./lighthouserc.json
```

Y un `lighthouserc.json` con `assertions` para LCP < 2500 ms, INP < 200 ms, etc. Activar cuando el equipo decida la pipeline.

---

## Orden sugerido de ejecución

1. **Día 1 (P0 entero):** medir con bundle-visualizer → code splitting → manualChunks → compresión → self-host fuentes. Sólo con esto deberías reducir el bundle inicial a la mitad.
2. **Día 2 (P1 #6, #7, #8):** validar lucide/date-fns, añadir persistencia offline.
3. **Día 3 (P2):** ajustes finos de Capacitor (splash, realtime en background).
4. **Día 4 (P3):** PWA + headers Vercel.
5. **Continuo (P4, P5):** medir, profilear, atacar lo que aparezca.

## Métricas objetivo

| Métrica | Hoy (estimado) | Objetivo |
|---|---|---|
| JS inicial (gzip) | ~250 KB | < 120 KB |
| LCP móvil 4G | ~3.5 s | < 2.0 s |
| INP | ¿? | < 200 ms |
| Tiempo de cold-start nativo (Android) | ¿? | < 1.5 s |
| Visita repetida (con SW) | igual que primera | < 500 ms |

---

**Notas:**
- Cada PR debe incluir el output del bundle visualizer antes/después.
- No hacer P0 #1 (lazy routes) sin antes tener un fallback de Suspense decente; un spinner feo es peor que esperar 100 ms más.
- Probar **siempre** en Capacitor (`npm run native:run:android` y `:ios`) — el WebView de iOS especialmente tiene comportamientos distintos al Chrome de desktop.
