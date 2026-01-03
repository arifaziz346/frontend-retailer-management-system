<template>
  <div
    class="bg-gray-100 rounded-md shadow-md p-0.5 flex flex-col justify-between
           hover:shadow-xl hover:-translate-y-1 transition-transform duration-300
           w-auto h-auto"
  >
    <div class="flex flex-col items-center">
      <!-- Name -->
      <h2
        class="text-center text-md font-semibold text-gray-800 mb-1 break-words overflow-hidden text-ellipsis"
      >
        {{ name }}
      </h2>

      <!-- Image -->
      <img
        :src="image"
        alt="Category Image"
        class="w-[200px] h-[300px] object-cover rounded-sm"
      />
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex justify-center gap-4 text-sm bg-gray-100 p-2 rounded-lg">
      <!-- Update Button -->
      <button
        v-if="showEdit"
        class="flex items-center text-blue-600 hover:text-blue-800"
        @click="$emit('edit')"
      >
        <Icon name="mdi:pencil" class="w-4 h-4 mr-1" />
        Update
      </button>

      <!-- Delete Button -->
      <button
        v-if="showDelete"
        class="flex items-center text-red-600 hover:text-red-800"
        @click="$emit('delete')"
      >
        <Icon name="mdi:delete" class="w-4 h-4 mr-1" />
        Delete
      </button>

      <!-- View Button -->
      <button
        v-if="showView"
        class="flex items-center text-gray-600 hover:text-gray-800"
        @click="$emit('view')"
      >
        <Icon name="mdi:eye" class="w-4 h-4 mr-1" />
        View
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  showView: { type: Boolean, default: true },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true }
})

const emit = defineEmits(['view', 'delete', 'edit'])
</script>
