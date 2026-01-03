<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      :for="id"
      class="text-xs lg:text-sm font-medium mb-1"
    >
      {{ label }}
    </label>

    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      @change="onChange"
      class="placeholder:italic placeholder:text-slate-400 block bg-white w-full
                 border border-slate-300 rounded-md py-1.5 pl-3 pr-10 shadow-sm
                 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1
                 sm:text-sm"
    >
      <!-- Default option -->
      <option v-if="placeholder" value="">
        {{ placeholder }}
      </option>

      <!-- Handle Array & Object -->
      <option
        v-for="(item, index) in normalizedOptions"
        :key="index"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>

    <p v-if="error" class="text-red-600 text-sm mt-1">
      {{ cleanError(error) }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cleanError } from '@/utils/stringHelpers'

const props = defineProps({
  id: String,
  label: String,
  modelValue: [String, Number],
  options: {
    type: [Array, Object],
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: String,
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

/**
 * Normalize options to:
 * [{ label: 'Deposit', value: 'Deposit' }]
 */
const normalizedOptions = computed(() => {
  // Case 1: Array
  if (Array.isArray(props.options)) {
    return props.options.map(item => {
      if (typeof item === 'object') {
        return {
          label: item.label ?? item.name ?? item.value,
          value: item.value ?? item.id ?? item.label,
        }
      }
      return { label: item, value: item }
    })
  }

  // Case 2: Object { key: value }
  return Object.entries(props.options).map(([key, value]) => ({
    label: value,
    value: key,
  }))
})

const onChange = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>
