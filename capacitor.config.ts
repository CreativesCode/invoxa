import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ai.commercecraft.invoxa',
  appName: 'Invoxa',
  webDir: 'dist',
  bundledWebRuntime: false,
  // Use the production-built `dist/` directory rather than a remote URL so
  // the app works offline and the build is reproducible.
  server: {
    androidScheme: 'https',
  },
  android: {
    // Allow window.open() to surface PDFs through the system browser.
    // (We also open via @capacitor/browser; this is a fallback.)
    allowMixedContent: false,
    captureInput: true,
  },
  ios: {
    contentInset: 'always',
    // Disable the swipe-to-go-back gesture system-wide; the app has its own
    // back navigation everywhere it matters.
    backgroundColor: '#FBF7F0',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#FBF7F0',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#FBF7F0',
      overlaysWebView: false,
    },
  },
}

export default config
