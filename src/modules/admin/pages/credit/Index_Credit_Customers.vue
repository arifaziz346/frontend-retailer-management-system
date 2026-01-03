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

    <!-- Content -->
    <div v-else class="mt-3">
        <div class="flex  justify-between flex-col md:flex-row items-center mb-4">
            <div></div>
            <div class="text-center justify-center items-center font-bold text-lg mb-3">Credit Customers</div>
               <SearchBar class="md:w-1/4" @input="handleSearch" />
            </div>

      <!-- MOBILE: card list -->
      <div v-if="state.customers.length > 0" class="space-y-3 sm:hidden px-2">
        <div
          v-for="customer in state.customers"
          :key="customer.id"
          class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-3 flex flex-col gap-2"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20a8 8 0 0116 0" />
                </svg>
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                    {{ customer.name }}
                  </h3>
                  <span class="text-[11px] text-gray-400">•</span>
                  <span class="text-[11px] text-gray-500 truncate">ID: {{ customer.id }}</span>
                </div>

                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {{ customer.address || 'No address' }}
                </p>
              </div>
            </div>

            <!-- action -->
            <div class="flex-shrink-0">
              <button
                @click.prevent="viewCustomerCredits(customer.id)"
                type="button"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              >
                View
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 pt-1">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 2v6h6" /></svg>
              <span>{{ formatDate(customer.created_at) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7 6 7-6" /></svg>
              <span class="truncate">{{ customer.phone || '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DESKTOP / TABLET: classic table (hidden on small screens) -->
      <div class="hidden sm:block overflow-x-auto shadow-md rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created-Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            <tr v-for="customer in state.customers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-900">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ customer.id }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(customer.created_at) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ customer.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ customer.phone_one }}</td>
              <td class="px-4 py-3 truncate text-sm text-gray-600 dark:text-gray-300 max-w-xs">{{ customer.address }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <button
                  @click.prevent="viewCustomerCredits(customer.id)"
                  type="button"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
       <!-- No Data -->
  <div
    v-if="state.customers.length === 0"
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
      <!-- <div v-if="state.customers.length === 0" class="text-center text-red-700 py-6">
        Data not found!
      </div> -->

      <!-- Pagination (shared) -->
      <div v-if="state.pagination.prevPageUrl || state.pagination.nextPageUrl" class="flex items-center justify-end gap-2 mt-3 px-2">
        <button
          v-if="state.pagination.prevPageUrl"
          @click.prevent="fetchCreditCustomers(state.pagination.prevPageUrl)"
          type="button"
          class="px-3 h-8 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Previous
        </button>

        <button
          v-if="state.pagination.nextPageUrl"
          @click.prevent="fetchCreditCustomers(state.pagination.nextPageUrl)"
          type="button"
          class="px-3 h-8 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Next
        </button>
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
    lastPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
  },
});






const fetchCreditCustomers = async (url = `/credit/customers`) => {
try {
    isLoading.value = true
    const response = await api.get(url)
     state.customers = response.data.data.data;
    console.log('creadit view----',response.data);

    state.pagination.currentPage = response.data.current_page;
    state.pagination.lastPage = response.data.last_page;
    state.pagination.nextPageUrl = response.data.next_page_url;
    state.pagination.prevPageUrl = response.data.prev_page_url;

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
