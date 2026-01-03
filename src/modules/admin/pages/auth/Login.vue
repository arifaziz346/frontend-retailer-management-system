<template>
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800">Chitral Steel 👋</h1>
      <p class="text-sm text-gray-500 mt-1">
        Login to continue to
        <span class="font-semibold text-indigo-600">Admin Dashboard</span>
      </p>
    </div>

    <!-- Login form -->
    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          id="email"
          type="email"
          v-model="form.email"
          placeholder="admin@example.com"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          id="password"
          type="password"
          v-model="form.password"
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex justify-center items-center"
        :disabled="loading"
      >
        <template v-if="loading">
          <VueSpinnerDots size="20px" color="#fff" />
          <span class="ml-2">Logging in...</span>
        </template>
        <template v-else>
          Login
        </template>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { VueSpinnerDots } from 'vue3-spinners'
import { useAuthStore } from '@/stores/auth'
import api from '@/plugins/axios'
const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const loading = ref(false)

const handleLogin = async () => {
  errors.value = {}
  loading.value = true

  try {
    console.log('🔹 Starting login...')
    // ✅ Ensure you include your endpoint URL
    const response = await api.post('/admin/login', {
      email: form.value.email,
      password: form.value.password
    })

    console.log('✅ Login response:', response.data)

    if (response.data.status) {
      const { access_token, user } = response.data
      auth.setAuth(user, access_token)

      // ✅ Redirect based on role
      if (user.role === 'admin') {
        await router.push('/admin/sale')
      } else {
        await router.push('/user/index')
      }
    }
  } catch (error) {
    console.error('❌ Login error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { email: [error.response.data.message] }
    } else {
      errors.value = { email: ['Something went wrong. Please try again.'] }
    }
  } finally {
    loading.value = false
  }
}

</script>
