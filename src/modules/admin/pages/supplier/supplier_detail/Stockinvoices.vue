<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              <i class="pi pi-home text-lg"></i>
              <span class="font-medium">Suppliers</span>
            </router-link>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <button
  @click="$router.back()"
  class="text-gray-600 hover:text-blue-600 transition-colors"
>
  <span class="font-medium">Supplier Details</span>
</button>
            
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <span class="text-gray-900 font-semibold">Stock Invoices</span>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button
              @click="openCreateModal"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <i class="pi pi-plus"></i>
              <span class="hidden sm:inline">New Invoice</span>
            </button>

            <router-link
              :to="`/admin/Supplier/${supplierId}`"
              class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
            >
              <i class="pi pi-arrow-left"></i>
              <span class="hidden sm:inline">Back</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Supplier Quick Info -->
      <div v-if="supplier.name" class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="pi pi-building text-blue-600"></i>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ supplier.name }}</h2>
              <p class="text-sm text-gray-600">{{ supplier.company_name }}</p>
            </div>
          </div>
          
          <!-- Quick Stats -->
          <div class="hidden md:flex items-center gap-6">
            <div class="text-center">
              <p class="text-xs text-gray-500">Total Invoices</p>
              <p class="text-lg font-bold text-gray-900">{{ invoices.length }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500">Total Amount</p>
              <p class="text-lg font-bold text-blue-600">Rs. {{ formatCurrency(totalPurchasedAmount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="flex flex-col items-center space-y-4">
          <VueSpinnerDots size="56px" color="#3B82F6" />
          <p class="text-gray-600 font-medium animate-pulse">Loading invoices...</p>
        </div>
      </div>

      <!-- Invoices Table -->
      <div v-else-if="invoices.length > 0" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <i class="pi pi-file-invoice"></i>
              Stock Invoices
            </h3>
            <span class="text-sm text-gray-300">{{ invoices.length }} total</span>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Invoice #
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Transport
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Labour
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="invoice in invoices"
                :key="invoice.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <i class="pi pi-file text-blue-600 text-sm"></i>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ invoice.supplier_invoice_number || 'N/A' }}
                      </p>
                      <p class="text-xs text-gray-500">ID: {{ invoice.id }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-calendar text-gray-400"></i>
                    <span class="text-sm text-gray-900">
                      {{ formatDate(invoice.supplier_invoice_date) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {{ invoice.total_items || 0 }} items
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rs. {{ formatCurrency(invoice.transport_cost || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Rs. {{ formatCurrency(invoice.labour_cost || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-blue-600">
                    Rs. {{ formatCurrency(invoice.total_purchased_amount || 0) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <!-- View -->
                    <button
                      @click="viewInvoiceItems(invoice)"
                      class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                      title="View Items"
                    >
                      <i class="pi pi-eye"></i>
                    </button>

                    <!-- Edit -->
                    <button
                      @click="editInvoice(invoice)"
                      class="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                      title="Edit Invoice"
                      :disabled="isProcessing"
                    >
                      <i class="pi pi-pencil"></i>
                    </button>

                    <!-- Delete -->
                    <button
                      @click="deleteInvoice(invoice.id)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                      title="Delete Invoice"
                      :disabled="isProcessing"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination (if needed) -->
        <div v-if="pagination.lastPage > 1" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <Pagination :pagination="pagination" @page-change="loadInvoices" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col items-center justify-center py-16 px-6">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="pi pi-inbox text-gray-400 text-5xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Invoices Found</h3>
          <p class="text-gray-600 text-center mb-6">
            This supplier doesn't have any stock invoices yet. Create one to get started.
          </p>
          <button
            @click="openCreateModal"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg"
          >
            <i class="pi pi-plus"></i>
            <span>Create First Invoice</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <BaseModal
      v-model="showModal"
      :title="isEditMode ? 'Edit Invoice' : 'Create New Invoice'"
      @save="saveInvoice"
      :disableSaveBtn="isProcessing"
      size="lg"
    >
      <div class="space-y-4">
        <FormInput
          id="supplier_invoice_number"
          label="Invoice Number"
          v-model="form.supplier_invoice_number"
          :error="errors.supplier_invoice_number"
          placeholder="e.g., INV-2025-001"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="supplier_invoice_date"
            label="Invoice Date"
            v-model="form.supplier_invoice_date"
            type="date"
            :error="errors.supplier_invoice_date"
          />

          <FormInput
            id="transport_cost"
            label="Transport Cost (Rs.)"
            v-model="form.transport_cost"
            type="number"
            :error="errors.transport_cost"
            placeholder="0.00"
          />
        </div>

        <FormInput
          id="labour_cost"
          label="Labour Cost (Rs.)"
          v-model="form.labour_cost"
          type="number"
          :error="errors.labour_cost"
          placeholder="0.00"
        />

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
            <div class="text-sm text-blue-800">
              <p class="font-medium mb-1">Next Steps</p>
              <p>After creating this invoice, you'll be able to add items to it.</p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VueSpinnerDots } from 'vue3-spinners';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
import { useFormErrors } from '@/composables/admin/useFormErrors';
import BaseModal from '@/components/BaseModal.vue';
import FormInput from '@/components/admin/FormInput.vue';
import Pagination from '@/components/admin/Pagination.vue';

const route = useRoute();
const router = useRouter();

// State
const isLoading = ref(true);
const isProcessing = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);

const supplier = reactive({
  name: '',
  company_name: '',
});

const invoices = ref([]);

const pagination = reactive({
  currentPage: 1,
  nextPageUrl: null,
  prevPageUrl: null,
  lastPage: 1,
});

const form = reactive({
  id: null,
  supplier_id: '',
  supplier_invoice_number: '',
  supplier_invoice_date: '',
  transport_cost: 0,
  labour_cost: 0,
});

const errors = reactive({
  supplier_invoice_number: '',
  supplier_invoice_date: '',
  transport_cost: '',
  labour_cost: '',
});

const handleFormErrors = useFormErrors(errors);

// Computed
const supplierId = computed(() => route.params.supplier_id);

const totalPurchasedAmount = computed(() => {
  return invoices.value.reduce((sum, inv) => sum + (parseFloat(inv.total_purchased_amount) || 0), 0);
});

// Format helpers
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0.0';
  return parseFloat(value).toLocaleString('en-PK', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Load data
const loadInvoices = async (page = 1) => {
  try {
    isLoading.value = true;

    // Load supplier info and invoices in parallel
    const [supplierRes, invoicesRes] = await Promise.all([
      api.get(`/suppliers/${supplierId.value}`),
      api.get(`/supplier-orders/${supplierId.value}`, { params: { page } })
    ]);

    console.log('supplier-invoices', invoicesRes.data);

    supplier.name = supplierRes.data.data.name;
    supplier.company_name = supplierRes.data.data.company_name;

    // Handle both array and paginated responses
    if (Array.isArray(invoicesRes.data.data)) {
      invoices.value = invoicesRes.data.data;
    } else {
      invoices.value = invoicesRes.data.data.data || [];
      pagination.currentPage = invoicesRes.data.data.current_page || 1;
      pagination.lastPage = invoicesRes.data.data.last_page || 1;
    }

  } catch (error) {
    console.error('Error loading invoices:', error);
    toast.error('Failed to load invoices');
  } finally {
    isLoading.value = false;
  }
};

// CRUD Operations
const openCreateModal = () => {
  resetForm();
  isEditMode.value = false;
  showModal.value = true;
};

const editInvoice = (invoice) => {
  isEditMode.value = true;
  form.id = invoice.id;
  form.supplier_invoice_number = invoice.supplier_invoice_number;
  form.supplier_invoice_date = invoice.supplier_invoice_date;
  form.transport_cost = invoice.transport_cost || 0;
  form.labour_cost = invoice.labour_cost || 0;
  showModal.value = true;
};

const saveInvoice = async () => {
  try {
    isProcessing.value = true;

    if (isEditMode.value) {
      await api.put(`/supplier-orders/${form.id}`, form);
      toast.success('Invoice updated successfully');
    } else {
      await api.post('/supplier-orders', form);
      toast.success('Invoice created successfully');
    }

    await loadInvoices(pagination.currentPage);
    resetForm();
  } catch (error) {
    if (error.response?.status === 422) {
      handleFormErrors(error);
    } else {
      toast.error('Failed to save invoice');
    }
  } finally {
    isProcessing.value = false;
  }
};

const deleteInvoice = async (id) => {
  if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
    return;
  }

  try {
    isProcessing.value = true;
    await api.delete(`/supplier-orders/${id}`);
    toast.success('Invoice deleted successfully');
    await loadInvoices(pagination.currentPage);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    toast.error('Failed to delete invoice');
  } finally {
    isProcessing.value = false;
  }
};

const viewInvoiceItems = (invoice) => {
  router.push({
    name: 'admin.stock-invoice',
    params: {
      id: invoice.id,
      supplier_id: supplierId.value
    }
  });
};

const resetForm = () => {
  form.id = null;
  form.supplier_invoice_number = '';
  form.supplier_invoice_date = '';
  form.transport_cost = 0;
  form.labour_cost = 0;
  Object.keys(errors).forEach(key => errors[key] = '');
  showModal.value = false;
};

// Lifecycle
onMounted(() => {
  if (!supplierId.value) {
    toast.error('No supplier ID provided');
    router.push('/admin/Supplier');
    return;
  }

  form.supplier_id = supplierId.value;
  loadInvoices();
});
</script>