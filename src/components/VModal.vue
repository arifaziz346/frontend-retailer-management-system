<template>
  <div class="fixed w-full h-full top-0 left-0 flex items-center justify-center z-10" v-if="isOpen">
    <!-- Overlay -->
    <div class="absolute w-full h-full bg-gray-900 opacity-50" @click="close"></div>

    <!-- Modal Container -->
    <div class="absolute max-h-[90vh] w-[90vw] md:w-auto" :class="[maxWidth, 'bg-white overflow-hidden md:rounded']">
      <!-- Modal Header -->
      <div class="px-4 py-4 leading-none flex justify-between items-center font-medium text-sm bg-gray-100 border-b select-none">
        <h3>{{ title }}</h3>
        <div @click="close" class="text-2xl hover:text-gray-600 cursor-pointer">
          &#215;
        </div>
      </div>

      <!-- Modal Content (Scrollable) -->
      <div class="overflow-y-auto max-h-[calc(90vh-8rem)] px-4 py-0.5">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "full",
    validator: (value) => ["xs", "sm", "md", "lg", "full"].indexOf(value) !== -1,
  },
});

// Emitters
const emit = defineEmits(["close"]);

// Local state for modal open status
const isOpen = ref(true);

// Method to close the modal
function close() {
  isOpen.value = false;
  emit("close");
}

// Compute max-width based on the `width` prop
const maxWidth = computed(() => {
  switch (props.width) {
    case "xs":
      return "max-w-lg";
    case "sm":
      return "max-w-xl";
    case "md":
      return "max-w-2xl";
    case "lg":
      return "max-w-3xl";
    case "full":
      return "max-w-full";
    default:
      return "";
  }
});

// Prevent scrolling on the body when modal is open
watch(isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    document.addEventListener("keydown", onEscape);
  } else {
    document.body.style.overflow = ''; // Restore scrolling
    document.removeEventListener("keydown", onEscape);
  }
});

// Handle Escape key to close the modal
const onEscape = (e) => {
  if (e.key === "Escape") {
    close();
  }
};
</script>

<style scoped>
/* Add any additional styling here */
</style>