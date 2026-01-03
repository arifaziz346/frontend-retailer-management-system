<!-- <template>
  <div class="flex items-start gap-2 w-full">
    <div class="flex-1 min-w-0">
      <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>

      <select
        v-model="model"
        class="block bg-white w-full border border-slate-300 rounded-md py-1.5 pl-3 pr-10
               shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1
               sm:text-sm"
      >
        <option value="">{{ placeholder }}</option>
        <option v-for="(item, index) in list" :key="index" :value="item">{{ item }}</option>
      </select>

      <p v-if="error" class="text-red-600 text-sm mt-1">{{ cleanError(error) }}</p>
    </div>

    <button
      v-if="showButton"
      class="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md shadow-sm"
      @click="$emit('action')"
    >
      {{ buttonName }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cleanError } from '@/utils/stringHelpers'

// Props
const props = defineProps({
  modelValue: String,
  list: { type: Array, default: () => [] },
  label: String,
  placeholder: { type: String, default: 'Select option' },
  error: String,
  showButton: Boolean,
  buttonName: { type: String, default: 'Add' }
})

// Emits
const emit = defineEmits(['update:modelValue', 'action'])

// Two-way binding
const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script> -->
<template>
  <div class="flex items-start gap-2 w-full">
    <!-- Main container with optional button on the right -->
    <div class="flex-1 min-w-0">
      <!-- Label for the select field -->
      <label v-if="label" class="block text-sm font-medium mb-1">{{ label }}</label>

      <!-- Select dropdown -->
      <select
        v-model="model"
        class="block bg-white w-full border border-slate-300 rounded-md py-1.5 pl-3 pr-10
               shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1
               sm:text-sm"
      >
        <!-- Default placeholder option -->
        <option value="">{{ placeholder }}</option>

        <!-- Iterate over the list to create options -->
        <option
          v-for="(item, index) in list"
          :key="index"
          :value="getValue(item)"
        >
         <!-- value can be simple or object value -->

          {{ getLabel(item) }} <!-- label can be simple string or object label -->
        </option>
      </select>

      <!-- Error message -->
      <p v-if="error" class="text-red-600 text-sm mt-1">{{ cleanError(error) }}</p>
    </div>

    <!-- Optional action button -->
    <button
      v-if="showButton"
      class="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md shadow-sm"
      @click="$emit('action')"
    >
      {{ buttonName }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { cleanError } from '@/utils/stringHelpers';

// ---------------------------
// Props definition
// ---------------------------
const props = defineProps({
  modelValue: [String, Number], // value bound to select
  list: { type: Array, default: () => [] }, // list of options (array of string or array of objects)
  label: String, // optional label for the field
  placeholder: { type: String, default: 'Select option' }, // placeholder option
  error: String, // optional error message
  showButton: Boolean, // if true, show extra button
  buttonName: { type: String, default: 'Add' } // label for the extra button
});

// ---------------------------
// Emit events
// ---------------------------
const emit = defineEmits(['update:modelValue', 'action']);

// ---------------------------
// Two-way binding for v-model
// ---------------------------
const model = computed({
  get() {
    return props.modelValue; // get value from parent
  },
  set(value) {
    emit('update:modelValue', value); // emit value back to parent
  }
});

// ---------------------------
// Helper to get option label
// Handles both strings and objects
// ---------------------------
const getLabel = (item) => {
  // If object with label property, return label
  if (typeof item === 'object' && item !== null && 'label' in item) return item.label;
  // Otherwise, return item itself
  return item;
};

// ---------------------------
// Helper to get option value
// Handles both strings and objects
// ---------------------------
const getValue = (item) => {
  // If object with value property, return value
  if (typeof item === 'object' && item !== null && 'value' in item) return item.value;
  // Otherwise, return item itself
  return item;
};
</script>
