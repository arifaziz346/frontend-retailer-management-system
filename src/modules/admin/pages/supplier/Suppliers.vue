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

  <div v-else class="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm rounded-lg"
    >
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
        <router-link
          to="/admin/Supplier"
          class="flex items-center hover:text-blue-600 transition-colors"
        >
          <i class="pi pi-home mr-1 text-2xl"></i>
          <span class="hidden sm:inline">Suppliers</span>
        </router-link>
        <!-- <span class="font-semibold text-gray-900">Supplier List</span> -->
      </nav>

      <!-- Add Button -->
      <Button
        variant="primary"
        size="sm"
        class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
        @click="() => { resetForm(); editSupplier = false; showModal = true; }"
      >
        <i class="pi pi-plus text-sm"></i>
        <span>Add Supplier</span>
      </Button>
    </header>

    <main class="flex-1 p-4 sm:p-6 md:p-8">
      <!-- <div class="flex flex-row justify-between items-center mb-4"> -->
        <!-- SearchBar: only search used for filtering -->
        <!-- <SearchBar
          v-model="searchText"
          placeholder="Search suppliers by name, phone or company..."
          class="w-full sm:w-1/2"
          @clear="clearSearch"
        /> -->
      <!-- </div> -->

      <!-- Searching loader -->
      <div v-if="isLoadingSearch" class="flex items-center justify-center p-4">
        <VueSpinnerDots size="32px" color="#2563eb" />
        <span class="ml-2 text-blue-600 font-medium animate-pulse">Searching...</span>
      </div>

      <div v-else>
        <div v-if="state.suppliers && state.suppliers.length" class="w-full overflow-x-scroll border border-gray-300 rounded-md shadow-sm">
            <div class="w-full bg bg-gray-800 text-white p-1.5">
                <i class="pi pi-home mr-1 text-md"> Supplier List</i></div>
          <table class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">#</th>
                <th class="px-4 py-2 text-left font-semibold">Supplier Name</th>
                <th class="px-4 py-2 text-left font-semibold">Contact No</th>
                <th class="px-4 py-2 text-left font-semibold">Company Name</th>
                <th class="px-4 py-2 text-left font-semibold">Account No.</th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Liabilities</th> -->
                <!-- <th class="px-4 py-2 text-left font-semibold">Purchased Amount</th>
                <th class="px-4 py-2 text-left font-semibold">Amount Paid</th>
                <th class="px-4 py-2 text-left font-semibold">Purchased Amount Remaining</th>
                <th class="px-4 py-2 text-left font-semibold">Remaining</th> -->
                <th class="px-4 py-2 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(supplier, index) in state.suppliers"
                :key="supplier.id"
                class="border-t border-t-gray-300 hover:bg-gray-50 transition ext-sm text-xs"
              >
                <td class="px-4 py-2 font-medium text-gray-800">{{ index + 1 + (state.pagination.currentPage - 1) * perPage }}</td>

                <td class="px-4 py-2 font-medium text-gray-900">{{ supplier.name }}</td>

                <td class="px-4 py-2 text-gray-700">{{ supplier.contact_person || '-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ supplier.company_name || '-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ supplier.account_number || '-' }}</td>

                

                <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">

  <!-- VIEW -->
  <button
    @click="viewSupplier(supplier)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow text-xs"
  >
    <i class="pi pi-eye text-base"></i>
    <span>View</span>
  </button>

  <!-- EDIT -->
  <button
    @click="editSupplierOpen(supplier)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-pencil text-base"></i>
    <span>Edit</span>
  </button>

  <!-- DELETE -->
  <button
    @click="onDelete(supplier.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-trash text-base"></i>
    <span>Delete</span>
  </button>

</td>


              </tr>

              <!-- Totals Row -->
              <!-- <tr class="bg-gray-50 border-t border-t-gray-300 font-semibold text-xs">
                <td colspan="5" class="px-4 py-2 text-left">Total:</td>
                <td class="px-4 py-2">{{ formatCurrency(totalLiabilities) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalPurchased) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalPaid) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalPurchased - totalPaid) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalRemaining) }}</td>
                <td class="px-4 py-2"></td>
              </tr> -->
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
          <h2 class="text-xl font-semibold text-gray-700 mb-2">No Suppliers Found</h2>
          <p class="text-gray-500">
            Try adding new suppliers to see them listed here.
          </p>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editSupplier ? 'Edit Supplier' : 'Create Supplier'"
      @save="() => onSaveOrUpdate()"
      :disableSaveBtn="isLoading"
    >
      <div class="bg-white p-4 rounded-lg shadow-2xl space-y-2">
        <FormInput id="name" label="Name" v-model="form.name" :error="errors.name" />
        <FormInput id="contact_person" label="Contact Person" v-model="form.contact_person" :error="errors.contact_person" />
        <!-- <FormInput id="phone" label="Phone" v-model="form.phone" :error="errors.phone" /> -->
        <FormInput id="company_name" label="Company Name" v-model="form.company_name" :error="errors.company_name" />
        <FormInput id="account_number" label="Account No." v-model="form.account_number" :error="errors.account_number" />
        <FormInput id="liabilities" label="Liabilities" v-model="form.liabilities" :error="errors.liabilities" type="number" />
        <FormInput id="nic" label="NIC" v-model="form.nic" :error="errors.nic" />
        <FormInput id="address" label="Address" v-model="form.address" :error="errors.address" />
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import Button from "@/components/admin/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, watch, computed } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from '@/utils/toast';
import { useFormErrors } from "@/composables/admin/useFormErrors";
import SearchBar from "@/components/SearchBar.vue"; // Using SearchBar only as requested
import _ from "lodash";

const route = useRoute();
const router = useRouter();

const perPage = 20; // pagination size (matches controller)
const state = reactive({
  suppliers: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const isLoading = ref(false);
const isLoadingSearch = ref(false);
const editSupplier = ref(false);
const supplier_id = ref('');
const showModal = ref(false);
const searchText = ref('');

// form
const form = reactive({
  name: '',
  contact_person: '',
//   phone: '',
  company_name: '',
  nic: '',
  address: '',
  account_number: '',
  liabilities: '',
});

const errors = reactive({
  name: '',
  contact_person: '',
//   phone: '',
  company_name: '',
  nic: '',
  address: '',
  account_number: '',
  liabilities: '',
});

const handleFormErrors = useFormErrors(errors);

// Aggregates cache: { supplierId: { purchased: number, paid: number } }
const aggregates = reactive({});

// Debounced search
const fetchSuppliersDebounced = _.debounce(() => {
  isLoadingSearch.value = true;
  fetchSuppliers();
}, 500);

watch(searchText, () => {
  fetchSuppliersDebounced();
});

const clearSearch = () => {
  searchText.value = '';
};

// ------------------- Fetch Suppliers -------------------
const fetchSuppliers = async (url = "/suppliers") => {
  try {
    // distinguish loading states
    if (isLoadingSearch.value) {
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

    // Controller returns: { data: collection(paginated) , message }
    // We expect response.data.data to be a paginated resource (laravel)
    const paginated = response.data.data;
    // If backend returns resource collection, adjust accordingly:
    state.suppliers = paginated.data || paginated; // safe fallback
    state.pagination.currentPage = paginated.current_page ?? 1;
    state.pagination.lastPage = paginated.last_page ?? 1;
    state.pagination.nextPageUrl = paginated.next_page_url ?? null;
    state.pagination.prevPageUrl = paginated.prev_page_url ?? null;

    // fetch aggregates for visible suppliers
    // for (const s of state.suppliers) {
    //   // initialize zero to prevent undefined in render
    //   aggregates[s.id] = aggregates[s.id] || { purchased: 0, paid: 0 };
    //   // fetch each supplier's aggregates asynchronously but not blocking UI
    //   fetchSupplierAggregates(s.id);
    // }
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    toast.error("Failed to fetch suppliers");
  } finally {
    isLoading.value = false;
    isLoadingSearch.value = false;
  }
};



// ------------------- Reset Form -------------------
const resetForm = () => {
  form.name = "";
  form.contact_person = "";
  form.phone = "";
  form.company_name = "";
  form.nic = "";
  form.address = "";
  form.account_number = "";
  form.liabilities = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  showModal.value = false;
  editSupplier.value = false;
  supplier_id.value = "";
};

// ------------------- Edit Supplier -------------------
const editSupplierOpen = (supplier) => {
  editSupplier.value = true;
  supplier_id.value = supplier.id;
  form.name = supplier.name;
  form.contact_person = supplier.contact_person;
  form.phone = supplier.phone;
  form.company_name = supplier.company_name;
  form.nic = supplier.nic;
  form.address = supplier.address;
  form.account_number = supplier.account_number;
  form.liabilities = supplier.liabilities;
  showModal.value = true;
};

const viewSupplier = (supplier) => {
  router.push({ name: 'admin.supplier-detail', params: { id: supplier.id } });
};

// ------------------- Save / Update Supplier -------------------
const onSaveOrUpdate = async () => {
  isLoading.value = true;
  try {
    const payload = {
      name: form.name,
      contact_person: form.contact_person,
      phone: form.phone,
      company_name: form.company_name,
      nic: form.nic,
      address: form.address,
      account_number: form.account_number,
      liabilities: form.liabilities};

    let response;

    if (!editSupplier.value) {
      response = await api.post("/suppliers", payload);
      // add to top of local list
      const newSupplier = response.data.data ?? response.data.supplier ?? response.data;
      state.suppliers.unshift(newSupplier);
      toast.success(response.data.message || "Supplier created successfully");
      resetForm();
    } else {
      response = await api.put(`/suppliers/${supplier_id.value}`, payload);
      const updated = response.data.data ?? response.data.supplier ?? response.data;
      const idx = state.suppliers.findIndex((s) => s.id === supplier_id.value);
      if (idx !== -1) state.suppliers[idx] = updated;
      toast.success(response.data.message || "Supplier updated successfully");
      resetForm();
    }


  } catch (error) {
    console.error("Error saving/updating supplier:", error);
    handleFormErrors(error);
  } finally {
    isLoading.value = false;
  }
};

// ------------------- Delete Supplier -------------------
const onDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this supplier?")) return;
  isLoading.value = true;
  try {
    const response = await api.delete(`/suppliers/${id}`);
    state.suppliers = state.suppliers.filter((s) => s.id !== id);
    // remove aggregates cache
    delete aggregates[id];
    toast.success(response.data.message || "Supplier deleted successfully");
  } catch (error) {
    console.error("Error deleting supplier:", error);
    toast.error("Failed to delete supplier");
  } finally {
    isLoading.value = false;
  }
};

// ------------------- Utils -------------------
const formatCurrency = (v) => {
  const n = Number(v ?? 0);
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ------------------- Computed totals -------------------
const totalPurchased = computed(() => {
  return Object.values(aggregates).reduce((sum, a) => sum + (a.purchased || 0), 0);
});
const totalPaid = computed(() => {
  return Object.values(aggregates).reduce((sum, a) => sum + (a.paid || 0), 0);
});
const totalLiabilities = computed(() => {
  return (state.suppliers || []).reduce((sum, s) => sum + Number(s.liabilities || 0), 0);
});
const totalRemaining = computed(() => {
  return totalLiabilities.value + (totalPurchased.value - totalPaid.value);
});

// ------------------- Mounted -------------------
onMounted(async () => {
  await fetchSuppliers();
});
</script>
