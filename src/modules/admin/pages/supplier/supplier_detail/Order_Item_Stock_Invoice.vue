<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    >
      <div class="flex flex-col items-center space-y-3">
        <VueSpinnerDots size="48px" color="#3B82F6" />
        <p class="text-blue-600 text-sm font-medium animate-pulse">
          Loading invoice details...
        </p>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <nav class="flex items-center space-x-2 text-sm">
            <router-link
              to="/admin/Supplier"
              class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i class="pi pi-home text-base"></i>
              <span class="font-medium">Suppliers</span>
            </router-link>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <button
              @click="$router.back()"
              class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Supplier Detail
            </button>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <span class="text-gray-900 font-semibold">Stock Invoice</span>
          </nav>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <button
              @click="printInvoice"
              class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all shadow-sm"
              title="Print Invoice"
            >
              <i class="pi pi-print text-sm"></i>
              <span class="hidden sm:inline">Print</span>
            </button>

            <button
              @click="openAddItemModal"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm"
            >
              <i class="pi pi-plus text-sm"></i>
              <span class="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Invoice Summary Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="pi pi-file-invoice"></i>
            Invoice Summary
          </h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-building text-blue-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Supplier</p>
                  <p class="text-base font-semibold text-gray-900">{{ state.supplier?.name || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ state.supplier?.company_name || '' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-phone text-green-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                  <p class="text-base font-semibold text-gray-900">{{ state.supplier?.contact_person || 'N/A' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-map-marker text-purple-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                  <p class="text-base text-gray-900">{{ state.supplier?.address || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-500 uppercase tracking-wide">Invoice ID</span>
                  <span class="text-base font-bold text-gray-900">#{{ invoiceOrderId }}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-500 uppercase tracking-wide">Invoice No</span>
                  <span class="text-base font-semibold text-blue-600">{{ invoiceNumber }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500 uppercase tracking-wide">Date</span>
                  <span class="text-base text-gray-900">{{ formatDate(invoiceDate) }}</span>
                </div>
              </div>

              <!-- Costs Summary -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p class="text-xs text-orange-600 font-medium mb-1">Transport Cost</p>
                  <p class="text-base font-bold text-orange-900">Rs. {{ formatCurrency(invoiceData.transport_cost) }}</p>
                </div>
                <div class="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p class="text-xs text-indigo-600 font-medium mb-1">Labour Cost</p>
                  <p class="text-base font-bold text-indigo-900">Rs. {{ formatCurrency(invoiceData.labour_cost) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Items Table -->
      <div ref="invoiceRef" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between print:bg-white print:border-b print:border-gray-300">
          <h3 class="text-lg font-bold text-white flex items-center gap-2 print:text-gray-900">
            <i class="pi pi-list"></i>
            Invoice Items
          </h3>
          <span class="text-sm text-gray-300 print:text-gray-600">{{ state.supplier_order_items.length }} items</span>
        </div>

        <!-- Items Table -->
        <div v-if="state.supplier_order_items && state.supplier_order_items.length" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Item Name
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Cost Price
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Sale Price
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Total
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in state.supplier_order_items"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ item.id }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i class="pi pi-box text-blue-600 text-xs"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ item.name || 'N/A' }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm text-gray-900">Rs. {{ formatCurrency(item.cost_price) }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm text-gray-900">Rs. {{ formatCurrency(item.sale_price) }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ item.quantity || 0 }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm font-semibold text-gray-900">
                    Rs. {{ formatCurrency(item.cost_price * item.quantity) }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right print:hidden">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="editItem(item)"
                      class="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                      title="Edit Item"
                    >
                      <i class="pi pi-pencil text-xs"></i>
                    </button>
                    <button
                      @click="deleteItem(item.id)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                      title="Delete Item"
                    >
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Totals Footer -->
            <tfoot class="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colspan="4" class="px-4 py-3 text-right">
                  <span class="text-sm font-bold text-gray-900 uppercase">Total:</span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white">
                    {{ totalQuantity }}
                  </span>
                </td>
                <td class="px-4 py-3 print:hidden">
                  <span class="text-base font-bold text-blue-600">
                    Rs. {{ formatCurrency(totalAmount) }}
                  </span>
                </td>
                <td class="print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-16 px-6">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="pi pi-inbox text-gray-400 text-5xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
          <p class="text-gray-600 text-center mb-6">
            This invoice doesn't have any items yet. Add items to get started.
          </p>
          <button
            @click="openAddItemModal"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg"
          >
            <i class="pi pi-plus"></i>
            <span>Add First Item</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Add/Edit Item Modal -->
    <BaseModal
      v-model="showModal"
      :title="isEditMode ? 'Update Item' : 'Add Item to Invoice'"
      @save="saveItem"
      :disableSaveBtn="isSaveLoading"
      size="lg"
    >
      <div class="space-y-4">
        <!-- Item Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Select Item <span class="text-red-500">*</span>
          </label>
          <div class="relative" ref="dropdownRef">
            <input
              type="text"
              v-model="form.name"
              @click="toggleDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Select an item"
              readonly
            />
            <button
              type="button"
              @click="toggleDropdown"
              class="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <i :class="isDropdownOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
            </button>

            <!-- Dropdown -->
            <Transition name="slide-fade">
              <div
                v-if="isDropdownOpen"
                class="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-hidden"
              >
                <!-- Search Bar -->
                <div class="p-3 border-b border-gray-200 bg-gray-50">
                  <div class="relative">
                    <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                      type="text"
                      v-model="searchItem"
                      @input="handleSearchInput"
                      placeholder="Search items..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <!-- Items List -->
                <ul class="max-h-48 overflow-y-auto">
                  <li
                    v-for="item in state.items"
                    :key="item.id"
                    @click="selectItem(item)"
                    class="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ item.name }}</span>
                      <span class="text-xs text-gray-500">{{ item.unit }}</span>
                    </div>
                  </li>
                  <li v-if="state.items.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                    No items found
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
          <p v-if="errors.name" class="text-red-600 text-xs mt-1">{{ cleanError(errors.name) }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span class="text-red-500">*</span>
            </label>
            <FormInput
              id="quantity"
              type="number"
              v-model="form.quantity"
              @input="calculateCostPrice"
              :error="errors.quantity"
              :disabled="isSaveLoading"
              placeholder="0"
            />
          </div>

          <!-- Total Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Total Price <span class="text-red-500">*</span>
            </label>
            <FormInput
              id="total_price"
              type="number"
              v-model="form.total_price"
              @input="calculateCostPrice"
              :error="errors.total_price"
              :disabled="isSaveLoading"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Cost Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Cost Price (Auto-calculated)
            </label>
            <FormInput
              id="cost_price"
              type="number"
              v-model="form.cost_price"
              :error="errors.cost_price"
              :disabled="true"
              placeholder="0.00"
            />
          </div>

          <!-- Sale Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Sale Price
            </label>
            <FormInput
              id="sale_price"
              type="number"
              v-model="form.sale_price"
              :error="errors.sale_price"
              :disabled="isSaveLoading"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">Calculation Info</p>
              <p>Cost Price = Total Price ÷ Quantity</p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VueSpinnerDots } from 'vue3-spinners';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
import { useFormErrors } from '@/composables/admin/useFormErrors';
import { usePrint } from '@/composables/admin/usePrint';
import { cleanError } from '@/utils/stringHelpers';
import { round } from '@/utils/helper';
import BaseModal from '@/components/BaseModal.vue';
import FormInput from '@/components/admin/FormInput.vue';
import Button from '@/components/admin/Button.vue';

const route = useRoute();
const router = useRouter();
const invoiceRef = ref(null);
const dropdownRef = ref(null);
const { printElement } = usePrint();

// State
const isLoading = ref(true);
const isSaveLoading = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);
const isDropdownOpen = ref(false);
const searchItem = ref('');

const state = reactive({
  supplier: {},
  supplier_order: [],
  supplier_order_items: [],
  items: [],
});

const form = reactive({
  id: null,
  supplier_order_id: '',
  item_id: '',
  name: '',
  quantity: '',
  cost_price: '',
  sale_price: '',
  total_price: '',
  unit: '',
});

const errors = reactive({
  name: '',
  quantity: '',
  cost_price: '',
  sale_price: '',
  total_price: '',
});

const handleFormErrors = useFormErrors(errors);

// Computed Properties
const supplierOrderId = computed(() => route.params.id);
const supplierId = computed(() => route.params.supplier_id);

const invoiceData = computed(() => {
  return state.supplier_order.length > 0 ? state.supplier_order[0] : {};
});

const invoiceOrderId = computed(() => invoiceData.value.id || '-');
const invoiceNumber = computed(() => invoiceData.value.supplier_invoice_number || 'N/A');
const invoiceDate = computed(() => invoiceData.value.supplier_invoice_date || '');

const totalQuantity = computed(() =>
  state.supplier_order_items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
);

const totalAmount = computed(() =>
  state.supplier_order_items.reduce(
    (sum, item) => sum + Number(item.cost_price * item.quantity || 0),
    0
  )
);

// Format helpers
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0.00';
  return parseFloat(value).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Calculations
const calculateCostPrice = () => {
  if (form.quantity && form.total_price) {
    form.cost_price = (parseFloat(form.total_price) / parseFloat(form.quantity)).toFixed(2);
  } else {
    form.cost_price = '';
  }
};

// Dropdown handlers
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
  form.name = item.name;
  form.item_id = item.id;
  form.sale_price = item.sale_price;
  form.unit = item.unit;
  form.quantity = '';
  form.total_price = '';
  form.cost_price = '';
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (
    isDropdownOpen.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }
};

const handleSearchInput = () => {
  fetchItems();
};

// API Calls
const loadAllData = async () => {
  try {
    isLoading.value = true;

    const [supplierRes, orderRes, orderItemsRes] = await Promise.all([
      api.get(`/suppliers/${supplierId.value}`),
      api.get(`/supplier-orders/order/${supplierOrderId.value}`),
      api.get(`/supplier-order-items/by-supplier-order/${supplierOrderId.value}`),
    ]);

    state.supplier = supplierRes.data.data;
    state.supplier_order = orderRes.data.data ? [orderRes.data.data] : [];
    state.supplier_order_items = orderItemsRes.data.data || [];
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Failed to load invoice details');
  } finally {
    isLoading.value = false;
  }
};

const fetchItems = async () => {
  try {
    const response = await api.get('/supplier-order-items/items', {
      params: { search: searchItem.value || null },
    });
    state.items = response.data.data.data || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    toast.error('Failed to fetch items');
  }
};

const saveItem = async () => {
  try {
    isSaveLoading.value = true;

    let response;
    if (isEditMode.value) {
      const { total_price, ...dataToSend } = form;
      response = await api.put(`/supplier-order-items/${form.id}`, dataToSend);
      toast.success('Item updated successfully');
    } else {
      const { id, total_price, ...dataToSend } = form;
      response = await api.post('/supplier-order-items', dataToSend);
      toast.success('Item added successfully');
    }

    await loadAllData();
    resetForm();
  } catch (error) {
    if (error.response?.status === 422) {
      handleFormErrors(error);
    } else {
      toast.error('Failed to save item');
    }
  } finally {
    isSaveLoading.value = false;
  }
};

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    isLoading.value = true;
    await api.delete(`/supplier-order-items/${id}`);
    toast.success('Item deleted successfully');
    await loadAllData();
  } catch (error) {
    console.error('Error deleting item:', error);
    toast.error('Failed to delete item');
  } finally {
    isLoading.value = false;
  }
};

// Modal handlers
const openAddItemModal = () => {
  resetForm();
  isEditMode.value = false;
  showModal.value = true;
  fetchItems();
};

const editItem = (item) => {
  isEditMode.value = true;
  form.id = item.id;
  form.name = item.name;
  form.item_id = item.item_id;
  form.quantity = item.quantity;
  form.cost_price = item.cost_price;
  form.sale_price = item.sale_price;
  form.unit = item.unit;
  form.total_price = (item.cost_price * item.quantity).toFixed(2);
  showModal.value = true;
  fetchItems();
};

const resetForm = () => {
  isEditMode.value = false;
  form.id = null;
  form.name = '';
  form.item_id = '';
  form.quantity = '';
  form.cost_price = '';
  form.sale_price = '';
  form.total_price = '';
  form.unit = '';
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  showModal.value = false;
};

const printInvoice = () => {
  printElement(invoiceRef);
};

// Lifecycle
onMounted(async () => {
  if (!supplierOrderId.value || !supplierId.value) {
    toast.error('Invalid invoice ID');
    router.push('/admin/Supplier');
    return;
  }

  form.supplier_order_id = supplierOrderId.value;
  document.addEventListener('click', handleClickOutside);
  await loadAllData();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Slide-fade transition for dropdown */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Print styles */
@media print {
  .print\:hidden {
    display: none !important;
  }

  .print\:bg-white {
    background-color: white !important;
  }

  .print\:text-gray-900 {
    color: #111827 !important;
  }

  .print\:border-b {
    border-bottom: 1px solid #e5e7eb;
  }

  .print\:border-gray-300 {
    border-color: #d1d5db !important;
  }
}
</style>