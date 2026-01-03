<template>
  <div class="p-4 space-y-6">
    <!-- Loader -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50"
    >
      <VueSpinnerDots size="50px" color="#3b82f6" />
    </div>

    <!-- ========== ORDER ANALYTICS ========== -->
    <section class="bg-white shadow rounded-2xl p-4">
      <header class="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
        <h2 class="font-semibold text-gray-700">Order</h2>
        <button
          @click="fetchDashboardData"
          class="text-sm text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-center border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th>Date</th>
                <th>Order</th>
                <th>Pending</th>
                <th>Delivered</th>
                <th>Cancelled</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in dashboard.orders" :key="i">
                <td>{{ item.date }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.pending }}</td>
                <td>{{ item.delivered }}</td>
                <td>{{ item.cancelled }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <LineChart
          v-if="dashboard.orders.length"
          :data="chartOrdersData"
           title="Order Summary"/>
          <NoData v-else />
        </div>
      </div>
    </section>

    <!-- ========== SALES ANALYTICS ========== -->
    <section class="bg-white shadow rounded-2xl p-4">
      <header class="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
        <h2 class="font-semibold text-gray-700">Sales Analytics</h2>

        <select
          v-model="filters.sales"
          @change="fetchDashboardData"
          class="border rounded px-2 py-1 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-center border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th>Date</th>
                <th>Sale</th>
                <th>Profit</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in dashboard.sales" :key="i">
                <td>{{ item.date }}</td>
                <td>{{ item.sale }}</td>
                <td>{{ item.profit }}</td>
                <td>{{ item.net_profit }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <BarChart
            v-if="dashboard.sales.length"
            :data="chartSalesData"
            title="Sales Performance"
          />
          <NoData v-else />
        </div>
      </div>
    </section>

    <!-- ========== TOP SELLING PRODUCTS ========== -->
    <section class="bg-white shadow rounded-2xl p-4">
      <header class="border-b border-gray-300 pb-2 mb-2 font-semibold text-gray-700">
        Top Selling Products
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-center border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th>Product</th>
                <th>Sold</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in dashboard.top_products" :key="i">
                <td>{{ item.name }}</td>
                <td>{{ item.total_sold }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <BarChart
            v-if="dashboard.top_products.length"
            :data="chartTopProductsData"
            title="Top Selling Products"
          />
          <NoData v-else />
        </div>
      </div>
    </section>

    <!-- ========== CUSTOMER INSIGHTS ========== -->
    <section class="bg-white shadow rounded-2xl p-4">
      <header class="border-b border-gray-300 pb-2 mb-2 font-semibold text-gray-700">
        Customer Insights
      </header>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <h3 class="text-lg font-semibold">{{ dashboard.customers.total }}</h3>
          <p class="text-gray-500 text-sm">Total Customers</p>
        </div>
        <div>
          <h3 class="text-lg font-semibold">{{ dashboard.customers.retention_rate }}%</h3>
          <p class="text-gray-500 text-sm">Retention Rate</p>
        </div>
        <div>
          <PieChart
            v-if="dashboard.customers.regions"
            :data="chartCustomerData"
            title="Demographics"
          />
          <NoData v-else />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import api from "@/plugins/axios";
import BarChart from "@/components/charts/BarChart.vue";
import PieChart from "@/components/charts/PieChart.vue";
import LineChart from "@/components/charts/LineChart.vue";
import NoData from "@/components/common/NoData.vue";

const isLoading = ref(false);
const dashboard = reactive({
  orders: [],
  sales: [],
  top_products: [],
  customers: {},
});

const filters = reactive({
  sales: "monthly",
});

const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.get(`/admin/dashboard`, {
      params: { filter: filters.sales },
    });

    console.log('Data-',data)
    Object.assign(dashboard, data);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

// ==========> Orders <===========
const chartOrdersData = computed(() => ({
  labels: dashboard.orders.map(o => o.date), // date strings e.g. '2025-10-27'
  datasets: [
    {
      label: "Total Orders",
      data: dashboard.orders.map(o => Number(o.total) || 0),
      type: 'line',
      tension: 0.25,
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      borderColor: "#3b82f6",
    },
    {
      label: "Pending",
      data: dashboard.orders.map(o => Number(o.pending) || 0),
      type: 'line',
      tension: 0.25,
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      borderColor: "#f59e0b",
    },
    {
      label: "Delivered",
      data: dashboard.orders.map(o => Number(o.delivered) || 0),
      type: 'line',
      tension: 0.25,
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      borderColor: "#10b981",
    },
    {
      label: "Cancelled",
      data: dashboard.orders.map(o => Number(o.cancelled) || 0),
      type: 'line',
      tension: 0.25,
      borderWidth: 2,
      pointRadius: 3,
      fill: false,
      borderColor: "#ef4444",
    },
  ],
}));



// =======> Sales Analytics <===========
const chartSalesData = computed(() => ({
  labels: dashboard.sales.map((s) => s.date),
  datasets: [
    {
      label: "Net Profit",
      data: dashboard.sales.map((s) => s.net_profit),
      backgroundColor: "#10b981",
    },
  ],
}));
// =======> Top Product Data <===========
const chartTopProductsData = computed(() => ({
  labels: dashboard.top_products.map((p) => p.name),
  datasets: [
    {
      label: "Units Sold",
      data: dashboard.top_products.map((p) => p.total_sold),
      backgroundColor: "#f59e0b",
    },
  ],
}));

const chartCustomerData = computed(() => ({
  labels: Object.keys(dashboard.customers.regions || {}),
  datasets: [
    {
      data: Object.values(dashboard.customers.regions || {}),
      backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#f87171"],
    },
  ],
}));

onMounted(fetchDashboardData);
</script>

<style scoped>
table th,
table td {
  padding: 6px 8px;
}
</style>
