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
  <div v-else class="bg-white p-4 rounded shadow m-1 shadow-1xl h-auto">
  
      <div class="flex flex-row md:flex-row justify-between items-center bg-white">
        <div class="relative flex items-center mb-4 md:mb-0">
          <p class="font-bold text-white text-xs md:text-xl rounded-sm bg-gray-800 p-1 border">Name: {{state.employee_name}}</p>
        </div>
        <div class="relative flex items-center mb-4 md:mb-0">
          <p class="font-bold text-white text-xs md:text-xl rounded-sm bg-gray-800 p-1 border">Account: {{state.account_name}}</p>
        </div>
        <div class="relative flex items-center mb-4 md:mb-0">
          <p class="font-bold text-white text-xs md:text-xl rounded-sm bg-gray-800 p-1 border">Balance: Rs.{{totalDeposit-totalWithdraw}}</p>
        </div>
      </div>
      
      <!-- Table with responsive design -->
      <div v-if="state.transactions.length > 0" class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-[9px] md:text-xs text-left text-gray-500 dark:text-gray-400">
          <thead class="text-[9px] md:text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-4 py-2">Date</th>
              <th scope="col" class="px-4 py-2">Transaction</th>
              <th scope="col" class="px-4 py-2">Amount</th>
              <th scope="col" class="px-4 py-2">Profit</th>
              <th scope="col" class="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in state.transactions" class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
              <td class="px-4 py-2">{{formatDate(transaction.created_at)}}</td>
              <td class="px-4 py-2">
  <i v-if="transaction.transaction_type === 'Deposit'" class="pi pi-arrow-up" style="color: slateblue">
    {{ transaction.transaction_type }}
  </i>
  <i v-else class="pi pi-arrow-down" style="color: red">
    {{ transaction.transaction_type }}
  </i>
</td>

              <td class="px-4 py-2">{{transaction.amount}}</td>
              <td class="px-4 py-2">{{transaction.profit}}</td>
              <td class="px-4 py-2 flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-2">
                <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline" @click.prevent="editTransactionModal(transaction)">Edit</a>
                <a href="#" class="text-red-600 dark:text-red-500 hover:underline"
                  :disabled="state.isDeleting"
                  @click.prevent="deleteItem(transaction.id)">{{state.isDeleting ? 'Wait...' : 'Delete'}}</a>
                  <a href="#" class="text-teal-600 dark:text-teal-500 hover:underline" @click.prevent="viewTransactionModal(transaction)">View</a>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-else class="text-center">
        <p class="text-red-600">Data not found</p>
      </div>
      
      <!------------------------------------Pagination------------------------------->  
      <div class="flex m-1 justify-end" v-if="state.pagination.prevPageUrl || state.pagination.nextPageUrl">
        <a 
          v-if="state.pagination.prevPageUrl"
          @click="accountFetch(state.pagination.prevPageUrl)" 
          class="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          Previous
        </a>
        <a 
          v-if="state.pagination.nextPageUrl"
          @click="accountFetch(state.pagination.nextPageUrl)" 
          class="flex items-center justify-center px-3 h-8 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          Next
        </a>
      </div>

      <!---------------------------edit transaction modal-------------------------------->
    <VModal v-if="showModal" title="Edit-Transaction" width="sm" @close="showModal = false">
      <form class="max-w-sm mx-auto p-1 mt-0" @submit.prevent="editTransaction"> 
        <div class="m-1">
          <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
          <input type="text" id="amount" v-model="form.amount"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :class="amount || keys.amount ? 'border-red-600' : 'border-gray-300'">
          <p class="mt-2 text-sm text-red-600" v-if="keys.amount">{{ keys.amount }}</p>
        </div>
        <div class="m-1">
          <label for="profit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profit</label>
          <input type="number" id="profit" v-model="form.profit"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :class="profit || keys.profit ? 'border-red-600' : 'border-gray-300'">
          <p class="mt-2 text-sm text-red-600" v-if="keys.profit">{{ keys.profit }}</p>
        </div>
        <div class="m-1">
          <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Note</label>
          <input type="text" id="description" v-model="form.description"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :class="description || keys.description ? 'border-red-600' : 'border-gray-300'">
          <p class="mt-2 text-sm text-red-600" v-if="keys.description">{{ keys.description }}</p>
        </div>
        <div class="text-right mt-4">
          <button type="submit" 
            @click="form.transaction_type = 'Withdraw'"
            class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-600 focus:outline-none hover:bg-red-600"
            :disabled="state.isLoading">
            {{ state.isLoading ? 'Wait' : 'Withdraw' }}
          </button>
          <button type="submit" 
            @click="form.transaction_type = 'Deposit'"
            class="mr-2 px-4 py-2 text-sm rounded text-white bg-teal-600 focus:outline-none hover:bg-teal-600"
            :disabled="state.isLoading">
            {{ state.isLoading ? 'Wait' : 'Deposit' }}
          </button>
        </div>
      </form>
    </VModal>

    <!-------------------------------View Transaction Modal------------------------------>
    <VModal v-if="showViewModal" title="Transaction Details" width="sm" @close="showViewModal = false">
      <div class="p-4">
        <p><strong>Name:</strong> {{ state.employee_name}}</p>
        <p><strong>Account:</strong> {{ state.account_name }}</p>
        <p><strong>Date:</strong> {{ formatDate(viewedTransaction.created_at) }}</p>
        <p><strong>Transaction Type:</strong> {{ viewedTransaction.transaction_type }}</p>
        <p><strong>Amount:</strong> Rs.{{ viewedTransaction.amount }}</p>
        <p><strong>Profit:</strong> Rs.{{ viewedTransaction.profit }}</p>
        <p><strong>Description:</strong> {{ viewedTransaction.description || 'N/A' }}</p>
      </div>
      <div class="text-right mt-4">
        <button @click="showViewModal = false" class="px-4 py-2 text-sm rounded text-white bg-teal-600 focus:outline-none hover:bg-teal-700">
          Close
        </button>
      </div>
    </VModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import VModal from '@/components/VModal.vue';
import { VueSpinnerDots } from "vue3-spinners";
import { toast } from '@/utils/toast';
import { RouterLink,useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { formatDate } from '@/utils/formatDate';

import api from '@/plugins/axios';
import { formatDate } from '@/utils/formatDate';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
const route = useRoute();
const state = reactive({
  transactions: [],
  employee_name: '',
  account_name: '',
  pagination: {
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
  },
  isLoading: false,
  isDeleting: false,
});
const showViewModal = ref(false); // New ref for the View modal
const viewedTransaction = reactive({}); // Store the transaction to view details
const showModal = ref(false);
const form = reactive({  
  amount: 0,
  profit: 0,
  description: '',
  id: '',
  transaction_type: '',
  hide_transaction_button:''
});

function viewTransactionModal(transaction) {
  showViewModal.value = true;
  Object.assign(viewedTransaction, transaction);
}

const keys = reactive({
  amount: '',
  profit: '',
  description: '',
});

  const amount = ref(false);
  const profit = ref(false);
  const description = ref(false);

const totalDeposit = computed(() => {
  return state.transactions
    .filter(transaction => transaction.transaction_type === "Deposit")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
});

const totalWithdraw = computed(() => {
  return state.transactions
    .filter(transaction => transaction.transaction_type === "Withdraw")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
});

const fetchTransactions = async(url=`account-detail/${route.params.id}`) =>{
      try {
      state.isloading = true
      const response = await api.get(`${apiBaseUrl}/${url}`);

      const employee_detail = response.data.employee_detail
      state.employee_name = employee_detail.employee_name
      state.account_name = employee_detail.account_name
      state.transactions = response.data.transactions

       //--this if for pgination
    const data = response.data
    // console.log('test-pagination',response.data)
    state.pagination.currentPage = data.current_page;
    state.pagination.lastPage = data.last_page;
    state.pagination.nextPageUrl = data.next_page_url;
    state.pagination.prevPageUrl = data.prev_page_url;
    //   state.transactions = response.data.data;
      console.log('state.transactions-',employee_detail);

     } catch (error) {
      console.log('error fetching  transactions', error);
     }
    finally{
      state.isloading = false
    }

     }

async function deleteItem(transactionId) {
  try {
    state.isDeleting = true;
    await api.delete(`/transactions/${transactionId}`);
    state.transactions = state.transactions.filter(transaction => transaction.id !== transactionId);
    toast.success('Transaction deleted successfully');
    // fetchTransactions();
  } catch (error) {
    toast.error('Error deleting transaction');
  } finally {
    state.isDeleting = false;
  }
}

function editTransactionModal(transaction) {
  showModal.value = true;
  form.id = transaction.id;
  form.amount = transaction.amount;
  form.profit = transaction.profit;
  form.description = transaction.description;
  form.transaction_type = transaction.transaction_type;
  form.hide_transaction_button = transaction.transaction_type;
}

async function editTransaction() {
  try {
    state.isLoading = true;
    const { amount, profit, transaction_type, description } = form;
    const formData = { amount, profit, transaction_type, description };
    
    const response = await api.put(`/transactions/${form.id}`, formData);
    const data = response.data;
    console.log(data);
    
    if (data.success) {
      toast.success(data.message);
      fetchTransactions();
      resetForm()
      showModal.value = false;
    } else {
      console.log(data.message);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      const data = error.response.data;
      console.log('Error');

      // Check if 'keys' is defined, if it isn't, replace or define it accordingly
      if (typeof keys !== 'undefined' && data.hasOwnProperty('key') && keys.hasOwnProperty(data.key)) {
        keys[data.key] = data.message;
        toast.error(`${data.message}`);
      } else {
        toast.error(data.message || 'An error occurred');
      }
    } else {
      toast.error('An unexpected error occurred');
    }
  } finally {
    state.isLoading = false;
  }
}

// Reset form function
const resetForm = () => {
  form.amount = 0,
  form.profit = 0,
  form.description= '',
  form.id= '',
  form.transaction_type= '',
  form.hide_transaction_button=''}

fetchTransactions();
</script>
