<template>
  <SalePrint ref="printRef" />

  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
    <div class="flex flex-col items-center space-y-3">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <p class="text-blue-600 text-sm font-medium animate-pulse">Syncing Delivery Data...</p>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-gray-50/50 p-2 sm:p-4 md:p-6">
    
    <div class="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <button @click.prevent="goBack()" class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div class="min-w-0">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 truncate">Delivery Management</h1>
            <p class="text-xs text-gray-500 font-medium">Sale ID: #{{ sale_id }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button @click.prevent="openSummaryModal" class="flex-1 lg:flex-none h-10 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs border border-blue-200 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Summary & Balance
          </button>

          <button @click.prevent="openDeliverModal" class="flex-1 lg:flex-none h-10 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Deliver Items +
          </button>
        </div>
      </div>
    </div>

    <main class="flex-1">
      <div v-if="advanceSales && advanceSales.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Delivery ID</th>
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Date</th>
                <th class="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Items Dispatched</th>
                <th class="px-4 py-3 text-center text-[10px] font-bold uppercase text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="record in advanceSales" :key="record.id" class="hover:bg-blue-50/20 transition-all">
                <td class="px-4 py-4 font-mono font-bold text-xs text-gray-900">#{{ record.id }}</td>
                <td class="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">{{ formatDate(record.created_at) }}</td>
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="item in record.items" :key="item.id" class="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-bold">
                      {{ item.name }} (x{{ item.quantity }})
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4 text-center">
                   <button @click="printDispatchBatch(record)" class="text-blue-500 hover:text-blue-700 transition-colors" title="Print this dispatch only">
                     <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 bg-gray-50/50 border-t border-gray-100">
          <Pagination :pagination="pagination" @page-change="fetchDeliveryHistory" />
        </div>
      </div>
    </main>

    <BaseModal v-model="showSummaryModal" title="Full Delivery & Balance Report" :showSaveBtn="false">
      <div class="space-y-4">
        <div v-if="saleObject" class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer</p>
                <h4 class="text-sm font-bold text-gray-800">{{ saleObject.customer?.name || 'Walk-in Customer' }}</h4>
                <p class="text-[10px] text-gray-500">{{ saleObject.customer?.phone || 'No phone provided' }}</p>
            </div>
            <button @click="printFullSummaryReport" class="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Summary Report
            </button>
        </div>

        <div class="overflow-hidden border border-gray-100 rounded-lg">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-800 text-white font-bold uppercase">
              <tr>
                <th class="px-3 py-3">Item Name</th>
                <th class="px-3 py-3 text-center">Ordered</th>
                <th class="px-3 py-3 text-center">Delivered</th>
                <th class="px-3 py-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in summaryItems" :key="item.id" class="hover:bg-gray-50">
                <td class="px-3 py-3 font-bold text-gray-700">{{ item.name }}</td>
                <td class="px-3 py-3 text-center text-gray-500">{{ item.quantity }}</td>
                <td class="px-3 py-3 text-center font-bold text-green-600">{{ item.quantity - item.remaining_to_deliver }}</td>
                <td class="px-3 py-3 text-right">
                  <span :class="item.remaining_to_deliver > 0 ? 'text-red-500 font-black' : 'text-gray-300'">
                    {{ item.remaining_to_deliver }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="showModal" title="Prepare Item Delivery" @save="submitDelivery" :disableSaveBtn="isSaving || !hasSelectedItems">
        <div class="space-y-4">
            <div class="max-h-[350px] overflow-y-auto border border-gray-100 rounded-lg">
                <table class="w-full text-left text-xs">
                    <thead class="bg-gray-50 sticky top-0 z-10 border-b">
                        <tr>
                            <th class="px-3 py-2 text-gray-500 font-bold uppercase">Item</th>
                            <th class="px-3 py-2 text-gray-500 font-bold uppercase text-center">Stock Rem.</th>
                            <th class="px-3 py-2 text-gray-500 font-bold uppercase text-center">Deliver Qty</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 bg-white">
                        <tr v-for="(item, index) in deliveryItems" :key="item.id">
                            <td class="px-3 py-3 font-bold text-gray-800">{{ item.name }}</td>
                            <td class="px-3 py-3 text-center font-mono font-bold">{{ item.remaining_to_deliver }}</td>
                            <td class="px-3 py-3">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="updateQty(index, -0.1)" class="w-7 h-7 rounded bg-gray-100">-</button>
                                    <input type="number" step="0.001" v-model.number="item.deliver_qty" @input="checkLimit(index)" class="w-12 text-center font-bold outline-none border-b border-gray-200" />
                                    <button @click="updateQty(index, 0.1)" class="w-7 h-7 rounded bg-blue-100 text-blue-600">+</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <FormInput v-model="form.delivery_note" label="Vehicle/Note" placeholder="e.g. Driver Ali - Toyota Hilux" />
        </div>
    </BaseModal>
  </div>
</template>

<script setup>
import api from "@/plugins/axios"
import BaseModal from "@/components/BaseModal.vue"
import FormInput from "@/components/admin/FormInput.vue"
import Pagination from "@/components/admin/Pagination.vue"
import SalePrint from '@/components/print/SalePrint.vue'
import { VueSpinnerDots } from "vue3-spinners"
import { reactive, ref, onMounted, computed } from "vue"
import { toast } from "@/utils/toast"
import { formatDate } from "@/utils/formatDate"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const sale_id = ref(route.params.id) 

/* ------------------ STATE ------------------ */
const printRef = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const showModal = ref(false)
const showSummaryModal = ref(false)
const advanceSales = ref([]) 
const deliveryItems = ref([])
const summaryItems = ref([])
const saleObject = ref(null)

const pagination = reactive({ currentPage: 1, lastPage: 1 })
const form = reactive({ delivery_note: '' })

/* ------------------ UPDATED PRINT LOGIC ------------------ */

// 1. Prints only the current dispatch items
const printDispatchBatch = (record) => {
  if (!printRef.value || !saleObject.value) return;
  const batchData = {
    ...saleObject.value,
    id: `DISPATCH-#${record.id}`,
    sale_date: record.created_at,
    items: record.items,
    total_amount: 0,
    total_items: record.items.length
  };
  printRef.value.print(batchData);
};

// 2. Prints Complete Summary (Ordered vs Delivered vs Balance)
const printFullSummaryReport = () => {
  if (!printRef.value || !saleObject.value || !summaryItems.value.length) return;
  
  // Transform items to show summary text in the print list
  const summaryData = {
    ...saleObject.value,
    id: `SUMMARY-SALE#${sale_id.value}`,
    sale_date: new Date().toLocaleDateString(),
    items: summaryItems.value.map(i => ({
      // We customize the name to show the status clearly on the receipt
      name: `${i.name} [Ord:${i.quantity} | Del:${i.quantity - i.remaining_to_deliver}]`,
      quantity: i.remaining_to_deliver, // The 'qty' field on thermal print usually denotes what is owed/remaining
      sale_price: i.sale_price,
      // We can add a custom property if your SalePrint component supports it
      summary_text: `Remaining: ${i.remaining_to_deliver}`
    })),
    total_amount: 0,
    note: "COMPLETE FULFILLMENT SUMMARY REPORT"
  };
  printRef.value.print(summaryData);
};

/* ------------------ API METHODS ------------------ */

const fetchDeliveryHistory = async (page = 1) => {
  isLoading.value = true
  try {
    const res = await api.get(`/advance/sale/${sale_id.value}?page=${page}`)
    advanceSales.value = res.data?.data?.data || []
    
    // Get full sale for customer details
    const saleRes = await api.get("/sales", { params: { search: sale_id.value } });
    saleObject.value = saleRes.data.data.data.find(s => s.id == sale_id.value);

    if (res.data?.data) {
        Object.assign(pagination, {
          currentPage: res.data.data.current_page || 1,
          lastPage: res.data.data.last_page || 1,
        })
    }
  } catch (e) {
    toast.error("Failed to sync data")
  } finally {
    isLoading.value = false
  }
}

const openSummaryModal = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/advance/sale-items/${sale_id.value}`)
    summaryItems.value = res.data?.data || []
    showSummaryModal.value = true
  } catch (e) {
    toast.error("Failed to load summary")
  } finally {
    isLoading.value = false
  }
}

const openDeliverModal = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/advance/sale-items/${sale_id.value}`)
    const items = res.data?.data || []
    deliveryItems.value = items.filter(i => i.remaining_to_deliver > 0).map(i => ({ ...i, deliver_qty: 0 }))
    if (deliveryItems.value.length === 0) toast.info("Fully delivered.");
    else showModal.value = true
  } catch (e) {
    toast.error("Failed to load delivery items")
  } finally {
    isLoading.value = false
  }
}

const updateQty = (i, d) => {
  const item = deliveryItems.value[i]
  const val = parseFloat((item.deliver_qty + d).toFixed(3)) // Support decimal increments
  if (val >= 0 && val <= item.remaining_to_deliver) item.deliver_qty = val
}

const checkLimit = (i) => {
  const item = deliveryItems.value[i]
  if (item.deliver_qty > item.remaining_to_deliver) item.deliver_qty = item.remaining_to_deliver
  if (item.deliver_qty < 0 || isNaN(item.deliver_qty)) item.deliver_qty = 0
}

const submitDelivery = async () => {
  const validItems = deliveryItems.value.filter(i => i.deliver_qty > 0)
  isSaving.value = true
  try {
    const payload = {
      sale_id: sale_id.value,
      note: form.delivery_note,
      items: validItems.map(i => ({ ...i, quantity: i.deliver_qty }))
    }
    const res = await api.post('/advance/deliver', payload)
    if (res.data.success) {
      toast.success("Delivery recorded")
      showModal.value = false
      form.delivery_note = ''
      await fetchDeliveryHistory()
    }
  } catch (e) { toast.error("Submission failed") } finally { isSaving.value = false }
}

const hasSelectedItems = computed(() => deliveryItems.value?.some(item => item.deliver_qty > 0))
const goBack = () => router.back()
onMounted(() => fetchDeliveryHistory())
</script>