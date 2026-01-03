// utils/waitForHydration.js

/**
 * Waits until a Pinia store using `pinia-plugin-persistedstate`
 * has finished restoring its data from localStorage/sessionStorage.
 *
 * Why do we need this?
 * ---------------------
 * - When the page first loads or refreshes, middleware runs immediately.
 * - At that moment, Pinia might not have rehydrated the state from storage yet,
 *   so `auth.user` and `auth.token` could look `null`.
 * - This causes false redirects (like being sent to `/unauthorized`).
 *
 * How it works:
 * -------------
 * - Checks if the store is already hydrated (via `$persistedState.isHydrated`).
 *   If yes → resolves immediately.
 * - If not → subscribes to the store and listens for changes.
 *   As soon as hydration finishes, it unsubscribes and resolves.
 *
 * Usage:
 * ------
 * import { useAuthStore } from '~/stores/auth'
 * import { waitForHydration } from '~/utils/waitForHydration'
 *
 * export default defineNuxtRouteMiddleware(async () => {
 *   const auth = useAuthStore()
 *   await waitForHydration(auth) // ✅ Wait until ready
 *
 *   if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
 *     return navigateTo('/unauthorized')
 *   }
 * })
 */
// utils/waitForHydration.js
export function waitForHydration(store) {
  return new Promise((resolve) => {
    if (store.$persistedState?.isHydrated) return resolve(true)

    const unwatch = store.$subscribe(() => {
      if (store.$persistedState?.isHydrated) {
        unwatch()
        resolve(true)
      }
    })
  })
}
