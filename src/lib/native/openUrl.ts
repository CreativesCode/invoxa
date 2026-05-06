import { Browser } from '@capacitor/browser'
import { isNative } from './platform'

/**
 * Opens an external URL.
 *
 * - Web: `window.open(url, '_blank', 'noopener,noreferrer')`.
 * - Native (iOS/Android): in-app SFSafariViewController / Custom Tab via
 *   `@capacitor/browser`. This keeps PDFs and signed Supabase URLs inside the
 *   app context (no external Safari bounce on iOS) and gives users a clear
 *   "Done" button to come back.
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (!isNative()) {
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }
  await Browser.open({ url, presentationStyle: 'popover' })
}
