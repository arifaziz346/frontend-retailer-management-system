<template>
  <div class="w-full p-4 space-y-4">
    
    <!-- Page Title -->
    <div class="text-center mb-4">
      <h1 class="text-lg lg:text-xl font-bold">Financial Report</h1>
      <p class="text-gray-600 text-xs lg:text-sm">
        View daily, weekly, monthly, and custom reports with sales, profit, expenses, and account details
      </p>
    </div>

    <!-- Filters + Title + Date Range Row -->
    <div class="flex flex-col lg:flex-row lg:items-end gap-3 justify-between w-full flex-wrap">

      <!-- Filters (left side) -->
      <div class="flex flex-wrap gap-3 items-start lg:items-end">
        <!-- Report Type -->
        <div>
          <label class="text-xs lg:text-sm font-medium">Report Type</label>
          <select
            v-model="localFilters.type"
            @change="emitFilter"
            class="w-full border border-gray-300 rounded px-2 py-1 text-xs lg:text-sm"
          >
            <option value="daily">Today</option>
            <option value="weekly">Weekly</option>
            <option value="15days">15 Days</option>
            <option value="6months">6 Months</option>
            <option value="yearly">Yearly</option>
            <!-- <option value="custom">Custom</option> -->
          </select>
        </div>

        <!-- Start Date -->
        <div v-if="localFilters.type === 'custom'">
          <label class="text-xs lg:text-sm font-medium">Start Date</label>
          <input
            type="date"
            v-model="localFilters.start_date"
            class="border rounded px-2 py-1 text-xs lg:text-sm"
          />
        </div>

        <!-- End Date -->
        <div v-if="localFilters.type === 'custom'">
          <label class="text-xs lg:text-sm font-medium">End Date</label>
          <input
            type="date"
            v-model="localFilters.end_date"
            class="border rounded px-2 py-1 text-xs lg:text-sm"
          />
        </div>

        <!-- Generate Button -->
        <button
          class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs lg:text-sm"
          @click="emitFilter"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Wait Generating...' : 'Generate Report' }}
        </button>
      </div>

      <!-- Centered Report Title -->
      <!-- <div class="flex-1 flex justify-center mt-2 lg:mt-0">
        <h2 class="font-bold text-xs lg:text-sm text-center">
         {{ friendlyTitle }}
        </h2>
      </div> -->

      <!-- Date Range (right side) -->
      <div class="text-right mt-2 lg:mt-0 text-xs lg:text-sm text-gray-700">
        <p>{{ backendDateRange || dateRangeText }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded border border-gray-300 mt-2 shadow-sm">
      <table class="min-w-full text-xs lg:text-sm text-left">
        <thead class="bg-gray-100 border-b border-gray-300">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-3 py-2 text-gray-700 uppercase font-medium whitespace-nowrap"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="Object.keys(data).length">
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-3 py-2 border-b border-gray-300"
            >
              {{ data[col.key] ?? 0 }}
            </td>
          </tr>

          <tr v-else>
            <td
              :colspan="columns.length"
              class="text-center py-6 text-gray-500"
            >
              No data found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

defineProps({
  data: { type: Object, required: true },
  columns: { type: Array, required: true },
  title: { type: String, required: false },
  isLoading: { type: Boolean, required: false, default: false },
})

const emit = defineEmits(['filter'])

const localFilters = ref({
  type: 'daily',
  start_date: '',
  end_date: '',
})

// Backend can optionally send these for friendly UI
const backendTitle = ref('')
const backendDateRange = ref('')

// Emit filter to parent
const emitFilter = () => {
  emit('filter', { ...localFilters.value })
}

// Friendly title (default fallback)
const friendlyTitle = computed(() => {
  switch (localFilters.value.type) {
    case 'daily': return 'Daily Report'
    case 'weekly': return 'Weekly Report'
    case '15days': return '15 Days Report'
    case '6months': return '6 Months Report'
    case 'yearly': return 'Yearly Report'
    case 'custom': return 'Custom Report'
    default: return 'Report'
  }
})

// Default computed date text (if backend not provided)
const dateRangeText = computed(() => {
  if (localFilters.value.type === 'custom') {
    if (localFilters.value.start_date && localFilters.value.end_date) {
      return `From ${localFilters.value.start_date} to ${localFilters.value.end_date}`
    } else {
      return 'Please select start and end dates'
    }
  }

  const today = new Date()
  const todayStr = today.toISOString().slice(0,10)
  switch (localFilters.value.type) {
    case 'daily': return `Date: ${todayStr}`
    case 'weekly': return `Last 7 days (until ${todayStr})`
    case '15days': return `Last 15 days (until ${todayStr})`
    case '6months': return `Last 6 months (until ${todayStr})`
    case 'yearly': return `Current Year (until ${todayStr})`
    default: return ''
  }
})

// Watch backend data for title/date updates
watch(
  () => localFilters.value,
  () => {
    // Reset backend overrides when user changes filters
    backendTitle.value = ''
    backendDateRange.value = ''
  },
)
</script>
