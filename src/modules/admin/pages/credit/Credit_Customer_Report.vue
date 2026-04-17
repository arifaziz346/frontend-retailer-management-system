<template>
  <div class="p-4 md:p-10 bg-slate-200 min-h-screen font-sans antialiased">
    
    <div class="max-w-7xl mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden border border-gray-300">
      
      <!-- Header -->
      <div class="bg-slate-800 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-light tracking-tight uppercase">
            Credit <span class="font-bold text-blue-400">Customer Ledger</span>
          </h1>
          <p class="text-slate-400 text-xs mt-1 tracking-widest">OFFICIAL OUTSTANDING RECEIVABLES REPORT</p>
        </div>

        <!-- Search -->
        <div class="relative">
          <input
            v-model="search"
            @input="debounceFetch"
            placeholder="Search by Name or Phone..."
            class="bg-slate-700 border-none text-white placeholder-slate-400 px-10 py-3 rounded-full w-80 focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
          <span class="absolute left-4 top-3.5 text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <!-- ══ SUMMARY CARDS ══ -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-0 border-b-2 border-gray-200">

        <!-- Total Credit -->
        <div class="flex items-center gap-4 px-8 py-5 border-r border-gray-200">
          <div class="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Credit Issued</p>
            <div v-if="summaryLoading" class="mt-1.5 h-6 w-36 bg-slate-200 rounded animate-pulse"></div>
            <p v-else class="text-xl font-mono font-bold text-slate-700 mt-0.5">
              {{ formatCurrency(grandTotals.total_credit) }}
            </p>
          </div>
        </div>

        <!-- Total Paid -->
        <div class="flex items-center gap-4 px-8 py-5 border-r border-gray-200">
          <div class="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount Paid</p>
            <div v-if="summaryLoading" class="mt-1.5 h-6 w-36 bg-slate-200 rounded animate-pulse"></div>
            <p v-else class="text-xl font-mono font-bold text-emerald-600 mt-0.5">
              {{ formatCurrency(grandTotals.total_paid) }}
            </p>
          </div>
        </div>

        <!-- Balance Due -->
        <div class="flex items-center gap-4 px-8 py-5">
          <div class="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Balance Due</p>
            <div v-if="summaryLoading" class="mt-1.5 h-6 w-36 bg-slate-200 rounded animate-pulse"></div>
            <p v-else class="text-xl font-mono font-bold text-red-600 mt-0.5">
              {{ formatCurrency(grandTotals.due) }}
            </p>
          </div>
        </div>

      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b-2 border-gray-200">
              <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase w-16">#</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Identity</th>
              <th class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total Credit</th>
              <th class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total Paid</th>
              <th class="px-4 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Balance Due</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aging</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(item, index) in sortedReport"
              :key="item.customer_id"
              class="hover:bg-blue-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 text-center text-sm font-mono text-slate-400 border-r border-gray-50">
                {{ index + 1 }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-slate-800">{{ item.name }}</div>
                <div class="text-md text-slate-500 font-bold tracking-tighter">{{ item.phone }}</div>
              </td>
              <td class="px-4 py-4 text-right font-mono text-sm text-slate-600">
                {{ formatCurrency(item.total_credit) }}
              </td>
              <td class="px-4 py-4 text-right font-mono text-sm text-emerald-600">
                {{ formatCurrency(item.total_paid) }}
              </td>
              <td class="px-4 py-4 text-right">
                <span class="font-mono text-sm font-bold text-red-600">
                  {{ formatCurrency(item.due) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div
                  class="inline-block px-3 py-1 text-[10px] font-black uppercase rounded shadow-sm"
                  :class="item.total_days > 30 ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'"
                >
                  {{ item.total_days }} Days
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!tableLoading && report.length === 0">
              <td colspan="6" class="py-32 text-center">
                <div class="opacity-20 flex flex-col items-center">
                  <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-xl font-bold italic">No records found in current ledger</p>
                </div>
              </td>
            </tr>

            <!-- Table Loading Skeleton -->
            <template v-if="tableLoading">
              <tr v-for="n in 6" :key="'sk-' + n">
                <td class="px-6 py-4 text-center">
                  <div class="h-4 w-6 bg-slate-200 rounded animate-pulse mx-auto"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 w-40 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div class="h-3 w-28 bg-slate-100 rounded animate-pulse"></div>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto"></div>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto"></div>
                </td>
                <td class="px-4 py-4 text-right">
                  <div class="h-4 w-20 bg-slate-200 rounded animate-pulse ml-auto"></div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="h-6 w-16 bg-slate-200 rounded animate-pulse mx-auto"></div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Load More -->
      <div class="bg-slate-50 p-6 border-t border-gray-200 flex flex-col items-center gap-4" v-if="page < lastPage">
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">End of visible records</p>
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="inline-flex items-center justify-center px-10 py-3 font-bold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none shadow-lg disabled:opacity-60"
        >
          <svg v-if="loadingMore" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"></path>
          </svg>
          <span v-if="!loadingMore">LOAD NEXT PAGE</span>
          <span v-else>LOADING...</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/plugins/axios";

const report         = ref([]);
const search         = ref("");
const page           = ref(1);
const lastPage       = ref(1);
const loadingMore    = ref(false);
const tableLoading   = ref(true);
const summaryLoading = ref(true);

const grandTotals = ref({
  total_credit: 0,
  total_paid:   0,
  due:          0,
});

let timeout = null;

// ── Format currency ────────────────────────────────────────────────────────
const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 1 }).format(val ?? 0);

// ── Fetch grand totals (all records, no pagination) ────────────────────────
const fetchSummary = async () => {
  summaryLoading.value = true;
  try {
    const res = await api.get("/credit-customer-report/summary", {
      params: { search: search.value },
    });
    grandTotals.value = res.data.totals;
  } catch (error) {
    console.error("Summary Error:", error);
  } finally {
    summaryLoading.value = false;
  }
};

// ── Fetch paginated table data ─────────────────────────────────────────────
const fetchReport = async (reset = false) => {
  try {
    if (reset) {
      page.value         = 1;
      report.value       = [];
      tableLoading.value = true;
    }
    loadingMore.value = true;

    const res = await api.get("/credit-customer-report", {
      params: { search: search.value, page: page.value },
    });

    report.value = reset
      ? res.data.data
      : [...report.value, ...res.data.data];

    lastPage.value = res.data.pagination.last_page;

  } catch (error) {
    console.error("Table Error:", error);
  } finally {
    loadingMore.value  = false;
    tableLoading.value = false;
  }
};

// ── Load next page ─────────────────────────────────────────────────────────
const loadMore = async () => {
  if (loadingMore.value || page.value >= lastPage.value) return;
  page.value++;
  await fetchReport(false);
};

// ── Debounce search ────────────────────────────────────────────────────────
const debounceFetch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetchSummary();
    fetchReport(true);
  }, 400);
};

// ── Sort by balance due descending ─────────────────────────────────────────
const sortedReport = computed(() =>
  [...report.value].sort((a, b) => b.due - a.due)
);

// ── Init ───────────────────────────────────────────────────────────────────
onMounted(() => {
  fetchSummary();
  fetchReport(true);
});
</script>

<style scoped>
.bg-slate-200 {
  background-color: #e2e8f0;
  background-image: linear-gradient(#cbd5e1 1px, transparent 1px),
                    linear-gradient(90deg, #cbd5e1 1px, transparent 1px);
  background-size: 40px 40px;
}
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>