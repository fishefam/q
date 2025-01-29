import type { PanelGroupStorage } from '../PanelGroup'

// PanelGroup might be rendering in a server-side environment where localStorage is not available
// or on a browser with cookies/storage disabled.
// In either case, this function avoids accessing localStorage until needed,
// and avoids throwing user-visible errors.
export function initializeDefaultStorage(storageObject: PanelGroupStorage) {
  try {
    if (typeof localStorage === 'undefined') {
      throw new TypeError('localStorage not supported in this environment')
    } else {
      // Bypass this check for future calls
      storageObject.getItem = (name: string) => {
        return localStorage.getItem(name) ?? undefined
      }
      storageObject.setItem = (name: string, value: string) => {
        localStorage.setItem(name, value)
      }
    }
  } catch (error) {
    console.error(error)

    storageObject.getItem = (() => {}) as never
    storageObject.setItem = () => {}
  }
}
