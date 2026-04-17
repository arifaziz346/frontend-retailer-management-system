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

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-red-100 bg-red-50/30">
            <p class="text-[10px] uppercase font-bold text-red-400">Total Debt (Cr+Lib)</p>
            <p class="text-sm sm:text-base font-black text-red-700">Rs.{{ totalDebt }}</p>
          </div>

          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-green-100 bg-green-50/30">
            <p class="text-[10px] uppercase font-bold text-green-400">Total Paid</p>
            <p class="text-sm sm:text-base font-black text-green-700">Rs.{{ state.total_paid }}</p>
          </div>

          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-amber-100 bg-amber-50/30">
            <p class="text-[10px] uppercase font-bold text-amber-400">Liability</p>
            <p class="text-sm sm:text-base font-black text-amber-700">
              Rs.{{ formattedLiability }}
            </p>
          </div>

          <div class="h-16 flex flex-col justify-center px-3 rounded-lg border border-blue-100 bg-blue-600 shadow-sm">
            <p class="text-[10px] uppercase font-bold text-blue-100">Net Due Balance</p>
            <p class="text-sm sm:text-base font-black text-white">
              Rs.{{ netBalance }}
            </p>
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
                <span class="text-sm font-bold text-gray-900">Rs.{{ sale.total }}</span>
              </td>
              <td class="px-4 py-3">
                <div v-if="sale.cancel == null" class="flex items-center justify-center gap-2">
                  <!-- View Button -->
                  <button @click.prevent="openViewModal(sale)" class="w-8 h-8 flex items-center justify-center text-green-600 bg-green-50 rounded-md border border-green-100 hover:bg-green-100" title="View">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>

                  <!-- Print Button -->
                  <button @click.prevent="printSale(sale.id)" class="w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100" title="Print">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </button>

                  <!-- Deliver Button — only shown on Advance Holds tab -->
                  <button
                    v-if="state.activeFilter === 2"
                    @click.prevent="deliverSale(sale.id)"
                    class="w-8 h-8 flex items-center justify-center text-purple-600 bg-purple-50 rounded-md border border-purple-100 hover:bg-purple-100"
                    title="Deliver"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="py-16 flex flex-col items-center justify-center text-center">
        <p class="text-sm font-bold text-gray-400">No Transactions Found</p>
      </div>
    </div>

    <SalePrint ref="printRef" />

    <!-- View Invoice Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">Invoice Details</h2>
          <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Sale Total:</span>
                <span class="font-bold text-gray-800">Rs.{{ (parseFloat(selectedSale?.total) || 0).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-amber-600">Customer Liability:</span>
                <span class="font-bold text-amber-600">+ Rs.{{ formattedLiability }}</span>
              </div>
              <div class="flex justify-between border-t pt-2">
                <span class="text-gray-600 font-bold">Accumulated Debt:</span>
                <span class="font-bold text-red-600">Rs.{{ totalDebt }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-green-600">Total Paid to Date:</span>
                <span class="font-bold text-green-600">- Rs.{{ state.total_paid }}</span>
              </div>
              <div class="border-t border-gray-300 pt-2 flex justify-between text-base">
                <span class="font-bold text-gray-800">Net Balance Due:</span>
                <span class="font-black text-blue-600">Rs.{{ netBalance }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
          <button @click="showViewModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold text-sm hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Deliver Confirmation Modal -->
    <div v-if="showDeliverModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">Confirm Delivery</h3>
              <p class="text-xs text-gray-500 mt-0.5">Sale #{{ deliverSaleId }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-6">Are you sure you want to mark this advance hold as <span class="font-bold text-purple-600">Delivered</span>? This action cannot be undone.</p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeliverModal = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all">
              Cancel
            </button>
            <button @click="confirmDeliver" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Deliver
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/plugins/axios';
import { onMounted, reactive, ref, watch, computed } from 'vue';
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
const showDeliverModal = ref(false);
const selectedSale = ref(null);
const deliverSaleId = ref(null);

const invoiceTabs = [
  { label: 'Standard Credit', value: 1 },
  { label: 'Advance Holds', value: 2 }
];

const state = reactive({
  activeFilter: 1,
  sales: [],
  customer: {},
  total_credit: 0,
  total_paid: 0,
});

// 1. Liability formatting
const formattedLiability = computed(() => {
  return (parseFloat(state.customer.liability) || 0).toFixed(2);
});

// 2. Total Debt = Total Credit Sales + Liability
const totalDebt = computed(() => {
  const credit = parseFloat(state.total_credit) || 0;
  const liability = parseFloat(state.customer.liability) || 0;
  return (credit + liability).toFixed(2);
});

// 3. Net Balance = (Credit + Liability) - Payments
const netBalance = computed(() => {
  const debt = parseFloat(totalDebt.value) || 0;
  const paid = parseFloat(state.total_paid) || 0;
  return (debt - paid).toFixed(2);
});

watch(() => state.activeFilter, (newVal) => {
  if (newVal === 1) fetchCreditsCustomer();
  else if (newVal === 2) fetchSalesAdvanceCreditCustomer();
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
    const res = await api.get(`credit/customer/advance-hold/${customer_id.value}`);
    const data = res.data.data;
    state.sales = data.Sales || [];
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    isLoading.value = false;
  }
};

const viewPayment = (id) => router.push({ name: "admin.customer-payments", params: { id } });
const goBack = () => router.go(-1);

const printSale = async (id) => {
  try {
    const res = await api.get("/sales", { params: { search: id } });
    const sale = res.data.data.data.find(s => s.id === id);
    if (sale && printRef.value) printRef.value.print(sale);
  } catch (e) {
    console.error("Print error", e);
  }
};

const openViewModal = (sale) => {
  api.get("/sales", { params: { search: sale.id } })
    .then(res => {
      const fullSale = res.data.data.data.find(s => s.id === sale.id);
      if (fullSale) {
        selectedSale.value = fullSale;
        showViewModal.value = true;
      }
    });
};

// Opens the deliver confirmation modal
const deliverSale = (id) => {
  deliverSaleId.value = id;
  router.push({ name: 'admin.advance-sale-items', params: { id } });
};

// Called when user confirms delivery in the modal
// const confirmDeliver = async () => {
//   isLoading.value = true;
//   showDeliverModal.value = false;
//   try {
//     await api.post(`/sales/deliver/${deliverSaleId.value}`);
//     await fetchSalesAdvanceCreditCustomer(); // refresh the list
//   } catch (err) {
//     console.error('Deliver error:', err);
//   } finally {
//     isLoading.value = false;
//     deliverSaleId.value = null;
//   }
// };
</script>