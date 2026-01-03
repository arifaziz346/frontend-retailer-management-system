<template>
  <!-- Fixed Navbar -->
  <nav
    class="fixed inset-x-0 top-0 h-14 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    role="navigation"
  >
    <div
      class="h-full mx-auto px-4 md:px-6 flex items-center justify-between w-full max-w-none"
    >
      <!-- Left: Brand -->
      <div class="flex items-center gap-3">
        <button
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          @click="$emit('toggleSidebar')"
          aria-label="Toggle sidebar"
        >
          <i class="pi pi-bars text-gray-700"></i>
        </button>

        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-md bg-gradient-to-tr from-indigo-500 to-indigo-300 flex items-center justify-center text-white font-semibold"
          >
            AD
          </div>
          <div class="hidden sm:block">
            <h1 class="text-sm md:text-base font-semibold">Admin Dashboard</h1>
            <p class="text-xs text-gray-500 font-bold -mt-0.5">{{ about?.name || '' }}</p>
          </div>
        </div>
      </div>

      <!-- Right Side -->
      <div class="flex items-center gap-3 relative">
        <!-- Notification -->
        <!-- <button class="relative p-2 rounded-full hover:bg-gray-100 transition">
          <i class="pi pi-bell text-gray-700"></i>
          <span
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button> -->

        <!-- Profile Avatar -->
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium hover:opacity-90 transition"
          >
            {{ initials }}
          </button>

          <!-- Dropdown -->
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50"
            >
              <div class="py-2">
                <button
                  @click="openProfile"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2"
                >
                  <i class="pi pi-user"></i> Profile
                </button>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <i class="pi pi-sign-out"></i> Logout
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>

  <!-- Profile Modal -->
  <BaseModal
    v-model="showProfileModal"
    title="Update Profile"
    @save="updateProfile"
    :disableSaveBtn="isLoading"
  >
    <div class="space-y-4">
      <FormInput label="Name" v-model="form.name" :error="errors.name" />
      <FormInput label="Email" v-model="form.email" :error="errors.email" />
      <FormInput label="Phone" v-model="form.phone" :error="errors.phone" />
      <FormInput label="Region" v-model="form.region" :error="errors.region" />
      <FormInput
  label="Password"
  type="password"
  placeholder="Leave blank to keep current password"
  v-model="form.password"
  :error="errors.password" />

    </div>
  </BaseModal>

</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed,watchEffect } from 'vue'
import Swal from 'sweetalert2'
import api from '@/plugins/axios'
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue"
import { useAboutStore } from '@/stores/useAboutStore'

// ---------------------
// 1️⃣ Pinia store
// ---------------------
const store = useAboutStore();

// Local reactive ref for about info
const about = ref(null);

// Safe assignment and debug logging
watchEffect(() => {
  if (store.about) {
    about.value = store.about;
  }
  console.log('About in SalePrint --->', store.about?.phone_number);
});


const showDropdown = ref(false)
const showProfileModal = ref(false)
const isLoading = ref(false)
const errors = reactive({})
const form = reactive({
  name: '',
  email: '',
  phone: '',
  region: '',
  password: ''
})

// Load user from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}')

// Compute initials for avatar
const initials = computed(() =>
  user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'A'
)

// Dropdown toggle
const toggleDropdown = () => (showDropdown.value = !showDropdown.value)
const handleClickOutside = e => {
  if (!e.target.closest('.relative')) showDropdown.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

// Open profile modal
const openProfile = () => {
  showDropdown.value = false
  showProfileModal.value = true
  Object.assign(form, {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    region: user.region || '',
    password: ''
  })
}

// Update profile
const updateProfile = async () => {
  try {
    isLoading.value = true
    const response = await api.put('/admin/profile', form)
    Swal.fire('Success', 'Profile updated successfully', 'success')
    localStorage.setItem('user', JSON.stringify(response.data.data))
    showProfileModal.value = false
  } catch (error) {
    if (error.response?.data?.errors) Object.assign(errors, error.response.data.errors)
    else Swal.fire('Error', 'Something went wrong', 'error')
  } finally {
    isLoading.value = false
  }
}

// Logout
const handleLogout = async () => {
  const confirm = await Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to log out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#EF4444'
  })

  if (confirm.isConfirmed) {
    try {
      await api.post('/admin/logout')
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      await Swal.fire('Logged out', 'You have been logged out successfully.', 'success')
      window.location.reload()
    }
  }
}
</script>
