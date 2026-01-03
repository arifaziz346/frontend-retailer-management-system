<!-- components/Pagination.vue -->
<template>
  <div
    v-if="pagination && (pagination.prevPageUrl || pagination.nextPageUrl)"
    class="flex justify-end mt-3 m-1"
  >
    <!-- Previous -->
    <button
      v-if="pagination && pagination.prevPageUrl"
      @click="$emit('page-change', pagination.prevPageUrl)"
      class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800
      focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs md:text-sm
      px-2 py-1.5 mr-2 transition"
    >
      Previous
    </button>

    <!-- Next -->
    <button
      v-if="pagination && pagination.nextPageUrl"
      @click="$emit('page-change', pagination.nextPageUrl)"
      class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800
      focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs md:text-sm
      px-2 py-1.5 transition"
    >
      Next
    </button>
  </div>
</template>

<script setup>
defineProps({
  pagination: {
    type: Object,
    required: false,
    default: () => ({})
  }
});

defineEmits(["page-change"]);
</script>
