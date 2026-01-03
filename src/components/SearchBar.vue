<template>
  <div class="relative flex items-center ml-1 mr-1">
    <input
      :class="inputClasses"
      :placeholder="placeholder"
      type="text"
      :name="name"
      v-model="searchQuery"
      @input="onInput"
    />
    <!-- Search Icon (Visible when input is empty) -->
    <i
      v-if="!searchQuery"
      class="pi pi-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
    ></i>
    <!-- Clear Icon (Visible when input has text) -->
    <i
      v-else
      class="pi pi-times absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
      @click="clearSearch"
    ></i>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search...',
  },
  name: {
    type: String,
    default: 'search',
  },
});

const searchQuery = ref('');

const inputClasses = computed(
  () =>
    'placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-1.5 pl-3 pr-10 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm'
);

const emit = defineEmits(['input']);

const onInput = () => {
  emit('input', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = ''; // Clear the input
  emit('input', ''); // Emit an empty value
};
</script>

<style scoped>
/* Add any additional styles if necessary */
</style>
