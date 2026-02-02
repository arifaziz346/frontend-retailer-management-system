<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header with Breadcrumb -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <nav class="flex items-center space-x-2 text-sm">
            <router-link
              to="/admin/Supplier"
              class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <i class="pi pi-home text-lg group-hover:scale-110 transition-transform"></i>
              <span class="font-medium">Suppliers</span>
            </router-link>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <span class="text-gray-900 font-semibold">Supplier Details</span>
          </nav>

          <!-- Back Button -->
          <router-link
            to="/admin/Supplier"
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
          >
            <i class="pi pi-arrow-left"></i>
            <span class="hidden sm:inline">Back</span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="flex flex-col items-center space-y-4">
          <VueSpinnerDots size="56px" color="#3B82F6" />
          <p class="text-gray-600 font-medium animate-pulse">Loading supplier details...</p>
        </div>
      </div>

      <template v-else>
        <!-- Supplier Information Card -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <i class="pi pi-building text-white text-xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">{{ supplier.name || 'N/A' }}</h2>
                  <p class="text-blue-100 text-sm">{{ supplier.company_name || 'Company Name' }}</p>
                </div>
              </div>
              
              <!-- Payment Button -->
              <button
                @click="goToPayments"
                class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30"
              >
                <i class="pi pi-money-bill"></i>
                <span class="hidden sm:inline">View Payments</span>
              </button>
            </div>
          </div>

          <!-- Card Content - Grid Layout -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Contact Info -->
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-gray-500 text-sm">
                  <i class="pi pi-user"></i>
                  <span class="font-medium">Contact Person</span>
                </div>
                <p class="text-lg font-semibold text-gray-900">
                  {{ supplier.contact_person || 'N/A' }}
                </p>
              </div>

              <!-- Account Number -->
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-gray-500 text-sm">
                  <i class="pi pi-credit-card"></i>
                  <span class="font-medium">Account Number</span>
                </div>
                <p class="text-lg font-semibold text-gray-900 font-mono">
                  {{ supplier.account_number || 'N/A' }}
                </p>
              </div>

              <!-- Phone/Contact -->
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-gray-500 text-sm">
                  <i class="pi pi-phone"></i>
                  <span class="font-medium">Phone</span>
                </div>
                <p class="text-lg font-semibold text-gray-900">
                  {{ supplier.phone || 'N/A' }}
                </p>
              </div>

              <!-- Status Badge -->
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-gray-500 text-sm">
                  <i class="pi pi-check-circle"></i>
                  <span class="font-medium">Status</span>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="pi pi-chart-line text-blue-600"></i>
                Financial Summary
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Total Purchased -->
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-blue-600 text-sm font-medium">Total Purchased</span>
                    <i class="pi pi-shopping-cart text-blue-600"></i>
                  </div>
                  <p class="text-2xl font-bold text-blue-900">
                    Rs. {{ formatCurrency(financials.totalPurchased) }}
                  </p>
                </div>

                <!-- Amount Paid -->
                <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-green-600 text-sm font-medium">Amount Paid</span>
                    <i class="pi pi-check-circle text-green-600"></i>
                  </div>
                  <p class="text-2xl font-bold text-green-900">
                    Rs. {{ formatCurrency(financials.amountPaid) }}
                  </p>
                </div>

                <!-- Remaining Balance -->
                <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-orange-600 text-sm font-medium">Remaining Balance</span>
                    <i class="pi pi-clock text-orange-600"></i>
                  </div>
                  <p class="text-2xl font-bold text-orange-900">
                    Rs. {{ formatCurrency(financials.totalPurchased - financials.amountPaid) }}
                  </p>
                </div>

                <!-- Outstanding Liabilities -->
                <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-red-600 text-sm font-medium">Liabilities</span>
                    <i class="pi pi-exclamation-triangle text-red-600"></i>
                  </div>
                  <p class="text-2xl font-bold text-red-900">
                    Rs. {{ formatCurrency(Math.max(0, supplier.liabilities - financials.amountPaid)) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock Invoices Section -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i class="pi pi-file-invoice text-white text-xl"></i>
              <h3 class="text-xl font-bold text-white">Stock Invoices</h3>
            </div>
            
            <button
              @click="goToStockInvoices"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <i class="pi pi-list"></i>
              <span>View All Invoices</span>
            </button>
          </div>

          <div class="p-6">
            <p class="text-gray-600 mb-4">
              Click the button above to view and manage all stock invoices for this supplier.
            </p>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-file text-blue-600"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Total Invoices</p>
                    <p class="text-xl font-bold text-gray-900">{{ invoiceStats.total }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-box text-green-600"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Total Items</p>
                    <p class="text-xl font-bold text-gray-900">{{ invoiceStats.totalItems }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i class="pi pi-calendar text-purple-600"></i>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Last Invoice</p>
                    <p class="text-xl font-bold text-gray-900">{{ invoiceStats.lastDate || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VueSpinnerDots } from 'vue3-spinners';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

const route = useRoute();
const router = useRouter();

// State
const isLoading = ref(true);
const supplier = reactive({
  id: null,
  name: '',
  company_name: '',
  contact_person: '',
  account_number: '',
  phone: '',
  liabilities: 0,
});

const financials = reactive({
  totalPurchased: 0,
  amountPaid: 0,
  totalItems: 0,
});

const invoiceStats = reactive({
  total: 0,
  totalItems: 0,
  lastDate: null,
});

// Computed
const supplierId = computed(() => route.params.id);

// Format currency helper
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0';
  return parseFloat(value).toLocaleString('en-PK', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

// Load all data in parallel
const loadSupplierData = async () => {
  try {
    isLoading.value = true;

    // Parallel API calls for maximum speed
    const [supplierRes, paymentsRes, orderItemsRes, ordersRes] = await Promise.all([
      api.get(`/suppliers/${supplierId.value}`),
      api.get(`/supplier-payments/total/${supplierId.value}`),
      api.get(`/supplier-order-items/total/${supplierId.value}`),
      api.get(`/supplier-orders/${supplierId.value}`),
    ]);

    // Update supplier data
    Object.assign(supplier, supplierRes.data.data);

    // Update financials
    financials.amountPaid = paymentsRes.data.data.paid_total_supplier || 0;
    financials.totalPurchased = orderItemsRes.data.data.total_purchased_amount || 0;
    financials.totalItems = orderItemsRes.data.data.total_item_quanity || 0;

    // Update invoice stats
    const orders = ordersRes.data.data || [];
    invoiceStats.total = orders.length;
    invoiceStats.totalItems = orders.reduce((sum, order) => sum + (order.total_items || 0), 0);
    
    if (orders.length > 0) {
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.supplier_invoice_date) - new Date(a.supplier_invoice_date)
      );
      invoiceStats.lastDate = sortedOrders[0].supplier_invoice_date;
    }

  } catch (error) {
    console.error('Error loading supplier data:', error);
    toast.error('Failed to load supplier details');
    router.push('/admin/Supplier');
  } finally {
    isLoading.value = false;
  }
};

// Navigation methods
const goToStockInvoices = () => {
  router.push({
    name: 'admin.supplier-stock-invoices',
    params: { supplier_id: supplierId.value }
  });
};

const goToPayments = () => {
  router.push({
    name: 'admin.supplier-payments',
    params: { supplier_id: supplierId.value }
  });
};

// Lifecycle
onMounted(() => {
  if (!supplierId.value) {
    toast.error('No supplier ID provided');
    router.push('/admin/Supplier');
    return;
  }
  loadSupplierData();
});
</script>

<style scoped>
/* Add smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Hover effects for cards */
.bg-gradient-to-br:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>