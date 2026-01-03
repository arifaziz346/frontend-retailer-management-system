<template>
  <div class="h-64">
    <Bar :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

defineProps({
  data: Object,
  title: String,
});

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    // title: { display: true, text: "Bar Chart" },
  },
};
</script>
