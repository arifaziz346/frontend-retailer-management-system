<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
      <VueSpinnerDots size="40px" color="#2563eb" />
      <span class="text-xs font-bold text-blue-600 mt-4 tracking-widest uppercase">Loading Accounts</span>
    </div>
  </div>

  <div v-else class="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
    
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition active:scale-95"
        >
          <i class="pi pi-arrow-left text-slate-600"></i>
        </button>
        <div>
          <nav class="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <router-link to="/admin" class="hover:text-blue-600 transition">Admin</router-link>
            <i class="pi pi-chevron-right text-[10px] mx-2"></i>
            <span class="text-slate-600">Accounts</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Account Management</h1>
        </div>
      </div>

      <button
        @click="() => { resetForm(); isEditAccount = false; openModal() }"
        class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all font-bold text-sm"
      >
        <i class="pi pi-plus-circle text-lg"></i>
        <span>Add New Account</span>
      </button>
    </header>

    <div v-if="state.accounts?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Total Accounts</span>
          <i class="pi pi-wallet text-blue-500"></i>
        </div>
        <p class="text-2xl font-black text-slate-800">{{ state.accounts.length }}</p>
      </div>
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Active Status</span>
          <i class="pi pi-check-circle text-green-500"></i>
        </div>
        <p class="text-2xl font-black text-slate-800">Operational</p>
      </div>
    </div>

    <div v-if="state.accounts && state.accounts.length" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Created Date</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Account Name</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Account Number</th>
              <th class="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="account in state.accounts"
              :key="account.id"
              class="hover:bg-blue-50/30 transition-colors group"
            >
              <td class="px-6 py-4 text-sm text-slate-500 font-medium">
                {{ formatDate(account.created_at) || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                    {{ account.account_name?.charAt(0) }}
                  </div>
                  <span class="text-sm font-bold text-slate-700">{{ account.account_name || '-' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-mono text-sm border border-slate-200">
                  {{ account.account_number || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-center items-center gap-2">
                  <button
                    @click="editAccount(account)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Account"
                  >
                    <i class="pi pi-pencil text-sm"></i>
                  </button>
                  <button
                    @click="deleteAccount(account.id)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Account"
                  >
                    <i class="pi pi-trash text-sm"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-slate-50/50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
        <span class="text-xs text-slate-500 font-medium">Showing {{ state.accounts.length }} items</span>
        <Pagination
          :pagination="state.pagination"
          @page-change="fetchAccounts"
        />
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
      <div class="bg-slate-50 p-6 rounded-full mb-6">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No Data" class="w-24 h-24 grayscale opacity-40" />
      </div>
      <h2 class="text-2xl font-bold text-slate-800 mb-2">No Accounts Linked</h2>
      <p class="text-slate-500 text-center max-w-xs mb-8">Establish your financial workspace by adding your first bank or cash account.</p>
      <button @click="openModal" class="text-blue-600 font-bold hover:underline flex items-center gap-2">
        <i class="pi pi-plus"></i> Add Account Now
      </button>
    </div>

    <BaseModal
      v-model="showModal"
      :title="isEditAccount ? 'Update Account' : 'Register New Account'"
      @save="() => (createAccount(), isEditAccount = false)"
      :disableSaveBtn="isLoading"
    >
      <div class="space-y-6 pt-2 pb-4">
        <div>
          <label for="account_name" class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Official Account Name
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <i class="pi pi-user text-sm"></i>
            </span>
            <input
              type="text"
              v-model="form.account_name"
              id="account_name"
              placeholder="e.g. HBL Corporate"
              class="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          <p v-if="account_nameError" class="mt-2 text-[11px] font-bold text-red-500 flex items-center gap-1">
            <i class="pi pi-exclamation-circle"></i> Account name is required
          </p>
        </div>

        <div>
          <label for="account_number" class="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Account / IBAN Number
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <i class="pi pi-credit-card text-sm"></i>
            </span>
            <input
              type="text"
              v-model="form.account_number"
              id="account_number"
              placeholder="0000 0000 0000 0000"
              class="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute,useRouter } from 'vue-router';
const router = useRouter();
import { formatDate } from '@/utils/helper';
import { VueSpinnerDots } from "vue3-spinners";
import { toast } from '@/utils/toast';
import BaseModal from '@/components/BaseModal.vue'; 
import api from '@/plugins/axios';
import Pagination from '@/components/admin/Pagination.vue';
const route = useRoute();

const showModal = ref(false);
const isLoading = ref(false);
const isEditAccount = ref(false);
const state = reactive({
accounts: [],
modal_action: '',
employee_name: '',
pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  }
});

const form = reactive({
id:'', 
account_name: '',
account_number:''
});

const account_nameError = ref(false);


const openModal = () =>{
  isEditAccount.value = true
  showModal.value = true
 
}


const editAccount = (account) =>{
  
form.id = account.id
form.account_name = account.account_name,
form.account_number = account.account_number
isEditAccount.value = false;
showModal.value = true
}



 





const deleteAccount = async (id)=>{
  if(confirm('Do you want to delete..?')){
    console.log('delete-id',id)
  try {
    const response = await api.delete(`/accounts/${id}`);
    const data = response.data;
  if (data.success) {
    toast.success(data.message);
    // Reset
  fetchAccounts(form.employee_id);
  }
  } catch (error) {
    console.log('fail to deleting account-',error)
  }
}
}

// const openModal = (title, action,account=null) => {
//   account_nameError.value = false 
// if(action === 'create'){
//    // Reset
//    Object.assign(form, {id:'',account_name: '' });
   
//   //it is used for create
//  showModal.value = true;
// //  state.modal_action = action;
// }else{
//   //it is used for edit
//   showModal.value = true;
//   modal_title.value = title;
//   state.modal_action = action;
//   showModal.value = true
//   
// }

// };

// const editViewModal = (account)=>{
  
  

  
// }

const createAccount = async () => {
    //  console.log('inside create-Account 0')
  if(!validateForm()){
try {
    //  console.log('inside create-Account 1')
  isLoading.value = true;
  let response = ''

  if (isEditAccount.value) {
    response =  await api.post(`/accounts`, form);
  } else {
    response =  await api.put(`/accounts/${form.id}`, form);
    
    
  }
  // const response = await axios.post(`${apiBaseUrl}/accounts`, form);
  // console.log('inside create-Account',response)
  const data = response.data;
  if (data.success) {
    showModal.value = false;
    toast.success(data.message);
    // Reset
  

    fetchAccounts(form.employee_id);
    Object.assign(form, { employee_id: '', account_name: '' });
  }
} catch (error) {
  console.log('error creating account', error);
} finally {
  isLoading.value = false;
}
}
};

const validateForm = () => {
account_nameError.value = form.account_name.trim() === '';
if (account_nameError.value) {
  console.log('log is empty')
 return true
}else{
  console.log('log is not empty')
  return false
}
};

const viewAccountDetail = (id)=>{

  router.push({ name: 'account-detail', params:{ id: id } });  // Programmatic navigation
}

const fetchAccounts = async (url=`/accounts`) => {
try {
  isLoading.value = true;
  const response = await api.get(url);
  const data = response.data.data.data;
  // console.log('account-',data);
  state.accounts = data;
  // state.employee_name = data.employee.name;
  const paginated = response.data.data;
  state.pagination.currentPage = paginated.current_page ?? 1;
  state.pagination.lastPage = paginated.last_page ?? 1;
  state.pagination.nextPageUrl = paginated.next_page_url ?? null;
  state.pagination.prevPageUrl = paginated.prev_page_url ?? null;
  
} catch (error) {
  console.log('error fetching accounts', error);
}
finally{
  isLoading.value = false;
}
};

const resetForm =()=>{
  form.account_name='';
  form.account_number=''; 
  
}

onMounted(async () => {

// form.employee_id = route.params.id;
fetchAccounts(form.employee_id);
});
</script>

<style scoped>
/* Additional styling can be added here if needed */
</style>
