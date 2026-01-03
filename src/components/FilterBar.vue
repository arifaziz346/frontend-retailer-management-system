<template>
  <div class="flex flex-row justify-between sm:flex-row items-center gap-1 w-full">

    <!-- Category Selector -->
    <div class="w-1/8">
      <!-- <label class="block text-sm font-medium mb-1">Select Category</label> -->
      <select
        v-model="localCategory"
        @change="emitFilters"
        class="placeholder:italic placeholder:text-slate-400
               block bg-white w-full border border-slate-300 rounded-md
               py-1.5 pl- pr-10 shadow-sm
               focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1
               sm:text-sm"
      >
        <option value="">All Categories</option>
        <option v-for="sub in subCategories" :key="sub.id" :value="sub.id">
          {{ sub.category_name }}
        </option>
      </select>
    </div>

    <!-- Search Bar -->
    <div class="relative w-full sm:w-1/4">
      <!-- <label class="block text-sm font-medium mb-1">Search</label> -->
      <input
        v-model="localSearch"
        @input="emitFilters"
        type="text"
        placeholder="Search Item..."
        class="placeholder:italic placeholder:text-slate-400 block bg-white w-full
               border border-slate-300 rounded-md py-1.5 pl-3 pr-10 shadow-sm
               focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1
               sm:text-sm"
      />

      <!-- Search Icon -->
      <i
        v-if="!localSearch"
        class="pi pi-search absolute right-3 bottom-2.5 text-gray-400"
      ></i>

      <!-- Clear Icon -->
      <i
        v-else
        @click="clearSearch"
        class="pi pi-times absolute right-3 bottom-2.5 text-gray-400 cursor-pointer"
      ></i>
    </div>



  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  subCategories: { type: Array, default: () => [] },
  showButton: { type: Boolean, default: true }
})



const emit = defineEmits(['update:search', 'update:category_id', 'click_add_category'])

const localSearch = ref('')
const localCategory = ref('')

const emitFilters = () => {
  emit('update:search', localSearch.value)
  emit('update:category_id', localCategory.value)
}

const clearSearch = () => {
  localSearch.value = ''
  emitFilters()
}
</script>
