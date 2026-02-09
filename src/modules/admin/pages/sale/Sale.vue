<template>
  <div v-if="state.isLoading" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
    <div class="bg-white p-6 rounded-xl shadow-2xl">
      <VueSpinnerDots />
    </div>
  </div>

  <div v-else class="w-full h-screen bg-gray-100 font-sans overflow-hidden">
    <div class="flex flex-col lg:flex-row h-full">
      
      <div class="flex-1 flex flex-col min-w-0 bg-gray-100 border-r border-gray-200">
        <div class="bg-white p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 z-20">
          <div class="w-full md:w-72">
            <SearchBar @input="handleSearch" />
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-[10px] font-bold uppercase text-gray-400">Category Filter</label>
            <select id="category"
              class="h-9 border border-gray-300 rounded-md bg-white px-3 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              @change="selectCategory($event)">
              <option value="">All Products</option>
              <option v-for="categorie in state.item_Categories" :key="categorie.id" :value="categorie.id">
                {{ categorie.category_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div v-if="state.items.length > 0">
            <div v-if="!state.isLoading" 
                 class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              
              <div v-for="item in state.items" :key="item.id"
                @click.prevent="addToCartItem(item)"
                class="group relative flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden">
                
                <div class="h-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
                   <div class="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform duration-300">
                      <span class="text-sm font-black text-blue-600 uppercase">
                        {{ item.name ? item.name.substring(0, 2) : 'IT' }}
                      </span>
                   </div>
                </div>

                <div class="p-3 flex-1 flex flex-col justify-between">
                  <p class="text-[12px] font-bold text-gray-700 leading-tight line-clamp-2 mb-2">
                    {{ item?.name || 'Unnamed Product' }}
                  </p>
                  <div class="flex items-center justify-between">
                    <span class="text-blue-700 font-extrabold text-xs">
                      Rs. {{ item?.sale_price || '0' }}
                    </span>
                    <span class="text-[11px] text-gray-600 font-mono">#{{ item.id }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex justify-center items-center h-64"><VueSpinnerDots /></div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
             <i class="pi pi-search text-5xl mb-3"></i>
             <p class="text-sm font-medium italic">No items found...</p>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-[380px] flex flex-col bg-white shadow-2xl z-30 h-full relative">
        <div class="p-4 border-b border-gray-100 flex-shrink-0 bg-white">
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-bold text-gray-800 text-lg flex items-center gap-2">
              <i class="pi pi-shopping-bag text-blue-600"></i> Cart
            </h2>
            <button @click="toggleScanner" 
              :class="isScanning ? 'bg-red-500' : 'bg-indigo-600'"
              class="text-white text-[9px] px-3 py-1.5 rounded-full flex items-center gap-1 transition-all uppercase font-bold">
              <i class="pi" :class="isScanning ? 'pi-times' : 'pi-camera'"></i>
              {{ isScanning ? 'Stop' : 'Scan' }}
            </button>
          </div>

          <div v-show="isScanning" class="mb-3 overflow-hidden rounded-lg border-2 border-blue-400 bg-black h-32">
            <div id="reader" class="w-full"></div>
          </div>

          <div class="flex gap-1">
            <input ref="quickAddInput" v-model="quickAddId" @keyup.enter="handleQuickAdd" 
              type="text" placeholder="Item Code / ID..." 
              class="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-[11px] font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
            <button @click="handleQuickAdd" class="bg-blue-600 text-white px-3 rounded-md text-[10px] font-bold"
            :disabled="isLoadingSearch">{{isLoadingSearch ? 'Wait..' : 'ADD'}}</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div v-if="refItems.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300 p-6 text-center">
            <i class="pi pi-shopping-cart text-4xl mb-2"></i>
            <p class="text-[10px] font-bold uppercase tracking-widest">Cart is empty</p>
          </div>

          <div v-else class="divide-y divide-gray-100">
            <div v-for="item in refItems" :key="item.id" class="p-2 hover:bg-gray-50 transition-colors">
              
              <div class="flex justify-between items-start mb-1">
                <div class="flex-1 truncate pr-2">
                  <h3 class="font-bold text-gray-700 text-[11px] leading-tight">{{ item.name }}</h3>
                  <p class="text-[9px] text-gray-400 italic">Base: Rs. {{ item.base_unit_price }}</p>
                </div>
                <button @click="removeItem(item.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                  <i class="pi pi-times text-[10px]"></i>
                </button>
              </div>

              <div class="flex items-center justify-between gap-2">
                <div 
                  class="flex flex-col border rounded-md px-1.5 py-0.5 transition-all duration-200"
                  :class="[
                    (!item.sale_price || item.sale_price <= 0) 
                    ? 'bg-red-50 border-red-500 ring-1 ring-red-500' 
                    : 'bg-blue-50/50 border-blue-100'
                  ]"
                >
                  <div class="flex items-center">
                    <span class="text-[9px] font-bold mr-1" :class="(!item.sale_price || item.sale_price <= 0) ? 'text-red-500' : 'text-blue-400'">Rs.</span>
                    <input type="number" v-model.number="item.sale_price" class="w-14 bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0" 
                      :class="(!item.sale_price || item.sale_price <= 0) ? 'text-red-700' : 'text-blue-700'" />
                  </div>
                  <span v-if="item.sale_price < item.base_unit_price" class="text-[8px] text-green-600 font-bold">
                    Save: {{ ((item.base_unit_price - item.sale_price) * item.quantity).toFixed(0) }}
                  </span>
                </div>

                <div class="flex items-center bg-white border border-gray-200 rounded-md h-7 overflow-hidden shadow-sm">
                  <button @click.prevent="decreaseItemQty(item.id)" class="w-6 h-full bg-gray-50 hover:bg-gray-100 text-gray-500 border-r border-gray-200 text-xs">-</button>
                  <input type="number" :value="item.quantity" @input="inputQty(item.id, $event.target.value)"
                    class="text-center bg-white border-none text-[11px] font-black text-gray-800 p-0 focus:ring-0"
                    :style="{ width: (item.quantity.toString().length + 1.2) + 'ch', minWidth: '28px' }" />
                  <button @click.prevent="increaseItemQty(item.id)" class="w-6 h-full bg-gray-50 hover:bg-gray-100 text-gray-500 border-l border-gray-200 text-xs">+</button>
                </div>

                <div class="text-right min-w-[60px]">
                  <p class="text-[11px] font-black text-gray-900">Rs. {{ (item.quantity * (item.sale_price || 0)) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.1)]">
          <div class="space-y-1 mb-4">
            <div class="flex justify-between text-[11px] text-gray-500">
              <span>Subtotal (Gross)</span>
              <span class="font-bold">Rs. {{ grossTotal }}</span>
            </div>
            <!-- <div class="flex justify-between text-[11px] text-red-500 font-bold">
              <span>Total Savings</span>
              <span>- Rs. {{ totalDiscount }}</span>
            </div> -->
            <div class="flex justify-between items-center pt-2 mt-1 border-t border-gray-300">
              <span class="text-sm font-bold text-gray-800">Grand Total</span>
              <span class="text-xl font-black text-green-600">Rs. {{ totalPrice }}</span>
            </div>
          </div>

          <div v-if="state.isLoading" class="flex justify-center py-2"><VueSpinnerDots /></div>
          
          <div v-else class="grid grid-cols-4 gap-2">
            <button type="button" :disabled="refItems.length === 0"
              @click="() => { payFastModal = true; state.customer_fast_pay = true; state.customer_invoice = false; state.credit = true; state.saleType = 'FAST_PAY'; about_modal = 'Fast pay (no credit involved)'; }"
              class="flex flex-col items-center justify-center py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
              <i class="pi pi-bolt text-lg mb-1"></i>
              <span class="text-[9px] font-black uppercase">Fast Pay</span>
            </button>

            <button type="button" :disabled="refItems.length === 0"
              @click="() => { showModal = true; state.customer_invoice = false; creditCustomerModal = true; state.customer_fast_pay = false; state.saleType = 'CREDIT'; state.credit = true; about_modal = 'Credit sale (customer wants to buy on credit)'; }"
              class="flex flex-col items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
              <i class="pi pi-credit-card text-lg mb-1"></i>
              <span class="text-[9px] font-black uppercase">Credit</span>
            </button>

            <button type="button" :disabled="refItems.length === 0"
              @click="() => { showModal = true; state.customer_invoice = true; state.credit = false; state.customer_fast_pay = false; creditCustomerModal = false; state.saleType ='INVOICE'; about_modal = 'Non-credit sale, but invoice is created with customer name'; }"
              class="flex flex-col items-center justify-center py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
              <i class="pi pi-user text-lg mb-1"></i>
              <span class="text-[9px] font-black uppercase">Invoice</span>
            </button>

            <button type="button" :disabled="refItems.length === 0"
                @click="() => { showModal = true; state.customer_invoice = false; creditCustomerModal = false; state.customer_fast_pay = false; state.saleType = 'ADVANCE_HOLD'; state.credit = 2; about_modal = 'User pays full amount in advance, but can collect items later';}"
                class="flex flex-col items-center justify-center py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
                <i class="pi pi-box text-lg mb-1"></i>
                <span class="text-[9px] font-black uppercase">Advance Hold</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="payFastModal" title="Fast Payment" @save="onSave()" :disableSaveBtn="isLoading">
      <div class="p-4">
        <FormInput id="sale_date" type="date" label="Order Date" v-model="form.sale_date" :errors="errors.sale_date" />
      </div>
    </BaseModal>

    <BaseModal v-model="showModal" :title="creditCustomerModal ? 'Credit Customer Details' : 'Invoice Details'" 
     @save="onSave()" :disableSaveBtn="isLoading" :about_modal="about_modal">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">

    <div>
      <FormInput 
        id="phone"  
        type="number" 
        label="Phone" 
        v-model="form.phone_one" 
        :error="errors.phone_one" 
      />

      <!-- Live Search Status -->
      <p v-if="searchStatus === 'searching'" class="text-blue-600 text-sm mt-1">Searching...</p>
      <p v-if="searchStatus === 'found'" class="text-green-600 text-sm mt-1">Customer found ✅</p>
      <p v-if="searchStatus === 'not-found'" class="text-red-600 text-sm mt-1">Customer not found ❌</p>
    </div>

    <FormInput id="name" label="Name" v-model="form.name" :error="errors.name" />
    <FormInput id="address" label="Address" v-model="form.address" :error="errors.address" />
    <FormInput 
  id="nic" 
  label="NIC (withtout dashes)" 
  v-model="form.nic" 
  @input="handleNicInput"
  :error="errors.nic" 
/>
    <FormInput id="remark" label="Remarks" v-model="form.remarks" :error="errors.remarks" />
    <FormInput id="sale_date" type="date" label="Date" v-model="form.sale_date" :errors="errors.sale_date" />
    
  </div>
</BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, reactive, nextTick ,watch} from "vue";
import { useRouter, useRoute } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';
import BaseModal from "@/components/BaseModal.vue";
import { toast } from '@/utils/toast';
import { VueSpinnerDots } from "vue3-spinners";
import api from '@/plugins/axios';
import FormInput from "@/components/admin/FormInput.vue";
import { useFormErrors } from "@/composables/admin/useFormErrors";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import _ from 'lodash';
const about_modal = ref([]);
const refItems = ref([]);
const quickAddId = ref('');
const quickAddInput = ref(null);
const isScanning = ref(false);
let html5QrCode = null;
const searchStatus = ref('');
const isLoadingSearch = ref(false);
const searchText = ref('');
const category_id = ref('');
const isLoading = ref(false);
const payFastModal = ref(false);
const creditCustomerModal = ref(false);
const router = useRouter();
const showModal = ref(false);

const state = reactive({
  items: [],
  item_Categories: [],
  credit: false,
  customer_invoice: false,
  customer_fast_pay: false,
  saleType: '',
});

const errors = reactive({ name: '', phone_one: '', address: '', nic: '', sale_date: '' });
const form = reactive({ name: '', phone_one: '', address: '', nic: '', remarks: '', sale_date: '' });

// --- CALCULATIONS (Discount/Savings) ---
const grossTotal = computed(() => {
  // Use the original locked price for gross total
  return refItems.value.reduce((total, item) => total + (item.base_unit_price * item.quantity), 0);
});

const totalPrice = computed(() => {
  return refItems.value.reduce((total, item) => total + ((item.sale_price || 0) * item.quantity), 0);
});

const totalDiscount = computed(() => {
  const diff = grossTotal.value - totalPrice.value;
  return diff > 0 ? diff : 0; // Only show discount if it's a saving
});

// --- API ACTIONS ---
const fetchItems = async (url = '/items') => {
  try {
    isLoadingSearch.value = true;
    const response = await api.get(url, {
      params: { search: searchText.value || null, category_id: category_id.value || null }
    });
    state.items = response.data.data.data;
  } catch (error) { console.error(error); } finally { isLoadingSearch.value = false; }
};

const fetchItemCategories = async () => {
  try {
    const response = await api.get('/categories');
    state.item_Categories = response.data.categories;
  } catch (err) { console.error(err); }
};

const addToCartItem = (Item) => {
  if (!Item.quantity_in_stock || Item.quantity_in_stock <= 0) {
    toast.error('Stock is empty'); return;
  }
  const exists = refItems.value.find(item => item.id === Item.id);
  if (exists) {
    increaseItemQty(exists.id);
  } else {
    refItems.value.push({
      id: Item.id,
      name: Item.name,
      quantity: 1,
      quantity_in_stock: Item.quantity_in_stock,
      sale_price: Item.sale_price,
      base_unit_price: Item.sale_price, // Fixed reference price to detect discounts
      original_price: Item.sale_price, // Maintained for backend compatibility
      cost_price: Item.cost_price,
    });
  }
};

const handleQuickAdd = async () => {
  if (!quickAddId.value) return;
  const found = state.items.find(i => String(i.id) === quickAddId.value || i.item_code === quickAddId.value);
  if (found) {
    addToCartItem(found);
    quickAddId.value = '';
    nextTick(() => quickAddInput.value?.focus());
  } else {
    try {
      isLoadingSearch.value = true;  
      const response = await api.get(`/items`, {
      params: { search: quickAddId.value     }
    });
    console.log('qucik add to cart-',response.data.data.data);
    // state.items = response.data.data.data;
      if (response.data.data.data) {
        addToCartItem(response.data.data.data[0]);
        quickAddId.value = '';
      } else { toast.error("Not found"); }
    } catch (e) { toast.error("Error finding item"); }
    finally {
      isLoadingSearch.value = false;
      nextTick(() => quickAddInput.value?.focus());
    }
    // searchText.value = quickAddId.value; fetchItems();
  }
};

// --- SCANNER ---
const toggleScanner = async () => {
  if (isScanning.value) {
    isScanning.value = false;
    if (html5QrCode) await html5QrCode.stop();
  } else {
    isScanning.value = true;
    await nextTick();
    startScanner();
  }
};

const startScanner = () => {
  const formats = [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.CODE_128];
  html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, (text) => {
    quickAddId.value = text;
    handleQuickAdd();
  }).catch(() => {
    isScanning.value = false;
    toast.error("Camera error");
  });
};

const removeItem = (id) => refItems.value = refItems.value.filter(item => item.id !== id);
const increaseItemQty = (id) => {
  const item = refItems.value.find(i => i.id === id);
  if (item && item.quantity < item.quantity_in_stock) item.quantity++;
  else toast.error('Max stock reached');
};
const decreaseItemQty = (id) => {
  const item = refItems.value.find(i => i.id === id);
  if (item && item.quantity > 1) item.quantity--;
};
const inputQty = (id, quantity) => {
  const item = refItems.value.find(i => i.id === id);
  if (!item) return;
  const qty = parseInt(quantity);
  item.quantity = (isNaN(qty) || qty < 1) ? 1 : (qty > item.quantity_in_stock ? item.quantity_in_stock : qty);
};

const handleSearch = (query) => { searchText.value = query; fetchItems(); };
const selectCategory = (event) => { category_id.value = event.target.value; fetchItems(); };

const onSave = async () => {
  if (refItems.value.some(item => !item.sale_price || item.sale_price <= 0)) {
    toast.error(`Please check item prices. All prices must be greater than 0.`);
    return;
  }

  isLoading.value = true;
  try {
    let credit = null;
    let customer = null;

    switch (state.saleType) {
      case 'CREDIT': credit = 1; customer = { ...form }; break;
      case 'ADVANCE_HOLD': credit = 2; customer = { ...form }; break;
      case 'INVOICE': credit = 0; customer = { ...form }; break;
      case 'FAST_PAY':
      default: credit = null; customer = null; break;
    }

    const payload = {
      items: refItems.value.map(i => ({
        ...i,
        // Backend logic: Calculate discount only if sale_price is less than original
        discount: (i.base_unit_price - i.sale_price) > 0 ? (i.base_unit_price - i.sale_price) : 0
      })),
      sale_date: form.sale_date,
      credit: credit,
      total_discount: totalDiscount.value,
    };

    if (customer) payload.customer = customer;

    const response = await api.post('/sales', payload);

    if (response.data.success) {
      refItems.value = [];
      showModal.value = false;
      payFastModal.value = false;
      toast.success(response.data.message);
      router.push('sale-list');
    }
  } catch (error) {
    if (error.response?.status === 422) {
      const backendErrors = error.response.data.errors;
      Object.keys(backendErrors).forEach((key) => {
        const cleanKey = key.split('.').pop();
        if (Object.prototype.hasOwnProperty.call(errors, cleanKey)) {
          errors[cleanKey] = backendErrors[key][0];
        }
      });
      toast.error("Please correct the highlighted errors.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  } finally {
    isLoading.value = false;
  }
};


 //------------------ Debounced Search Function ------------------
const searchCustomerPhoneDebounced = _.debounce(async () => {
  if (!form.phone_one) {
    form.name = '';
    form.address = '';
    form.nic = '';
    searchStatus.value = '';
    return;
  }

  try {
    const response = await api.get('/customers', {
      params: { search: form.phone_one }
    });

    const customers = response.data.data?.data || [];

    if (customers.length > 0) {
      form.name = customers[0].name || '';
      form.address = customers[0].address || '';
      form.nic = customers[0].nic || '';
      searchStatus.value = 'found';
    } else {
      form.name = '';
      form.address = '';
      form.nic = '';
      searchStatus.value = 'not-found';
    }

    state.pagination = response.data.data || {};
  } catch (err) {
    console.error('Failed to load customers:', err);
    toast.error("Failed to load customers");
    searchStatus.value = 'not-found';
  }
}, 500);

// ------------------ Watch Phone Input ------------------
watch(() => form.phone_one, (newVal, oldVal) => {
  if (!newVal) {
    form.name = '';
    form.address = '';
    searchStatus.value = '';
    return;
  }
  // Show "Searching..." immediately on key press
  searchStatus.value = 'searching';
  searchCustomerPhoneDebounced();
});



const handleNicInput = (e) => {
  // 1. Extract only digits and limit to exactly 13
  let val = e.target.value.replace(/\D/g, '').substring(0, 13);
  
  // 2. Insert dashes at specific positions
  if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5);
  if (val.length > 13) val = val.slice(0, 13) + "-" + val.slice(13);
  
  // 3. Update the form state
  form.nic = val;
};

// Helper to make it cleaner
String.prototype.insert = function (index, string) {
  if (index > 0) return this.substring(0, index) + string + this.substring(index);
  return string + this;
};


onMounted(() => {
  if (!form.sale_date) {
    const now = new Date();
    form.sale_date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  fetchItems();
  fetchItemCategories();
});

onBeforeUnmount(() => { if (html5QrCode) html5QrCode.stop(); });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.h-screen { height: 91vh; overflow: hidden; }
</style>