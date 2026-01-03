<template>
  <client-only>
    <div>
      <div ref="editor" class="h-72 border rounded-md" :class="{'border-red-500': error}">
      </div>

      <!-- ✅ Error Message -->
      <p v-if="error" class="text-red-500 text-sm mt-1">
        {{ error }}
      </p>
    </div>
  </client-only>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import 'quill/dist/quill.snow.css'

// ✅ Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: [String, Boolean],
    default: false
  }
})

// ✅ Emits
const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
let quill

onMounted(async () => {
  const { default: Quill } = await import('quill')

  quill = new Quill(editor.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3, false] }],
        ['link']
      ]
    }
  })

  // ✅ Initialize editor with parent’s current value
  quill.root.innerHTML = props.modelValue || ''

  // ✅ Emit changes to parent
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML)
  })
})

// ✅ Watch for parent updates (edit mode / form reset)
watch(
  () => props.modelValue,
  (newVal) => {
    if (quill && newVal !== quill.root.innerHTML) {
      quill.root.innerHTML = newVal || ''
    }
  }
)
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444;
}
</style>
