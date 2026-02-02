<template>
  <div class="flex flex-col min-h-screen bg-slate-50 font-sans">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <VueSpinnerDots size="50px" color="#2563eb" />
    </div>

    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Customers</h1>
            <p class="text-sm text-slate-500">Manage customer records and contact details</p>
          </div>
          <!-- Search Input -->
          <div>
            <input
              v-model="search"
              @input="onSearch"
              type="text"
              placeholder="Search name or mobile..."
              class="w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm
                     focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
        </div>

        <button
          @click="openModal"
          class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>New Customer</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main v-if="!isSearching" class="max-w-7xl mx-auto w-full p-6">
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Contact Info</th>
                <th class="px-6 py-4">NIC Number</th>
                <th class="px-6 py-4 text-center">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="customer in state.customers"
                :key="customer.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 text-slate-500 font-mono text-xs">#{{ customer.id }}</td>
                <td class="px-6 py-4 font-bold text-slate-900">{{ customer.name }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-slate-700">
                      <i class="pi pi-phone text-blue-500 mr-2"></i>{{ customer.phone_one }}
                    </span>
                    <span v-if="customer.phone_two" class="text-slate-500 text-xs italic">{{ customer.phone_two }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">{{ customer.nic || 'N/A' }}</td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                  >
                    {{ customer.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="editCustomer(customer)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <button @click="deleteCustomer(customer.id)" class="p-2 text-rose-600 hover:bg-rose-50 rounded-md">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <Pagination :pagination="state.pagination" @page-change="fetchCustomers" />
      </div>
    </main>
    <div v-else class="flex items-center justify-center h-64">
       <VueSpinnerDots size="50px" color="#2563eb" />
       </div>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Customer' : 'Create Customer'"
      @save="saveCustomer"
      :disableSaveBtn="isLoading"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
        <div class="md:col-span-2">
          <FormInput
            label="Full Name"
            v-model="form.name"
            :error="errors.name?.[0]"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Phone One (11 Digits)</label>
          <input
            type="text"
            v-model="form.phone_one"
            @input="handlePhoneInput('phone_one')"
            :class="[
              'w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 outline-none transition-all',
              form.phone_one.length > 11 || errors.phone_one ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-blue-100'
            ]"
            placeholder="03001234567"
          />
          <p v-if="errors.phone_one" class="text-red-500 text-xs mt-1">{{ errors.phone_one[0] }}</p>
          <p v-else-if="form.phone_one.length > 11" class="text-red-500 text-xs mt-1">Exceeds 11 digits!</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Phone Two (Optional)</label>
          <input
            type="text"
            v-model="form.phone_two"
            @input="handlePhoneInput('phone_two')"
            :class="[
              'w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 outline-none transition-all',
              (form.phone_two && form.phone_two.length > 11) || errors.phone_two ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:ring-blue-100'
            ]"
            placeholder="03001234567"
          />
          <p v-if="errors.phone_two" class="text-red-500 text-xs mt-1">{{ errors.phone_two[0] }}</p>
        </div>

        <FormInput label="NIC Number" v-model="form.nic" :error="errors.nic?.[0]" placeholder="42101-xxxxxxx-x" />

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full border-slate-300 rounded-lg text-sm h-[42px]">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Address</label>
          <textarea
            v-model="form.address"
            rows="2"
            :class="['w-full border rounded-lg p-3 text-sm', errors.address ? 'border-red-500' : 'border-slate-300']"
          ></textarea>
          <p v-if="errors.address" class="text-red-500 text-xs mt-1">{{ errors.address[0] }}</p>
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
const search = ref('');
const isSearching = ref(false);
let searchTimeout = null;

const errors = ref({});

const state = reactive({
  customers: { data: [] },
  pagination: { current_page: 1, last_page: 1, next_page_url: null, prev_page_url: null },
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

// ------------------- Helper Functions -------------------

const handlePhoneInput = (field) => {
  form[field] = form[field].replace(/\D/g, "");
  if (errors.value[field]) delete errors.value[field];
};

const resetForm = () => {
  Object.assign(form, { id: null, name: "", phone_one: "", phone_two: "", address: "", nic: "", status: "active" });
  errors.value = {};
};

// ------------------- API Calls -------------------

const fetchCustomers = async (url = '/customers') => {
  if(!isSearching.value){
    isLoading.value = true;
  }
  
  try {
    const response = await api.get(url, { params: { search: search.value || null } });
    state.customers = response.data.data.data;
    console.log('customers', state.customers);

    state.pagination = response.data.data;
  } catch (err) {
    toast.error("Failed to load customers");
  } finally {
    isLoading.value = false;
    isSearching.value = false;
  }
};

// Debounced search
const onSearch = () => {
  isSearching.value = true;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchCustomers('/customers');
  }, 400);
};

// ------------------- Modal Actions -------------------

const openModal = () => {
  resetForm();
  editMode.value = false;
  showModal.value = true;
};

const editCustomer = (customer) => {
  resetForm();
  Object.assign(form, customer);
  editMode.value = true;
  showModal.value = true;
};

const saveCustomer = async () => {
  if (form.phone_one.length > 11) {
    toast.error("Primary phone cannot exceed 11 digits");
    return;
  }

  isLoading.value = true;
  errors.value = {};
  try {
    const method = editMode.value ? "put" : "post";
    const url = editMode.value ? `/customers/${form.id}` : "/customers";
    await api[method](url, form);
    toast.success(editMode.value ? "Updated successfully" : "Created successfully");
    showModal.value = false;
    fetchCustomers('/customers');
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors;
      toast.error("Validation failed. Please check the form.");
    } else {
      toast.error("Server error occurred");
    }
  } finally {
    isLoading.value = false;
  }
};

const deleteCustomer = async (id) => {
  if (!confirm("Are you sure?")) return;
  try {
    await api.delete(`/customers/${id}`);
    toast.success("Customer removed");
    fetchCustomers('/customers');
  } catch (err) {
    toast.error("Delete failed");
  }
};

// ------------------- Lifecycle -------------------

onMounted(() => fetchCustomers());
</script>