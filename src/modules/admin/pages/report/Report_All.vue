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
  <div v-else class="bg-white p-4 rounded shadow m-1 shadow-1xl h-auto">
    <!-- <header class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Report Type All</h1>
    </header> -->
    <Report
    :data="reportData"
    :columns="columns"
    @filter="fetchReport"
    title="Financial Report"
    :isLoading="isLoading"
  />



    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Report from '@/components/Report.vue';
import { VueSpinnerDots } from 'vue3-spinners';

const isLoading = ref(false);
const reportData = ref([])

const columns = [
  // { label: 'Date', key: 'date' },
  { label: 'Sale', key: 'sale' },
  { label: 'Discount', key: 'discount' },
  { label: 'Profit', key: 'profit' },
  { label: 'Credit Customer', key: 'credit_customer' },
  { label: 'Expense', key: 'expense' },
  // { label: 'Credit Supplier', key: 'credit_supplier' },
  { label: 'Account (Withdraw)', key: 'account_withdraw' },
  { label: 'Account (Deposit)', key: 'account_deposit' },
  { label: 'Cash in Hand', key: 'cash_in_hand' },
]

const fetchReport = async (filters) => {
  isLoading.value = true
  
  try {
    const { data } = await api.get('/reports/all', { // fixed route
      params: filters,
    })
    
    reportData.value = data
    console.log('Fetching report with filters:', reportData.value)
  } catch (error) {
    console.error('Report error:', error)
  }
  finally{
    isLoading.value = false
  }
}

const fetchFinancialReportDetail =async () => {
  // Implement if needed
 const start = '2025-10-01';
const end = new Date(2025,12,31); // 11 = December, day 0 = last day of previous month
const endDate = end.toISOString().slice(0,10); // '2025-11-30'

const response = await api.get('/reports/custom-details', {
  params: {
    start_date: start,
    end_date: endDate
  }
});
console.log('Financial Report Details:', response);
}

// Load default (daily)
onMounted(() => {
  fetchReport({ type: 'daily' })
  fetchFinancialReportDetail();

  
})
</script>