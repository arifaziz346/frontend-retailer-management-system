
<template>
  <!-- 🔵 Loader -->
  <div
    v-if="state.isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
  >
    <div class="flex flex-col items-center space-y-3">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <p class="text-blue-600 text-sm font-medium animate-pulse">
        Loading, please wait...
      </p>
    </div>
  </div>

    <!-- Header -->
     <div v-else class="bg-white p-4 rounded shadow">
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm rounded-lg"
    >
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
        <router-link
          to="/admin/transactions"
          class="flex items-center hover:text-blue-600 transition-colors"
        >
          <i class="pi pi-money-bill mr-1 text-2xl"></i>
          <span class="hidden sm:inline">Transaction</span>
        </router-link>
        <!-- <span class="font-semibold text-gray-900">{{ category_name }}</span> -->
      </nav>

      

    </header>

   
    <div  class="w-full overflow-x-scroll border border-gray-300 rounded-md shadow-sm">
            <div class="flex flex-row justify-between items-center w-full bg bg-gray-800 text-white p-1">
                <i class="pi pi-money-bill mr-1 text-lg"> Transaction List</i>
              
                <!-- Add Button -->
      <Button
  variant="primary"
  size="sm"
  class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
  @click="openCreateModal()"
>
  <i class="pi pi-plus text-sm"></i>
  <span>Transaction</span>
</Button>
              </div>
          <table v-if="state.transactions && state.transactions.length" class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <!-- <th class="px-4 py-2 text-left font-semibold">#</th> -->
                <th class="px-4 py-2 text-left font-semibold">Transaction-Date</th>
                
                <th class="px-4 py-2 text-left font-semibold">Account</th>
                <th class="px-4 py-2 text-left font-semibold">Amount</th>
                <th class="px-4 py-2 text-left font-semibold">Transaction-ype</th>
                <th class="px-4 py-2 text-center font-semibold">Note</th>
                <th class="px-4 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(transaction, index) in state.transactions"
                :key="transaction.id"
                class="border-t border-t-gray-300 hover:bg-gray-50 transition ext-sm text-xs"
              >
                <!-- <td class="px-4 py-2 font-medium text-gray-800">{{ index + 1 + (state.pagination.currentPage - 1) * perPage }}</td> -->
                <td class="px-4 py-2 text-gray-700">{{formatDate(transaction.transaction_date) || '-' }}</td>
                <td class="px-4 py-2 text-gray-700">{{ transaction.account_name || '-' }}</td>
                <td class="px-4 py-2 font-medium text-gray-900">Rs.{{ transaction.amount || '-' }}</td>
               <td
  :class="[
    'px-4 py-2 font-semibold',
    transaction.transaction_type === 'Deposit' && 'text-green-700',
    transaction.transaction_type === 'Withdraw' && 'text-blue-700',
    transaction.transaction_type === 'Failed' && 'text-red-700'
  ]"
>
  {{ transaction.transaction_type || 'N/A' }}
</td>

                <td class="px-4 py-2 text-gray-700 text-center">{{ transaction.description || '-' }}</td>
                

                

                <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">

  <!-- VIEW -->
  <button
    @click="viewTransactionDetail(transaction)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow text-xs"
  >
    <i class="pi pi-eye text-base"></i>
    <span>View</span>
  </button>

  <!-- EDIT -->
  <button
    @click.prevent="editTransaction(transaction)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-pencil text-base"></i>
    <span>Edit</span>
  </button>

  <!-- DELETE -->
  <button
    @click.prevent="deleteTransaction(transaction.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-trash text-base"></i>
    <span>Delete</span>
  </button>

</td>


              </tr>
            </tbody>
          </table>

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
    <h2 class="text-xl font-semibold text-gray-700 mb-2">No Transaction Found</h2>
    <p class="text-gray-500">
      Try adding new transaction to see them listed here.
    </p>

    

    
  </div>

          <!-- Pagination -->
       <Pagination
        :pagination="state.pagination"
        @page-change="fetchTransactions"/>
        </div>

    
  <!-- MODAL -->
    <BaseModal
      v-model="showModal"
      :title="modalTitle"
      @save="saveTransaction"
      :disableSaveBtn="state.isLoading"
      :show-footer="viewTransaction!=true"
    >

   
      <div class="space-y-1">
  <!-- Label -->
  <label class="block text-sm font-medium text-gray-700">
    Select Account
  </label>

  <!-- Select + Button -->
  <div class="flex gap-2">
    <select
      v-model="form.account_id"
      class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
             focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
      <option value="">-- Select Account --</option>

      <option
        v-for="account in state.accounts || []"
        :key="account.id"
        :value="account.id"
      >
        {{ account.account_name }}
      </option>
    </select>

    <!-- Button -->
    <router-link
  to="/admin/accounts"
  class="inline-block whitespace-nowrap rounded-md bg-blue-600 px-3 py-2
         text-sm font-medium text-white hover:bg-blue-700 transition"
>
  + Account
</router-link>

  </div>

  <!-- Error -->
  <p v-if="errors?.account_id" class="text-sm text-red-500">
    {{ cleanError(errors.account_id) }}
  </p>
</div>


      <FormInput
        label="Amount"
        v-model="form.amount"
        :error="errors.amount"
        type="Number"        
      />

      <FormInput
        label="Transaction-Date"
        v-model="form.transaction_date"
        :error="errors.transaction_date"
        type="date"        
      />

      <!-- <FormInput
        label="Profit"
        v-model="form.profit"
        :error="errors.profit"
      /> -->

      <FormInput
        label="Note"
        v-model="form.description"
      />

      <div class="flex flex-col justify-end mt-3  ">
  <select
    v-model="form.transaction_type"
    class="px-3 py-1 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring focus:ring-gray-300"
  >
    <option disabled value="">Select transaction type</option>
    <option value="Withdraw">Withdraw</option>
    <option value="Deposit">Deposit</option>
    <option value="Failed">Failed</option>
  </select>
  <!-- Error -->
  <p v-if="errors?.transaction_type" class="text-sm text-red-500">
    {{ cleanError(errors.transaction_type) }}
  </p>
</div>


    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { formatDate } from '@/utils/helper'
import { cleanError } from '@/utils/stringHelpers'
import { toast } from '@/utils/toast'
import BaseModal from '@/components/BaseModal.vue'
import Pagination from '@/components/admin/Pagination.vue'
import FormInput from '@/components/admin/FormInput.vue'
import { VueSpinnerDots } from "vue3-spinners"

/* ---------------- STATE ---------------- */
const showModal = ref(false)
const modalTitle = ref('Create Transaction')
//Vue transaction should false , then after it will show the the save button in Base modal
const viewTransaction = ref(false);
const isEdit = ref(false)

const state = reactive({
  transactions: [],
  accounts: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
  isLoading: false,
})

const form = reactive({
  id: '',
  account_id: '',
  transaction_type: '',
  amount: '',
  profit: '',
  description: '',
  transaction_date:''
})

const errors = reactive({})

/* ---------------- FETCH ---------------- */
const fetchTransactions = async (url = '/transactions') => {
  state.isLoading = true
  try {
    const res = await api.get(url)
    state.transactions = res.data.data.data
    console.log(state.transactions);
    state.pagination = res.data.pagination
  } catch (e) {
    toast.error('Failed to load transactions')
  } finally {
    state.isLoading = false
  }
}

const fetchAccounts = async () => {
  const res = await api.get('/transactions/accounts')
  state.accounts = res.data.data.data;
  // console.log(state.accounts);
}

/* ---------------- MODAL ---------------- */
const openCreateModal = () => {
  // console.log('Opening create modal')
  resetForm()
  modalTitle.value = 'Create Transaction'
  viewTransaction.value = false;
  isEdit.value = false
  showModal.value = true
  //  console.log('Opening create modal-end show Modal')

}

const editTransaction = (transaction) => {
  console.log('Editing transaction:', transaction)
  Object.assign(form, transaction)
  modalTitle.value = 'Edit Transaction'
  viewTransaction.value = false;
  isEdit.value = true
  showModal.value = true
}

/* ---------------- SAVE ---------------- */
const saveTransaction = async () => {
  state.isLoading = true
  try {
    if (isEdit.value) {
      await api.put(`/transactions/${form.id}`, form)
      toast.success('Transaction updated')
    } else {
      await api.post('/transactions', form)
      toast.success('Transaction created')
    }
    showModal.value = false
    resetForm()
    fetchTransactions()
  } catch (e) {
    Object.assign(errors, e.response.data.errors || {})
  }
  finally {
    state.isLoading = false
  } 
}

/* ---------------- DELETE ---------------- */
const deleteTransaction = async (id) => {
  if (!confirm('Are you sure?')) return
  await api.delete(`/transactions/${id}`)
  toast.success('Deleted successfully')
  fetchTransactions()
}

/* ---------------- HELPERS ---------------- */
const resetForm = () => {
  Object.assign(form, {
    transaction_type: '',
    amount: '',
    profit: '',
    description: '',
    transaction_date:''
  })
  Object.keys(errors).forEach(k => delete errors[k])
}

const viewTransactionDetail = (transaction) => {
  Object.assign(form, transaction)
  console.log('Viewing transaction:', transaction);
  viewTransaction.value = true;
  modalTitle.value = 'View Transaction Detail';
  showModal.value = true;
};


onMounted(() => {
  fetchTransactions()
  fetchAccounts()
})
</script>
