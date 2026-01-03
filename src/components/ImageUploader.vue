<script setup>
import { ref, watch } from 'vue'
import { useUtils } from '@/composables/admin/useUtils'
const { formatErrors } = useUtils()
const props = defineProps({
  modelValue: { type: [Array, String], default: () => [] }, // ✅ allow Array or String
  label: { type: String, default: 'Upload Images' },
  error: { type: String, default: '' },
  multiple: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue','removeVariantImage'])
const previews = ref([])

// Sync previews with modelValue
watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      previews.value = []
      return
    }

    // ✅ If string → convert to array
    const files = Array.isArray(val) ? val : [val]

    previews.value = files.map((item) =>
      typeof item === 'string' ? item : URL.createObjectURL(item)
    )
  },
  { immediate: true }
)

const onFileChange = (event) => {
  const files = Array.from(event.target.files)
  const newPreviews = files.map((file) => URL.createObjectURL(file))

  // ✅ Prepend latest first
  previews.value = props.multiple
    ? [...newPreviews, ...previews.value]
    : newPreviews

  emit(
    'update:modelValue',
    props.multiple ? [...files, ...(Array.isArray(props.modelValue) ? props.modelValue : [])] : files
  )
}

const removeImage = (index) => {

  emit('removeVariantImage')
  previews.value.splice(index, 1)
  if (Array.isArray(props.modelValue)) {
    const newModelValue = [...props.modelValue]
    newModelValue.splice(index, 1)
    emit('update:modelValue', newModelValue)
  } else {
    emit('update:modelValue', null) // ✅ clear single string
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>

    <!-- Upload input always on top -->
    <input
      type="file"
      :multiple="multiple"
      accept="image/*"
      @change="onFileChange"
      class="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4
             file:rounded-md file:border-0 file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>

   <p v-if="error" class="text-sm md:xs text-red-500 mt-1 whitespace-pre-line">
     {{ formatErrors(error) }}</p>

    <!-- Image previews -->
    <div class="flex flex-wrap gap-3 mt-3 max-h-[350px] overflow-y-auto pr-1">
      <div
        v-for="(src, index) in previews"
        :key="index"
        class="relative w-[200px] h-[300px] border rounded-lg overflow-hidden"
      >
        <img :src="src" alt="preview" class="object-cover w-full h-full" />
        <button
          type="button"
          class="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
          @click="removeImage(index)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
