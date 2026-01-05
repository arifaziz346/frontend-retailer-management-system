<template>
  <div class="min-h-screen bg-gray-50 p-3 md:p-6 font-sans text-gray-800">
    <div class="max-w-7xl mx-auto mb-6">
      <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
        <i class="pi pi-wallet text-blue-600"></i>
        Transaction Report
      </h2>
      <p class="text-sm text-gray-500">Monitor and analyze your monthly financial flows.</p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
  
  <div class="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div class="w-12 h-12 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600">
      <i class="pi pi-arrow-down-left text-xl font-bold"></i>
    </div>
    <div class="min-w-0">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Total Deposits</p>
      <h3 class="text-xl xl:text-2xl font-black text-emerald-600 truncate">
        Rs. {{ totalDeposit.toLocaleString() }}
      </h3>
    </div>
  </div>

  <div class="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div class="w-12 h-12 rounded-full bg-rose-50 flex-shrink-0 flex items-center justify-center text-rose-600">
      <i class="pi pi-arrow-up-right text-xl font-bold"></i>
    </div>
    <div class="min-w-0">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Total Withdrawals</p>
      <h3 class="text-xl xl:text-2xl font-black text-blue-600 truncate">
        Rs. {{ totalWithdraw.toLocaleString() }}
      </h3>
    </div>
  </div>

  <div class="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
    <div class="w-12 h-12 rounded-full bg-amber-50 flex-shrink-0 flex items-center justify-center text-amber-600">
      <i class="pi pi-times-circle text-xl font-bold"></i>
    </div>
    <div class="min-w-0">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Total Failed</p>
      <h3 class="text-xl xl:text-2xl font-black text-rose-600 truncate">
        Rs. {{ totalFailed.toLocaleString() }}
      </h3>
    </div>
  </div>

</div>

    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-black text-gray-400 uppercase ml-1">Start Date</label>
          <input type="date" v-model="filters.start_date" 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-black text-gray-400 uppercase ml-1">End Date</label>
          <input type="date" v-model="filters.end_date" 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-[11px] font-black text-gray-400 uppercase ml-1">Transaction Type</label>
          <select v-model="filters.transaction_type" 
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-semibold">
            <option value="">All Transactions</option>
            <option value="Withdraw">Withdraw</option>
            <option value="Deposit">Deposit</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <button @click="fetchTransactions" :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
          <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-search"></i>
          {{ isLoading ? 'Processing...' : 'Generate Report' }}
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">#</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Account Information</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Type</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Reference/Description</th>
              <th class="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(transaction, index) in transactions" :key="transaction.id" class="hover:bg-blue-50/20 transition-colors group">
  <td class="px-6 py-4 text-xs font-bold text-gray-400">{{ index + 1 }}</td>
  
  <td class="px-6 py-4">
    <span class="font-bold text-gray-700">{{ transaction.account?.name || 'General Account' }}</span>
  </td>

  <td class="px-6 py-4 text-center">
    <span :class="{
        'bg-emerald-50 text-emerald-600 border-emerald-100': transaction.transaction_type === 'Deposit',
        'bg-blue-50 text-blue-600 border-blue-100': transaction.transaction_type === 'Withdraw',
        'bg-rose-50 text-rose-600 border-rose-100': transaction.transaction_type === 'Failed'
      }"
      class="px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter">
      {{ transaction.transaction_type }}
    </span>
  </td>

  <td class="px-6 py-4">
    <span :class="{
        'text-emerald-600': transaction.transaction_type === 'Deposit',
        'text-blue-600': transaction.transaction_type === 'Withdraw',
        'text-rose-600': transaction.transaction_type === 'Failed'
      }" class="font-black">
      
      <template v-if="transaction.transaction_type === 'Deposit'">+</template>
      <template v-else-if="transaction.transaction_type === 'Withdraw'">-</template>
      <template v-else></template> 
      
      Rs. {{ transaction.amount }}
    </span>
  </td>

  <td class="px-6 py-4 max-w-xs">
    <p class="text-xs text-gray-500 truncate" :title="transaction.description">
        {{ transaction.description || 'No description provided' }}
    </p>
  </td>

  <td class="px-6 py-4 text-right">
    <span class="text-xs font-semibold text-gray-400">{{ transaction.transaction_date }}</span>
  </td>
</tr>
            <tr v-if="transactions.length === 0">
              <td colspan="6" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center">
                  <i class="pi pi-folder-open text-5xl text-gray-200 mb-3"></i>
                  <p class="text-gray-500 font-bold">No transactions found for this period.</p>
                  <p class="text-xs text-gray-400 mt-1">Try changing your filters or date range.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/plugins/axios'

/**
 * -------------------------------------------------
 * State
 * -------------------------------------------------
 */
const isLoading = ref(false)
const transactions = ref([])

/**
 * -------------------------------------------------
 * Helpers
 * -------------------------------------------------
 */
const getToday = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * -------------------------------------------------
 * Filters (Default: Current Day)
 * -------------------------------------------------
 */
const filters = reactive({
  start_date: getToday(),
  end_date: getToday(),
  transaction_type: ''
})

/**
 * -------------------------------------------------
 * Fetch Transactions
 * -------------------------------------------------
 */
const fetchTransactions = async () => {
  

  try {
    isLoading.value = true
    const { data } = await api.get('/reports/transactions', {
      params: {
        start_date: filters.start_date || null,
        end_date: filters.end_date || null,
        transaction_type: filters.transaction_type || null
      }
    })

    transactions.value = data.data ?? []
  } catch (err) {
    console.error('Transaction fetch failed:', err)
    transactions.value = []
  } finally {
    isLoading.value = false
  }
}

/**
 * -------------------------------------------------
 * Computed Totals
 * -------------------------------------------------
 */
const totalDeposit = computed(() => {
  return transactions.value
    .filter(t => t.transaction_type === 'Deposit')
    .reduce((total, t) => total + Number(t.amount || 0), 0)
})

const totalWithdraw = computed(() => {
  return transactions.value
    .filter(t => t.transaction_type === 'Withdraw')
    .reduce((total, t) => total + Number(t.amount || 0), 0)
})

const totalFailed = computed(() => {
  return transactions.value
    .filter(t => t.transaction_type === 'Failed')
    .reduce((total, t) => total + Number(t.amount || 0), 0)
})

/**
 * -------------------------------------------------
 * Lifecycle
 * -------------------------------------------------
 */
onMounted(() => {
  fetchTransactions() // Default: current day report
})
</script>
