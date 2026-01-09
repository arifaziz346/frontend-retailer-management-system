<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-[100]">
    <div class="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl border border-white">
      <VueSpinnerDots size="50px" color="#2563eb" />
      <p class="text-slate-500 text-xs font-bold mt-4 tracking-[0.2em] uppercase">Processing Data</p>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-[#f8fafc] w-full">

    <header class="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
      <div class="w-full px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <nav class="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <router-link to="/admin/Item" class="hover:text-blue-600 transition-colors">Inventory</router-link>
            <i class="pi pi-chevron-right text-[10px]"></i>
            <span class="text-blue-600">{{ category_name || 'All Categories' }}</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Product Management</h1>
        </div>

        <button
          class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all text-sm"
          @click="() => { resetForm(); editItem = false; showModal = true; addVariant(); }"
        >
          <i class="pi pi-plus-circle"></i>
          <span>Create New Item</span>
        </button>
      </div>
    </header>

    <main class="w-full px-4 sm:px-8 py-6">
      
      <div class="w-full mb-8">
        <FilterBar
          :subCategories="state.categories"
          v-model:search="searchText"
          v-model:category_id="category_id"
          :showButton="false"
          class="w-full"
        />
      </div>

      <div v-if="state.items && state.items.length" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
                <th class="px-6 py-5">Product Info</th>
                <th class="px-6 py-5">Category</th>
                <th class="px-6 py-5">Pricing (Cost/Sale)</th>
                <th class="px-6 py-5">Profit Analysis</th>
                <th class="px-6 py-5 w-[200px]">Inventory Health</th> <th class="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in state.items" :key="item.id" class="hover:bg-blue-50/40 transition-all group">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 text-base group-hover:text-blue-700 transition-colors">{{ item.name }}</span>
                    <span class="text-xs font-mono text-slate-400 mt-1">#{{ item.unique_barcode || item.id }}</span>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {{ item.category?.category_name || 'General' }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-slate-700">Rs.{{ item.sale_price }}</div>
                  <div class="text-[11px] text-slate-400 font-medium tracking-tight">Net Cost: Rs.{{ item.cost_price }}</div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-baseline gap-2">
                    <span class="text-sm font-black text-green-600 tracking-tighter">+{{ (item.sale_price - item.cost_price).toFixed(0) }}</span>
                    <span class="text-[10px] font-bold text-green-500/80 bg-green-50 px-1.5 py-0.5 rounded">
                      {{ profitPercentage(item.sale_price, item.cost_price) }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                      <span :class="item.quantity_in_stock < 10 ? 'text-red-500' : 'text-slate-500'">
                        {{ item.quantity_in_stock || 0 }} {{ item.unit || 'pcs' }}
                      </span>
                      <span class="text-slate-400">Target: 100</span>
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        class="h-full rounded-full transition-all duration-1000"
                        :class="[
                           item.quantity_in_stock > 20 ? 'bg-blue-500' : 
                           item.quantity_in_stock > 5 ? 'bg-amber-400' : 'bg-red-500'
                        ]"
                        :style="{ width: Math.min((item.quantity_in_stock / 100) * 100, 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end items-center gap-1">
                    <button @click="edit(item)" class="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                    <button @click="onDelete(item.id)" class="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                      <i class="pi pi-trash text-sm"></i>
                    </button>

                    <button
    @click="openUpdateStockModal(item)"
    :disabled="isLoading"
    class="text-sm bg-blue-600 text-white p-1 rounded disabled:bg-gray-400">
    {{ isLoading ? 'Wait...' : 'Update-Stock' }}
  </button>
                  </div>
                </td>

                <td class="px-6 py-4 text-right">
                  


                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-slate-50/50 px-8 py-4 border-t border-slate-100">
          <Pagination :pagination="state.pagination" @page-change="fetchItems" />
        </div>
      </div>

      <div v-else class="w-full py-32 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
        <div class="p-6 bg-slate-50 rounded-full mb-4">
          <i class="pi pi-box text-5xl text-slate-300"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Your inventory is empty</h3>
        <p class="text-slate-500 mb-6">Start tracking your products by clicking the button below.</p>
        <button @click="showModal = true" class="text-blue-600 font-bold hover:text-blue-700">+ Add First Product</button>
      </div>
    </main>

    <BaseModal
      v-model="showModal"
      :title="editItem ? 'Modify Product Information' : 'Catalog New Item'"
      @save="() => onSaveOrUpdate()"
      :disableSaveBtn="isLoading"
      panelClass="max-w-2xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
        <div class="md:col-span-2">
           <FormInput id="name" label="Item Name" v-model="form.name" placeholder="Enter product name..." :error="errors.name" />
        </div>

        <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        New Stock (Quantity)
      </label>

      <FormInput
        id="quantity_in_stock"
        type="number"
        v-model="form.quantity_in_stock"
        :error="errors.quantity_in_stock"
      />
    </div>
        
        <TypeSelector
          v-model="form.category_id"
          :sub_categories="state.categories || []"
          :error="errors?.category_id"
          button_name="+ New"
          label="Category"
          @click_sub_category="navigateToSubcategory"
        />

        <div class="space-y-2">
          <label class="block text-sm font-bold text-slate-700">Unit of Measure</label>
          <div class="flex gap-2">
            <Selector
              id="unit"
              v-model="form.unit"
              :options="state.units.map(u => ({ label: u.name, value: u.name }))"
              placeholder="Select Unit"
              class="flex-1"
              :error="errors.unit"
            />
            <button @click="goToUnitPage" class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><i class="pi pi-plus"></i></button>
          </div>
        </div>

        <FormInput v-model="form.cost_price" label="Cost Price (Base)" type="number" />
        <FormInput v-model="form.sale_price" label="Selling Price" type="number" />
      </div>
    </BaseModal>

      <!-------Base modal For Update Stock---------->
     <BaseModal
      v-model="showUpdateStockModal"
      :title="'Update Stock'"
      @save="() => updateStock()"
      :disableSaveBtn="isLoading"
      panelClass="max-w-2xl">

    <FormInput
        id="quantity_in_stock"
        type="number"
        v-model="new_quantity_in_stock"
        :error="errors.new_quantity_in_stock"
      />

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
const showUpdateStockModal = ref(false);
const searchQuery = defineModel() // this binds to v-model from parent
const new_quantity_in_stock =ref(0);
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
  quantity_in_stock:"",
  unit: "",
});

const errors = reactive({
  name: '',
  sale_price: '',
  category_id: '',
  cost_price: '',
  quantity_in_stock:'',
  unit: '',
  new_quantity_in_stock:''
});

const handleFormErrors = useFormErrors(errors);


// Watch filters to fetch items
// Debounced function to fetch items
const fetchItemsDebounced = _.debounce(() => {
    isLoadingSearch.value = true;
  fetchItems()
}, 500) // 500ms debounce

// Watch searchText and category_id
watch([searchText, category_id], () => {
  fetchItemsDebounced()
})

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

    console.log('Items fetched:', response.data)

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
      quantity_in_stock:form.quantity_in_stock,
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


const openUpdateStockModal = async (item)=>{
  item_id.value = item.id
  showUpdateStockModal.value  = true;
}

//------------------Update Stock-----------------------
const updateStock = async ()=>{

  isLoading.value = true
  try {


    const response  = await api.post(`/item/update/stock`,{
      'new_quantity':new_quantity_in_stock.value,
      'item_id':item_id.value
    });

    if(response.data.success){
      showUpdateStockModal.value = false
      toast.success(response.data.message);
      fetchItems();
    }

    


    

    
  } catch (error) {
    // console.error("Error saving/updating item:", error);
    handleFormErrors(error);
  } finally{
    isLoading.value = false
  }
}

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

