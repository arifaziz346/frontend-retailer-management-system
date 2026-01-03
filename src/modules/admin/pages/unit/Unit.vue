<template>
  <!-- 🔵 Loader -->
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

  <div v-else class="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- ✅ Header -->
    <header
      class="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <BackButton />

      <h1 class="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
        Units
      </h1>

      <Button
        variant="primary"
        size="sm"
        class="flex items-center gap-2"
        @click="openCreate"
      >
        <i class="pi pi-plus"></i>
        Unit
      </Button>
    </header>

    <!-- ✅ Units Table -->
    <main v-if="state.units.length" class="p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div class="overflow-x-auto w-full">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-700 text-sm uppercase">
              <th class="p-3">#</th>
              <th class="p-3">Unit Name</th>
              <th class="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(unit, index) in state.units"
              :key="unit.id"
              class="border-b border-b-gray-200 hover:bg-gray-50"
            >
              <td class="p-3 text-sm text-gray-700">
                {{ index + 1 }}
              </td>

              <td class="p-3 text-sm font-medium text-gray-800">
                {{ unit.name }}
              </td>

              <td class="p-3 text-sm flex justify-center gap-4">
                <!-- Edit -->
                <button
                  class="text-blue-600 hover:text-blue-800 flex items-center"
                  @click="openEdit(unit)"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  Edit
                </button>

                <!-- Delete -->
                <button
                  class="text-red-600 hover:text-red-800 flex items-center"
                  @click="onDelete(unit.id)"
                >
                  <i class="pi pi-trash mr-1"></i>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- ❌ No Data -->
    <div
      v-else
      class="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <h2 class="text-xl font-semibold text-gray-700 mb-2">
        No Units Found
      </h2>
      <p class="text-gray-500">
        Click "Unit" to create your first unit.
      </p>
    </div>

    <!-- ✅ Modal -->
    <BaseModal
      v-model="showModal"
      :title="isEdit ? 'Edit Unit' : 'Create Unit'"
      @save="handleSubmit"
    >
      <div class="bg-white p-4 rounded-lg">
        <FormInput
          id="name"
          label="Unit Name"
          v-model="form.name"
          :error="errors.name"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/plugins/axios'
import Button from '@/components/admin/Button.vue'
import BaseModal from '@/components/BaseModal.vue'
import FormInput from '@/components/admin/FormInput.vue'
import BackButton from '@/components/BackButton.vue'
import { VueSpinnerDots } from 'vue3-spinners'
import { toast } from '@/utils/toast'
import { useFormErrors } from '@/composables/admin/useFormErrors'

const isLoading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)
const unitId = ref(null)

const state = reactive({
  units: [],
})

const form = reactive({
  name: '',
})

const errors = reactive({
  name: '',
})

const handleFormErrors = useFormErrors(errors)

/* ---------------- Methods ---------------- */

const fetchUnits = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/units')
    state.units = res.data.data
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const openCreate = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEdit = (unit) => {
  resetForm()
  isEdit.value = true
  unitId.value = unit.id
  form.name = unit.name
  showModal.value = true
}

const handleSubmit = () => {
  isEdit.value ? updateUnit() : createUnit()
}

const createUnit = async () => {
  isLoading.value = true
  try {
    const res = await api.post('/units', form)
    if (res.data.success) {
      toast.success(res.data.message)
      state.units.unshift(res.data.data)
      showModal.value = false
    }
  } catch (error) {
    handleFormErrors(error)
  } finally {
    isLoading.value = false
  }
}

const updateUnit = async () => {
  isLoading.value = true
  try {
    const res = await api.put(`/units/${unitId.value}`, form)
    if (res.data.success) {
      toast.success(res.data.message)
      const index = state.units.findIndex(u => u.id === unitId.value)
      if (index !== -1) state.units[index] = res.data.data
      showModal.value = false
    }
  } catch (error) {
    handleFormErrors(error)
  } finally {
    isLoading.value = false
  }
}

const onDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this unit?')) return

  isLoading.value = true
  try {
    const res = await api.delete(`/units/${id}`)
    if (res.data.success) {
      toast.success(res.data.message)
      state.units = state.units.filter(u => u.id !== id)
    }
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.name = ''
  errors.name = ''
  unitId.value = null
}

onMounted(fetchUnits)
</script>
