<template>
  <div v-if="state.isLoading" class="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
      <VueSpinnerDots size="40px" color="#2563eb" />
      <p class="text-blue-600 text-xs font-bold mt-4 tracking-widest uppercase">Processing</p>
    </div>
  </div>

  <div v-else class="min-h-screen bg-slate-50 pb-10">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <button @click="$router.back()" class="p-2 rounded-lg hover:bg-slate-100 transition active:scale-90">
            <i class="pi pi-arrow-left text-slate-500"></i>
          </button>
          <nav class="flex items-center text-sm font-semibold text-slate-400 tracking-tight">
            <router-link to="/admin/transactions" class="hover:text-blue-600 transition flex items-center">
              <i class="pi pi-money-bill mr-2"></i>
              Transactions
            </router-link>
          </nav>
        </div>

        <button
          @click="openCreateModal()"
          class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-md transition-all font-bold text-sm"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Add Transaction</span>
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
      <div v-if="state.transactions?.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Volume</p>
          <p class="text-xl font-black text-slate-800 mt-1">{{ state.transactions.length }} Entries</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Filters</p>
          <p class="text-xl font-black text-blue-600 mt-1">Current Page</p>
        </div>
        <div class="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Quick Search</p>
            <p class="text-white text-sm font-medium mt-1">Find by ID or Account</p>
          </div>
          <i class="pi pi-search text-blue-200 text-xl"></i>
        </div>
      </div>

      <div v-if="state.transactions?.length" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Account</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Note</th>
                <th class="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="transaction in state.transactions" :key="transaction.id" class="hover:bg-blue-50/30 transition-colors group">
                <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(transaction.transaction_date) }}</td>
                <td class="px-6 py-4 font-bold text-slate-700 text-sm">{{ transaction.account_name || '-' }}</td>
                <td class="px-6 py-4 font-mono font-bold text-slate-900 text-sm">Rs.{{ Number(transaction.amount).toLocaleString() }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1',
                      transaction.transaction_type === 'Deposit' ? 'bg-green-100 text-green-700' : 
                      transaction.transaction_type === 'Withdraw' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    <span class="w-1 h-1 rounded-full bg-current"></span>
                    {{ transaction.transaction_type || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 max-w-[150px] truncate italic">{{ transaction.description || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-center gap-2">
                    <button @click="viewTransactionDetail(transaction)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><i class="pi pi-eye"></i></button>
                    <button @click.prevent="editTransaction(transaction)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><i class="pi pi-pencil"></i></button>
                    <button @click.prevent="deleteTransaction(transaction.id)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><i class="pi pi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-slate-50/50 border-t border-slate-200">
          <Pagination :pagination="state.pagination" @page-change="fetchTransactions" />
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div class="bg-slate-50 p-6 rounded-full mb-4">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" class="w-20 h-20 grayscale opacity-40" />
        </div>
        <h3 class="text-xl font-bold text-slate-800">Clean Slate</h3>
        <p class="text-slate-500 mb-6">No transactions found for the current period.</p>
        <button @click="openCreateModal()" class="text-blue-600 font-bold flex items-center gap-2 hover:underline">
          <i class="pi pi-plus"></i> Add first transaction
        </button>
      </div>
    </div>

    <BaseModal
      v-model="showModal"
      :title="modalTitle"
      @save="saveTransaction"
      :disableSaveBtn="state.isLoading"
      :show-footer="!viewTransaction"
    >
      <div class="space-y-6 pt-2">
        <div>
          <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Select Account</label>
          <div class="flex gap-2">
            <select
              v-model="form.account_id"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Choose an account...</option>
              <option v-for="account in state.accounts" :key="account.id" :value="account.id">{{ account.account_name }}</option>
            </select>
            <router-link to="/admin/accounts" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 text-sm font-bold transition">
              +
            </router-link>
          </div>
          <p v-if="errors?.account_id" class="text-[11px] text-red-500 font-bold mt-1 ml-1">{{ cleanError(errors.account_id) }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Amount" v-model="form.amount" :error="errors.amount" type="Number" placeholder="0.00" />
          <FormInput label="Date" v-model="form.transaction_date" :error="errors.transaction_date" type="date" />
        </div>

        <div>
          <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Type</label>
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="type in ['Withdraw', 'Deposit', 'Failed']" 
              :key="type"
              type="button"
              @click="form.transaction_type = type"
              :class="[
                'py-2 text-xs font-bold rounded-lg border transition-all',
                form.transaction_type === type ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              ]"
            >
              {{ type }}
            </button>
          </div>
          <p v-if="errors?.transaction_type" class="text-[11px] text-red-500 font-bold mt-1 ml-1">{{ cleanError(errors.transaction_type) }}</p>
        </div>

        <FormInput label="Note / Reference" v-model="form.description" placeholder="Optional details..." />
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
