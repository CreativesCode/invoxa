# Pendiente · Integración real de envío de emails

> Estado: **no implementado** · Bloqueante para cerrar el MVP del documento.

## Estado actual

Hoy todas las edge functions que tienen que "enviar un correo" hacen únicamente `INSERT` en la tabla `email_logs` con `status='pending'`:

| Edge function | Inserción a `email_logs` | Tipo |
|---|---|---|
| [`invite-user`](../../supabase/functions/invite-user/index.ts) | sí | `invitation` |
| [`request-invoice`](../../supabase/functions/request-invoice/index.ts) | sí | `invoice_request` |
| [`request-invoices-bulk`](../../supabase/functions/request-invoices-bulk/index.ts) | sí (1 por destinatario) | `invoice_request` |
| [`request-invoice-number-change`](../../supabase/functions/request-invoice-number-change/index.ts) | sí | `invoice_number_change_request` |
| [`resolve-invoice-number-change`](../../supabase/functions/resolve-invoice-number-change/index.ts) | sí (approve y reject) | `invoice_number_change_resolved` |

`invite-user` además dispara el `auth.admin.inviteUserByEmail` de Supabase, así que la invitación inicial sí llega por correo (vía SMTP de Supabase). Todo lo demás queda registrado pero **no se envía**.

La sección 19 del documento original ya tiene reservada la pieza que falta:

```
supabase/functions/
  send-email/
```

## Qué hay que construir

### 1. Elegir proveedor

Las cuatro opciones que sugiere el documento (sección 10):

- **Resend** — la más simple, 3 000 emails/mes gratis, API muy directa.
- **SendGrid** — más cuotas gratuitas pero requiere validación de dominio más larga.
- **Postmark** — excelente entregabilidad transaccional, sin tier gratuito permanente.
- **Mailgun** — tier gratuito limitado a 100/día.

Recomendación: **Resend** para empezar (es el menor fricción para Deno).

### 2. Edge function `send-email`

Crear `supabase/functions/send-email/index.ts` con esta forma:

```ts
type SendEmailPayload = {
  to: string | string[]
  subject: string
  // Plantilla pre-renderizada en HTML; la edge function NO renderiza markdown
  // ni MJML para mantenerse simple. Si más adelante se quieren plantillas,
  // agregar un parámetro `template_id` y un dispatch interno.
  html: string
  text?: string
  // Opcional: id de la fila de email_logs que dispara el envío. Cuando viene,
  // la función actualiza esa fila (status sent/failed + provider_response).
  email_log_id?: string
}
```

Comportamiento:

1. Sólo callable por service role (otra edge function) o por admin autenticado.
   No exponer al usuario final — usaría el endpoint para spam.
2. POST al proveedor (Resend `https://api.resend.com/emails`) con
   `Authorization: Bearer ${RESEND_API_KEY}`.
3. Si éxito → actualizar `email_logs` row a `status='sent'`,
   `provider_response = { id: <provider_id>, ... }`.
4. Si falla → `status='failed'` + el error en `provider_response`.

### 3. Cambiar las edge functions existentes

En cada función que hoy sólo logea, después del `insert` de `email_logs` invocar
`send-email` pasando el `email_log_id` para cerrar el ciclo:

```ts
const { data: log } = await adminClient
  .from('email_logs')
  .insert({ ... })
  .select('id')
  .single()

await fetch(`${supabaseUrl}/functions/v1/send-email`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${supabaseServiceKey}`,
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: targetUser.email,
    subject: '...',
    html: renderTemplate(...),
    email_log_id: log.id,
  }),
})
```

Mantener fire-and-forget — si el correo falla, la lógica principal (la
factura se generó, la solicitud se guardó) no debe romperse. La fila en
`email_logs` queda con `status='failed'` y un admin puede reintentar.

### 4. Plantillas HTML

Cinco plantillas mínimas, una por cada `email_type`:

1. **`invitation`** — ya cubierto por Supabase Auth, no hace falta tocar.
2. **`invoice_request`** — recordatorio al colaborador. Debe incluir nombre, periodo y un CTA con `${APP_URL}/app/invoices/new`.
3. **`invoice_generated`** — al admin cuando un usuario genera factura. (Hoy ni siquiera está siendo logeado; agregarlo en la edge function `generate-invoice`.)
4. **`invoice_number_change_request`** — al admin cuando un user pide cambio.
5. **`invoice_number_change_resolved`** — al user cuando el admin aprueba o rechaza.

Mantener las plantillas inline en TS (template literals) o servirlas como `text/html` desde Storage. Lo simple primero.

### 5. Variables de entorno

Añadir a Supabase project settings → Edge Functions → Secrets:

| Variable | Descripción |
|---|---|
| `EMAIL_PROVIDER` | `resend` (o el que se elija) |
| `RESEND_API_KEY` | API key del proveedor |
| `EMAIL_FROM` | `Invoxa <facturas@informagestudios.com>` — debe estar verificado en el proveedor |
| `EMAIL_REPLY_TO` | (opcional) `admin@informagestudios.com` |

### 6. Verificación de dominio

Antes de desplegar a prod, verificar el dominio en el proveedor (DKIM/SPF/DMARC). Esto demora 24–48 h en propagarse. Sin esto los correos van a spam.

## Pruebas mínimas antes de cerrar

- [ ] Admin invita usuario → correo llega (ya funciona via Supabase).
- [ ] Admin solicita factura individual → correo llega al colaborador con CTA.
- [ ] Admin solicita facturas masivas → correo llega a los N seleccionados.
- [ ] Usuario solicita cambio de consecutivo → correo llega al admin.
- [ ] Admin aprueba/rechaza cambio → correo llega al usuario con el resultado.
- [ ] Si el proveedor falla, `email_logs` queda con `status='failed'` y el flujo principal **no se rompe**.

## Consideraciones futuras

- **Rate limiting**: Resend permite 10 envíos/segundo en tier gratuito. El
  bulk request manda N correos en serie hoy; si N > 50 podría toparse con el
  límite. Implementar `Promise.allSettled` con un pequeño delay entre batches
  de 10.
- **Tracking de aperturas/clicks**: Resend lo expone vía webhooks. No es
  prioridad para el MVP pero conviene capturar el `provider_id` para luego.
- **Plantillas multilenguaje**: hoy todo es español. Si entra inglés, mover
  los textos a un dict por locale.

## Archivos a tocar (cuando arranque)

```
supabase/functions/send-email/index.ts             [nuevo]
supabase/functions/invite-user/index.ts            [añadir invocación post-log]
supabase/functions/request-invoice/index.ts        [añadir invocación post-log]
supabase/functions/request-invoices-bulk/index.ts  [añadir invocación post-log]
supabase/functions/generate-invoice/index.ts       [añadir log + invocación]
supabase/functions/request-invoice-number-change/index.ts  [añadir invocación]
supabase/functions/resolve-invoice-number-change/index.ts  [añadir invocación]
docs/pending/email-integration.md                  [eliminar este archivo]
```
