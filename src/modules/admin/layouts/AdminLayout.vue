<template>
  <div class="min-h-screen bg-gray-100 flex flex-col w-full">


    <!-- NAVBAR: fixed and full width -->
    <NavBar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

    <!-- Page content: add top padding equal to navbar height (h-14 => pt-14) -->
    <div class="flex flex-1 w-full pt-14">
      <!-- Desktop sidebar (static, below navbar) -->
      <aside class="hidden md:flex w-40 bg-white shadow-lg flex-shrink-0">
        <SideBar />
      </aside>

      <!-- Mobile sidebar drawer (fixed, appears below navbar) -->
      <transition name="slide">
        <aside
          v-if="isSidebarOpen"
          class="fixed left-0 right-0 md:hidden z-50 top-14 w-full max-w-xs bg-white shadow-lg"
          style="width: 18rem;"

        >
          <SideBar @close="isSidebarOpen = false" />
        </aside>
      </transition>

      <!-- Mobile overlay (covers content when drawer open) -->
      <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = false"
        class="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
      >
    </div>

      <!-- MAIN: flexible, occupies remaining width -->
      <!-- <main class="flex-1 w-full p-1 md:p-6 overflow-y-auto"> -->
        <MainContent />
      <!-- </main> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './NavBar.vue'
import SideBar from './SideBar.vue'
import MainContent from './MainContent.vue'

const isSidebarOpen = ref(false)
</script>

<style scoped>
/* Slide animation for mobile drawer */
.slide-enter-active,
.slide-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-enter-from { transform: translateX(-12%); opacity: 0; }
.slide-enter-to { transform: translateX(0); opacity: 1; }
.slide-leave-from { transform: translateX(0); opacity: 1; }
.slide-leave-to { transform: translateX(-12%); opacity: 0; }
</style>
