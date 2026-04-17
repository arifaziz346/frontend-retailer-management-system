<template>
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

  <div v-else class="flex flex-col min-h-screen bg-gray-50/50 overflow-x-hidden p-2 sm:p-4 md:p-6">
    
    <div class="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div class="flex items-center gap-3 min-w-0">
          <button
            @click.prevent="goBack()"
            class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200 transition-all"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="min-w-0">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 truncate">
              {{ state.customer.name }}
            </h1>
            <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">Payment History</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div class="flex-1 sm:flex-none flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 border border-green-100">
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-green-500 leading-none text-nowrap">Collected Total</p>
              <p class="text-sm sm:text-base font-black text-green-700 leading-tight">Rs. {{ state.total_paid }}</p>
            </div>
          </div>

          <button
            @click.prevent="openCreateModal"
            class="flex-1 sm:flex-none h-11 sm:h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Add Payment
          </button>
        </div>
      </div>
    </div>

    <main class="flex-1">
      <div v-if="payments.length" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">ID</th>
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Amount</th>
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Status</th>
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Paid Date</th>
                <th class="px-4 py-3 text-center text-[10px] font-bold uppercase text-gray-400 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="payment in payments" :key="payment.id" class="hover:bg-blue-50/20 transition-all">
                <td class="px-4 py-4 font-mono font-bold text-xs text-gray-900">#{{ payment.id }}</td>
                <td class="px-4 py-4">
                  <span class="text-sm font-black text-blue-700">Rs. {{ payment.amount }}</span>
                </td>
                <td class="px-4 py-4">
                  <span 
                    v-if="payment.status == 1" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase"
                  >
                    Pending
                  </span>
                  <span 
                    v-else 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase"
                  >
                    Complete
                  </span>
                </td>
                <td class="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">
                  {{ payment.paid_at }}
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="handlePrint(payment)"
                      class="h-8 px-3 text-[11px] font-bold bg-amber-50 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-all border border-amber-100"
                    >
                      Print
                    </button>

                    <button
                      @click="viewPayment(payment)"
                      class="h-8 px-3 text-[11px] font-bold bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"
                    >
                      View
                    </button>
                    <button
                      @click="editPayment(payment)"
                      class="h-8 px-3 text-[11px] font-bold bg-gray-100 text-gray-600 rounded-md hover:bg-gray-800 hover:text-white transition-all border border-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="deletePayment(payment.id)"
                      class="h-8 px-3 text-[11px] font-bold bg-white text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all border border-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-gray-50/50 border-t border-gray-100">
          <Pagination
            :pagination="pagination"
            @page-change="fetchPayments"
          />
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Data"
          class="w-24 h-24 opacity-30 mb-4"
        />
        <h2 class="text-lg font-bold text-gray-700">No Payments Recorded</h2>
        <p class="text-gray-400 text-sm mt-1">Start by adding a new payment for this customer.</p>
        <button 
          @click="openCreateModal"
          class="mt-4 text-blue-600 text-sm font-bold hover:underline"
        >
          + Create First Payment
        </button>
      </div>
    </main>

    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Payment Record' : 'Record New Payment'"
      @save="saveOrUpdatePayment"
      :disableSaveBtn="isSavingOrUpdating"
    >
      <div class="space-y-4 p-1">
        <FormInput
          v-model="form.amount"
          label="Payment Amount (Rs.)"
          type="number"
          placeholder="e.g. 5000"
          :error="errors.amount"
        />

        <FormInput
          v-model="form.paid_at"
          label="Date of Payment"
          type="date"
          :error="errors.paid_at"
        />

        <div class="space-y-2">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.status = null"
              :class="form.status === null ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'"
              class="py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <div v-if="form.status === null" class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Complete
            </button>
            <button
              type="button"
              @click="form.status = 1"
              :class="form.status == 1 ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'"
              class="py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <div v-if="form.status == 1" class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Pending
            </button>
          </div>
          <p v-if="errors.status" class="text-[10px] text-red-500 font-semibold mt-1">
            {{ errors.status }}
          </p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-gray-500 uppercase">Note / Description</label>
          <textarea
            v-model="form.note"
            rows="3"
            class="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
            placeholder="Reference number or reason..."
          ></textarea>
          <p v-if="errors.note" class="text-[10px] text-red-500 font-medium">{{ errors.note }}</p>
        </div>
      </div>
    </BaseModal>

    <BaseModal
      v-model="showViewModal"
      title="Payment Details"
      :showSaveBtn="false"
    >
      <div v-if="selectedPayment" class="space-y-6 py-2">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase">Amount Paid</p>
              <p class="text-2xl font-black text-blue-700">Rs. {{ selectedPayment.amount }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-gray-400 uppercase">Status</p>
              <span 
                :class="selectedPayment.status == 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'"
                class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase"
              >
                {{ selectedPayment.status == 1 ? 'Pending' : 'Complete' }}
              </span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-white border border-gray-100 rounded-xl">
            <p class="text-[10px] font-bold text-gray-400 uppercase">Transaction ID</p>
            <p class="text-sm font-bold text-gray-800">#{{ selectedPayment.id }}</p>
          </div>
          <div class="p-3 bg-white border border-gray-100 rounded-xl">
            <p class="text-[10px] font-bold text-gray-400 uppercase">Date</p>
            <p class="text-sm font-bold text-gray-800">{{ selectedPayment.paid_at }}</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase px-1">Note/Description</p>
          <div class="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 italic border border-gray-100 min-h-[80px]">
            {{ selectedPayment.note || 'No description provided for this transaction.' }}
          </div>
        </div>
      </div>
    </BaseModal>

    <PaymentPrint ref="printRef" />

  </div>
</template>

<script setup>
import api from "@/plugins/axios"
import BaseModal from "@/components/BaseModal.vue"
import FormInput from "@/components/admin/FormInput.vue"
import Pagination from "@/components/admin/Pagination.vue"
import PaymentPrint from "@/components/print/PaymentPrint.vue" // New Import
import { VueSpinnerDots } from "vue3-spinners"
import { reactive, ref, onMounted } from "vue"
import { toast } from "@/utils/toast"
import { useFormErrors } from "@/composables/admin/useFormErrors"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const customer_id = ref(route.params.id)

/* ------------------ STATE ------------------ */
const printRef = ref(null) // Printer reference
const isLoading = ref(false)
const isSavingOrUpdating = ref(false)
const showModal = ref(false)
const showViewModal = ref(false)
const editMode = ref(false)
const paymentId = ref(null)
const payments = ref([])
const selectedPayment = ref(null)

const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  nextPageUrl: null,
  prevPageUrl: null,
})

const state = reactive({
  customer: {},
  total_paid: 0
})

const form = reactive({
  customer_id: '',
  amount: '',
  paid_at: '',
  note: '',
  status: null, 
})

const errors = reactive({
  amount: '',
  paid_at: '',
  note: '',
  status: '', 
})

const handleErrors = useFormErrors(errors)

/* ------------------ API METHODS ------------------ */

const fetchCreditsCustomer = async () => {
  try {
    const response = await api.get(`/credit/customer/${customer_id.value}`)
    state.customer = response.data.data.Customer
    state.total_paid = response.data.data.CreditDetail.total_paid
  } catch (error) {
    console.error('Error fetching customer stats', error)
  }
}

const fetchPayments = async (url = null) => {
  isLoading.value = true
  try {
    const response = await api.get(url || `/payments/customer/${customer_id.value}`)
    payments.value = response.data.data.data
    Object.assign(pagination, {
      currentPage: response.data.data.current_page,
      lastPage: response.data.data.last_page,
      nextPageUrl: response.data.data.next_page_url,
      prevPageUrl: response.data.data.prev_page_url,
    })
  } catch (e) {
    console.error('Error fetching payments', e)
  } finally {
    isLoading.value = false
  }
}

const saveOrUpdatePayment = async () => {
  isSavingOrUpdating.value = true
  
  // Clear previous errors
  Object.keys(errors).forEach(k => errors[k] = '')
  
  try {
    // 1. Prepare the payload to ensure status is either 1 or null
    // This prevents sending empty strings which cause validation issues
    const payload = {
      customer_id: customer_id.value,
      amount: form.amount,
      paid_at: form.paid_at,
      note: form.note,
      status: form.status === 1 ? 1 : null // Force literal null for 'Complete'
    }

    let response;
    if (!editMode.value) {
      // Create new payment
      response = await api.post('/payments', payload)
    } else {
      // Update existing payment
      response = await api.put(`/payments/${paymentId.value}`, payload)
    }

    if (response.data.success) {
      toast.success(response.data.message)
      
      // Refresh list and customer totals
      await Promise.all([fetchPayments(), fetchCreditsCustomer()])
      
      resetForm()
    }
  } catch (error) {
    // Handle Laravel validation errors (like 422 Unprocessable Entity)
    handleErrors(error)
  } finally {
    isSavingOrUpdating.value = false
  }
}

const deletePayment = async (id) => {
  if (!confirm('Delete this payment record permanently?')) return
  isLoading.value = true
  try {
    const response = await api.delete(`/payments/${id}`)
    if (response.data.success) {
      toast.success(response.data.message)
      await Promise.all([fetchPayments(), fetchCreditsCustomer()])
    }
  } catch {
    toast.error('Delete failed')
  } finally {
    isLoading.value = false
  }
}

/* ------------------ PRINTING ------------------ */

const handlePrint = (payment) => {
  if (printRef.value) {
    // Calling the print method exposed in PaymentPrint.vue
    printRef.value.print(payment, state.customer.name)
  } else {
    toast.error("Printer component not initialized")
  }
}

/* ------------------ MODAL & UTILS ------------------ */

const openCreateModal = () => {
  resetForm()
  showModal.value = true
}

const viewPayment = (payment) => {
  selectedPayment.value = payment
  showViewModal.value = true
}

const editPayment = (payment) => {
  editMode.value = true
  paymentId.value = payment.id
  form.customer_id = customer_id.value
  form.amount = payment.amount
  form.paid_at = payment.paid_at
  form.note = payment.note
  form.status = payment.status 
  showModal.value = true
}

const resetForm = () => {
  form.customer_id = customer_id.value
  form.amount = ''
  form.paid_at = new Date().toISOString().split('T')[0]
  form.note = ''
  form.status = null 
  editMode.value = false
  paymentId.value = null
  Object.keys(errors).forEach(k => errors[k] = '')
  showModal.value = false
}

const goBack = () => router.back()

onMounted(() => {
  fetchCreditsCustomer()
  fetchPayments()
  form.customer_id = customer_id.value
})
</script>

<style scoped>
tbody tr {
  transition: all 0.2s ease;
}
</style>