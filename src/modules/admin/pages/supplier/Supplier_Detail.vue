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
        <span class=" sm:inline font-bold">Supplier-Detail</span>
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
  <table class="min-w-full border-collapse text-xs sm:text-sm md:text-base">
    <thead class="bg-gray-100 text-gray-700 text-xs">
      <tr>
        <th class="px-4 py-2 text-left font-semibold">Name</th>
        <th class="px-4 py-2 text-left font-semibold">Contact</th>
        <th class="px-4 py-2 text-left font-semibold">Company Name</th>
        <th class="px-4 py-2 text-left font-semibold">Account No.</th>
        <th class="px-4 py-2 text-left font-semibold">Liabilities</th>
        <th class="px-4 py-2 text-left font-semibold">Purchased Amount</th>
        <th class="px-4 py-2 text-left font-semibold">Amount Paid</th>
        <th class="px-4 py-2 text-left font-semibold">Remaining</th>
        <!-- <th class="px-4 py-2 text-left font-semibold">Total</th> -->
        <th class="px-4 py-2 text-left font-semibold">Action</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-t border-gray-200 text-xs">
        <td class="px-4 py-2">{{ state.supplier.name || '-' }}</td>
        <td class="px-4 py-2">{{state.supplier.contact_person || '-' }}</td>
        <td class="px-4 py-2">{{state.supplier.company_name || '-' }}</td>
        <td class="px-4 py-2">{{  state.supplier.account_number || '-' }}</td>

        <!-- if the result is negative, it returns 0 -->
        <td class="px-4 py-2">
        Rs.{{ Math.max(0, state.supplier.liabilities - amount_paid_total_supplier) || 0 }}
       </td>

        <td class="px-4 py-2">Rs.{{ round(total_purchased_amount) || '-' }}</td>
        <td class="px-4 py-2">Rs.{{round( amount_paid_total_supplier) || '-' }}</td>
        <td class="px-4 py-2">Rs.{{ round(total_purchased_amount-amount_paid_total_supplier) || '-' }}</td>
        <!-- <td class="px-4 py-2 font-semibold">{{ '-' }}</td> -->
        <td class="px-4 py-2 font-semibold">
    <button
    @click="viewPaymentSupplier(state.supplier.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-money-bill text-base"></i>
    <span>Payments</span>
  </button></td>
      </tr>
    </tbody>
  </table>
</div>


    <main class="flex-1 mt-1">

        <div  class="w-full overflow-x-scroll border border-gray-300 rounded-md shadow-sm">
            <div class="w-full bg flex flex-row items-center  bg-gray-800 text-white p-1.5 justify-between">
                <i class="pi pi-home mr-1 text-lg"> Stock Invoices</i>
            <!-- Add Button -->
      <Button
        variant="primary"
        size="sm"
        class="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-1 py-2 rounded-lg shadow-sm transition-all duration-150 mt-3 sm:mt-0"
        @click="() => { resetForm(); editSupplierOrder = false; showModal = true; }"
      >
        <i class="pi pi-plus text-sm"></i>
        <span>Stock-Invoices</span>
      </Button>
            </div>


                <table v-if="state.supplier_order && state.supplier_order.length" class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">#</th>
                <th class="px-4 py-2 text-left font-semibold">Invoice-Number</th>
                <th class="px-4 py-2 text-left font-semibold">Date</th>
                <th class="px-4 py-2 text-left font-semibold">Transport-Cost</th>
                <th class="px-4 py-2 text-left font-semibold">Total-Items</th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Total-Amount</th> -->
                <th class="px-4 py-2 text-left font-semibold">Purchased-Amount</th>
                <th class="px-4 py-2 text-left font-semibold">Actions</th>
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

                <td class="px-4 py-2 text-gray-700">{{order.transport_cost ||'-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ order.total_items || '-' }}</td>
                 <!-- <td class="px-4 py-2 text-gray-700">{{ order.total_amount || '-' }}</td> -->
                  <td class="px-4 py-2 text-gray-700">{{order.total_purchased_amount || '-' }}</td>

                <!-- <td class="px-4 py-2 text-gray-700">{{ formatCurrency(supplier.liabilities) }}</td>

                <td class="px-4 py-2 text-gray-700">{{ formatCurrency(getAggregate(supplier.id).purchased) }}</td>

                <td class="px-4 py-2 text-gray-700">{{ formatCurrency(getAggregate(supplier.id).paid) }}</td> -->

                <!-- <td class="px-4 py-2 text-gray-700">
                  {{ formatCurrency(getAggregate(supplier.id).purchased - getAggregate(supplier.id).paid) }}
                </td> -->

                <!-- <td class="px-4 py-2 text-gray-700">
                  {{ formatCurrency((supplier.liabilities || 0) + (getAggregate(supplier.id).purchased - getAggregate(supplier.id).paid)) }}
                </td> -->

                <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">

  <!-- VIEW -->
  <button
    @click="viewSupplierOrderItems(order)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow text-xs"
  >
    <i class="pi pi-eye text-base"></i>
    <span>View</span>
  </button>

  <!-- EDIT -->
  <button
    @click="editSupplierOrderOpen(order)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-pencil text-base"></i>
    <span>Edit</span>
  </button>

  <!-- DELETE -->
  <button
    @click="onDelete(order.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-trash text-base"></i>
    <span>Delete</span>
  </button>

</td>


              </tr>

              <!-- Totals Row -->
              <!-- <tr class="bg-gray-50 border-t border-t-gray-300 font-semibold text-xs">
                <td colspan="5" class="px-4 py-2 text-left">Total:</td>
                <td class="px-4 py-2">{{ formatCurrency(totalLiabilities) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalPurchased) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalPaid) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalPurchased - totalPaid) }}</td>
                <td class="px-4 py-2">{{ formatCurrency(totalRemaining) }}</td>
                <td class="px-4 py-2"></td>
              </tr> -->
            </tbody>
          </table>

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

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editSupplierOrder ? 'Edit Supplier_Order' : 'Create Supplier Order'"
      @save="() => onSaveOrUpdate()"
      :disableSaveBtn="isLoading"
    >
      <div class="bg-white p-4 rounded-lg shadow-2xl space-y-2">
        <FormInput id="supplier_invoice_number" label="Supplier Invoice Number" v-model="form.supplier_invoice_number" :error="errors.supplier_invoice_number" />
        <FormInput id="transport_cost" label="Transport Cost" v-model="form.transport_cost" :error="errors.transport_cost" />
        <!-- <FormInput id="total_amount" label="Total Amount" v-model="form.total_amount" :error="errors.total_amount" />
        <FormInput id="total_items" label="Total Items" v-model="form.total_items" :error="errors.total_items" /> -->
        <FormInput id="supplier_invoice_date" label="Supplier Invoice Date" v-model="form.supplier_invoice_date" type="date" :error="errors.supplier_invoice_date" />
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import Button from "@/components/admin/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, watch, computed } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from '@/utils/toast';
import { useFormErrors } from "@/composables/admin/useFormErrors";
// import BreadCrumb from "@/components/admin/BreadCrumb.vue";
import SearchBar from "@/components/SearchBar.vue"; // Using SearchBar only as requested
import _ from "lodash";
import { round } from "@/utils/helper";

const route = useRoute();
const router = useRouter();

const perPage = 20; // pagination size (matches controller)
const state = reactive({
  supplier: [],
  supplier_order: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const isLoading = ref(false);
const isLoadingSearch = ref(false);
const editSupplierOrder = ref(false);
const supplier_id = ref('');
const showModal = ref(false);
const searchText = ref('');

const amount_paid_total_supplier = ref(0);
const total_purchased_amount = ref(0);
const total_item_quanity = ref(0)
// form
const form = reactive({
  supplier_id : '',
  supplier_invoice_number: '',
//   phone: '',
  transport_cost: 0,
  supplier_invoice_date: '',
});

const errors = reactive({
 supplier_id : '',
  supplier_invoice_number: '',
//   phone: '',
  transport_cost: '',
  supplier_invoice_date: '',
});

const handleFormErrors = useFormErrors(errors);



//--------------------Crate or Update Supplier Order-------------------
//onSaveOrUpdate
const onSaveOrUpdate = async () => {
  isLoading.value = true;


  try {
    let response;
    if (editSupplierOrder.value) {
      // Update existing supplier order
      response = await api.put(`/supplier-orders/${form.id}`, form);
      toast.success("Supplier Order updated successfully");
       fetchSupplierOrder(form.supplier_id);
    } else {
      // Create new supplier order
      response = await api.post("/supplier-orders", form);
      toast.success("Supplier Order created successfully");
       fetchSupplierOrder(form.supplier_id);
    }

    // Refresh supplier orders list
    // await fetchSuppliers();

    resetForm();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Validation errors
      console.log("Validation errors:", error.response.data.errors);
      handleFormErrors(error);
    } else {
      toast.error("An error occurred while saving the supplier order");
    }
  } finally {
    isLoading.value = false;
  }
};


// ------------------- Edit Supplier Order ------------------
const editSupplierOrderOpen = (supplier) => {
  editSupplierOrder.value = true;
  form.id = supplier.id;
  form.supplier_invoice_number = supplier.supplier_invoice_number;
  form.transport_cost = supplier.transport_cost;
  form.total_amount = supplier.total_amount;
  // form.total_items = supplier.total_items;
  form.supplier_invoice_date = supplier.supplier_invoice_date;
  showModal.value = true;
};


// ------------------- Fetch Suppliers -------------------
const fetchSupplierOrder = async (supplier_order_id) => {
  try {
    isLoading.value = true;

    const response = await api.get(`/supplier-orders/${supplier_order_id}`);

    state.supplier_order = response.data.data; // this is a single object
    console.log('fetch Supplier response-',response.data)

  } catch (error) {
    console.error("Error fetching order:", error);
    toast.error("Failed to fetch order");
  } finally {
    isLoading.value = false;
  }
};


//---------------------Fetch Tota Paid to Supplier ------------

const fetchTotalPaidToSupplier = async (supplier_id)=>{
try {
    isLoading.value = true

    const response = await api.get(`/supplier-payments/total/${supplier_id}`);
    amount_paid_total_supplier.value = response.data.data.paid_total_supplier;
     console.log('fetchTotalPaidToSupplier-',response.data.data)
} catch (error) {
    console.log('fail to fetch total Order Items',error)
}
}

//---------------------Fetch Total Order Items ------------

const fetchTotalOrderItems = async (supplier_id)=>{
try {
    isLoading.value = true

    const response = await api.get(`/supplier-order-items/total/${supplier_id}`)
    total_purchased_amount.value = response.data.data.total_purchased_amount;
    total_item_quanity.value = response.data.data.total_item_quanity
    console.log('fetchTotalOrderItems-',response.data.data)
} catch (error) {
    console.log('fail to fetch total Order Items',error)
}
}
//--------------------Get Total Order Per Invoice -----------------------

// const getInvoiceItemTotals = async (order_invoice_id)=>{
// try {
//     isLoading.value = true

//     //
//     const response = await api.get(`/total-order-invoice/${order_invoice_id}`)
//     total_purchased_amount.value = response.data.data.total_order_items;
//     total_item_quanity.value = response.data.data.total_quantity
//     console.log('fetchTotalOrderItems-',response.data.data)
// } catch (error) {
//     console.log('fail to fetch total Order Items',error)
// }
// }

const resetForm = () => {
  form.supplier_invoice_number = "";
  form.transport_cost = "";
  form.supplier_invoice_date = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  showModal.value = false;
  editSupplierOrder.value = false;
  
};

const  fetcSupplierDetail = async (supplier_id)=>{
    isLoading.value = true;
    try {
        const response = await api.get(`/suppliers/${supplier_id}`)
        state.supplier = response.data.data;
        console.log("Supplier Details:", state.supplier);
    } catch (error) {
        console.error("Error fetching supplier details:", error);
        toast.error("Failed to fetch supplier details");
    } finally {
        isLoading.value = false;

    }


}


const viewSupplierOrderItems = (order) => {
    router.push({
        name: 'admin.stock-invoice',
        params: {
            id: order.id,
            supplier_id: supplier_id.value
        }
    });
};


const viewPaymentSupplier = (supplier_id)=>{
router.push({
    name:'admin.supplier-payments',
    params:{
       supplier_id:supplier_id
    }
})
}



// ------------------- Delete Supplier -------------------
const onDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this supplier Order Invoice?")) return;
  isLoading.value = true;
  try {
    const response = await api.delete(`/supplier-orders/${id}`);
    // state.supplier = state.supplier.filter((s) => s.id !== id);
    // remove aggregates cache


    if(response.data.success){
      fetchSupplierOrder(form.supplier_id);
      toast.success(response.data.message || "Supplier Order Invoice deleted successfully");
    }

  } catch (error) {
    console.error("Error deleting supplier:", error);
    toast.error("Failed to delete supplier");
  } finally {
    isLoading.value = false;
  }
};


// ------------------- Mounted -------------------
onMounted(async () => {

     form.supplier_id = route.params.id ? route.params.id : '' ;
     supplier_id.value = route.params.id ? route.params.id : '' ;
    //  console.log("Supplier ID:", form.supplier_id);
     await fetchTotalPaidToSupplier(form.supplier_id)
     await fetchTotalOrderItems(form.supplier_id)
     await fetcSupplierDetail(form.supplier_id);
     await fetchSupplierOrder(form.supplier_id);
});
</script>
