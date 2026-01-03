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

    <!-- Header -->
    <!-- <header
      class="flex items-center justify-between bg-white border-b border-gray-300 px-4 py-3 shadow-sm rounded-lg"
    >
      <h2 class="text-lg font-semibold text-gray-800">
        Customer Payments
      </h2>

      <Button
        variant="primary"
        size="sm"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        @click="openCreateModal"
      >
        + Add Payment
      </Button>
    </header> -->
    <!-- Header with Go-Back Arrow (replace this block) -->
<div class="w-full bg-white/50 dark:bg-gray-800/60 rounded-lg p-3 sm:p-4 shadow-sm">
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <!-- Left: go-back button + avatar + name -->
    <div class="flex items-start sm:items-center gap-3 min-w-0">
      <!-- Go back button -->
      <button
        @click.prevent="goBack()"
        type="button"
        aria-label="Go back"
        class="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600 transition"
      >
        <svg class="w-4 h-4 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div class="flex items-start sm:items-center gap-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20a8 8 0 0116 0" />
            </svg>
          </div>
        </div>

        <div class="min-w-0">
          <p class="text-sm sm:text-base font-semibold leading-tight text-gray-900 dark:text-gray-100 truncate">
            <span class="text-gray-500 dark:text-gray-400 font-medium mr-1">Name:</span>
            {{ state.customer.name }}
          </p>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Customer details</p>
        </div>
      </div>
    </div>

    <!-- Middle: totals as compact pills (wrap on small screens) -->
    <div class="flex flex-wrap items-center gap-2 justify-start sm:justify-center w-full sm:w-auto">
      <!-- <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
        <svg class="w-4 h-4 text-red-600 dark:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v8m4-4H8" />
        </svg>
        <div class="text-xs sm:text-sm leading-none">
          <div class="font-semibold text-red-700 dark:text-red-200">Credit</div>
          <div class="text-[11px] text-gray-600 dark:text-gray-300">Rs.{{ state.total_credit }}</div>
        </div>
      </div> -->

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
        <svg class="w-4 h-4 text-green-600 dark:text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12l4 4L19 6" />
        </svg>
        <div class="text-xs sm:text-sm leading-none">
          <div class="font-semibold text-green-700 dark:text-green-200">Paid</div>
          <div class="text-[11px] text-gray-600 dark:text-gray-300">Rs.{{ state.total_paid }}</div>
        </div>
      </div>

      <!-- <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
        <svg class="w-4 h-4 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6l4 2" />
        </svg>
        <div class="text-xs sm:text-sm leading-none">
          <div class="font-semibold text-blue-700 dark:text-blue-200">Remaining</div>
          <div class="text-[11px] text-gray-600 dark:text-gray-300">Rs.{{ state.total_credit - state.total_paid }}</div>
        </div>
      </div> -->
    </div>

    <!-- Right: Make Payment CTA (stacks on mobile for easy tap) -->
    <div class="w-full sm:w-auto">
      <button
        @click.prevent="openCreateModal()"
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        aria-label="Open payment dialog"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 6h10l1 2H6l1-2zM5 18h14a2 2 0 002-2V8H3v8a2 2 0 002 2z" />
        </svg>
        <span class="text-sm">Make Payment</span>
      </button>
    </div>
  </div>
</div>

    <main class="flex-1 p-4">

      <!-- Payments Table -->
      <div v-if="payments.length" class="overflow-x-auto border border-gray-300 rounded-md bg-white">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">#ID</th>
              <th class="px-4 py-2 text-left">Amount</th>
              <th class="px-4 py-2 text-left">Paid Date</th>
              <th class="px-4 py-2 text-left">Note</th>
              <th class="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="payment in payments"
              :key="payment.payment_id"
              class="border-t border-gray-300 hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ payment.id }}</td>
              <td class="px-4 py-2">Rs. {{ payment.amount }}</td>
              <td class="px-4 py-2">{{ payment.paid_at }}</td>
              <td class="px-4 py-2">{{ payment.note || '-' }}</td>

              <td class="px-4 py-2 flex justify-center gap-2">
                <button
                  class="bg-blue-600 text-white px-3 py-1 rounded"
                  @click="editPayment(payment)"
                >
                  Edit
                </button>

                <button
                  class="bg-red-500 text-white px-3 py-1 rounded"
                  @click="deletePayment(payment.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <Pagination
           class="m-0.5"
          :pagination="pagination"
          @page-change="fetchPayments()"
        />
      </div>

      <!-- No Data -->
      <!-- No Data -->
  <div
    v-else
    class="flex flex-col items-center justify-center h-[60vh] text-center"
  >
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      alt="No Data"
      class="w-32 h-32 opacity-70 mb-4"
    />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h2>
    <p class="text-gray-500">
      <!-- Try adding new credit to see them listed here. -->
    </p>
  </div>
    </main>

    <!-- 🔹 Payment Modal -->
    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Payment' : 'Add Payment'"
      @save="saveOrUpdatePayment"
      :disableSaveBtn="isSavingOrUpdating"
    >
      <div class="space-y-3">

        <FormInput
          v-model="form.amount"
          label="Amount"
          type="number"
          :error="errors.amount"
        />

       

        <FormInput
          v-model="form.paid_at"
          label="Paid Date"
          type="date"
          :error="errors.paid_at"
        />

        <FormInput
          v-model="form.note"
          label="Note"
          :error="errors.note"
        />

      </div>
    </BaseModal>

  </div>
</template>

<script setup>
import api from "@/plugins/axios"
import Button from "@/components/admin/Button.vue"
import BaseModal from "@/components/BaseModal.vue"
import FormInput from "@/components/admin/FormInput.vue"
import Pagination from "@/components/admin/Pagination.vue"
import { VueSpinnerDots } from "vue3-spinners"
import { reactive, ref, onMounted } from "vue"
import { toast } from "@/utils/toast"
import { useFormErrors } from "@/composables/admin/useFormErrors"
import { useRoute,useRouter } from "vue-router"

const route = useRoute()
const router = useRouter();
const customer_id  = ref(route.params.id)
/* ------------------ STATE ------------------ */
const isLoading = ref(false)
const isSavingOrUpdating = ref(false);
const showModal = ref(false)
const editMode = ref(false)
const paymentId = ref(null)

const payments = ref([])

const pagination = reactive({
  currentPage: 1,
  lastPage: 1,
  nextPageUrl: null,
  prevPageUrl: null,
})


 const state = reactive({
   credits: [],
   sales:[],
   customer:[],
   shop:{name:'',address:'',phone:''},
   total_credit:0,
   total_paid:0
 });

const form = reactive({
  customer_id: '',
  amount: '',
  paid_at: '',
  note: '',
})

const errors = reactive({
  amount: '',
  paid_at: '',
  note: '',
})

const handleErrors = useFormErrors(errors)


 const fetchCreditsCustomer = async (url =`/credit/customer/${customer_id.value}`) => {

  isLoading.value = true;
 try {
     
     const response = await api.get(url)
     state.credits = response.data.data.data;
     state.sales = response.data.data.Sales;
     state.customer = response.data.data.Customer;
     state.total_credit = response.data.data.CreditDetail.total_credit;
     state.total_paid = response.data.data.CreditDetail.total_paid;
     console.log('inside state ',state.customer);
 } catch (error) {
     console.log('Error fetching customers',error)
 }
 finally{
  isLoading.value = false;
 }
 }

/* ------------------ FETCH ------------------ */
const fetchPayments = async (url = null) => {
  try {
    isLoading.value = true
    const response = await api.get(
      url || `/payments/customer/${customer_id.value}`
    )

    payments.value = response.data.data.data
    Object.assign(pagination, {
      currentPage: response.data.data.current_page,
      lastPage: response.data.data.last_page,
      nextPageUrl: response.data.data.next_page_url,
      prevPageUrl: response.data.data.prev_page_url,
    })
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

/* ------------------ MODAL ------------------ */
const openCreateModal = () => {
  
  // form.customer_id = route.params.customer_id
  showModal.value = true
}

/* ------------------ EDIT ------------------ */
const editPayment = (payment) => {
  editMode.value = true
  paymentId.value = payment.id

  form.customer_id = payment.customer_id
  form.amount = payment.amount
  form.paid_at = payment.paid_at
  form.note = payment.note

  showModal.value = true
}

/* ------------------ SAVE / UPDATE ------------------ */
const saveOrUpdatePayment = async () => {
  let response = '';
  isSavingOrUpdating.value = true

  try {
    
     //------------Edit--------------
    if (!editMode.value) {
       response = await api.post('/payments', form)
     
     //-------------Save---------------
    } else {
       response = await api.put(`/payments/${paymentId.value}`, form)
      
    }


    // console.log('response-success',response)
    if(response.data.success){
      // console.log('response-success',response)
      toast.success(response.data.message)
      fetchPayments()
      resetForm()
    }

    
  } catch (error) {
    handleErrors(error)
  } finally {
    isSavingOrUpdating.value = false
  }
}

/* ------------------ DELETE ------------------ */
const deletePayment = async (id) => {
  if (!confirm('Delete this payment?')) return
  isLoading.value = true
  try {
   const response =  await api.delete(`/payments/${id}`)
    if(response.data.success){
      toast.success(response.data.message)
      fetchPayments()
     }
    
  } catch {
    toast.error('Delete failed')
  }finally{
    isLoading.value = false
  }

}

/* ------------------ RESET ------------------ */
const resetForm = () => {
  form.amount = ''
  form.method = ''
  form.paid_at = ''
  form.note = ''
  editMode.value = false
  paymentId.value = null
  Object.keys(errors).forEach(k => errors[k] = '')
  showModal.value = false
}

const goBack = () => {
  
  router.back();
};

/* ------------------ MOUNT ------------------ */
onMounted(async()=>{
fetchCreditsCustomer()
fetchPayments()
form.customer_id = customer_id.value
})
</script>
