<template>
  <!-- 🔵 Loader -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
  >
    <div class="flex flex-col items-center space-y-3">
      <VueSpinnerDots size="48px" color="#2563eb" />
      <p class="text-blue-600 text-sm font-medium animate-pulse">
        Loading, please wait...
      </p>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">

    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm rounded-lg"
    >
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
        <router-link
          to="/admin/Item"
          class="flex items-center hover:text-blue-600 transition-colors"
        >
          <i class="pi pi-home mr-1 text-2xl"></i>
          <span class="hidden sm:inline">Items</span>
        </router-link>
        <span class="font-semibold text-gray-900">{{ category_name }}</span>
      </nav>

      <!-- Add Button -->
      <Button
        variant="primary"
        size="sm"
        class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
        @click="() => { resetForm(); editItem = false; showModal = true; addVariant(); }"
      >
        <i class="pi pi-plus text-sm"></i>
        <span>Items</span>
      </Button>
    </header>

    <main class="flex-1 p-4 sm:p-6 md:p-8">

  <div class="flex flex-row justify-between">

    <FilterBar
    :subCategories="state.categories"
     v-model:search="searchText"
     v-model:category_id="category_id"
     :showButton="false"/>



  </div>

            <!--Searching---->
            <div v-if="isLoadingSearch" class="flex items-center justify-center p-4">
              <VueSpinnerDots size="32px" color="#2563eb" />
              <span class="ml-2 text-blue-600 font-medium animate-pulse">Searching...</span>
            </div>

            <div v-else>



  <div v-if="state.items && state.items.length" class="w-full overflow-x-auto border border-gray-300 rounded-md shadow-sm mt-1">
    <div class="w-full  bg-gray-800 text-white p-1.5">
                <i class="pi pi-home mr-1 text-md"> Item List</i></div>
    <table class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
      <!-- Table Head -->
      <thead class="bg-gray-100 text-gray-700  text-sm ">
        <tr>
          <th class="px-4 py-2 text-left font-semibold">#ID</th>
          <th class="px-4 py-2 text-left font-semibold">Bar-Code</th>
          <th class="px-4 py-2 text-left font-semibold">Item-Name</th>
          <th class="px-4 py-2 text-left font-semibold">Category</th>
          <th class="px-4 py-2 text-left font-semibold">Cost Price</th>
          <th class="px-4 py-2 text-left font-semibold">Sale Price</th>

          <th class="px-4 py-2 text-left font-semibold">Profit</th>
          <th class="px-4 py-2 text-left font-semibold">Profit%</th>
          <th class="px-4 py-2 text-left font-semibold">Unit</th>
          <th class="px-4 py-2 text-left font-semibold">In-Stock</th>
          <th class="px-4 py-2 text-center font-semibold">Actions</th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr
          v-for="item in state.items"
          :key="item.id"
          class="border-t border-t-gray-200 hover:bg-gray-50 transition ext-sm"
        >
          <td class="px-4 py-2 font-medium text-gray-800">{{ item.id }}</td>
          <td class="px-4 py-2 text-gray-700">{{ item.unique_barcode }}</td>
          <td class="px-4 py-2 font-medium text-gray-900">{{ item.name }}</td>
          <td class="px-4 py-2 text-gray-700">
          {{ item.category && item.category.category_name ? item.category.category_name : '-' }}
          </td>


          <td class="px-4 py-2 text-gray-700">Rs.{{ item.cost_price }}</td>
          <td class="px-4 py-2 text-gray-700">Rs.{{ item.sale_price }}</td>
          <td class="px-4 py-2 text-gray-700">Rs.{{ round(item.sale_price - item.cost_price) }}</td>
          <td class="px-4 py-2 text-gray-700">
            {{profitPercentage(item.sale_price, item.cost_price )}}
          </td>
          <td class="px-4 py-2 text-gray-700">{{ item.unit || '-' }}</td>
          <td class="px-4 py-2 text-gray-700">{{ item.quantity_in_stock || '0' }}</td>
          <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">
            <button
              @click="edit(item)"
              class="px-3 py-1.5 text-xs sm:text-sm md:text-base text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
            >
              Edit
            </button>
            <button
              @click="onDelete(item.id)"
              class="px-3 py-1.5 text-xs sm:text-sm md:text-base text-white bg-red-500 hover:bg-red-600 rounded-md shadow"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
    <Pagination
      :pagination="state.pagination"
      @page-change="fetchItems"
    />
  </div>


  <!-- No Data -->
  <div
    v-else
    class="flex flex-col items-center justify-center h-[60vh] text-center"
  >
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      alt="No Data"
      class="w-32 h-32 opacity-70 mb-4"
    />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">No Products Found</h2>
    <p class="text-gray-500">
      Try adding new products to see them listed here.
    </p>
  </div>

</div>

</main>


    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editItem ? 'Edit Item' : 'Create Item'"
      @save="() => (editItem ? onSaveOrUpdate() : onSaveOrUpdate())"
      :disableSaveBtn="isLoading"
    >
      <div class="bg-white p-4 rounded-lg shadow-2xl space-y-2">
        <FormInput
          id="name"
          label="Name"
          v-model="form.name"
          :error="errors.name"
        />
        
        <TypeSelector
          v-model="form.category_id"
          :sub_categories="state.categories || []"
          :error="errors?.category_id"
          button_name="+ Category"
          :label="'Select-Category'"
          @click_sub_category="navigateToSubcategory"
        />
        <FormInput v-model="form.cost_price" label="Buy Price" :error="errors.cost_price" type="number" />
        <FormInput v-model="form.sale_price" label="Sale Price" :error="errors.sale_price" type="number" />
        <!-- <FormInput v-model="form.unit" label="Unit" :error="errors.unit" /> -->
         <div class="flex items-center gap-2">
  <!-- Selector wrapper without label taking extra row -->
  <div class="flex-1">
    <label for="unit" class="block text-sm font-medium mb-1 text-gray-700">
      Unit
    </label>
    <Selector
      id="unit"
      v-model="form.unit"
      :options="state.units.map(unit => ({ label: unit.name, value: unit.name }))"
      placeholder="Select Unit"
      class="w-full"
      :error="errors.unit"
    />
    
  </div>

  <!-- Button stays on the same row -->
  <button
    type="button"
    @click="goToUnitPage"
    class="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm gap-1 mt-6"
  >
    <i class="pi pi-plus"></i>
    Add Unit
  </button>
</div>




        
      </div>
    </BaseModal>
  </div>
</template>


<script setup>
import api from "@/plugins/axios";
import Button from "@/components/admin/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, toRaw, watch } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Selector from "@/components/Selector.vue";
import TypeSelector from "@/components/TypeSelector.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from '@/utils/toast';
import { useFormErrors } from "@/composables/admin/useFormErrors";
import FilterBar from "@/components/FilterBar.vue";
import { round,profitPercentage } from "@/utils/helper";
import _ from 'lodash'
const route = useRoute();
const router = useRouter();
const searchQuery = defineModel() // this binds to v-model from parent

const state = reactive({
  items: [],
  units:[],
  categories: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const category_id = ref();
const category_name = ref();
const isLoading = ref(false);
const isLoadingSearch = ref(false);
const editItem = ref(false);
const item_id = ref('');
const showModal = ref(false);
const searchText = ref('');
const form = reactive({
  name: '',
  category_id: category_id.value,
  sale_price: "",
  cost_price: "",
  stock: "",
  unit: "",
});

const errors = reactive({
  name: '',
  sale_price: '',
  category_id: '',
  cost_price: '',
  unit: '',
});

const handleFormErrors = useFormErrors(errors);


// Watch filters to fetch items
// Debounced function to fetch items
// const fetchItemsDebounced = _.debounce(() => {
//     isLoadingSearch.value = true;
//   fetchItems()
// }, 500) // 500ms debounce

// // Watch searchText and category_id
// watch([searchText, category_id], () => {
//   fetchItemsDebounced()
// })

const goToUnitPage = () => {
  router.push('/admin/unit') // Replace with your route name
}



// ------------------- Fetch Items -------------------
// Example fetchItems using your API
const fetchItems = async (url = '/items') => {
  try {

    if(isLoadingSearch.value){
        isLoadingSearch.value = true
    }else{
       isLoading.value = true
    }

    const response = await api.get(url, {
      params: {
        search: searchText.value || null,
        category_id: category_id.value || null
      }
    })
    const paginated = response.data.data
    state.items = paginated.data
    state.pagination.currentPage = paginated.current_page
    state.pagination.lastPage = paginated.last_page
    state.pagination.nextPageUrl = paginated.next_page_url
    state.pagination.prevPageUrl = paginated.prev_page_url
  } catch (error) {
    console.log('Error fetching items:', error)
  } finally {
    isLoading.value = false
    isLoadingSearch.value = false
  }
}




// ------------------- Fetch Categories -------------------
const fetchItemCategories = async () => {
  try {
    const response = await api.get('/categories');
    state.categories = response.data.categories;
  } catch (err) {
    console.log("Error fetching categories:", err);
  }
};

// ------------------- Reset Form -------------------
const resetForm = () => {
  form.name = "";
  form.sale_price = "";
  form.cost_price = "";
  form.unit = "";
  form.category_id = category_id.value || 0;
  Object.keys(errors).forEach((key) => errors[key] = '');
  showModal.value = false;
  editItem.value = false;
  item_id.value = '';
};

// ------------------- Edit Product -------------------
const edit = (item) => {
  editItem.value = true;
  item_id.value = item.id;
  form.name = item.name;
  form.sale_price = item.sale_price;
  form.cost_price = item.cost_price;
  form.unit = item.unit;
  form.category_id = item.category_id;
  showModal.value = true;
};

// ------------------- Update Product -------------------
const onSaveOrUpdate = async () => {
  isLoading.value = true;

  try {
    const payload = {
      name: form.name,
      sale_price: form.sale_price,
      cost_price: form.cost_price,
      unit: form.unit,
      category_id: form.category_id,
    };

    let response;

    if (!editItem.value) {
      // Create new item
      response = await api.post('/items', payload);
    } else {
      // Update existing item
      response = await api.put(`/items/${item_id.value}`, payload);
    }

    // Update local state
    if (!editItem.value) {
      state.items.unshift(response.data.item); // Add new item at the top
    } else {
      const index = state.items.findIndex(i => i.id === item_id.value);
      if (index !== -1) state.items[index] = response.data.item;
    }

    // Show success message from response
    if (response.data.success) {
       fetchItems();
       toast.success(response.data.message || (editItem.value ? 'Item updated successfully' : 'Item created successfully'));
       resetForm();
    }



  } catch (error) {
    console.error("Error saving/updating item:", error);
    handleFormErrors(error);
  } finally {
    isLoading.value = false;
  }
};


// ------------------- Delete Product -------------------
const onDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;

  isLoading.value = true;
  try {
    const response =await api.delete(`/items/${id}`);
    // Remove from local state
    state.items = state.items.filter(i => i.id !== id);
   // Show success message from response
    if (response.data.success) {
      toast.success(response.data.message || (editItem.value ? 'Item updated successfully' : 'Item created successfully'));
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    toast.error("Failed to delete item");
  } finally {
    isLoading.value = false;
  }
};

// ------------------- Modal Navigation -------------------
const navigateToSubcategory = () => {
  router.push('/admin/category');
};

//--------------------Units Fetching--------------------
const fetchUnits = async () => {
  try {
    const response = await api.get('/units');
    state.units = response.data.data;
    console.log("Units fetched:", state.units);
  } catch (err) {
    console.log("Error fetching units:", err);
  }
};

// ------------------- Mounted -------------------
onMounted(async () => {
  category_id.value = route.params.id || 0;
  category_name.value = route.params.category_name || '';
  form.category_id = category_id.value;

  await fetchItems();
  await fetchItemCategories();
  await fetchUnits();
});
</script>

