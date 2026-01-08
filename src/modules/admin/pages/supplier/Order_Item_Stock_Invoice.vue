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
  <!-- Left section: Supplier Details & Supplier Payments -->
  <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
        <router-link
          to="/admin/Supplier"
          class="flex items-center hover:text-blue-600 transition-colors"
        >
          <i class="pi pi-home mr-1 text-2xl"></i>
          <span class=" sm:inline">Supplier</span>
        </router-link>
        <span class="font-semibold text-gray-900">/</span>
        <span class=" text-gray-900"> Supplier-Detail</span>
        <span class="font-semibold text-gray-900">/</span>
        <span class=" sm:inline font-bold">Stock-Invoice</span>
      </nav>

  <!-- Right section: Back Button -->
  <!-- <div class="mt-2 sm:mt-0">
    <router-link
      to="/admin/Supplier"
      class="flex items-center gap-1 text-blue-600 hover:text-blue-800"
    >
      <i class="pi pi-arrow-left"></i>
      <span>Back</span>
    </router-link>
  </div> -->

</header>

<!-- Table -->
<div class="overflow-x-auto border border-gray-300 rounded-md shadow-sm mt-4">
  <table v-if="state.supplier_order && state.supplier_order.length" class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">#ID</th>
                <th class="px-4 py-2 text-left font-semibold">Invoice-Number</th>
                <th class="px-4 py-2 text-left font-semibold">Date</th>
                <th class="px-4 py-2 text-left font-semibold">Transport-Cost</th>
                <th class="px-4 py-2 text-left font-semibold">Total-Items</th>
                <th class="px-4 py-2 text-left font-semibold">Total-Amount</th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Purchased-Amount</th> -->

              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(order, index) in state.supplier_order"
                :key="order.id"
                class="border-t border-t-gray-300 hover:bg-gray-50 transition ext-sm text-xs"
              >
                <td class="px-4 py-2 font-medium text-gray-800">{{ order.id }}</td>

                <td class="px-4 py-2 font-medium text-gray-900">{{ order.supplier_invoice_number || '-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ order.supplier_invoice_date || '-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ order.transport_cost || '-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ total_quantity || '-' }}</td>
                 <td class="px-4 py-2 text-gray-700">{{ total_amount_order_items || '-' }}</td>
                  <!-- <td class="px-4 py-2 text-gray-700">{{ order.account_number || '-' }}</td> -->



              </tr>


            </tbody>
          </table>
</div>


    <main class="flex-1 mt-1">

        <div  class="w-full min-h-screen overflow-x-scroll border border-gray-300 rounded-md shadow-sm">
            <div class="w-full bg flex flex-row items-center  bg-gray-800 text-white p-1.5 justify-between">
                <i class="pi pi-home mr-1 text-lg"> Invoice</i>
            <!-- Add Button -->
             <div class="flex flex-row">

                <button
  @click="printInvoice"
  class="relative text-white rounded mr-3 p-2 group"
>
  <!-- Icon -->
  <i class="pi pi-print text-white text-lg transition-transform duration-200 group-hover:scale-110"></i>

  <!-- Tooltip text -->
  <span
    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
  >
    Click to Print
  </span>
</button>


      <Button
        variant="primary"
        size="sm"
        class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
        @click="() => { resetForm(); showModal = true;}"
      >
        <i class="pi pi-plus text-base"> Add-Item-Stock</i>
        <span></span>
      </Button>


</div>


            </div>



       <BaseModal
  v-model="showModal"
  :title="isEditSupplierOrderItems ? 'Update Item Stock' : 'Add Item Stock'"
  @save="() => { addOrUpdateStockItem(form); resetForm(); }"
  :disableSaveBtn="isSaveLoading"
>

  <!-- GRID FORM -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <!-- ITEM SELECTOR -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Item</label>

      <div class="relative" ref="dropdownRef">
        <input
          type="text"
          v-model="form.name"
          @click="toggleDropdown"
          class="w-full px-3 py-2 border border-gray-300 rounded-md pr-10
                 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Select Item"
          readonly
        />

        <!-- Dropdown Icon -->
        <button
          type="button"
          @click="toggleDropdown"
          class="absolute right-0 top-0 h-full w-10 flex items-center
                 justify-center text-gray-400 hover:text-gray-600"
        >
          ▼
        </button>

        <!-- Hidden Item ID
        <FormInput v-model="form.item_id" class="hidden" /> -->

        <!-- DROPDOWN -->
        <Transition name="slide">
          <div
            v-if="isDropdownOpen"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300
                   rounded-md shadow-lg"
          >
            <!-- Search Items -->
            <SearchBar
              v-model="searchItem"
              @input="handleSearchInput"
              placeholder="Search Items..."
              class="mt-1"
            />

            <!-- List -->
            <ul class="max-h-40 overflow-y-auto">
              <li
                v-for="item in state.items"
                :key="item.id"
                @click="selectItem(item)"
                class="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </Transition>
      </div>

      <p v-if="errors.name" class="text-red-600 text-sm mt-1">
        {{ cleanError(errors.name) }}
      </p>
    </div>

    <!-- QUANTITY -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        New Stock (Quantity)
      </label>

      <FormInput
        id="quantity"
        type="number"
        v-model="form.quantity"
        @input="calculateCost()"
        :error="errors.quantity"
        :disabled="isSaveLoading"
      />
    </div>

    <!-- TOTAL PRICE -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Total Price
      </label>

      <FormInput
        id="total_price"
        type="number"
        v-model="form.total_price"
        @input="calculateCost()"
        :error="errors.total_price"
        :disabled="isSaveLoading"
      />
    </div>

    <!-- COST PRICE -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>

      <FormInput
        id="cost_price"
        type="number"
        v-model="form.cost_price"
        :error="errors.cost_price"
        :disabled="isSaveLoading"
      />
    </div>

    <!-- SALE PRICE -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>

      <FormInput
        id="sale_price"
        type="number"
        v-model="form.sale_price"
        :error="errors.sale_price"
        :disabled="isSaveLoading"
      />
    </div>

  </div>

</BaseModal>



         <!------------------------------Order Items---------------------------------------->
         <!-- Table -->

<div ref="invoiceRef" v-if="state.supplier_order_items && state.supplier_order_items.length" class="overflow-x-auto border border-gray-300 rounded-xs shadow-sm m-2">

     <!-- <div class="hidden print:flex w-full h-16  items-center justify-center text-2xl font-bold border-t border-b border-gray-300 bg-gray-100 space-x-2"> -->
  <!-- Icon -->
  <!-- <i class="pi pi-box text-3xl"></i> -->

  <!-- Text -->
  <!-- <span>Item Details</span> -->
  <!-- </div> -->

    <!-- Invoice Header -->
<div class="w-full border mt-1 border-gray-300 bg-gray-100 p-5  rounded-md">

  <!-- Flex row with justify-between -->
  <div class="flex justify-between w-full">

    <!-- Left Column -->
    <div class="flex flex-col space-y-2 ">
      <div class="flex items-center space-x-2">
        <i class="pi pi-user text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Supplier Name:
          <span class="font-normal">{{ state.supplier?.name || '-' }}</span>
          <div class="text-[11px] text-slate-400 font-medium tracking-tight">Company Name:{{ state.supplier?.company_name }}</div>
          </span>
          
      </div>

      <div class="flex items-center space-x-2">
        <i class="pi pi-phone text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Contact No:
          <span class="font-normal">{{ state.supplier?.contact_person || '-' }}</span>
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <i class="pi pi-map-marker text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Address:
          <span class="font-normal">{{ state.supplier?.address || '-' }}</span>
        </span>
      </div>
    </div>

    <!-- Right Column -->
    <div class="flex flex-col space-y-2 text-right">

      <div class="flex items-center justify-start space-x-2">
        <i class="pi pi-hashtag text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Invoice ID:
          <span class="font-normal">{{ inoivce_order_id || '-' }}</span>
        </span>
      </div>

      <div class="flex items-center justify-start space-x-2">
        <i class="pi pi-file text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Invoice No:
          <span class="font-normal">{{ invoice_number || '-' }}</span>
        </span>
      </div>

      <div class="flex items-center justify-start space-x-2">
        <i class="pi pi-calendar text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Created Date:
          <span class="font-normal">{{ invoice_date || '-' }}</span>
        </span>
      </div>

    </div>

  </div>

</div>


             <table v-if="state.supplier_order && state.supplier_order.length" class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">ID</th>
                <th class="px-4 py-2 text-left font-semibold">Name</th>
                <th class="px-4 py-2 text-left font-semibold print:hidden">Cost-Price</th>
                <th class="px-4 py-2 text-left font-semibold print:hidden">Sale-Price</th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Unit-price</th> -->
                <th class="px-4 py-2 text-left font-semibold">Quantity</th>
                <th class="px-4 py-2 text-left font-semibold print:hidden">Total</th>
                <th class="px-4 py-2 text-left font-semibold print:hidden">Action</th>


              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(order_items, index) in state.supplier_order_items"
                :key=" order_items.id"
                class="border-t border-t-gray-300 hover:bg-gray-50 transition ext-sm text-xs"
              >
                <td class="px-4 py-2 font-medium text-gray-800">{{ order_items.id }}</td>

                <td class="px-4 py-2 font-medium text-gray-900">{{ order_items.name || '-' }}</td>

                <td class="px-4 py-2 text-gray-700 print:hidden">{{ order_items.cost_price || '0' }}</td>

                <td class="px-4 py-2 text-gray-700 print:hidden">{{ order_items.sale_price || '0' }}</td>
                <!-- <td class="px-4 py-2 text-gray-700">{{ order_items.unit_price || '-' }}</td> -->
                 <td class="px-4 py-2 text-gray-700">{{ order_items.quantity || '0' }}</td>
                  <td class="px-4 py-2 text-gray-700 print:hidden">{{ round((order_items.cost_price) * order_items.quantity) || '0' }}</td>
            <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2 print:hidden">


  <!-- EDIT -->
  <button
    @click="edit(order_items)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-pencil text-xs"></i>
    <span>Update</span>
  </button>

  <!-- DELETE -->
  <button
    @click="onDelete(order_items.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-trash text-xs"></i>
    <span>Delete</span>
  </button>

</td>

            </tr>

            </tbody>

            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr class="border border-gray-300">
                <th class="px-4 py-2 text-left font-semibold">Total</th>
                <th class="px-4 py-2 text-left font-semibold print:hidden" ></th>
                <th class="px-4 py-2 text-left font-semibold print:hidden"></th>
                <th class="px-4 py-2 text-left font-semibold "></th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Unit-price</th> -->
                <th class="px-4 py-2 text-left font-semibold">{{total_quantity || 0}}</th>
                <th class="px-4 py-2 text-left font-semibold print:hidden">Rs.{{ total_amount_order_items || 0}}</th>
                <th class="px-4 py-2 text-left font-semibold"></th>

              </tr>
            </thead>
          </table>

        </div>



        <div
          v-else
          class="flex flex-col items-center justify-center h-[60vh] text-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No Data"
            class="w-32 h-32 opacity-70 mb-4"
          />
          <h2 class="text-xl font-semibold text-gray-700 mb-2">No Suppliers Found</h2>
          <p class="text-gray-500">
            Try adding new suppliers to see them listed here.
          </p>
        </div>

          <!-- Pagination -->
          <Pagination
            :pagination="state.pagination"
            @page-change="fetchSuppliers"
          />
        </div>



    </main>

    <!----------------------------Modal------------------------------------->
    <!-- <BaseModal
      v-model="showModal"
      :title="editSupplierOrder ? 'Edit Supplier_Order' : 'Create Supplier Order'"
      @save="() => updateStokItem()"
      :disableSaveBtn="isLoading"
    > -->
      <!-- <div class="bg-white p-4 rounded-lg shadow-2xl space-y-2">
        <FormInput id="supplier_invoice_number" label="Supplier Invoice Number" v-model="form.supplier_invoice_number" :error="errors.supplier_invoice_number" />
        <FormInput id="transport_cost" label="Transport Cost" v-model="form.transport_cost" :error="errors.transport_cost" /> -->
        <!-- <FormInput id="total_amount" label="Total Amount" v-model="form.total_amount" :error="errors.total_amount" />
        <FormInput id="total_items" label="Total Items" v-model="form.total_items" :error="errors.total_items" /> -->
        <!-- <FormInput id="supplier_invoice_date" label="Supplier Invoice Date" v-model="form.supplier_invoice_date" type="date" :error="errors.supplier_invoice_date" />
      </div> -->
    <!-- </BaseModal> -->
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import Button from "@/components/admin/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, watch, computed,onUnmounted,nextTick } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from '@/utils/toast';
import { useFormErrors } from "@/composables/admin/useFormErrors";
import SearchBar from "@/components/SearchBar.vue"; // Using SearchBar only as requested
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas'; // Import the new dependency
import jsPDF from "jspdf";

// let html2pdf = null;
const pdfContent = ref(null)
const downloading = ref(false);
const orderContent = ref(null);

import _ from "lodash";
import { limitDisplayText, cleanError } from '@/utils/stringHelpers'
import { round } from '@/utils/helper';
import { usePrint } from '@/composables/admin/usePrint'

const invoiceRef = ref(null)
const { printElement } = usePrint()

const route = useRoute();
const router = useRouter();
// 1. Create a template ref for the dropdown container
const dropdownRef = ref(null);
const perPage = 20; // pagination size (matches controller)
const state = reactive({
  supplier: [],
  supplier_order: [],
  supplier_order_items: [],
  items:[],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const pdfRef = ref(null)
const searchItem = ref('');
const isLoading = ref(false);
const isSaveLoading = ref(false);
const isLoadingSearch = ref(false);
const editSupplierOrderItems = ref(false);
const isEditSupplierOrderItems = ref(false);
const supplier_id = ref('');
const showModal = ref(false);
const searchText = ref('');
const supplier_order_id = ref('');



// form
const form = reactive({
  supplier_order_id : '',
  item_id:'',
  name:'',
  quantity:'',
  cost_price:'',
  sale_price:'',
  total_price:'',
  unit:''
});






const errors = reactive({
  name:'',
  quantity:'',
  cost_price:'',
  sale_price:'',
  total_price:'',
});



// Calculate cost price based on total price and quantity
const calculateCost = () => {
    form.cost_price = form.quantity ? (form.total_price / form.quantity).toFixed(2) : 0
}



// Search items for stock invoice
const handleSearchInput = (query) => {
    console.log("Searching for items with query:", query);
    searchItem.value = query;

     fetchItems();
} // Adjust the debounce delay as needed

// ... other reactive variables

// Dropdown state for search items
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

//Select items for Order
const selectItem = (item) => {

  //reset some fields
    form.quantity = ''
    form.total_price = ''
    form.cost_price = ''



  form.name = item.name
  form.item_id = item.id
  form.sale_price = item.sale_price
  form.unit = item.unit

  isDropdownOpen.value = false
}








// //--------------------Crate or Update Supplier Order-------------------
// //onSaveOrUpdate
// const onSaveOrUpdate = async () => {
//   isLoading.value = true;


//   try {
//     let response;
//     if (editSupplierOrder.value) {
//       // Update existing supplier order
//       response = await api.put(`/supplier-orders/${form.id}`, form);
//       toast.success("Supplier Order updated successfully");
//     } else {
//       // Create new supplier order
//       response = await api.post("/supplier-orders", form);
//       toast.success("Supplier Order created successfully");
//     }

//     // Refresh supplier orders list
//     await fetchSuppliers();
//     resetForm();
//   } catch (error) {
//     if (error.response && error.response.status === 422) {
//       // Validation errors
//       console.log("Validation errors:", error.response.data.errors);
//       handleFormErrors(error);
//     } else {
//       toast.error("An error occurred while saving the supplier order");
//     }
//   } finally {
//     isLoading.value = false;
//   }
// };


//Add item to stock
const addOrUpdateStockItem = async (form) => {
  isSaveLoading.value = true;
    try {

         // Exclude fields using destructuring
  const { total_price, ...dataToSend } = form;

        let response =''
        if (isEditSupplierOrderItems.value) {
            // Update existing stock item
            dataToSend.id = form.id; // Include the ID for updating
            response = await api.put(`/supplier-order-items/${form.id}`, dataToSend);
            toast.success(response.data.message || "Stock item updated successfully");
             resetForm();
        } else {
            // Create new stock item
        response = await api.post("/supplier-order-items", dataToSend);
        toast.success(response.data.message || "Stock item added successfully");
         resetForm();
        }

        // Refresh supplier orders list
        await fetchSupplierOrder(supplier_order_id.value);
        await fetchSupplierOrderItems(supplier_order_id.value)


    } catch (error) {
        if (error.response && error.response.status === 422) {
            // Validation errors
            console.log("Validation errors:", error.response.data.errors);
            handleFormErrors(error);
        } else {
            toast.error("An error occurred while adding the stock item");
        }
    } finally {
        isSaveLoading.value = false;
    }
};


const fetchSupplierOrderItems = async (supplier_order_id) => {
    isLoading.value = true;
    try {
        const response = await api.get(`/supplier-order-items/by-supplier-order/${supplier_order_id}`);

        state.supplier_order_items = response.data.data || [];
        console.log("Supplier Order Items:", state.supplier_order_items);

    } catch (error) {
        console.error("Error fetching supplier order items:", error);
        toast.error("Failed to fetch supplier order items");
    } finally {
        isLoading.value = false;
    }
};



const resetForm = () => {
isEditSupplierOrderItems.value = false;
  form.name = "";
  form.cost_price = "";
  form.sale_price = "";
  form.quantity = "";
  form.total_price = "";
  form.item_id = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  showModal.value = false;
//   editSupplierOrder.value = false;
//   supplier_id.value = "";
};

const fetchSupplierOrder = async (supplier_order_id) => {
    isLoading.value = true;
    try {
        const response = await api.get(`/supplier-orders/order/${supplier_order_id}`);

        // FIX: ensure array format
        state.supplier_order = response.data.data ? [response.data.data] : [];

        console.log("supplier_invoice_number:", state.supplier_order.supplier_invoice_number);

    } catch (error) {
        console.error("Error fetching supplier details:", error);
        toast.error("Failed to fetch supplier details");
    } finally {
        isLoading.value = false;
    }
};

const fetchItems = async (url = "/supplier-order-items/items") => {
    isLoading.value = true;

    try {
        const response = await api.get(url, {
            params: {
                search: searchItem.value || null,
            }
        });

        state.items = response.data.data.data || [];



    } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to fetch items");
    } finally {
        isLoading.value = false;
    }
};


// ------------------- Delete Supplier -------------------
const onDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this Item?")) return;
  isLoading.value = true;
  try {
    const response = await api.delete(`/supplier-order-items/${id}`);
    // state.suppliers = state.suppliers.filter((s) => s.id !== id);
    // remove aggregates cache
    // delete aggregates[id];
    fetchSupplierOrderItems(supplier_order_id.value)
    toast.success(response.data.message || "Item deleted successfully");
  } catch (error) {
    console.error("Error deleting supplier:", error);
    toast.error("Failed to delete supplier");
  } finally {
    isLoading.value = false;
  }
};

// ------------------- Fetch Supplier Detail ---------------
const  fetchSupplierDetail = async (id)=>{

    isLoading.value = true

    try {
        const response = await api.get(`suppliers/${id}`)
        // console.log('response',)
        state.supplier = response.data.data;
        // console.log('Supplier-Name',state.supplier?.name)

    } catch (error) {
        toast.error(error);

    }
    finally{
        isLoading.value = false
    }

}

const total_quantity = computed(() =>
  state.supplier_order_items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
);

const total_amount_order_items = computed(() =>
  state.supplier_order_items.reduce((sum, item) => sum + Number(item.cost_price * item.quantity || 0), 0)
);

// Invoice Number (from first order)
const invoice_number = computed(() =>
  state.supplier_order.length
    ? state.supplier_order[0].supplier_invoice_number || '0'
    : '0'
);

// Invoice Date (from first order)
const invoice_date = computed(() =>
  state.supplier_order.length
    ? state.supplier_order[0].supplier_invoice_date || '0'
    : '0'
);

const inoivce_order_id = computed(()=>
state.supplier_order.length
    ? state.supplier_order[0].id || '-'
    : '-'
)




// 2. Define the handler function
const handleClickOutside = (event) => {
    // console.log("Document clicked:", event.target);
  // Check if the dropdown is open AND
  // Check if the click occurred outside the dropdown element itself
  // !dropdownRef.value.contains(event.target) is the core logic.
  console.log("outside click clicked:", isDropdownOpen.value);
  if (isDropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};




// Edit Supplier Order Items
const edit = (order_items) => {
    isEditSupplierOrderItems.value = true;
    form.id = order_items.id;
    form.name = order_items.name;
    form.item_id = order_items.item_id;
    form.quantity = order_items.quantity;
    form.cost_price = order_items.cost_price;
    form.sale_price = order_items.sale_price;
    form.unit = order_items.unit;
    form.total_price = (order_items.cost_price * order_items.quantity).toFixed(2);
    showModal.value = true;
}

//handle backend validation errors and display below each inputs fileds
const handleFormErrors = useFormErrors(errors);


const printInvoice = () =>{
    printElement(invoiceRef)
}
// //Convert into Pdf/**
// const printInvoice = () => {
//   if (!orderContent.value) return

//   const printContents = orderContent.value.innerHTML
//   const originalContents = document.body.innerHTML

//   // Replace body with invoice content
//   document.body.innerHTML = printContents

//   // Trigger browser print
//   window.print()

//   // Restore original body after printing
//   document.body.innerHTML = originalContents
//   window.location.reload()
// }


// ------------------- Mounted -------------------
onMounted(async () => {


    // Add the listener when the component is mounted to the DOM
  document.addEventListener('click', handleClickOutside);


     supplier_order_id.value = route.params.id ? route.params.id : '' ;
     form.supplier_order_id = supplier_order_id.value;
     supplier_id.value = route.params.supplier_id? route.params.supplier_id :'';
     await fetchSupplierDetail(supplier_id.value)
    //  await fetcSupplierDetail(form.supplier_id);
     await fetchSupplierOrder(supplier_order_id.value);
     fetchSupplierOrderItems(supplier_order_id.value)
     await fetchItems();
});

onUnmounted(() => {
  // IMPORTANT: Clean up the listener when the component is destroyed
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
/* Define the sliding transition */

/* Initial state (hidden) */
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Final state (visible) */
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 200px; /* A fixed height large enough for the content */
}

/* Apply transition properties */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
}
</style>

<style>
/* This CSS is applied only when the page is printed or converted to PDF */
@media print {
  /* Hides any element with the class 'print-hide' */
  .print-hide,
  .print-hide * {
    display: none !important;
  }
}

/* html2pdf.js uses the 'print' media query when generating the PDF,
so this is the standard way to hide elements.
*/
</style>
