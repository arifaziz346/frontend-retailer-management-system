<template>
  <div class="flex items-start gap-2 w-full">

    <div class="flex-1 min-w-0">
      <label class="block text-sm font-medium mb-1">{{ label }}</label>

      <div class="relative w-auto">

        <select
          v-model="model"
          class="placeholder:italic placeholder:text-slate-400 block bg-white w-full
                 border border-slate-300 rounded-md py-1.5 pl-3 pr-10 shadow-sm
                 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1
                 sm:text-sm"
        >
          <!-- Default option -->
          <option value="other">Other</option>

          <!-- Dynamic options -->
          <option
            v-for="sub in sub_categories"
            :key="sub.id"
            :value="sub.id"
          >
            {{ sub.category_name }}
          </option>
        </select>

      </div>

    </div>

    <!-- ⭐ Conditionally Show Button -->
    <button
      v-if="show_button"
      class="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md
             shadow-sm border border-green-700"
      @click="emit('click_sub_category')"
    >
      {{ button_name }}
    </button>
  </div>
</template>

<script setup>
import { cleanError } from '@/utils/stringHelpers'

const model = defineModel({
  default: 'other' // ✅ Set default to “Other”
})

const props = defineProps({
  label: { type: String, default: 'Select' },
  sub_categories: { type: Array, default: () => [] },
  error: String,
  button_name: { type: String, default: 'Add' },
  show_button: { type: Boolean, default: true },
})

const emit = defineEmits(['click_sub_category'])
</script>
