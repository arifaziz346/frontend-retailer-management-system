<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-md z-50"
  >
    <div class="flex flex-col items-center">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <p class="mt-4 text-blue-600 text-sm font-semibold tracking-wide animate-pulse uppercase">
        Loading data...
      </p>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Credit Customers
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Manage and view customer credit history</p>
      </div>
      <div class="w-full md:w-72">
        <SearchBar @input="handleSearch" />
      </div>
    </div>

    <div v-if="state.customers.length > 0" class="space-y-4 sm:hidden">
      <div
        v-for="customer in state.customers"
        :key="customer.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
      >
        <div class="p-4">
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                {{ customer.name.charAt(0) }}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-gray-900 dark:text-gray-100 truncate">{{ customer.name }}</h3>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 uppercase font-medium">ID: {{ customer.id }}</span>
              </div>
            </div>
            <button
              @click.prevent="viewCustomerCredits(customer.id)"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              VIEW
            </button>
          </div>
          
          <div class="space-y-2 border-t border-gray-50 dark:border-gray-700 pt-3">
            <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span class="w-16 font-medium text-gray-400">Phone:</span> {{ customer.phone_one || '—' }}
            </div>
            <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span class="w-16 font-medium text-gray-400">Address:</span> <span class="truncate">{{ customer.address || 'No address' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="state.customers.length > 0" class="hidden sm:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
            <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created Date</th>
            <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="customer in state.customers" :key="customer.id" class="hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-colors group">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">#{{ customer.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ customer.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{{ customer.address }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
              {{ customer.phone_one }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(customer.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click.prevent="viewCustomerCredits(customer.id)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
              >
                View History
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="state.customers.length === 0" class="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-full shadow-xl mb-6">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Data" class="w-24 h-24 grayscale opacity-40" />
      </div>
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">No Records Found</h2>
      <p class="text-gray-500 dark:text-gray-400 max-w-xs text-center">We couldn't find any credit customers matching your search or filters.</p>
    </div>

    <div class="mt-8 flex justify-center">
      <Pagination :pagination="state.pagination" @page-change="fetchCreditCustomers" />
    </div>
  </div>
</template>


<script setup>
import api from "@/plugins/axios";
import SearchBar from '@/components/SearchBar.vue';
import { onMounted, reactive,computed,ref } from 'vue';
import axios from 'axios';
import { formatDate } from '@/utils/formatDate';
import { VueSpinnerDots } from "vue3-spinners";
import { toast } from "@/utils/toast";
import Pagination from "@/components/admin/Pagination.vue";
import { useRouter,RouterLink,useRoute } from 'vue-router';
// import logo from '@/icons/rms-logo.png';
 const router = useRouter();
 const route = useRoute();
 const isLoading = ref(false)
// const toast = useToast();
const state = reactive({
  customers: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});






const fetchCreditCustomers = async (url = `/credit/customers`) => {
try {
     isLoading.value = true
     const response = await api.get(url)
     state.customers = response.data.data.data;
     console.log('creadit view----',response.data);

     const paginated = response.data.data;
     console.log('paginated', paginated.current_page);
    // If backend returns resource collection, adjust accordingly
    state.pagination.currentPage = paginated.current_page ?? 1;
    state.pagination.lastPage = paginated.last_page ?? 1;
    state.pagination.nextPageUrl = paginated.next_page_url ?? null;
    state.pagination.prevPageUrl = paginated.prev_page_url ?? null;

} catch (error) {
    console.log('Error fetching customers',error)
}

finally{
    isLoading.value = false
}
}

const viewCustomerCredits =  (id) =>{
        router.push({name:'admin.credits-customer',params:{id: id}});
}

const handleSearch = async (query) => {
  console.log('Search query:', query);
  try {
    const url = query
      ? `/credit/customers?search=${encodeURIComponent(query)}`
      : `/credit/customers`;

    const response = await api.get(url);
    console.log(response.data);

    state.customers = response.data.data.data;
    state.pagination.currentPage = response.data.current_page;
    state.pagination.lastPage = response.data.last_page;
    state.pagination.nextPageUrl = response.data.next_page_url;
    state.pagination.prevPageUrl = response.data.prev_page_url;

  } catch (error) {
    console.log('Error searching customers', error);
  }
};


onMounted(async () =>{
fetchCreditCustomers();
})
</script>
