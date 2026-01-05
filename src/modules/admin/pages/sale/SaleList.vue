<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[60]">
    <div class="flex flex-col items-center gap-3">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <span class="text-blue-600 font-semibold animate-pulse">Loading Sales...</span>
    </div>
  </div>

  <div v-else class="w-full min-h-screen bg-gray-50 p-2 sm:p-4">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div class="bg-white border-b border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="bg-blue-600 p-2 rounded-lg">
            <i class="pi pi-shopping-cart text-white text-lg"></i>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800 leading-tight">Sales Management</h1>
            <p class="text-xs text-gray-500">View and manage your transaction history</p>
          </div>
        </div>

        <div class="relative w-full md:w-96">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i class="pi pi-search text-gray-400 text-sm"></i>
          </span>
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="handleSearch"
            placeholder="Search by Customer, ID, or Phone..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all outline-none"
          />
        </div>
      </div>


       
      <div v-if="state.sales.length" class="overflow-x-auto">

        <div v-if="isSearching" class="flex flex-col items-center gap-3">
         <VueSpinnerDots size="15px" color="#2563eb" />
        <span class="text-blue-600 font-sm animate-pulse">Searching...</span>

    </div v-else>
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th class="px-6 py-4">Invoice #</th>
              <th class="px-6 py-4">Date & Customer</th>
              <th class="px-6 py-4">Payment Type</th>
              <th class="px-6 py-4 text-center">Items</th>
              <th class="px-6 py-4">Financials</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="sale in state.sales" :key="sale.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="px-6 py-4">
                <span class="font-mono font-bold text-gray-700">#{{ sale.id }}</span>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-semibold text-gray-900">{{ Number(sale.credit) === 1 ? sale.customer?.name || 'Walk-in Customer' : 'Walk-in Customer' }}</span>
                  <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span><i class="pi pi-calendar text-[10px]"></i> {{ sale.sale_date || '-' }}</span>
                    <span v-if="sale.customer?.phone_one">• {{ sale.customer.phone_one }}</span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span v-if="sale.return === 1" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">
                  Canceled
                </span>
                <span v-else :class="Number(sale.credit) === 1 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'" 
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border">
                  {{ Number(sale.credit) === 1 ? 'Credit' : 'Cash Sale' }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold text-xs">
                  {{ sale.total_items || 0 }}
                </span>
              </td>

              <td class="px-6 py-4 text-sm">
                <div class="flex flex-col">
                  <span class="text-gray-900 font-black">Rs. {{ sale.total_amount || 0 }}</span>
                  <span v-if="sale.total_discount > 0" class="text-[10px] text-orange-500 font-medium">
                    Disc: Rs. {{ sale.total_discount }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button @click="printSale(sale.id)" 
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all">
                    <i class="pi pi-print"></i> Print
                  </button>

                  <button @click="() => (sale.return===1?viewReturnReason(sale.id):openReturnSaleModal(sale.id))"
                    :class="sale.return === 1 ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'"
                    class="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                    <i :class="sale.return === 1 ? 'pi pi-info-circle' : 'pi pi-times-circle'"></i>
                    {{ sale.return === 1 ? 'Reason' : 'Cancel' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div class="bg-gray-50 p-6 rounded-full mb-4">
          <i class="pi pi-search-plus text-5xl text-gray-300"></i>
        </div>
        <h2 class="text-xl font-bold text-gray-700">No Transactions Found</h2>
        <p class="text-gray-500 text-sm max-w-xs mx-auto mt-1">
          We couldn't find any sales matching your current criteria. Try adjusting your filters.
        </p>
      </div>

      <div class="bg-gray-50 border-t border-gray-100 px-4 py-3">
        <Pagination :pagination="state.pagination" @page-change="fetchSales" />
      </div>
    </div>

    <BaseModal v-model="showCanelModal" title="Cancel Transaction" @save="saveOpenReturnSaleModal()" :disableSaveBtn="isSaving">
      <div class="p-4">
        <div class="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg mb-4">
          <i class="pi pi-exclamation-triangle text-xl"></i>
          <p class="text-xs font-semibold uppercase">This action will return items to stock and void the payment.</p>
        </div>
        
        <label class="block mb-2 text-sm font-bold text-gray-700">Why are you canceling this sale?</label>
        <select v-model="form.cancel_reason_id"
          class="bg-white border border-gray-300 text-sm rounded-lg block w-full p-3 outline-none focus:ring-2 focus:ring-red-500 transition-all">
          <option value="" disabled>Select a professional reason</option>
          <option v-for="reason in state.return_reasons" :key="reason.id" :value="reason.id">
            {{ reason.title }}
          </option>
        </select>

        <textarea v-if="form.cancel_reason_id === 11" v-model="form.custom_reason" rows="3"
          class="mt-3 bg-white border border-gray-300 text-sm rounded-lg block w-full p-3 outline-none focus:ring-2 focus:ring-red-500 transition-all"
          placeholder="Please describe the specific issue..."></textarea>

        <p v-if="errors.return_reason_id" class="mt-2 text-xs text-red-600 italic">
          * {{ cleanError(errors.return_reason_id) }}
        </p>
      </div>
    </BaseModal>

    <SalePrint ref="printRef"/>
  </div>
</template>

<!-- <script setup>
/**
 * NOTE: Ensure you have `handleSearch` defined in your script.
 * If you haven't implemented the logic yet, here is a simple version:
 * * const handleSearch = () => {
 * // Clear existing timer if any
 * clearTimeout(searchTimer);
 * searchTimer = setTimeout(() => {
 * fetchSales(1); // Call your API with page 1 and the searchQuery
 * }, 500);
 * }
 */
</script> -->

<style scoped>
/* Optional: Soften the table header sticky behavior if used */
thead th {
  position: sticky;
  top: 0;
  z-index: 5;
}

/* Custom Scrollbar for the table */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
</style>

<script setup>
import api from "@/plugins/axios";
import { reactive, onMounted,ref,computed,watch } from "vue";
import Pagination from "@/components/admin/Pagination.vue";
import SalePrint from "@/components/print/SalePrint.vue";
import BaseModal from "@/components/BaseModal.vue";
import { VueSpinnerDots } from "vue3-spinners";
import { useFormErrors } from "@/composables/admin/useFormErrors";
import { limitDisplayText, cleanError } from '@/utils/stringHelpers'
// import debounce from "lodash/debounce";

import Swal from 'sweetalert2'
import { toast } from "@/utils/toast";

//Smart Search 
let timer = null;
let delaySeconds = 0;

const printRef = ref(null);
const showCanelModal = ref(false);
const isLoading = ref(false)
const isSaving = ref(false)
const isSearching = ref(false)
const searchQuery = ref('')
const search = ref('');
/* ---------------- STATE ---------------- */
const state = reactive({
  sales: [],
  return_reasons:[],
  pagination: {},

});

const form = reactive({
  sale_id: null,
  cancel_reason_id: '',
  custom_reason: '',
  is_reason_empty: false
})

const errors = reactive({
  return_reason_id:false
})

const handleFormErrors = useFormErrors(errors);

// const fetchItemsDebounced = debounce(() => {
//   fetchSales()
// }, 500) // 500ms debounce

// // Watch searchText and category_id
// watch([searchQuery, search], () => {
//   fetchItemsDebounced()
// })

// const handleSearch = () => {
//   // clearTimeout(searchTimer);
//   // searchTimer = setTimeout(() => {
//     search.value = searchQuery.value;
//     console.log('Search Query --->', search.value);
//   //   fetchSales(1); // Call your API with page 1 and the searchQuery
//   // }, 500);
// };

watch(searchQuery, () => {
  isSearching.value = true;
  search.value = searchQuery.value;
  fetchSales();
});



/* ---------------- FETCH SALES ---------------- */
const fetchSales = async (url=`/sales`) => {
  isLoading.value = isSearching.value ? false : true;

  try {
    const res = await api.get(url, {
      params: {
        search: search.value || null,
      },
    });

    console.log('res->>>',res.data);

    // ✅ NO .value with reactive
    state.sales = res.data.data.data;
    state.pagination = res.data.data;

  } catch (error) {
    console.error("fetching error", error);
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};




/*-----------------Fetch Return Reasons-------------*/
const fetchReturnReasons = async () => {
   isLoading.value = true
   try {
  const res = await api.get(`/return_reasons`);
  state.return_reasons = res.data.data

  } catch (error) {
     console.log('feting error',error)
  }finally{
    isLoading.value = false
  }
};



/* ---------------- Open CANCEL SALE  Modal  ---------------- */
async function openReturnSaleModal(id) {
  
  form.sale_id = id
  //---->Reset
  form.cancel_reason =''
  showCanelModal.value = true;
  form.sale_id = id;
  // form.is_reason_empty=true
  // await api.post(`/sales/${id}/cancel`);
  // fetchSales();
   Object.keys(errors).forEach((key) => errors[key] = '');
}


const saveOpenReturnSaleModal = async (id) =>{
   isSaving.value = true
  try {
    let cancel_reason = '';

     //Handle Custom reasons
     if(form.cancel_reason_id===11){
     cancel_reason = form.custom_reason;
     }

    const res = await api.post(`/sales/return`,{
     'sale_id':form.sale_id,
     'return':1,
     'return_reason_id':form.cancel_reason_id,
     'cancel_reason':cancel_reason
    })

    if(res.data.success){
      showCanelModal.value = false
      resetForm();
      fetchSales();
      toast.success(res.data.message);
    }
    console.log('return successfull');
   } catch (error) {
    handleFormErrors(error)
    // console.log('error-',error)
    
   }finally{
    isSaving.value = false
   }
}

const viewReturnReason = async (id)=>{

  const res = await api.post(`return_reasons/${id}`);
  // console.log('response view Return Resason',res);
   Swal.fire('Cancel Reason', res.data.data.cancel_reason, 'fail')
}


/* ---------------- PRINT SALE (THERMAL) ---------------- */
const printSale = async (id) => {
  try {
    const res = await api.get(`/sales/${id}`, { params: { search: id } });

    console.log('Print Sale Response --->', res.data.data.data);
    const sale = res.data.data.data.find(s => s.id === id);
    if (!sale) return;

    // Pass sale object to child print method
    if (printRef.value) {
      printRef.value.print(sale);
    }
  } catch (e) {
    console.error("Print error", e);
  }
};




 const resetForm = ()=>{
     form.cancel_reason =''
     Object.keys(errors).forEach((key) => errors[key] = '');
     form.cancel_reason_id= '',
     form.custom_reason='',
     form.is_reason_empty= false
 }



/* ---------------- INIT ---------------- */
onMounted(async () => {
  await fetchReturnReasons()
  await fetchSales()
})
</script>
