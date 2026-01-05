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
    const token = localStorage.getItem('token')

    // ❌ Do NOT attach token on login routes
    const publicRoutes = ['/admin/login', '/user/login']

    if (
      token &&
      !publicRoutes.some(route => config.url?.includes(route))
    ) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api
