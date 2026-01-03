<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
    <div class="flex flex-col items-center space-y-4">
      <div class="relative">
        <VueSpinnerDots size="56px" color="#2563eb" />
        <div class="absolute inset-0 animate-ping opacity-20 bg-blue-400 rounded-full"></div>
      </div>
      <p class="text-blue-700 text-sm font-bold tracking-widest uppercase animate-pulse">
        Generating Report...
      </p>
    </div>
  </div>

  <div class="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
    <div class="max-w-7xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <i class="pi pi-chart-bar text-blue-600"></i>
            Sales Analysis Report
          </h1>
          <p class="text-gray-500 text-sm mt-1">Detailed breakdown of sold items and revenue metrics.</p>
        </div>
        
        <div class="flex gap-2">
          <button class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm">
            <i class="pi pi-file-excel text-green-600"></i> Excel
          </button>
          <button class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm">
            <i class="pi pi-file-pdf text-red-600"></i> PDF
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
      <div class="flex flex-col lg:flex-row items-end gap-4">
        
        <div class="w-full lg:w-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div class="space-y-1.5">
            <label class="text-[11px] uppercase font-black text-gray-400 ml-1">Start Date</label>
            <div class="relative">
              <i class="pi pi-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="date" v-model="filters.start_date" 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-semibold text-gray-700" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-[11px] uppercase font-black text-gray-400 ml-1">End Date</label>
            <div class="relative">
              <i class="pi pi-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input type="date" v-model="filters.end_date" 
                class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-semibold text-gray-700" />
            </div>
          </div>
        </div>

        <div class="w-full lg:w-auto flex gap-3">
          <div class="relative flex-1 lg:flex-none">
            <button @click="showCategory = !showCategory" 
              class="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
              <i class="pi pi-filter"></i> Categories
            </button>
            
            <div v-if="showCategory" class="absolute right-0 mt-3 bg-white shadow-2xl rounded-2xl w-64 p-4 z-30 border border-gray-100">
              <div class="max-h-60 overflow-y-auto custom-scrollbar pr-2">
                <div v-for="category in categories" :key="category" 
                  class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                  <input type="checkbox" :value="category" v-model="filters.categories" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span class="capitalize text-sm font-medium text-gray-600">{{ category }}</span>
                </div>
              </div>
              <button @click="fetchReport(); showCategory = false;"
                class="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition">
                Apply Filters
              </button>
            </div>
          </div>

          <button @click="fetchReport"
            class="flex-1 lg:flex-none px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
            RUN REPORT
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">Item Details</th>
              <th class="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Qty Sold</th>
              <th class="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">Pricing</th>
              <th class="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider">Net Revenue</th>
              <th class="py-4 px-6 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">Last Sale</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in report.data" :key="item.name" class="group hover:bg-blue-50/30 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {{ item.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-bold text-gray-700 capitalize">{{ item.name }}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-center">
                <span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-bold text-xs border border-gray-200">
                  {{ item.total_quantity }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 italic">Gross: Rs. {{ item.total_price }}</span>
                  <span class="text-[11px] text-red-500 font-medium">Disc: -Rs. {{ item.discount || 0 }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="text-sm font-black text-green-600">
                  Rs. {{ (item.total_price - item.discount) }}
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <span class="text-xs font-semibold text-gray-400">
                  {{ formatDate(item.last_sale_date) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="report.data.length === 0" class="flex flex-col items-center justify-center py-20 bg-white">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <i class="pi pi-inbox text-3xl text-gray-300"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-700">No data found</h3>
        <p class="text-gray-400 text-sm max-w-xs text-center">Try adjusting your date range or category filters to see results.</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto mt-4 text-center">
      <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">End of Report</p>
    </div>
  </div>
</template>

<style scoped>
/* Professional Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

/* Ensure nice date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.5;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
  
  <script setup>
  import { ref, onMounted,computed } from 'vue';
  import api from '@/plugins/axios';
  import Chart from 'chart.js/auto';
  import { VueSpinnerDots } from "vue3-spinners";
  
  const isLoading = ref(false);
  const report = ref({
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  });
  const categories = ref([]);
  const showCategory = ref(false);
  
  const filters = ref({
    start_date: '',
    end_date: '',
    categories: [],
    page: 1,
    per_page: 10,
  });
  
  const totalPages = computed(() => {
    return Math.ceil(report.value.total / filters.value.per_page);
  });
  
  const toggleCategory = () => {
    showCategory.value = !showCategory.value;
  };
  
  const fetchCategories = async () => {
  try {
    const response = await api.get(`/report/sale-items`);
    categories.value = response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
  
//   const fetchReport = async () => {
//     try {
//       const response = await axios.get(`${apiBaseUrl}/sale-report/filter`, {
//         params: filters.value,
//       });
//       report.value = response.data;
//     } catch (error) {
//       console.error('Error fetching report:', error);
//     }
//   };
  
  const changePage = (page) => {
    filters.value.page = page;
    fetchReport();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  onMounted(() => {
    fetchCategories();
    fetchReport();
  });


  const exportExcel = () => {
  window.open(`${apiBaseUrl}/sale-report/export-excel?start_date=${filters.value.start_date}&end_date=${filters.value.end_date}`, '_blank');
};

const exportPdf = () => {
  window.open(`${apiBaseUrl}/sale-report/export-pdf?start_date=${filters.value.start_date}&end_date=${filters.value.end_date}`, '_blank');
};

const renderChart = () => {
  const ctx = document.getElementById('saleChart').getContext('2d');
  if (window.saleChartInstance) {
    window.saleChartInstance.destroy();
  }
  window.saleChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: report.value.data.map(item => item.name),
      datasets: [{
        label: 'Total Quantity',
        data: report.value.data.map(item => item.total_quantity),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const fetchReport = async () => {
    isLoading.value = true
  try {
    const params = {
      start_date: filters.value.start_date,
      end_date: filters.value.end_date,
      categories: filters.value.categories,
    };
    const response = await api.get(`/report/sale-items`, { params });
    report.value = response.data;
    renderChart();
  } catch (error) {
    console.error('Error fetching report:', error);
  }finally{
    isLoading.value = false
  }
};
  </script>
  
  <style scoped>
  /* Scroll bar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #9ca3af;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #6b7280;
  }
  </style>
  