 <template>
 <button
  @click="$router.back()"
  class="flex items-center justify-center w-9 h-9 rounded-full
         hover:bg-gray-100 transition">
  <i class="pi pi-arrow-left text-lg text-gray-700 hover:text-blue-600 hover:cursor-pointer"></i>
</button>
</template>