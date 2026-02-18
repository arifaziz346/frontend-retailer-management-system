<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-[100]">
    <div class="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl border border-white">
      <VueSpinnerDots size="50px" color="#2563eb" />
      <p class="text-slate-500 text-xs font-bold mt-4 tracking-[0.2em] uppercase">Generating Report</p>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-[#f8fafc] w-full">
    <header class="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
      <div class="w-full px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <nav class="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <router-link to="/admin/Item" class="hover:text-blue-600 transition-colors">Inventory</router-link>
            <i class="pi pi-chevron-right text-[10px]"></i>
            <span class="text-blue-600">Stock Report</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Stock Report</h1>
        </div>

        <div class="flex gap-3">
          <button
            @click="generateReport"
            :disabled="isLoading"
            class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all text-sm disabled:bg-gray-400"
          >
            <i class="pi pi-refresh"></i>
            <span>{{ isLoading ? 'Loading...' : 'Generate Report' }}</span>
          </button>

          <button
            @click="downloadPDF"
            :disabled="isLoading || !reportData.items?.length"
            class="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 transition-all text-sm disabled:bg-gray-400"
          >
            <i class="pi pi-file-pdf"></i>
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </header>

    <main class="w-full px-4 sm:px-8 py-6">
      <div v-if="reportData.items && reportData.items.length" class="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        <!-- Report Paper Design -->
        <div id="report-content" class="p-12 bg-white">
          
          <!-- Report Header -->
          <div class="border-b-4 border-slate-800 pb-6 mb-8">
            <div class="text-center">
              <h1 class="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">Inventory Stock Report</h1>
              <p class="text-sm text-slate-600 font-medium">Generated on {{ formatDate(new Date()) }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ reportData.company_name || 'Company Name' }}</p>
            </div>
          </div>

          <!-- Report Summary Box -->
          <div class="grid grid-cols-3 gap-6 mb-8 bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
            <div class="text-center">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Items</p>
              <p class="text-3xl font-black text-slate-900">{{ reportData.items.length }}</p>
            </div>
            <div class="text-center border-x-2 border-slate-300">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Stock Value</p>
              <p class="text-3xl font-black text-blue-600">Rs.{{ formatNumber(reportData.total_sale_price) }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Profit</p>
              <p class="text-3xl font-black text-green-600">Rs.{{ formatNumber(reportData.total_profit) }}</p>
            </div>
          </div>

          <!-- Items Table -->
          <div class="mb-8">
            <h2 class="text-xl font-black text-slate-800 uppercase mb-4 border-b-2 border-slate-300 pb-2">Item Details</h2>
            
            <table class="w-full border-2 border-slate-900">
              <thead>
                <tr class="bg-slate-800 text-white">
                  <th class="px-4 py-3 text-left text-xs font-black uppercase tracking-wider border-r border-slate-600">#</th>
                  <th class="px-4 py-3 text-left text-xs font-black uppercase tracking-wider border-r border-slate-600">Item Name</th>
                  <th class="px-4 py-3 text-right text-xs font-black uppercase tracking-wider border-r border-slate-600">Quantity</th>
                  <th class="px-4 py-3 text-right text-xs font-black uppercase tracking-wider border-r border-slate-600">Cost Price</th>
                  <th class="px-4 py-3 text-right text-xs font-black uppercase tracking-wider border-r border-slate-600">Sale Price</th>
                  <th class="px-4 py-3 text-right text-xs font-black uppercase tracking-wider">Profit</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in reportData.items" 
                  :key="item.id"
                  class="border-b-2 border-slate-300"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50'"
                >
                  <td class="px-4 py-3 text-sm font-bold text-slate-700 border-r border-slate-300">{{ index + 1 }}</td>
                  <td class="px-4 py-3 border-r border-slate-300">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-900">{{ item.name }}</span>
                      <span class="text-xs text-slate-500">{{ item.category?.category_name || 'General' }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-slate-700 border-r border-slate-300">
                    {{ item.quantity_in_stock }} {{ item.unit }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-slate-700 border-r border-slate-300">
                    Rs.{{ formatNumber(item.cost_price) }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-blue-700 border-r border-slate-300">
                    Rs.{{ formatNumber(item.sale_price) }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-bold text-green-600">
                    Rs.{{ formatNumber(item.profit) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-slate-900 text-white">
                <tr>
                  <td colspan="3" class="px-4 py-4 text-right text-sm font-black uppercase tracking-wider border-r border-slate-600">
                    TOTALS:
                  </td>
                  <td class="px-4 py-4 text-right text-sm font-black border-r border-slate-600">
                    Rs.{{ formatNumber(reportData.total_cost_price) }}
                  </td>
                  <td class="px-4 py-4 text-right text-sm font-black border-r border-slate-600">
                    Rs.{{ formatNumber(reportData.total_sale_price) }}
                  </td>
                  <td class="px-4 py-4 text-right text-sm font-black">
                    Rs.{{ formatNumber(reportData.total_profit) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Report Footer -->
          <div class="mt-12 pt-6 border-t-2 border-slate-300">
            <div class="grid grid-cols-2 gap-8">
              <div>
                <p class="text-xs font-bold text-slate-500 uppercase mb-2">Report Generated By:</p>
                <p class="text-sm font-bold text-slate-900">{{ reportData.generated_by || 'System Admin' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-bold text-slate-500 uppercase mb-2">Report Date:</p>
                <p class="text-sm font-bold text-slate-900">{{ formatDate(new Date()) }}</p>
              </div>
            </div>
            <div class="mt-6 text-center">
              <p class="text-xs text-slate-400 italic">This is a system-generated report. No signature required.</p>
            </div>
          </div>

        </div>
      </div>

      <div v-else class="w-full py-32 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
        <div class="p-6 bg-slate-50 rounded-full mb-4">
          <i class="pi pi-file-excel text-5xl text-slate-300"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800">No Report Generated</h3>
        <p class="text-slate-500 mb-6">Click "Generate Report" to create your stock report.</p>
        <button @click="generateReport" class="text-blue-600 font-bold hover:text-blue-700">+ Generate Report</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { VueSpinnerDots } from "vue3-spinners";
import api from "@/plugins/axios";
import { toast } from '@/utils/toast';

const isLoading = ref(false);

const reportData = reactive({
  items: [],
  total_cost_price: 0,
  total_sale_price: 0,
  total_profit: 0,
  company_name: '',
  generated_by: ''
});

const formatNumber = (value) => {
  return parseFloat(value || 0).toFixed(2);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const generateReport = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/stock-report');
    
    if (response.data.success) {
      reportData.items = response.data.data.items;
      reportData.total_cost_price = response.data.data.total_cost_price;
      reportData.total_sale_price = response.data.data.total_sale_price;
      reportData.total_profit = response.data.data.total_profit;
      reportData.company_name = response.data.data.company_name;
      reportData.generated_by = response.data.data.generated_by;
      
      toast.success('Report generated successfully!');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    toast.error('Failed to generate report');
  } finally {
    isLoading.value = false;
  }
};

const downloadPDF = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/stock-report/download', {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stock_report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('PDF downloaded successfully!');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    toast.error('Failed to download PDF');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  generateReport();
});
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  #report-content, #report-content * {
    visibility: visible;
  }
  #report-content {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>