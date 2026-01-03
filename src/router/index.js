import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from '../modules/admin/router'
// import userRoutes from '../modules/user/router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...adminRoutes,
    // ...userRoutes,
  ],
})

// ✅ Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // 🔹 Wait for auth store to initialize (restore from localStorage)
  if (!auth.isReady) {
    await auth.initializeAuth()
  }

  const isLoggedIn = !!auth.token
  const userRole = auth.user?.role

  console.log('Route Check:', to.path, 'User Role:', userRole, 'LoggedIn:', isLoggedIn)

  // --- ADMIN ROUTE PROTECTION ---
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
  if (!isLoggedIn) return next('/admin/login')
  if (userRole !== 'admin') return next('/user/index')
}


  // --- USER ROUTE PROTECTION ---
  if (to.path.startsWith('/user')) {
    if (!isLoggedIn) {
      if (to.path !== '/user/login') return next('/user/login')
    } else if (userRole !== 'customer') {
      return next('/admin/dashboard')
    }
  }

  // --- Redirect if already logged in ---
  if (['/login', '/admin/login', '/user/login'].includes(to.path)) {
    if (isLoggedIn) {
      if (userRole === 'admin') return next('/admin/dashboard')
      if (userRole === 'customer') return next('/user/index')
    }
  }

  next()
})

export default router
