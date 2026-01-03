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
     
    <!-- <div class="flex flex-row md:flex-row justify-between items-center bg-white">
      <div class="relative flex items-center mb-4 md:mb-0"> -->
        <!-- <p class="font-bold text-white text-xs md:text-xl rounded-sm bg-gray-800 p-1 border">Name: {{state.employee_name}}</p> -->
      <!-- </div>
      <div class="relative flex items-center mb-4 md:mb-0">
        <p class="font-bold underline text-xs md:text-xl">Accounts</p>
      </div>
      <div class="flex flex-row gap-1">
        <button @click="openModal('Create Account', 'create',null)" type="button"
            class="text-blue-800 hover:text-white border border-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-1 md:py-1.5 py-0.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Account+</button>
      </div>
    </div> -->
    <!-- Header -->
    <header
  class="flex flex-col sm:flex-row sm:items-center sm:justify-between
         bg-white border-b border-gray-200 px-4 py-3 shadow-sm rounded-lg"
>
  <!-- Left: Back + Breadcrumb -->
  <div class="flex items-center gap-3">
    <!-- Back Arrow -->
    <button
  @click="$router.back()"
  class="flex items-center justify-center w-9 h-9 rounded-full
         hover:bg-gray-100 transition"
>
  <i class="pi pi-arrow-left text-lg text-gray-700 hover:text-blue-600 hover:cursor-pointer"></i>
</button>


    <!-- Breadcrumb -->
    <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
      <router-link
        to="/admin/accounts"
        class="flex items-center hover:text-blue-600 transition-colors"
      >
        <i class="pi pi-home mr-1 text-2xl"></i>
        <span class="hidden sm:inline">Account</span>
      </router-link>
    </nav>
  </div>

  <!-- Right: Add Button -->
  <Button
    variant="primary"
    size="sm"
    class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
           text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
    @click="() => { resetForm(); isEditAccount = false; openModal() }"
  >
    <i class="pi pi-plus text-sm"></i>
    <span>Account</span>
  </Button>
</header>


    <div v-if="state.accounts && state.accounts.length" class="w-full overflow-x-scroll border border-gray-300 rounded-md shadow-sm">
            <div class="w-full bg bg-gray-800 text-white p-1.5">
                <i class="pi pi-home mr-1 text-md"> Account List</i></div>
          <table class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <!-- <th class="px-4 py-2 text-left font-semibold">#</th> -->
                <th class="px-4 py-2 text-left font-semibold">Created-Date</th>
                
                <th class="px-4 py-2 text-left font-semibold">Account-Name</th>
                <th class="px-4 py-2 text-left font-semibold">Account-Number</th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Balance</th> -->
                
                <th class="px-4 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(account, index) in state.accounts"
                :key="account.id"
                class="border-t border-t-gray-300 hover:bg-gray-50 transition ext-sm text-xs"
              >
                <!-- <td class="px-4 py-2 font-medium text-gray-800">{{ index + 1 + (state.pagination.currentPage - 1) * perPage }}</td> -->
                <td class="px-4 py-2 text-gray-700">{{formatDate(account.created_at) || '-' }}</td>

                

                <td class="px-4 py-2 text-gray-700">{{ account.account_name || '-' }}</td>
                <td class="px-4 py-2 font-medium text-gray-900">{{ account.account_number || '-' }}</td>
                <!-- <td class="px-4 py-2 text-gray-700">Rs.{{ account.balance || '0' }}</td> -->

                

                

                <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">

  <!-- VIEW -->
  <!-- <button
    @click="viewAccountDetail(account)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow text-xs"
  >
    <i class="pi pi-eye text-base"></i>
    <span>View</span>
  </button> -->

  <!-- EDIT -->
  <button
    @click="editAccount(account)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-pencil text-base"></i>
    <span>Edit</span>
  </button>

  <!-- DELETE -->
  <button
    @click="deleteAccount(account.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-trash text-base"></i>
    <span>Delete</span>
  </button>

</td>


              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <Pagination
            :pagination="state.pagination"
            @page-change="fetchSuppliers"
          />
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
    <h2 class="text-xl font-semibold text-gray-700 mb-2">No Accounts Found</h2>
    <p class="text-gray-500">
      Try adding new account to see them listed here.
    </p>
  </div>

  
  <!-- Modal -->
   <BaseModal
  v-model="showModal"
  title="Create Account"
  @save="() => (createAccount(), isEditAccount = false)"
  :disableSaveBtn="isLoading"
   >

  <!-- FORM WRAPPER -->
  <div class="w-full max-w-full overflow-x-hidden">

    <!-- Account Name -->
    <div class="mb-4">
      <label
        for="account_name"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Account Name
      </label>

      <input
        type="text"
        v-model="form.account_name"
        id="account_name"
        class="block w-full max-w-full bg-gray-50 border border-gray-300
               text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500
               p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      <p v-if="account_nameError" class="mt-1 text-sm text-red-600">
        Account name is required
      </p>
    </div>

    <!-- Account Number -->
    <div class="mb-4">
      <label
        for="account_number"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Account Number
      </label>

      <input
        type="text"
        v-model="form.account_number"
        id="account_number"
        class="block w-full max-w-full bg-gray-50 border border-gray-300
               text-gray-900 text-sm rounded-lg
               focus:ring-blue-500 focus:border-blue-500
               p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
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

const fetchAccounts = async (id) => {
try {
  isLoading.value = true;
  const response = await api.get(`/accounts`);
  const data = response.data.data.data;
  // console.log('account-',data);
  state.accounts = data;
  // state.employee_name = data.employee.name;
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
