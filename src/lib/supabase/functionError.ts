/**
 * Reads the actual error message produced by a Supabase Edge Function.
 *
 * `supabase.functions.invoke` returns a `FunctionsHttpError` for any non-2xx
 * status. Its `.context` is the raw `Response` (not a parsed body), so the
 * default `error.message` is the unhelpful
 *   "Edge Function returned a non-2xx status code"
 * — never the JSON `{ error: "..." }` we send from the function.
 *
 * This helper consumes the response body once, tries to parse it as JSON,
 * and falls back to plain text. We cache the parsed body on the error object
 * so callers calling it twice don't crash with "body already read".
 */
export async function extractFunctionError(
  err: unknown,
  fallback = 'Error inesperado',
): Promise<string> {
  if (err == null) return fallback

  const error = err as {
    message?: string
    context?: Response
    __invoxaErrorBody?: string | null
  }

  // Cached on the error so successive reads don't trip "Body already read".
  if (error.__invoxaErrorBody !== undefined && error.__invoxaErrorBody !== null) {
    return error.__invoxaErrorBody
  }

  const ctx = error.context
  if (ctx && typeof ctx.clone === 'function') {
    try {
      const cloned = ctx.clone()
      const text = await cloned.text()
      if (text) {
        try {
          const json = JSON.parse(text) as { error?: unknown; message?: unknown }
          const fromJson =
            typeof json.error === 'string'
              ? json.error
              : typeof json.message === 'string'
                ? json.message
                : null
          if (fromJson) {
            error.__invoxaErrorBody = fromJson
            return fromJson
          }
        } catch {
          // Not JSON — surface the raw text if it looks meaningful.
          error.__invoxaErrorBody = text
          return text
        }
      }
    } catch {
      /* swallow — fall through to message */
    }
  }

  if (typeof error.message === 'string' && error.message) return error.message
  return fallback
}
