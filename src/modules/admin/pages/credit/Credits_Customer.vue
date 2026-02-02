<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
    <div class="flex flex-col items-center">
      <VueSpinnerDots size="50px" color="#2563eb" />
      <p class="text-blue-600 font-bold mt-4 animate-pulse text-sm">Syncing Records...</p>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50/50 p-2 sm:p-4 md:p-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-3 min-w-0">
            <button @click.prevent="goBack()" class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="min-w-0">
              <h1 class="text-base sm:text-lg font-bold text-gray-900 truncate">{{ state.customer.name }}</h1>
              <p class="text-xs text-gray-500 font-medium">Customer ID: #{{ customer_id }}</p>
            </div>
          </div>
          
          <button @click.prevent="viewPayment(customer_id)" class="hidden sm:flex h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all items-center gap-2 shadow-sm">
            <span>Receive Payment</span>
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:gap-4">
          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-red-100 bg-red-50/30">
            <p class="text-[10px] uppercase font-bold text-red-400">Credit</p>
            <p class="text-sm sm:text-base font-black text-red-700">Rs.{{ state.total_credit }}</p>
          </div>
          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-green-100 bg-green-50/30">
            <p class="text-[10px] uppercase font-bold text-green-400">Paid</p>
            <p class="text-sm sm:text-base font-black text-green-700">Rs.{{ state.total_paid }}</p>
          </div>
          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-blue-100 bg-blue-600 shadow-sm">
            <p class="text-[10px] uppercase font-bold text-blue-100">Due</p>
            <p class="text-sm sm:text-base font-black text-white">Rs.{{ state.total_credit - state.total_paid }}</p>
          </div>
        </div>

        <button @click.prevent="viewPayment(customer_id)" class="flex sm:hidden w-full h-11 bg-blue-600 text-white rounded-lg font-bold text-sm items-center justify-center shadow-md">
          Receive Payment
        </button>
      </div>
    </div>

    <div class="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
      <button 
        v-for="tab in invoiceTabs" :key="tab.value"
        @click="state.activeFilter = tab.value"
        :class="[
          'h-10 px-4 flex-shrink-0 rounded-lg text-xs font-bold transition-all border shrink-0',
          state.activeFilter === tab.value 
          ? 'bg-gray-900 border-gray-900 text-white shadow-sm' 
          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="state.sales.length > 0" class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">ID</th>
              <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Date</th>
              <th v-if="state.activeFilter === 2" class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Status</th>
              <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 text-right">Grand Total</th>
              <th class="px-4 py-3 text-center text-[10px] font-bold uppercase text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="sale in state.sales" :key="sale.id" class="hover:bg-blue-50/20 transition-all">
              <td class="px-4 py-3 font-mono font-bold text-xs text-gray-900">#{{ sale.id }}</td>
              <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ formatDate(sale.created_at) }}</td>
              <td v-if="state.activeFilter === 2" class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-700 uppercase">Hold</span>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="text-sm font-bold text-gray-900">Rs.{{ sale.total - (sale.discount || 0) }}</span>
              </td>
              <td class="px-4 py-3">
                <div v-if="sale.cancel == null" class="flex items-center justify-center gap-2">
                  <button @click.prevent="printSale(sale.id)" class="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </button>
                  <button v-if="state.activeFilter === 2"
                  @click="deliverItem(sale.id)"
                  class="h-8 px-3 text-[10px] font-bold bg-green-600 text-white rounded-md hover:bg-green-700">
                    Deliver
                  </button>
                </div>
                <div v-else class="text-center">
                  <span class="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">Void</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-16 flex flex-col items-center justify-center text-center">
        <svg class="w-12 h-12 text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <p class="text-sm font-bold text-gray-400">No Transactions Found</p>
      </div>
    </div>

    <SalePrint ref="printRef" />
  </div>
</template>

<script setup>
import api from '@/plugins/axios';   
import { onMounted, reactive, ref, watch } from 'vue';
import SalePrint from '@/components/print/SalePrint.vue';
import { formatDate } from '@/utils/formatDate';
import { VueSpinnerDots } from "vue3-spinners";
import { useRouter, useRoute } from 'vue-router';

const printRef = ref(null);
const router = useRouter();
const route = useRoute();
const customer_id = ref(route.params.id);
const isLoading = ref(false);

const invoiceTabs = [
  { label: 'Standard Credit', value: 1 }, // Changed value to 1 to match your logic
  { label: 'Advance Holds', value: 2 }
];

const state = reactive({
  activeFilter: 1,
  sales: [],
  customer: {},
  total_credit: 0,
  total_paid: 0
});

// 🟢 FIX: Use a watcher instead of a computed property for API calls
watch(() => state.activeFilter, (newVal) => {
  if (newVal === 1) {
    console.log('credits-customer',state.sales);
    fetchCreditsCustomer();
  } else if (newVal === 2) {
    console.log('Adcance-credits-customer',state.sales);
    fetchSalesAdvanceCreditCustomer();
  }
});

onMounted(() => {
  fetchCreditsCustomer();
});

const fetchCreditsCustomer = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(`/credit/customer/${customer_id.value}`);
    const data = res.data.data;
    state.sales = data.Sales || [];
    state.customer = data.Customer || {};
    state.total_credit = data.CreditDetail?.total_credit || 0;
    state.total_paid = data.CreditDetail?.total_paid || 0;
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    isLoading.value = false;
  }
};

const fetchSalesAdvanceCreditCustomer = async () => {
  isLoading.value = true;
  try {
    // Note: Adjusted URL to match your route group prefix
    const res = await api.get(`credit/customer/advance-hold/${customer_id.value}`);
    const data = res.data.data;
    state.sales = data.Sales || [];
    // state.customer = data.Customer || {};
    // state.total_credit = data.CreditDetail?.total_credit || 0;
    // state.total_paid = data.CreditDetail?.total_paid || 0;
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    isLoading.value = false;
  }
};

const deliverItem = (id) =>router.push({ name: "admin.advance-sale-items", params: { id } })

const viewPayment = (id) => router.push({ name: "admin.customer-payments", params: { id } });
const goBack = () => router.go(-1);
const printSale = async (id) => {
  try {
    const res = await api.get("/sales", { params: { search: id } });
    const sale = res.data.data.data.find(s => s.id === id);
    if (sale && printRef.value) printRef.value.print(sale);
  } catch (e) { console.error("Print error", e); }
};
</script>