// import axios from 'axios'
// import { useAuthStore } from '@/stores/auth' // ✅ import Pinia store

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//   },
// })

// // ✅ Helper to check if JWT token is expired
// function isTokenExpired(token) {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]))
//     const expiry = payload.exp * 1000 // seconds → milliseconds
//     return Date.now() > expiry
//   } catch (error) {
//     return true // invalid or corrupted token
//   }
// }

// // 🔹 Request Interceptor → attach token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')

//     if (token) {
//       // 🧠 Check if expired before sending
//       if (isTokenExpired(token)) {
//         console.warn('Token expired — clearing session...')
//         const auth = useAuthStore()
//         auth.clearAuth()
//         window.location.href = '/login'
//         return Promise.reject('Token expired')
//       }

//       config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// // 🔹 Response Interceptor → catch 401 errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const auth = useAuthStore()

//     if (error.response && error.response.status === 401) {
//       console.warn('Unauthorized — logging out user...')
//       auth.clearAuth()
//       window.location.href = '/admin/login'
//     }

//     return Promise.reject(error)
//   }
// )

// export default api
// src/plugins/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')

    // ⛔ DO NOT attach token on auth routes
    const publicRoutes = ['/admin/login', '/user/login']

    if (token && !publicRoutes.some(r => config.url.includes(r))) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api
