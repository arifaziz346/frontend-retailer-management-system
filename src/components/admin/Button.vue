<template>
  <button
    :class="[
      baseClass,
      sizeClasses[size],
      variantClasses[variant],
      { 'w-full': block }
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

// ✅ Props make the button reusable and customizable
const props = defineProps({
  variant: {
    type: String,
    default: "primary", // primary, secondary, danger
  },
  size: {
    type: String,
    default: "md", // sm, md, lg
  },
  block: {
    type: Boolean,
    default: false, // if true => button takes full width
  },
});

// ✅ Base button styling (common for all variants)
const baseClass = `
  rounded-xl font-semibold transition-all duration-200
  active:scale-95 text-center
  shadow-sm hover:shadow-md
  focus:outline-none focus:ring-2 focus:ring-offset-2
`;

// ✅ Different sizes — responsive & dynamic
const sizeClasses = {
  sm: "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm",
  md: "px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg",
  lg: "px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg md:text-xl",
};

// ✅ Color variants for reuse
const variantClasses = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
  danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
};
</script>
