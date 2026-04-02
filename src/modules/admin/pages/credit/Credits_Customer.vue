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
                  <button @click.prevent="openViewModal(sale)" class="w-8 h-8 flex items-center justify-center text-green-600 bg-green-50 rounded-md border border-green-100 hover:bg-green-100" title="View invoice details">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button @click.prevent="printSale(sale.id)" class="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100" title="Print invoice">
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

    <!-- Invoice View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">Invoice Details</h2>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div v-if="selectedSale && state.customer" class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Invoice ID</p>
                <h4 class="text-sm font-bold text-gray-800">#{{ selectedSale.id }}</h4>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Date</p>
                <h4 class="text-sm font-bold text-gray-800">{{ formatDate(selectedSale.created_at) }}</h4>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer</p>
                <h4 class="text-sm font-bold text-gray-800">{{ state.customer.name }}</h4>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Phone</p>
                <h4 class="text-sm font-bold text-gray-800">{{ state.customer.phone || 'N/A' }}</h4>
              </div>
            </div>
          </div>

          <div class="overflow-hidden border border-gray-100 rounded-lg">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-800 text-white font-bold uppercase">
                <tr>
                  <th class="px-3 py-3">Item Name</th>
                  <th class="px-3 py-3 text-center">Quantity</th>
                  <th class="px-3 py-3 text-right">Unit Price</th>
                  <th class="px-3 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in selectedSale?.items || []" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-3 py-3 font-bold text-gray-700">{{ item.name }}</td>
                  <td class="px-3 py-3 text-center text-gray-600">{{ item.quantity }}</td>
                  <td class="px-3 py-3 text-right text-gray-600 font-mono">{{ item.sale_price || 0 }}</td>
                  <td class="px-3 py-3 text-right font-bold text-gray-800">{{ (parseFloat(item.quantity) * (parseFloat(item.sale_price) || 0)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-bold text-gray-800">Rs.{{ (parseFloat(selectedSale?.total) || 0).toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-300 pt-2 flex justify-between text-base">
                <span class="font-bold text-gray-800">Grand Total:</span>
                <span class="font-black text-blue-600">Rs.{{ (parseFloat(selectedSale?.total) || 0).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedSale?.note" class="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p class="text-[10px] font-bold uppercase text-blue-400">Note</p>
            <p class="text-sm text-blue-900">{{ selectedSale.note }}</p>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
          <button @click="showViewModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold text-sm hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
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
const showViewModal = ref(false);
const selectedSale = ref(null);

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

const openViewModal = (sale) => {
  // Fetch full sale data with items
  api.get("/sales", { params: { search: sale.id } })
    .then(res => {
      const fullSale = res.data.data.data.find(s => s.id === sale.id);
      if (fullSale) {
        selectedSale.value = fullSale;
        showViewModal.value = true;
      }
    })
    .catch(e => console.error("Error fetching sale", e));
};
</script>