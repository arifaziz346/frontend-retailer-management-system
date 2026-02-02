<template>
  <div
    v-if="pagination && (pagination.prev_page_url || pagination.next_page_url)"
    class="flex justify-end mt-3 m-1"
  >
    <!-- Previous -->
    <button
      v-if="pagination.prev_page_url"
      @click="$emit('page-change', pagination.prev_page_url)"
      class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800
      focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs md:text-sm
      px-2 py-1.5 mr-2 transition"
    >
      Previous
    </button>

    <!-- Next -->
    <button
      v-if="pagination.next_page_url"
      @click="$emit('page-change', pagination.next_page_url)"
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
    default: () => ({}),
  },
});

defineEmits(["page-change"]);
</script>
