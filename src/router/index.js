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

  // Restore auth state
  if (!auth.isReady) {
    await auth.initializeAuth()
  }

  const isLoggedIn = Boolean(auth.token)
  const userRole = auth.user?.role

  console.log('Route Check:', {
    to: to.path,
    isLoggedIn,
    userRole
  })

  /* =========================
     ADMIN ROUTES
  ========================= */
  if (to.path.startsWith('/admin')) {
    // Allow admin login
    if (to.path === '/admin/login') {
      if (isLoggedIn && userRole === 'admin') {
        return next('/admin/dashboard')
      }
      return next()
    }

    // Not logged in → admin login
    if (!isLoggedIn) {
      return next('/admin/login')
    }

    // Logged in but not admin
    if (userRole !== 'admin') {
      return next('/user/index')
    }

    return next()
  }

  /* =========================
     USER ROUTES
  ========================= */
  if (to.path.startsWith('/user')) {
    // Allow user login
    if (to.path === '/user/login') {
      if (isLoggedIn && userRole === 'customer') {
        return next('/user/index')
      }
      return next()
    }

    // Not logged in → user login
    if (!isLoggedIn) {
      return next('/user/login')
    }

    // Logged in but wrong role
    if (userRole !== 'customer') {
      return next('/admin/dashboard')
    }

    return next()
  }

  next()
})

export default router
