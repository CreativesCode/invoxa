import { App } from '@capacitor/app'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { isNative } from './platform'

/**
 * Runs once at app startup. Configures status bar, hides the splash after
 * the React tree has mounted, and wires the hardware back button on Android
 * to history.back(). Safe to call from web — short-circuits when not native.
 */
export async function bootstrapNative(): Promise<void> {
  if (!isNative()) return

  // Tag the document so CSS can opt into native-only styling
  // (no tap highlight, no text selection outside fields, etc.).
  document.documentElement.classList.add('capacitor-native')

  // Status bar — cream background, dark icons (we pass `Light` content
  // because StatusBar.Style.Light = light content / dark background; we
  // want the opposite, so use `Dark`).
  try {
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#FBF7F0' })
    await StatusBar.setOverlaysWebView({ overlay: false })
  } catch {
    // Older Android may reject some calls — non-fatal.
  }

  // Hide the splash with a small fade once we're ready.
  try {
    await SplashScreen.hide({ fadeOutDuration: 250 })
  } catch {
    /* ignore */
  }

  // Hardware back button on Android: pop history if possible, otherwise
  // exit the app. The default capacitor behaviour exits immediately, which
  // is jarring inside a multi-screen SPA.
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back()
    } else {
      App.exitApp()
    }
  })
}
