<template>
  <div class="flex flex-col min-h-screen bg-slate-50 font-sans">
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <VueSpinnerDots size="50px" color="#2563eb" />
    </div>

    <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Customers</h1>
          <p class="text-sm text-slate-500">Manage customer records, NICs, and contact details</p>
        </div>
        <button
          @click="openModal(),editMode=false"
          class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>New Customer</span>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto w-full p-6">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Contact Info</th>
                <th class="px-6 py-4">NIC Number</th>
                <th class="px-6 py-4">Address</th>
                <th class="px-6 py-4 text-center">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="customer in state.customers.data" :key="customer.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-slate-500 font-mono text-xs">#{{ customer.id }}</td>
                <td class="px-6 py-4">
                  <span class="font-bold text-slate-900">{{ customer.name }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <span class="flex items-center gap-2 text-slate-700">
                      <i class="pi pi-phone text-[10px] text-blue-500"></i> {{ customer.phone_one }}
                    </span>
                    <span v-if="customer.phone_two" class="flex items-center gap-2 text-slate-500 text-xs">
                      <i class="pi pi-phone text-[10px] text-slate-400"></i> {{ customer.phone_two }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border border-slate-200 uppercase">
                    {{ customer.nic || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 max-w-xs truncate text-slate-600">
                  {{ customer.address || '---' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]">
                    {{ customer.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="editCustomer(customer)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button @click="deleteCustomer(customer.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
          <Pagination
            :pagination="state.pagination"
            @page-change="fetchCustomers"
          />

        <!-- <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span class="text-xs text-slate-500">Page {{ state.customers.current_page }} of {{ state.customers.last_page }}</span>
          <div class="flex gap-2">
            <button
              @click="fetchCustomers(state.customers.prev_page_url)"
              :disabled="!state.customers.prev_page_url"
              class="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium disabled:opacity-50"
            >Prev</button>
            <button
              @click="fetchCustomers(state.customers.next_page_url)"
              :disabled="!state.customers.next_page_url"
              class="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium disabled:opacity-50"
            >Next</button>
          </div>
        </div> -->
      </div>
    </main>

    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Customer Details' : 'Create New Customer'"
      @save="editMode ? updateCustomer() : createCustomer()"
      :disableSaveBtn="isLoading"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        <div class="md:col-span-2">
          <FormInput label="Customer Full Name" v-model="form.name" :error="errors.name" placeholder="Enter name" />
        </div>
        
        <FormInput label="Phone Number (Primary)" v-model="form.phone_one" :error="errors.phone_one" placeholder="03xx-xxxxxxx" />
        <FormInput label="Phone Number (Secondary)" v-model="form.phone_two" :error="errors.phone_two" placeholder="Optional" />
        
        <FormInput label="NIC Number" v-model="form.nic" :error="errors.nic" placeholder="42xxx-xxxxxxx-x" />
        
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full border-slate-300 rounded-lg text-sm focus:ring-blue-500 h-[42px]">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Residential Address</label>
          <textarea 
            v-model="form.address" 
            rows="3" 
            class="w-full border-slate-300 rounded-lg text-sm focus:ring-blue-500 p-3"
            placeholder="Enter full address"
          ></textarea>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/plugins/axios";
import { toast } from "@/utils/toast";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Pagination from "@/components/admin/Pagination.vue";
const isLoading = ref(false);
const showModal = ref(false);
const editMode = ref(false);
const perPage = 4; 

const state = reactive({
  customers: { data: [] },
    pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const form = reactive({
  id: null,
  name: "",
  phone_one: "",
  phone_two: "",
  address: "",
  nic: "",
  status: "active",
});

const errors = reactive({});

const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: "",
    phone_one: "",
    phone_two: "",
    address: "",
    nic: "",
    status: "active",
  });
  Object.keys(errors).forEach((key) => (errors[key] = ""));
};

const searchText = ref("");
const isLoadingSearch = ref(false);

const fetchCustomers = async (url = "/customers") => {
  try {
    // Distinguish loading states: search vs initial/pagination load
    if (searchText.value) {
      isLoadingSearch.value = true;
    } else {
      isLoading.value = true;
    }

    const response = await api.get(url, {
      params: {
        search: searchText.value || null,
        per_page: perPage
      }


    });

    // Handle standard Laravel Paginated response via ApiResponse trait
    // If your response structure is: { data: { data: [...], current_page: 1 } }
    // state.customers = response.data.data;
     const paginated = response.data.data;
     console.log('paginated', paginated);
    // If backend returns resource collection, adjust accordingly:
    state.customers = paginated.data.data || paginated; // safe fallback
    state.pagination.currentPage = paginated.current_page ?? 1;
    state.pagination.lastPage = paginated.last_page ?? 1;
    state.pagination.nextPageUrl = paginated.next_page_url ?? null;
    state.pagination.prevPageUrl = paginated.prev_page_url ?? null;


  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch customers");
  } finally {
    isLoading.value = false;
    isLoadingSearch.value = false;
  }
};

const openModal = () => {
  resetForm();
  editMode.value = false;
  showModal.value = true;
};

const createCustomer = async () => {
  try {
    isLoading.value = true;
    const res = await api.post("/customers", form);
    toast.success("Customer added successfully");
    showModal.value = false;
    fetchCustomers();
  } catch (err) {
    console.log(err);
    if (err.response?.data?.errors) Object.assign(errors, err.response.data.errors);
  } finally {
    isLoading.value = false;
  }
};

const editCustomer = (customer) => {
  resetForm();
  Object.assign(form, customer);
  editMode.value = true;
  showModal.value = true;
};

const updateCustomer = async () => {
  try {
    isLoading.value = true;
    await api.put(`/customers/${form.id}`, form);
    toast.success("Customer profile updated");
    showModal.value = false;
    fetchCustomers();
  } catch (err) {
    if (err.response?.data?.errors) Object.assign(errors, err.response.data.errors);
  } finally {
    isLoading.value = false;
  }
};

const deleteCustomer = async (id) => {
  if (confirm("Delete this customer permanently?")) {
    try {
      await api.delete(`/customers/${id}`);
      toast.success("Record deleted");
      fetchCustomers();
    } catch (err) {
      toast.error("Deletion failed");
    }
  }
};

onMounted(() => fetchCustomers());
</script>