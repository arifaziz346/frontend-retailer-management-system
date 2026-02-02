<template>
  <!-- 🔵 Initial Loader (only shows on first load) -->
  <div
    v-if="isInitialLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
  >
    <div class="flex flex-col items-center space-y-3">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <p class="text-blue-600 text-sm font-medium animate-pulse">
        Loading supplier details...
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
          <span class="sm:inline">Supplier</span>
        </router-link>
        <span class="font-semibold text-gray-900">/</span>
        <span class="sm:inline font-bold">Supplier-Detail</span>
      </nav>
    </header>

    <!-- Supplier Summary Table -->
    <div class="overflow-x-auto border border-gray-300 rounded-md shadow-sm mt-4">
      <!-- Show skeleton while loading -->
      <div v-if="!state.supplier.id" class="animate-pulse">
        <div class="bg-gray-100 p-4">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      
      <table v-else class="min-w-full border-collapse text-xs sm:text-sm md:text-base">
        <thead class="bg-gray-100 text-gray-700 text-xs">
          <tr>
            <th class="px-4 py-2 text-left font-semibold">Name</th>
            <th class="px-4 py-2 text-left font-semibold">Contact</th>
            <th class="px-4 py-2 text-left font-semibold">Company Name</th>
            <th class="px-4 py-2 text-left font-semibold">Account No.</th>
            <th class="px-4 py-2 text-left font-semibold">Liabilities</th>
            <th class="px-4 py-2 text-left font-semibold">Purchased Amount</th>
            <th class="px-4 py-2 text-left font-semibold">Amount Paid</th>
            <th class="px-4 py-2 text-left font-semibold">Remaining</th>
            <th class="px-4 py-2 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-gray-200 text-xs">
            <td class="px-4 py-2">{{ state.supplier.name || '-' }}</td>
            <td class="px-4 py-2">{{ state.supplier.contact_person || '-' }}</td>
            <td class="px-4 py-2">{{ state.supplier.company_name || '-' }}</td>
            <td class="px-4 py-2">{{ state.supplier.account_number || '-' }}</td>
            <td class="px-4 py-2">
              Rs.{{ Math.max(0, state.supplier.liabilities - financials.amountPaid) || 0 }}
            </td>
            <td class="px-4 py-2">Rs.{{ round(financials.totalPurchased) || 0 }}</td>
            <td class="px-4 py-2">Rs.{{ round(financials.amountPaid) || 0 }}</td>
            <td class="px-4 py-2">Rs.{{ round(financials.totalPurchased - financials.amountPaid) || 0 }}</td>
            <td class="px-4 py-2 font-semibold">
              <button
                @click="viewPaymentSupplier(state.supplier.id)"
                class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow text-xs"
              >
                <i class="pi pi-money-bill text-base"></i>
                <span>Payments</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <main class="flex-1 mt-1">
      <div class="w-full overflow-x-scroll border border-gray-300 rounded-md shadow-sm">
        <div class="w-full bg flex flex-row items-center bg-gray-800 text-white p-1.5 justify-between">
          <i class="pi pi-home mr-1 text-lg"> Stock Invoices</i>
          <!-- Add Button -->
          <Button
            variant="primary"
            size="sm"
            class="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-1 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
            @click="openCreateModal"
            :disabled="isProcessing"
          >
            <i class="pi pi-plus text-sm"></i>
            <span>Stock-Invoices</span>
          </Button>
        </div>

        <!-- Loading Skeleton for Orders -->
        <div v-if="isLoadingOrders" class="animate-pulse p-4">
          <div v-for="i in 3" :key="i" class="h-12 bg-gray-200 rounded mb-2"></div>
        </div>

        <!-- Orders Table -->
        <table
          v-else-if="state.supplier_order && state.supplier_order.length"
          class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base"
        >
          <thead class="bg-gray-100 text-gray-700 text-xs">
            <tr>
              <th class="px-4 py-2 text-left font-semibold">#</th>
              <th class="px-4 py-2 text-left font-semibold">Invoice-Number</th>
              <th class="px-4 py-2 text-left font-semibold">Date</th>
              <th class="px-4 py-2 text-left font-semibold">Transport-Cost</th>
              <th class="px-4 py-2 text-left font-semibold">Labour-Cost</th>
              <th class="px-4 py-2 text-left font-semibold">Total-Items</th>
              <th class="px-4 py-2 text-left font-semibold">Purchased-Amount</th>
              <th class="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in state.supplier_order"
              :key="order.id"
              class="border-t border-t-gray-300 hover:bg-gray-50 transition text-sm text-xs"
            >
              <td class="px-4 py-2 font-medium text-gray-800">{{ order.id }}</td>
              <td class="px-4 py-2 font-medium text-gray-900">{{ order.supplier_invoice_number || '-' }}</td>
              <td class="px-4 py-2 text-gray-700">{{ order.supplier_invoice_date || '-' }}</td>
              <td class="px-4 py-2 text-gray-700">{{ order.transport_cost || '-' }}</td>
              <td class="px-4 py-2 text-gray-700">{{ order.labour_cost || '-' }}</td>
              <td class="px-4 py-2 text-gray-700">{{ order.total_items || '-' }}</td>
              <td class="px-4 py-2 text-gray-700">{{ order.total_purchased_amount || '-' }}</td>

              <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">
                <!-- VIEW -->
                <button
                  @click="viewSupplierOrderItems(order)"
                  class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow text-xs"
                >
                  <i class="pi pi-eye text-base"></i>
                  <span>View</span>
                </button>

                <!-- EDIT -->
                <button
                  @click="editSupplierOrderOpen(order)"
                  class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
                  :disabled="isProcessing"
                >
                  <i class="pi pi-pencil text-base"></i>
                  <span>Edit</span>
                </button>

                <!-- DELETE -->
                <button
                  @click="onDelete(order.id)"
                  class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
                  :disabled="isProcessing"
                >
                  <i class="pi pi-trash text-base"></i>
                  <span>Delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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
          <h2 class="text-xl font-semibold text-gray-700 mb-2">No Invoices Found</h2>
          <p class="text-gray-500">
            Try adding new stock invoices to see them listed here.
          </p>
        </div>

        <!-- Pagination -->
        <Pagination :pagination="state.pagination" @page-change="fetchSuppliers" />
      </div>
    </main>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editSupplierOrder ? 'Edit Supplier Order' : 'Create Supplier Order'"
      @save="onSaveOrUpdate"
      :disableSaveBtn="isProcessing"
    >
      <div class="bg-white p-4 rounded-lg shadow-2xl space-y-2">
        <FormInput
          id="supplier_invoice_number"
          label="Supplier Invoice Number"
          v-model="form.supplier_invoice_number"
          :error="errors.supplier_invoice_number"
        />
        <FormInput
          id="transport_cost"
          label="Transport Cost"
          v-model="form.transport_cost"
          :error="errors.transport_cost"
        />
        <FormInput
          id="labour_cost"
          label="Labour Cost"
          v-model="form.labour_cost"
          :error="errors.labour_cost"
        />
        <FormInput
          id="supplier_invoice_date"
          label="Supplier Invoice Date"
          v-model="form.supplier_invoice_date"
          type="date"
          :error="errors.supplier_invoice_date"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import Button from "@/components/admin/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, computed } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from "@/utils/toast";
import { useFormErrors } from "@/composables/admin/useFormErrors";
import { round } from "@/utils/helper";

const route = useRoute();
const router = useRouter();

const perPage = 20;
const state = reactive({
  supplier: {},
  supplier_order: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

// Separated loading states for better UX
const isInitialLoading = ref(true);
const isLoadingOrders = ref(false);
const isProcessing = ref(false); // For save/delete operations
const editSupplierOrder = ref(false);
const supplier_id = ref("");
const showModal = ref(false);

// Financial data
const financials = reactive({
  amountPaid: 0,
  totalPurchased: 0,
  totalItemQuantity: 0,
});

// Form data
const form = reactive({
  id: null,
  supplier_id: "",
  supplier_invoice_number: "",
  transport_cost: 0,
  labour_cost: 0,
  supplier_invoice_date: "",
});

const errors = reactive({
  supplier_id: "",
  supplier_invoice_number: "",
  labour_cost: "",
  transport_cost: "",
  supplier_invoice_date: "",
});

const handleFormErrors = useFormErrors(errors);

// ============ OPTIMIZED DATA FETCHING ============

/**
 * Load all initial data in parallel (non-blocking)
 * This is THE KEY OPTIMIZATION - all requests fire simultaneously
 */
const loadInitialData = async (supplierId) => {
  isInitialLoading.value = true;

  try {
    // Fire all requests in parallel using Promise.all
    const [supplierResponse, ordersResponse, paymentsResponse, orderItemsResponse] = 
      await Promise.all([
        api.get(`/suppliers/${supplierId}`),
        api.get(`/supplier-orders/${supplierId}`),
        api.get(`/supplier-payments/total/${supplierId}`),
        api.get(`/supplier-order-items/total/${supplierId}`),
      ]);

    // Update state with all responses
    state.supplier = supplierResponse.data.data;
    state.supplier_order = ordersResponse.data.data;
    financials.amountPaid = paymentsResponse.data.data.paid_total_supplier || 0;
    financials.totalPurchased = orderItemsResponse.data.data.total_purchased_amount || 0;
    financials.totalItemQuantity = orderItemsResponse.data.data.total_item_quanity || 0;

    console.log("All data loaded successfully");
  } catch (error) {
    console.error("Error loading initial data:", error);
    toast.error("Failed to load supplier details");
    
    // Optionally redirect back if critical data fails
    // router.push("/admin/Supplier");
  } finally {
    isInitialLoading.value = false;
  }
};

/**
 * Refresh only orders and financials (after create/update/delete)
 * Much faster than reloading everything
 */
const refreshOrderData = async (supplierId) => {
  isLoadingOrders.value = true;

  try {
    const [ordersResponse, paymentsResponse, orderItemsResponse] = await Promise.all([
      api.get(`/supplier-orders/${supplierId}`),
      api.get(`/supplier-payments/total/${supplierId}`),
      api.get(`/supplier-order-items/total/${supplierId}`),
    ]);

    state.supplier_order = ordersResponse.data.data;
    financials.amountPaid = paymentsResponse.data.data.paid_total_supplier || 0;
    financials.totalPurchased = orderItemsResponse.data.data.total_purchased_amount || 0;
    financials.totalItemQuantity = orderItemsResponse.data.data.total_item_quanity || 0;
  } catch (error) {
    console.error("Error refreshing order data:", error);
    toast.error("Failed to refresh data");
  } finally {
    isLoadingOrders.value = false;
  }
};

// ============ CRUD OPERATIONS ============

const onSaveOrUpdate = async () => {
  isProcessing.value = true;

  try {
    let response;
    if (editSupplierOrder.value) {
      response = await api.put(`/supplier-orders/${form.id}`, form);
      toast.success("Supplier Order updated successfully");
    } else {
      response = await api.post("/supplier-orders", form);
      toast.success("Supplier Order created successfully");
    }

    // Only refresh order data, not entire page
    await refreshOrderData(form.supplier_id);
    resetForm();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      handleFormErrors(error);
    } else {
      toast.error("An error occurred while saving the supplier order");
    }
  } finally {
    isProcessing.value = false;
  }
};

const editSupplierOrderOpen = (order) => {
  editSupplierOrder.value = true;
  form.id = order.id;
  form.supplier_invoice_number = order.supplier_invoice_number;
  form.transport_cost = order.transport_cost;
  form.labour_cost = order.labour_cost;
  form.supplier_invoice_date = order.supplier_invoice_date;
  showModal.value = true;
};

const onDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this supplier Order Invoice?")) return;
  
  isProcessing.value = true;

  try {
    const response = await api.delete(`/supplier-orders/${id}`);

    if (response.data.success) {
      await refreshOrderData(form.supplier_id);
      toast.success(response.data.message || "Supplier Order Invoice deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting supplier order:", error);
    toast.error("Failed to delete supplier order");
  } finally {
    isProcessing.value = false;
  }
};

// ============ NAVIGATION ============

const viewSupplierOrderItems = (order) => {
  router.push({
    name: "admin.stock-invoice",
    params: {
      id: order.id,
      supplier_id: supplier_id.value,
    },
  });
};

const viewPaymentSupplier = (supplierId) => {
  router.push({
    name: "admin.supplier-payments",
    params: {
      supplier_id: supplierId,
    },
  });
};

// ============ HELPERS ============

const openCreateModal = () => {
  resetForm();
  editSupplierOrder.value = false;
  showModal.value = true;
};

const resetForm = () => {
  form.id = null;
  form.supplier_invoice_number = "";
  form.transport_cost = 0;
  form.labour_cost = 0;
  form.supplier_invoice_date = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  showModal.value = false;
  editSupplierOrder.value = false;
};

// Placeholder for pagination (if needed)
const fetchSuppliers = async (page = 1) => {
  // Implement if pagination is needed for orders
  console.log("Pagination requested for page:", page);
};

// ============ LIFECYCLE ============

onMounted(async () => {
  form.supplier_id = route.params.id || "";
  supplier_id.value = route.params.id || "";

  if (!supplier_id.value) {
    toast.error("No supplier ID provided");
    router.push("/admin/Supplier");
    return;
  }

  // Load all data in parallel - THIS IS THE KEY OPTIMIZATION
  await loadInitialData(supplier_id.value);
});
</script>