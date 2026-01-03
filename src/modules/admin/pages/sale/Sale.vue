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
                    <span class="text-[10px] text-gray-400 font-mono">#{{ item.id }}</span>
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
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-gray-800 text-lg flex items-center gap-2">
              <i class="pi pi-shopping-bag text-blue-600"></i> Cart
            </h2>
            <span class="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              {{ refItems.length }} Items
            </span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div v-if="refItems.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300 p-10 text-center">
            <i class="pi pi-shopping-cart text-5xl mb-4"></i>
            <p class="text-xs font-bold uppercase tracking-widest">Cart is empty</p>
          </div>

          <table v-else class="w-full text-xs">
            <thead class="text-[10px] text-gray-400 uppercase bg-gray-50/50 sticky top-0 border-b border-gray-100 z-10">
              <tr>
                <th class="px-4 py-3 text-left">Product</th>
                <th class="px-2 py-3 text-center">Qty</th>
                <th class="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="item in refItems" :key="item.id" class="hover:bg-blue-50/20">
                <td class="px-4 py-3">
                  <p class="font-bold text-gray-800">{{ item.name }}</p>
                  <p class="text-[10px] text-gray-400 mt-1">Rate: Rs. {{ item.sale_price }}</p>
                  <div class="mt-2 flex items-center gap-1">
                     <span class="text-[9px] text-yellow-600 font-bold">DISC:</span>
                     <input type="number" v-model.number="item.discount" @input="getDiscount(item.id)"
                      class="w-14 h-5 border-b border-yellow-200 bg-yellow-50/50 text-[10px] text-center outline-none" />
                  </div>
                </td>
                <td class="px-2 py-3">
                  <div class="flex flex-col items-center gap-1">
                    <div class="flex items-center bg-gray-100 rounded p-0.5">
                      <button @click.prevent="decreaseItemQty(item.id)" class="px-1 text-gray-500">-</button>
                      <input type="number" :value="item.quantity" class="w-6 text-center bg-transparent border-none text-[10px] font-bold p-0 focus:ring-0" 
                        @input="inputQty(item.id, $event.target.value)" />
                      <button @click.prevent="increaseItemQty(item.id)" class="px-1 text-gray-500">+</button>
                    </div>
                    <button @click="removeItem(item.id)" class="text-red-400 hover:text-red-600">
                      <i class="pi pi-trash text-[10px]"></i>
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3 text-right font-black text-gray-900">
                  Rs. {{ (item.quantity * item.sale_price) - item.discount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 shadow-[0_-8px_15px_-5px_rgba(0,0,0,0.1)]">
          <div class="space-y-1 mb-4">
            <div class="flex justify-between text-[11px] text-gray-500">
              <span>Subtotal</span>
              <span class="font-bold">Rs. {{ totalPrice }}</span>
            </div>
            <div class="flex justify-between text-[11px] text-yellow-600">
              <span>Total Discount</span>
              <span class="font-bold">- Rs. {{ discount }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 mt-1 border-t border-gray-300">
              <span class="text-sm font-bold text-gray-800">Grand Total</span>
              <span class="text-xl font-black text-green-600">Rs. {{ totalPrice - discount }}</span>
            </div>
          </div>

          <div v-if="state.isLoading" class="flex justify-center py-2"><VueSpinnerDots /></div>
          
          <div v-else class="grid grid-cols-3 gap-2">
            <button type="button" 
              :disabled="refItems.length === 0"
              @click="() => { payFastModal = true; state.customer_fast_pay = true; state.customer_invoice = false; state.credit = true; state.saleType = 'FAST_PAY'; }"
              class="flex flex-col items-center justify-center py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
              <i class="pi pi-bolt text-lg mb-1"></i>
              <span class="text-[9px] font-black uppercase">Fast Pay</span>
            </button>

            <button type="button" 
              :disabled="refItems.length === 0"
              @click="() => { showModal = true; state.customer_invoice = false; creditCustomerModal = true; state.customer_fast_pay = false; state.saleType = 'CREDIT'; state.credit = true; }"
              class="flex flex-col items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
              <i class="pi pi-credit-card text-lg mb-1"></i>
              <span class="text-[9px] font-black uppercase">Credit</span>
            </button>

            <button type="button" 
              :disabled="refItems.length === 0"
              @click="() => { showModal = true; state.customer_invoice = true; state.credit = false; state.customer_fast_pay = false; creditCustomerModal = false; state.saleType ='INVOICE' }"
              class="flex flex-col items-center justify-center py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl shadow-md transition-all active:scale-95">
              <i class="pi pi-user text-lg mb-1"></i>
              <span class="text-[9px] font-black uppercase">Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="payFastModal" title="Fast Payment" @save="onSave()" :disableSaveBtn="isLoading">
      <div class="p-4"><FormInput id="sale_date" type="date" label="Order Date" v-model="form.sale_date" :errors="errors.sale_date" /></div>
    </BaseModal>

    <BaseModal v-model="showModal" :title="creditCustomerModal ? 'Credit Customer Details' : 'Invoice Details'" 
     @save="onSave()" :disableSaveBtn="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <FormInput id="phone" type="number" label="Phone" v-model="form.phone_one" :error="errors.phone_one" />
        <FormInput id="name" label="Name" v-model="form.name" :error="errors.name" />
        <FormInput id="address" label="Address" v-model="form.address" :error="errors.address" />
        <FormInput id="remark" label="Remarks" v-model="form.remarks" :error="errors.remarks" />
        <FormInput id="sale_date" type="date" label="Date" v-model="form.sale_date" :errors="errors.sale_date" />
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* Critical for "No Scroll" on sidebar buttons */
.h-screen { height: 91vh; overflow: hidden; }
</style>
<script setup>
import SearchBar from '@/components/SearchBar.vue';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
import { ref ,onMounted,onBeforeUnmount,computed, reactive} from "vue";

import { useRouter,useRoute } from 'vue-router';
//import { Vue3TailwindModal } from "vue3-tailwind-modal";
import BaseModal from "@/components/BaseModal.vue";
import { toast } from '@/utils/toast';
import { VueSpinnerDots } from "vue3-spinners";
import api from '@/plugins/axios';
import cart_item from '@/icons/cart_item.png';
import FormInput from "@/components/admin/FormInput.vue";
import { useFormErrors } from "@/composables/admin/useFormErrors";
//It is used to store cart item
const refItems = ref([]);
const sale_id = ref(null)
const itemIdsRemove = ref([])
const discount = ref(0);
const isLoadingSearch = ref(false);
const searchText = ref('');
const category_id  = ref('');
const isLoading = ref(false);
const sale_status = ref('false');
// const toast = useToast();

const payFastModal =ref(false);
const creditCustomerModal = ref(false);
const customerInvoiceModal = ref(false);

const router = useRouter()
const route = useRoute();
const state = reactive({
  items:[],
  item_Categories:[],
  credit:false,
  customer_invoice:false,
  customer_fast_pay:false,
  // ids_remove: [],
  update:false,
  saleType:''
});



const showModal = ref(false);
const showModalTable = ref(false);
const showModalFastPay = ref(false);
const screenHeight = ref(0);

const errors = reactive({
  name: '',
  phone_one: '',
  address: '',
  sale_date:''
});

const form = reactive({
  name: '',
  phone_one: '',
  address: '',
  remarks:'',
  sale_date:'',
});

const handleFormErrors = useFormErrors(errors);


// Example fetchItems using your API
const fetchItems = async (url = '/items') => {
  try {

    if(isLoadingSearch.value){
        isLoadingSearch.value = true
    }else{
       isLoadingSearch.value = true
    }

    const response = await api.get(url, {
      params: {
        search: searchText.value || null,
        category_id: category_id.value || null
      }
    })

    console.log('response items-',response.data.data.data);
    const paginated = response.data.data
    // console.log('paginated items-',paginated.data);
    state.items = paginated.data
    state.pagination.currentPage = paginated.current_page
    state.pagination.lastPage = paginated.last_page
    state.pagination.nextPageUrl = paginated.next_page_url
    state.pagination.prevPageUrl = paginated.prev_page_url
  } catch (error) {
    console.log('Error fetching items:', error)
  } finally {
    // isLoading.value = false
    isLoadingSearch.value = false
  }
}

const fetchItemCategories = async () => {
  try {
    const response = await api.get('/categories');
     state.item_Categories = response.data.categories;
    console.log('response',state.item_Categories);

  } catch (err) {
    console.log("Error fetching categories:", err);
  }
};


const addToCartItem = (Item) =>{


if (
    Item.quantity_in_stock === null ||
    Item.quantity_in_stock === '' ||
    Item.quantity_in_stock <= 0
) {
    toast.error('Stock is empty');
    return;
}



var item = {
'id':Item.id,
'unit':Item.unit,
'name':Item.name,
'quantity':1,
'quantity_in_stock':Item.quantity_in_stock,
'sale_price':Item.sale_price,
'cost_price':Item.cost_price,
'sale_price':Item.sale_price,
'new_sale_price':0,
'categorie_id':Item.categorie_id,
'discount':0}

const exists = refItems.value.some(item => item.id === Item.id);
//console.log(exists)
if(exists){
  toast.error('Item is al ready added in the cart')
 }else{
  refItems.value.push(item)
  // toast.success(`${Item.name} has been added.`)
 }

}

//------------------isStockAvailable-----------
const isStockAvailable = (item) => {
    const stock = Number(item.quantity_in_stock);
    return !(isNaN(stock) || stock <= 0);
};



const removeItem = (id) =>{

refItems.value = refItems.value.filter(item => item.id !== id);
//Handle disocunt in case of remove item the discount should be recalculated
let totalDisc = 0;
refItems.value.forEach(i => {
    totalDisc += Number(i.discount) || 0;
});
discount.value = totalDisc;


// console.log('after move:',refItems.value);
}
//-------------------Increase item Qty-----------------
const increaseItemQty = (id) => {
    const item = refItems.value.find(item => item.id === id);
    if (!item) return;

    if (!isStockAvailable(item)) {
        toast.error('Stock is empty');
        return;
    }

    if (item.quantity < item.quantity_in_stock) {
        item.quantity += 1;
    } else {
        toast.error('Quantity exceeds available stock');
    }
};

//-------------------Decrease item Qty-----------------
const decreaseItemQty = (id) => {
    const item = refItems.value.find(item => item.id === id);
    if (!item) return;

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        toast.error('Quantity cannot be less than 1');
    }
};

//-------------------Get input Data-----------------
const inputQty = (id, quantity) => {
    const item = refItems.value.find(item => item.id === id);
    if (!item) return;

    const qty = Number(quantity);
    const stock = Number(item.quantity_in_stock);

    if (!isStockAvailable(item)) {
        toast.error('Stock is empty');
        item.quantity = 1;
        return;
    }

    if (isNaN(qty) || qty < 1) {
        toast.error('Quantity cannot be less than 1');
        item.quantity = 1;
        return;
    }

    if (qty > stock) {
        toast.error(`Only ${stock} items available`);
        item.quantity = stock;
        return;
    }

    item.quantity = qty;
};


const handleSearch = async (query) => {
    searchText.value = query
    fetchItems();
};


const getDiscount = (id) => {

    const item = refItems.value.find(item => item.id === id);
    if (!item) return;

    const disc = Number(item.discount);
    if (isNaN(disc) || disc < 0) {
        toast.error('Discount cannot be negative');
        item.discount = 0;
        return;
    }

    if (disc > (item.quantity * item.sale_price)) {
        toast.error('Discount exceeds total price');
        item.discount = 0;
        return;
    }

    //total discount calculation
    let totalDisc = 0;
    refItems.value.forEach(i => {
        totalDisc += Number(i.discount) || 0;
    });
    discount.value = totalDisc;  

};

// const searchCustomerPhone = async () =>{

//   // const selectedCategory = state.Categories.find(categorie => categorie.categorie_id == categorie_id);
//   // console.log(categorie_id);
//   try {
//     if(form.phone.length == 0 & form.phone == '' ){
//       form.name = ''
//       form.address =''
//     }else{
//       const response = await api.get(`/search/customer/${form.phone}`)
//         // console.log(response.data.Data.name)
//         if(response.data.success){
//           // console.log('searh-success',)
//           form.name = response.data.Data.name
//           form.address = response.data.Data.address
//         }
//     }

//     } catch (error) {
//         console.log('Error Searching cooking item',error)
//     }
// }

// Method to log the selected item
const selectCategory = (event) => {
    const selectedId = event.target.value;
    category_id.value = selectedId
    fetchItems();
};


  const isSmallScreen = ref(false);
  const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 640; // Check if the screen is less than 640px
};
// Compute the class name dynamicallye
// Define a reactive variable for height
// const height = ref(300);

// Compute the inline style dynamically
const computedHeightStyle = computed(() => {
  return {
    height: isSmallScreen.value === false ? `${screenHeight.value - 227}px` : 'auto',
  };
});





const totalPrice = computed(() => {
    return refItems.value.reduce((total, item) => {
        return total += (item.sale_price * item.quantity);
    }, 0);
});





// saleType values:
// 'FAST_PAY' | 'CREDIT' | 'INVOICE'

const onSave = async () => {
  isLoading.value = true;

  try {
    let credit = null;
    let customer = null;

    // ---------------------------------
    // SINGLE DECISION POINT
    // ---------------------------------
    switch (state.saleType) {

      case 'CREDIT':
        credit = 1;
        customer = { ...form };
        break;

      case 'INVOICE':
        credit = 0;
        customer = { ...form };
        break;

      case 'FAST_PAY':
      default:
        credit = null;
        break;
    }

    // ---------------------------------
    // PAYLOAD (customer ONLY when needed)
    // ---------------------------------
    const payload = {
      items: refItems.value,
      sale_date: form.sale_date,
      credit: credit,
    };

    if (customer) {
      payload.customer = customer;
    }

    console.log('FINAL PAYLOAD =>', payload);

    const response = await api.post('/sales', payload);

    if (response.data.success) {
      reset();
      toast.success(response.data.message);
      router.push('sale-list')
    }

  } catch (error) {

    if (error.response?.status === 422) {
      const backendErrors = error.response.data.errors;

      Object.keys(backendErrors).forEach((key) => {
        const cleanKey = key.split('.').pop();
        if (errors.hasOwnProperty(cleanKey)) {
          errors[cleanKey] = backendErrors[key][0];
        }
      });
    }

  } finally {
    isLoading.value = false;
  }
};





const reset =()=>{

     form.name =''
     form.address =''
     form.sale_date =''
     form.remarks =''
     form.phone_one =''
     refItems.value = [];
     Object.keys(errors).forEach((key) => errors[key] = '');
     showModal.value = false;
     payFastModal.value = false;
     sale_status.value = false
     discount.value = 0;
}

const getScreenHeight = () => {
  screenHeight.value =(window.innerHeight);
  // console.log('scree height',screenHeight.value)
};

onMounted(() => {
  updateScreenSize();
  // Set current date in YYYY-MM-DD format
// Get current date and time in the format YYYY-MM-DDTHH:MM (for input type="datetime-local")
if (!form.sale_date) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(now.getDate()).padStart(2, '0'); // Add leading zero

    // Format: YYYY-MM-DDT00:00
    form.sale_date = `${year}-${month}-${day}T00:00`;
  }

      sale_id.value = route.params.id || null;
  if(sale_id.value !== null ){
    state.update = true;
    fetItemsForEdit()
  }


  fetchItems();
  fetchItemCategories();
  getScreenHeight();
  window.addEventListener('resize', getScreenHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', getScreenHeight);
});
</script>
<style scoped>
.dot-flash {
  animation: flash 1s infinite alternate;
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}


</style>
<style>
/* Optional: Add styling for the video element */
video {
  border: 1px solid #000;
}
</style>
