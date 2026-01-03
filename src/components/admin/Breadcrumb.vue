<template>
  <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
    <!-- Home -->
    <router-link
      :to="homeRoute"
      class="flex items-center hover:text-blue-600 transition-colors"
    >
      <i class="pi pi-home mr-1 text-2xl"></i>
      <span class="sm:inline">{{ homeLabel }}</span>
    </router-link>

    <!-- Dynamic breadcrumb items -->
    <template v-for="(crumb, index) in computedBreadcrumbs" :key="index">
      <span class="font-semibold text-gray-900">/</span>

      <!-- Go back button for second-to-last item -->
      <button
        v-if="crumb.isBack"
        @click="goBack(crumb.fallback)"
        class="sm:inline font-medium text-blue-600 hover:text-blue-800"
      >
        {{ crumb.label }}
      </button>

      <!-- Normal router link -->
      <router-link
        v-else-if="crumb.route"
        :to="crumb.route"
        class="sm:inline font-medium text-blue-600 hover:text-blue-800"
      >
        {{ crumb.label }}
      </router-link>

      <!-- Current page (last segment) -->
      <span v-else class="sm:inline font-bold text-gray-900">
        {{ crumb.label }}
      </span>
    </template>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter()
const route = useRoute()

// Home link
const homeRoute = "/admin/Supplier"
const homeLabel = "Supplier"

// Generate breadcrumbs dynamically from route.path
const computedBreadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean) // remove empty segments
  const crumbs = []

  segments.forEach((seg, index) => {
    const label = seg.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())

    // Last segment → current page
    if (index === segments.length - 1) {
      crumbs.push({ label })
    }
    // Second-to-last → go back button
    else if (index === segments.length - 2) {
      crumbs.push({ label, isBack: true, fallback: homeRoute })
    }
    // Middle segments → normal link
    else {
      crumbs.push({ label, route: "/" + segments.slice(0, index + 1).join("/") })
    }
  })

  return crumbs
})

// Go back or fallback
const goBack = (fallback) => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(fallback)
  }
}
</script>
