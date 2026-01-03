<script setup>
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Props from parent
const props = defineProps({
  stock: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  size: { type: Number, default: 60 } // diameter of chart
})

// Dynamic chart data
const chartData = {
  labels: ['Stock', 'Sold'],
  datasets: [
    {
      data: [props.stock, props.sold || 0],
      backgroundColor: ['#3B82F6', '#F87171'], // blue, red
      borderWidth: 0
    }
  ]
}

// Chart options (no legend, clean display)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  layout: {
    padding: 0
  }
}
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
