<template>

      <!----------------Pulse Loader ----------->
 <!-- 🔵 Loader (when loading) -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
  >
    <div class="flex flex-col items-center space-y-3">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <p class="text-blue-600 text-sm font-medium animate-pulse">
        Loading, please wait...
      </p>
    </div>
  </div>
  <div v-else class="flex flex-col min-h-screen bg-gray-50">
    <!-- Loader -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <VueSpinnerDots size="48px" color="#2563eb" />
    </div>

    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm"
    >
      <div class="flex items-center gap-2">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-gray-600 hover:text-blue-600"
        >
          <i class="pi pi-arrow-left mr-1"></i>
          <span>Back</span>
        </button>
        <h1 class="text-lg font-semibold text-gray-800">Admins</h1>
      </div>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center gap-2"
        @click="openModal()"
      >
        <i class="pi pi-plus"></i>
        <span>Add Admin</span>
      </button>
    </header>

    <!-- Table -->
     <div v-if="state.admins.data && state.admins.data.length">
    <main class="p-4">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- ✅ Scrollable Wrapper -->
        <div class="w-full overflow-x-auto">
          <table class="w-full text-sm text-left border-collapse">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th class="px-4 py-3">#</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Phone</th>
                <th class="px-4 py-3">Region</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(admin, index) in state.admins.data"
                :key="admin.id"
                class="border-b border-gray-300 hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ index + 1 }}</td>
                <td class="px-4 py-2">{{ admin.name }}</td>
                <td class="px-4 py-2">{{ admin.email }}</td>
                <td class="px-4 py-2">{{ admin.phone }}</td>
                <td class="px-4 py-2">{{ admin.region }}</td>
                <td class="px-4 py-2">
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      admin.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ admin.status }}
                  </span>
                </td>
                <td class="px-4 py-2 text-center">
                  <div class="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      class="bg-blue-600 text-white px-3 py-1 rounded-md w-full sm:w-auto text-center"
                      @click="editAdmin(admin)"
                    >
                      <i class="pi pi-pencil"></i> Edit
                    </button>
                    <button

                      class="bg-red-600 text-white px-3 py-1 rounded-md w-full sm:w-auto text-center"
                      @click="deleteAdmin(admin.id)"
                    >
                      <i class="pi pi-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-4 bg-gray-50 text-sm">
          <button
            @click="fetchAdmins(state.admins.prev_page_url)"
            :disabled="!state.admins.prev_page_url"
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>Page {{ state.admins.current_page }} of {{ state.admins.last_page }}</span>
          <button
            @click="fetchAdmins(state.admins.next_page_url)"
            :disabled="!state.admins.next_page_url"
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
            </div>
            <!-- No Data Message -->
  <div
    v-else
    class="flex flex-col items-center justify-center h-[60vh] text-center"
  >
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      alt="No Data"
      class="w-32 h-32 opacity-70 mb-4"
    />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">
      No Category Found
    </h2>
    <p class="text-gray-500">
      Try adding new products to see them listed here.
    </p>
  </div>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Admin' : 'Add Admin'"
      @save="editMode ? updateAdmin() : createAdmin()"
      :disableSaveBtn="isLoading"
    >
      <div class="space-y-4">
        <FormInput label="Name" v-model="form.name" :error="errors.name" />
        <FormInput label="Email" v-model="form.email" :error="errors.email" />
        <FormInput label="Phone" v-model="form.phone" :error="errors.phone" />
        <FormInput label="Region" v-model="form.region" :error="errors.region" />

        <select v-model="form.status" class="border rounded-lg w-full px-3 py-2 focus:ring-blue-500">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <FormInput
          label="Password"
          type="password"
          v-model="form.password"
          :error="errors.password"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/plugins/axios';
import { VueSpinnerDots } from 'vue3-spinners'
import { toast } from "@/utils/toast";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue"
// import { useAuthStore } from '@/stores/auth';
const state = reactive({
  admins: { data: [] }
})
const isLoading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const form = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
  region: '',
  status: 'active',
  password: ''
})

const user = reactive({});
const errors = reactive({})

const fetchAdmins = async (url = '/admin/admins') => {
  try {
    isLoading.value = true
    const res = await api.get(url)
    state.admins = res.data.data
  } finally {
    isLoading.value = false
  }
}

const openModal = () => {
  editMode.value = false
  Object.assign(form, { id: null, name: '', email: '', phone: '', region: '', status: 'active', password: '' })
  errors.value = {}
  showModal.value = true
}

const editAdmin = (admin) => {
  editMode.value = true
  Object.assign(form, admin)
  form.password = ''
  showModal.value = true
}

const createAdmin = async () => {
  try {
    isLoading.value = true
    const res = await api.post('/admin/admins', form)
    toast.success(res.data.message)
    showModal.value = false
    fetchAdmins()
  } catch (err) {
    console.log(err)
    if (err.response?.data?.errors) Object.assign(errors, err.response.data.errors)
  } finally {
    isLoading.value = false
  }
}

const updateAdmin = async () => {
  try {
    isLoading.value = true
    const res = await api.put(`/admin/admins/${form.id}`, form)
    toast.success(res.data.message)
    showModal.value = false
    fetchAdmins()
  } catch (err) {
    if (err.response?.data?.errors) Object.assign(errors, err.response.data.errors)
  } finally {
    isLoading.value = false
  }
}

const deleteAdmin = async (id) => {
  if (!confirm('Are you sure you want to delete this admin?')) return
  try {
    isLoading.value = true
    const res = await api.delete(`/admin/admins/${id}`)
    toast.success(res.data.message)
    fetchAdmins()
  } catch (err) {
    toast.error('Failed to delete admin')
  }
  finally{
    isLoading.value = false
  }
}

onMounted(() => fetchAdmins())
</script>
