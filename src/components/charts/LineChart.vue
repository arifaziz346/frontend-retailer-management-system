<template>
  <div class="h-64">
    <Line :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

defineProps({
  data: { type: Object, required: true },
  title: { type: String, default: "" },
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: { display: true, position: 'top' },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: {
      display: true,
      title: { display: false },
      ticks: { maxRotation: 0, autoSkip: true },
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
};
</script>

<style scoped>
/* keep simple styling; your Tailwind handles padding/size */
</style>
