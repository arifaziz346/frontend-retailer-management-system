

<template>
  <TransitionRoot appear :show="props.modelValue" as="template">
    <Dialog as="div" class="relative z-50" @close="close">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <!-- Modal panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
          >
            <!-- Title -->
            <DialogTitle class="text-lg font-bold text-gray-800 mb-4 px-4 pt-4">
              {{ props.title }}
            </DialogTitle>

            <!-- Content (scrollable) -->
            <div class="flex-1 overflow-y-auto px-4 space-y-4 mb-5">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="showFooter" class="mt-4 flex justify-end gap-2 border-t border-t-gray-200 px-4 py-3">
              <button v-if="showCancelBtn" @click="close" class="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button :disabled="disableSaveBtn" v-if="showSaveBtn" @click="$emit('save')" class="px-4 py-2 bg-blue-600 text-white rounded">
                {{disableSaveBtn?'Wait':'Save'}}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  showSaveBtn:{type:String,default:true},
  showCancelBtn:{type:String,default:true},
  showFooter:{type:String,default:true},
  disableSaveBtn:{type:Boolean,default:false},

})

const emit = defineEmits(['update:modelValue','save'])
const close = () => {
  emit('update:modelValue', false)
}

// watch(
//   () => props.modelValue,
//   (newVal) => {
//     if (quill && newVal !== quill.root.innerHTML) {
//       quill.root.innerHTML = newVal || ''
//     }
//   }
// )
</script>
