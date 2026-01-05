<template>
  <div class="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <div class="p-6 border-b border-slate-100 bg-slate-50/30">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800">{{ title }}</h1>
          <p class="text-slate-500 text-xs mt-1 font-medium uppercase tracking-wider">{{ dateRangeText }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="localFilters.type"
            @change="handleTypeChange"
            class="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          >
            <option value="daily">Today</option>
            <option value="weekly">Weekly</option>
            <option value="15days">15 Days</option>
            <option value="6months">6 Months</option>
            <option value="yearly">Yearly</option>
            <!-- <option value="custom">Custom Range</option> -->
          </select>

          <div v-if="localFilters.type === 'custom'" class="flex items-center gap-2 animate-in fade-in duration-300">
            <input
              type="date"
              v-model="localFilters.start_date"
              class="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span class="text-slate-400 text-xs font-bold">TO</span>
            <input
              type="date"
              v-model="localFilters.end_date"
              class="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            @click="emitFilter"
            :disabled="isLoading"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition-all text-sm disabled:bg-slate-300"
          >
            {{ isLoading ? 'Syncing...' : (localFilters.type === 'custom' ? 'Apply Range' : 'Generate') }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50/50">
      <div 
        v-for="col in columns.slice(0, 4)" 
        :key="col.key"
        class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
      >
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ col.label }}</span>
        <div class="text-lg font-extrabold text-slate-900 mt-1 truncate">
          {{ formatCurrency(data[col.key]) }}
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-100/50 border-y border-slate-200">
            <th v-for="col in columns" :key="col.key" class="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="Object.keys(data).length" class="hover:bg-blue-50/30 transition-colors">
            <td v-for="col in columns" :key="col.key" class="px-6 py-4 text-sm font-semibold">
              <span :class="getValueClass(col.key, data[col.key])">
                {{ formatCurrency(data[col.key]) }}
              </span>
            </td>
          </tr>
          <tr v-else>
            <td :colspan="columns.length" class="px-6 py-10 text-center text-slate-400 text-sm italic">
              No financial records found for this period.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true },
  columns: { type: Array, required: true },
  title: { type: String, default: 'Financial Report' },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['filter'])

const localFilters = ref({
  type: 'daily',
  start_date: '',
  end_date: '',
})

// --- Logic Functions ---

const handleTypeChange = () => {
  if (localFilters.value.type !== 'custom') {
    localFilters.value.start_date = '';
    localFilters.value.end_date = '';
    emitFilter();
  }
}

const emitFilter = () => {
  if (localFilters.value.type === 'custom') {
    if (!localFilters.value.start_date || !localFilters.value.end_date) {
      alert("Please select both dates for the range.");
      return;
    }
  }
  emit('filter', { ...localFilters.value });
}

// --- Formatting Functions (This fixes your error) ---

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num).replace('₹', '₨ ');
}

const getValueClass = (key, val) => {
  const num = Number(val) || 0;
  // Make Profit Green, Expenses/Discounts Red
  if (key === 'profit') return num >= 0 ? 'text-emerald-600' : 'text-rose-600';
  if (key === 'expense' || key === 'discount') return 'text-rose-500';
  return 'text-slate-700';
}

const dateRangeText = computed(() => {
  if (localFilters.value.type === 'custom' && localFilters.value.start_date) {
    return `Range: ${localFilters.value.start_date} to ${localFilters.value.end_date || '...'}`;
  }
  const today = new Date().toLocaleDateString('en-GB');
  return `${localFilters.value.type.toUpperCase()} Report | Updated ${today}`;
})
</script>