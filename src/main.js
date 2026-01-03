import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'

// 🔹 Import your auth store
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(VueSweetalert2)
app.use(router)

const auth = useAuthStore(pinia)

// ✅ Wait for auth initialization before mounting app
auth.initializeAuth().then(() => {
  app.mount('#app')
})
