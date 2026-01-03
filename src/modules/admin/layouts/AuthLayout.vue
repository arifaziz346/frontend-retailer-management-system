<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
