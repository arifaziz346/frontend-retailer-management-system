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

  <div
    v-else
    class="bg-white p-4 rounded shadow m-1 shadow-1xl h-auto w-full max-w-full overflow-x-auto"
  >
    <!-- Header Section -->
    <!-- Redesigned Header (replace only this block) -->
<!-- Header with Go-Back Arrow (replace this block) -->
<div class="w-full bg-white/50 dark:bg-gray-800/60 rounded-lg p-3 sm:p-4 shadow-sm">
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <!-- Left: go-back button + avatar + name -->
    <div class="flex items-start sm:items-center gap-3 min-w-0">
      <!-- Go back button -->
      <button
        @click.prevent="goBack()"
        type="button"
        aria-label="Go back"
        class="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center border border-gray-200 dark:border-gray-600 transition"
      >
        <svg class="w-4 h-4 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div class="flex items-start sm:items-center gap-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20a8 8 0 0116 0" />
            </svg>
          </div>
        </div>

        <div class="min-w-0">
          <p class="text-sm sm:text-base font-semibold leading-tight text-gray-900 dark:text-gray-100 truncate">
            <span class="text-gray-500 dark:text-gray-400 font-medium mr-1">Name:</span>
            {{ state.customer.name }}
          </p>
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Customer details</p>
        </div>
      </div>
    </div>

    <!-- Middle: totals as compact pills (wrap on small screens) -->
    <div class="flex flex-wrap items-center gap-2 justify-start sm:justify-center w-full sm:w-auto">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800">
        <svg class="w-4 h-4 text-red-600 dark:text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v8m4-4H8" />
        </svg>
        <div class="text-xs sm:text-sm leading-none">
          <div class="font-semibold text-red-700 dark:text-red-200">Credit</div>
          <div class="text-[11px] text-gray-600 dark:text-gray-300">Rs.{{ state.total_credit }}</div>
        </div>
      </div>

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
        <svg class="w-4 h-4 text-green-600 dark:text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12l4 4L19 6" />
        </svg>
        <div class="text-xs sm:text-sm leading-none">
          <div class="font-semibold text-green-700 dark:text-green-200">Paid</div>
          <div class="text-[11px] text-gray-600 dark:text-gray-300">Rs.{{ state.total_paid }}</div>
        </div>
      </div>

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
        <svg class="w-4 h-4 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6l4 2" />
        </svg>
        <div class="text-xs sm:text-sm leading-none">
          <div class="font-semibold text-blue-700 dark:text-blue-200">Remaining</div>
          <div class="text-[11px] text-gray-600 dark:text-gray-300">Rs.{{ state.total_credit - state.total_paid }}</div>
        </div>
      </div>
    </div>

    <!-- Right: Make Payment CTA (stacks on mobile for easy tap) -->
    <div class="w-full sm:w-auto">
      <button
        @click.prevent="viewPayment(state.customer.id)"
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        aria-label="Open payment dialog"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 6h10l1 2H6l1-2zM5 18h14a2 2 0 002-2V8H3v8a2 2 0 002 2z" />
        </svg>
        <span class="text-sm">Make Payment</span>
      </button>
    </div>
  </div>
</div>

<hr class="my-4 border-t border-gray-200 dark:border-gray-700" />



    <hr class="my-3 border-gray-300" />

    <!-- Table Section -->
    <div
      v-if="state.sales.length > 0"
      class="relative overflow-x-auto shadow-md sm:rounded-lg bg-gray-50"
    >
      <table
        class="min-w-full text-xs sm:text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 text-center"
      >
        <thead
          class="text-[10px] sm:text-xs md:text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-3 sm:px-6 py-3">Id</th>
            <th scope="col" class="px-3 sm:px-6 py-3">Created-Date</th>
            <th scope="col" class="px-3 sm:px-6 py-3">Total</th>
            <th scope="col" class="px-3 sm:px-6 py-3">Discount</th>
            <th scope="col" class="px-3 sm:px-6 py-3">Grand-Total</th>
            <th scope="col" class="px-3 sm:px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="sale in state.sales"
            :key="sale.id"
            class="bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 transition-all"
          >
            <th
              scope="row"
              class="px-2 sm:px-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ sale.id }}
            </th>
            <td class="px-2 sm:px-4 py-1">
              {{ formatDate(sale.created_at) }}
            </td>
            <td class="px-2 sm:px-4 py-1">Rs.{{ sale.total }}</td>
            <td class="px-2 sm:px-4 py-1">Rs.{{ sale.discount }}</td>
            <td class="px-2 sm:px-4 py-1">
              Rs.{{ sale.total - sale.discount }}
            </td>

            <td v-if="sale.cancel == null" class="px-2 sm:px-4 py-1">
              <button
                @click.prevent="printSale(sale.id)"
                class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[10px] sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 text-center mb-1 transition-all"
              >
                Print
              </button>
            </td>

            <td v-else class="px-2 sm:px-4 py-1 text-red-600 font-bold">
              Canceled
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 sm:gap-3 p-3"
        v-if="state.pagination.prevPageUrl || state.pagination.nextPageUrl"
      >
        <a
          v-if="state.pagination.prevPageUrl"
          @click="fetchCreditcredits(state.pagination.prevPageUrl)"
          class="flex items-center justify-center px-3 h-8 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer"
        >
          Previous
        </a>

        <a
          v-if="state.pagination.nextPageUrl"
          @click="fetchCreditcredits(state.pagination.nextPageUrl)"
          class="flex items-center justify-center px-3 h-8 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer"
        >
          Next
        </a>
      </div>
    </div>

    <!-- No Data -->
  <div
    v-else
    class="flex flex-col items-center justify-center h-[60vh] text-center"
  >
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      alt="No Data"
      class="w-32 h-32 opacity-70 mb-4"
    />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">No Credit Found</h2>
    <p class="text-gray-500">
      <!-- Try adding new credit to see them listed here. -->
    </p>
  </div>

    <!-- Print component (hidden) -->
    <SalePrint ref="printRef"
    />
   
  </div>
</template>


 <script setup>
 import api from '@/plugins/axios';   
 import { onMounted, reactive,computed,defineProps,ref } from 'vue';
 import axios from 'axios';
 import SalePrint from '@/components/print/SalePrint.vue';
 import { formatDate } from '@/utils/formatDate';
import { VueSpinnerDots } from "vue3-spinners";
import { toast } from "@/utils/toast";
 import { useRouter,RouterLink,useRoute} from 'vue-router';
 const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const printRef = ref(null);
 const router = useRouter();
 const route = useRoute();

 const showPrintModal = ref(false);
 const customer_id = ref(route.params.id);
 const isLoading = ref(false)
 const state = reactive({
   credits: [],
   sales:[],
   customer:[],
   shop:{name:'',address:'',phone:''},
   total_credit:0,
   total_paid:0,
   pagination: {
     currentPage: 1,
     lastPage: 1,
     nextPageUrl: null,
     prevPageUrl: null,
   },
 });




 onMounted(async () =>{
 fetchCreditsCustomer();
 })

 const fetchCreditsCustomer = async (url =`/credit/customer/${customer_id.value}`) => {

  isLoading.value = true;
 try {
     
     const response = await api.get(url)
     state.credits = response.data.data.data;
     state.sales = response.data.data.Sales;
     state.customer = response.data.data.Customer;
     state.total_credit = response.data.data.CreditDetail.total_credit;
     state.total_paid = response.data.data.CreditDetail.total_paid;
     console.log('inside state ',state.customer);
 } catch (error) {
     console.log('Error fetching customers',error)
 }
 finally{
  isLoading.value = false;
 }
 }
//-----View payments list
 const viewPayment = async (id) => {

    //  console.log('view payment',id);
    router.push({name:"admin.customer-payments",params:{id:id}})
    }



const goBack = () => {
  router.go(-1); // Navigates back to the previous page in history
};

const printSale = async (id) => {

  // console.log('print Sale->',id)
  try {
    const res = await api.get("/sales", { params: { search: id } });
    const sale = res.data.data.data.find(s => s.id === id);
    if (!sale) return;

      console.log('print Sale->',sale)

    // Pass sale object to child print method
    if (printRef.value) {
      printRef.value.print(sale);
    }
  } catch (e) {
    console.error("Print error", e);
  }
};

const getAbout = async (url =`${apiBaseUrl}/about`)=>{
  const response = await axios.get(url)

  state.shop.name = response.data.name
  state.shop.address = response.data.address
  state.shop.phone = response.data.phone
}



 </script>
