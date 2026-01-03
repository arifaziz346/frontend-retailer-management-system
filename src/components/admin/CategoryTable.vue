<template>
  <div class="overflow-x-auto w-full">
    <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-100 text-left text-gray-700 text-sm uppercase">
          <th class="p-3">#</th>
          <th class="p-3">Category Name</th>
          <th class="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(cat, index) in categories"
          :key="cat.id"
          class="border-b border-b-gray-200 hover:bg-gray-50"
        >
          <td class="p-3 text-sm text-gray-700">
            {{ index + 1 }}
          </td>

          <td class="p-3 text-sm font-medium text-gray-800">
            {{ cat.category_name }}
          </td>

          <td class="p-3 text-sm flex justify-center gap-4">

            <!-- Edit Button -->
            <button
              v-if="cat.id !== 1"
              class="text-blue-600 hover:text-blue-800 flex items-center"
              @click="$emit('edit', cat)"
            >
              <Icon name="mdi:pencil" class="w-4 h-4 mr-1" />
              Edit
            </button>

            <!-- Delete Button -->
            <button
              v-if="cat.id !== 1"
              class="text-red-600 hover:text-red-800 flex items-center"
              @click="$emit('delete', cat.id)"
            >
              <Icon name="mdi:delete" class="w-4 h-4 mr-1" />
              Delete
            </button>

            <!-- View Button -->
            <!-- <button
              class="text-gray-700 hover:text-gray-900 flex items-center"
              @click="$emit('view', cat)"
            >
              <Icon name="mdi:eye" class="w-4 h-4 mr-1" />
              View
            </button> -->

          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true }
})

defineEmits(['view', 'delete', 'edit'])
</script>
