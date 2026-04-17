<template>
  <div class="min-h-screen bg-slate-50 p-4 lg:p-8 relative">
    <div
      v-show="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-50 transition-all"
    >
      <div class="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-100">
        <VueSpinnerDots size="50px" color="#2563eb" />
        <p class="mt-4 text-slate-600 font-semibold animate-pulse tracking-wide">
          PREPARING FINANCIAL DATA
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto space-y-6">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <Report
          :data="reportData"
          :columns="columns"
          :isLoading="isLoading"
          @filter="fetchReport"
          title="Executive Financial Summary"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Report from '@/components/Report.vue';
import { VueSpinnerDots } from 'vue3-spinners';

const isLoading = ref(false);
const reportData = ref({});

const columns = [
  { label: 'Total Sales', key: 'sale', icon: 'trending-up' },
  { label: 'Profit', key: 'profit', icon: 'dollar-sign' },
  { label: 'Expenses', key: 'expense', icon: 'credit-card' },
  {label:'Credit Payments', key: 'credit_payments', icon: 'dollar-sign' },
  { label: 'Credit (Cust)', key: 'credit_customer', icon: 'users' },
  { label: 'Cash Only', key: 'cash_only_sale', icon: 'dollar-sign' },
  { label: 'Withdrawals', key: 'account_withdraw', icon: 'arrow-up-right' },
  { label: 'Deposits', key: 'account_deposit', icon: 'arrow-down-left' },
  { label: 'Cash In Hand', key: 'cash_in_hand', icon: 'wallet' },
];

const fetchReport = async (filters) => {
  isLoading.value = true;
  try {
    // API call remains the same
    const { data } = await api.get('/reports/all', { params: filters });
    reportData.value = data;
    console.log('Data Refreshed:', data);
  } catch (error) {
    console.error('Report error:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchReport({ type: 'daily' }));
</script>