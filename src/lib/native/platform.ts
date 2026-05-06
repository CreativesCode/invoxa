import { Capacitor } from '@capacitor/core'

/** True when the app is running inside the Capacitor native shell (iOS/Android). */
export function isNative(): boolean {
  return Capacitor.isNativePlatform()
}

/** Returns 'ios', 'android' or 'web'. */
export function getPlatform(): 'ios' | 'android' | 'web' {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web'
}
