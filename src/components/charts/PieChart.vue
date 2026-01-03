<template>
  <div class="h-64">
    <Pie :data="data" :options="options" />
  </div>
</template>

<script setup>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

defineProps({ data: Object, title: String });

const options = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
  },
};
</script>
