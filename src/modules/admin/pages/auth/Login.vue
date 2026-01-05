<template>
  <div
    class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
  >
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800">Chitral Steel 👋</h1>
      <p class="text-sm text-gray-500 mt-1">
        Login to continue to
        <span class="font-semibold text-indigo-600">Admin Dashboard</span>
      </p>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          v-model.trim="form.email"
          placeholder="admin@example.com"
          autocomplete="email"
          class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email[0] }}
        </p>
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          v-model.trim="form.password"
          placeholder="••••••••"
          autocomplete="current-password"
          class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password[0] }}
        </p>
      </div>

      <!-- Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex justify-center items-center disabled:opacity-60"
      >
        <VueSpinnerDots
          v-if="loading"
          size="20px"
          color="#fff"
          class="mr-2"
        />
        <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { VueSpinnerDots } from 'vue3-spinners'
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const errors = ref({})

const form = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  loading.value = true
  errors.value = {}

  try {
    console.log('🔹 Login request started')

    // ❌ No Authorization header here (handled by interceptor rule)
    const { data } = await api.post('/admin/login', {
      email: form.value.email,
      password: form.value.password,
    })

    console.log('✅ Login success:', data)

    // 🔐 Store JWT + user
    auth.setAuth(data.user, data.access_token)

    // 🚀 Redirect
    if (data.user.role === 'admin') {
      router.replace('/admin/sale')
    } else {
      router.replace('/user/index')
    }
  } catch (err) {
    console.error('❌ Login failed', err)

    if (err.response?.status === 401) {
      errors.value = {
        email: ['Invalid email or password'],
      }
    } else if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      errors.value = {
        email: ['Server error. Please try again later.'],
      }
    }
  } finally {
    loading.value = false
  }
}
</script>
