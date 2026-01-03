// stores/auth.js
import { defineStore } from 'pinia'

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000 // convert seconds → milliseconds
    return Date.now() > expiry
  } catch (e) {
    return true // invalid or expired
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isReady: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    // ✅ Save user & token
    setAuth(user, token) {
      this.user = user
      this.token = token
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      this.isReady = true
    },

    // ✅ Clear user & token
    clearAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.isReady = false
    },

    // ✅ Initialize authentication on app load
    async initializeAuth() {
      try {
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (user && token) {
          if (isTokenExpired(token)) {
            console.warn('Token expired. Logging out...')
            this.clearAuth()
          } else {
            this.user = JSON.parse(user)
            this.token = token
          }
        }
      } catch (error) {
        console.error('Error restoring auth:', error)
      } finally {
        this.isReady = true
      }
    },
  },
})
