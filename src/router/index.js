import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from '../modules/admin/router'
// import userRoutes from '../modules/user/router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ✅ ROOT FIX (IMPORTANT)
    {
      path: '/',
      redirect: '/admin/login'
    },

    // MODULE ROUTES
    ...adminRoutes,
    // ...userRoutes,

    // ✅ 404 FALLBACK (IMPORTANT)
    {
      path: '/:pathMatch(.*)*',
      redirect: '/admin/login'
    }
  ],
})

/* =========================
   GLOBAL NAVIGATION GUARD
========================= */
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Wait until Pinia auth store is ready
  if (!auth.isReady) {
    await auth.initializeAuth()
  }

  const isLoggedIn = Boolean(auth.token)
  const userRole = auth.user?.role

  // Handle routes that require auth
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      // Not logged in → redirect to login
      return next('/admin/login')
    }

    if (to.meta.role && to.meta.role !== userRole) {
      // Logged in but wrong role → redirect to dashboard
      return next(userRole === 'admin' ? '/admin/sale' : '/user/index')
    }

    return next()
  }

  // Allow login page if not logged in
  if (to.path === '/admin/login' && isLoggedIn && userRole === 'admin') {
    return next('/admin/sale')
  }

  next()
})



export default router
