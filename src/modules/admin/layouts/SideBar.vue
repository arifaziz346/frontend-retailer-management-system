<template>
  <div class="h-full flex flex-col bg-white border-r border-gray-200">

    <!-- Mobile close -->
    <div class="md:hidden flex justify-end p-3">
      <button
        @click="$emit('close')"
        class="p-2 rounded-md hover:bg-gray-100 transition"
      >
        ✕
      </button>
    </div>

    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-100">
      <div class="text-sm font-semibold">Main Menu</div>
      <div class="text-xs text-gray-500 mt-1">Welcome, Admin</div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-1">
      <div v-for="item in menu" :key="item.name">

        <!-- Parent Menu -->
        <div
          @click="handleMenuClick(item)"
          class="flex items-center justify-between w-full px-3 py-2 rounded-md cursor-pointer transition"
          :class="isParentActive(item)
            ? 'bg-gray-200 font-semibold text-blue-600'
            : 'text-gray-700 hover:bg-gray-100'"
        >
          <span class="flex items-center gap-2">
            <span class="w-5 h-5 flex items-center justify-center">
              ☰
            </span>
            {{ item.name }}
          </span>

          <!-- Arrow -->
          <svg
            v-if="item.children"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-90': item.open }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <!-- Submenu -->
        <transition name="fade">
          <div
            v-if="item.open && item.children"
            class="ml-8 mt-1 space-y-1"
          >
            <router-link
              v-for="child in item.children"
              :key="child.route"
              :to="child.route"
              class="block px-3 py-1.5 rounded-md text-sm transition"
              :class="isChildActive(child)
                ? 'bg-gray-200 font-medium text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ child.name }}
            </router-link>
          </div>
        </transition>

      </div>
    </nav>

    <!-- Footer -->
    <div class="px-3 py-3 border-t border-gray-100">
      <button class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition">
        Settings
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/* ---------------- MENU DATA ---------------- */
const menu = ref([
  // { name: 'Item', route: '/admin/item' },
  { name:'Stock',
    open:false,
    children:[
      { name: 'Item', route: '/admin/item' },
      { name: 'Category', route: '/admin/category' },
      { name: 'Units', route: '/admin/unit' }
    ]

  },
  { name: 'Supplier', route: '/admin/supplier' },
  {
    name: 'Sale',
    open: false,
    children: [
      { name: 'Sale', route: '/admin/sale' },
      { name: 'Sales-list', route: '/admin/sale-list' },
      // { name: 'Report', route: '/admin/report-sale-items' },
    ]
  },
  {
    name: 'Report',
    open: false,
    children: [
      { name: 'Sale-Items', route: '/admin/report-sale-items'},
      { name: 'Transactions', route: '/admin/report-transactions'},
      { name: 'All', route: '/admin/report-all'},
    ]
  },
  { name: 'Credit', route: '/admin/credit-customers' },
  { name: 'Expense', route: '/admin/expense' },

  {
    name: 'Account',
    open: false,
    children: [
      { name: 'Account', route: '/admin/accounts' },
      { name: 'Transaction', route: '/admin/transactions' },
      
    ]
  },

  { name: 'Customer', route: '/admin/customer' },
  { name: 'Admins', route: '/admin/admins' },
  { name: 'About', route: '/admin/about' },
])

/* ---------------- METHODS ---------------- */

// Parent click
const handleMenuClick = (item) => {
  if (item.children) {
    item.open = !item.open
  } else {
    router.push(item.route)
  }
}

// Parent active
const isParentActive = (item) => {
  if (item.children) {
    return item.children.some(child => route.path === child.route)
  }
  return route.path === item.route
}

// Child active
const isChildActive = (child) => route.path === child.route

/* -------- AUTO OPEN SUBMENU ON PAGE LOAD -------- */
watch(
  () => route.path,
  () => {
    menu.value.forEach(item => {
      if (item.children) {
        item.open = item.children.some(
          child => route.path === child.route
        )
      }
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
