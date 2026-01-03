import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import api from '@/plugins/axios'

export const useAboutStore = defineStore('about', () => {
  const about = ref(null)
  const isLoading = ref(false)
  const loaded = ref(false)

  // Auto fetch once
  if (!loaded.value) {
    isLoading.value = true

    api.get('/admin/about')
      .then(res => {
        about.value = res.data.data
        loaded.value = true
      })
      .catch(err => {
        console.error('Failed to load About info', err)
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  return {
    about: readonly(about),
    isLoading: readonly(isLoading)
  }
})
