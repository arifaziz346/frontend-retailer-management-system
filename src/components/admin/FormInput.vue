<template>
    <div>
      <label :for="id" class=" block text-sm  font-medium mb-1 text-gray-900 dark:text-white">
        {{ label }}
      </label>
      <input
  :id="id"
  :type="type"
  :placeholder="placeholder"
  :required="required"
  :value="modelValue"
  :disabled="disabled"
  autocomplete="new-password"
  @input="$emit('update:modelValue', $event.target.value)"
  class="w-full px-1 py-2 md:px-4 md:py-2 p-2.5 text-sm rounded-sm bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:ring-blue-500 focus:border-blue-500"
/>

 <p v-if="error" class="text-red-600 text-sm">{{cleanError(error) }}</p>
    </div>

  </template>

<script setup>
import { limitDisplayText, cleanError } from '@/utils/stringHelpers'

defineProps({
  label: String,
  type: String,
  id: String,
  placeholder: String,
  required: Boolean,
  modelValue: String,
  error: String,
  autocomplete: {
    type: String,
    default: 'off', // ✅ disable autocomplete by default
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue'])
</script>

