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
      <!-------------------------------Breadcrumb---------------------------->
      <nav class="flex items-center space-x-2 text-sm md:text-base text-gray-600">
    <!-- Home -->
    <router-link
      :to="homeRoute"
      class="flex items-center hover:text-blue-600 transition-colors"
    >
      <i class="pi pi-home mr-1 text-2xl"></i>
      <span class="sm:inline">{{ homeLabel }}</span>
    </router-link>

    <template v-for="(crumb, index) in breadcrumbs" :key="index">
      <i class="pi pi-chevron-right text-gray-400 mx-0.5"></i>

      <button
        v-if="crumb.isBack"
        @click="goBack(crumb.fallback)"
        class="sm:inline  text-gray-600 hover:text-blue-600"
      >
        {{ crumb.label }}
      </button>

      <router-link
        v-else
        :to="crumb.route"
        class="sm:inline font-bold text-gray-600 hover:text-gray-800"
      >
        {{ crumb.label }}
      </router-link>
    </template>
  </nav>

  <!-------------------------------Breadcrumb---------------------------->


    </header>

    <main class="flex-1 p-4 sm:p-6 md:p-8">




        <div ref="invoiceRef"  class="w-full overflow-x-scroll border  border-gray-300 rounded-md shadow-sm ">


            <div class="w-full bg flex flex-row items-center  print:hidden bg-gray-800 text-white p-1.5 justify-between">
                <i class="pi pi-money-bill mr-1 text-lg"> Payment List</i>
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
        @click="() => { resetForm(); editPayment = false; showModal = true; }"
      >
        <i class="pi pi-plus text-sm"></i>
        <span>Payment</span>
      </Button>
      </div>
            </div>

             <div class="hidden print:flex w-full h-16 items-center justify-center text-2xl font-bold border-t border-b border-gray-400 bg-gray-100 space-x-2">
  <!-- Icon -->
  <i class="pi pi-money-bill text-3xl"></i>

  <!-- Text -->
  <span>Supplier Paid Details</span>
</div>


             <!-- Invoice Header -->
<div class="w-full border border-gray-300 bg-gray-100 p-5  rounded-md">

  <!-- Flex row with justify-between -->
  <div class="flex justify-between w-full">

    <!-- Left Column -->
    <div class="flex flex-col space-y-2 ">
      <div class="flex items-center space-x-2">
        <i class="pi pi-user text-gray-700"></i>
        <span class="font-medium text-gray-800">
          Supplier Name:
          <span class="font-normal">{{ state.supplier?.name || '-' }}</span>
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
    <!-- <div class="flex flex-col space-y-2 text-right">

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

    </div> -->

  </div>

</div>

          <table v-if="state.payments && state.payments.length" class="min-w-full border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm md:text-base">
            <thead class="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">#</th>
                <th class="px-4 py-2 text-left font-semibold">Amount</th>
                <th class="px-4 py-2 text-left font-semibold">Payment-Method</th>
                <th class="px-4 py-2 text-left font-semibold">Payment-Date</th>
                <!-- <th class="px-4 py-2 text-left font-semibold">Reference-Number</th> -->
                <th class="px-4 py-2 text-left font-semibold">Remarks</th>
                <th class="px-4 py-2 text-center font-semibold print:hidden">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(payment, index) in state.payments"
                :key="payment.id"
                class="border-t border-t-gray-300 hover:bg-gray-50 transition ext-sm text-xs"
              >
                <td class="px-4 py-2 font-medium text-gray-800">{{ index + 1 + (state.pagination.currentPage - 1) * perPage }}</td>

                <td class="px-4 py-2 font-medium text-gray-900">Rs.{{ payment.amount }}</td>

                <td class="px-4 py-2 text-gray-700">{{ payment.payment_method || '-' }}</td>

                <td class="px-4 py-2 text-gray-700">{{ payment.payment_date || '-' }}</td>

                <!-- <td class="px-4 py-2 text-gray-700">{{ payment.refrence_number || '-' }}</td> -->

                <td class="px-4 py-2 text-gray-700">{{ payment.remark }}</td>


                <td class="px-4 py-2 flex flex-col sm:flex-row justify-center gap-2 print:hidden">

  <!-- VIEW -->
  <!-- <button
    @click="viewPayment(payment)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow text-xs"
  >
    <i class="pi pi-eye text-base"></i>
    <span>View</span>
  </button> -->

  <!-- EDIT -->
  <button
    @click="editPaymentOpen(payment)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-pencil text-base"></i>
    <span>Edit</span>
  </button>

  <!-- DELETE -->
  <button
    @click="onDelete(payment.id)"
    class="flex flex-col sm:flex-row items-center gap-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
  >
    <i class="pi pi-trash text-base"></i>
    <span>Delete</span>
  </button>

</td>


              </tr>
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
          <h2 class="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h2>
          <p class="text-gray-500">
            Try adding new payments to see them listed here.
          </p>
        </div>

          <!-- Pagination -->
          <Pagination
            :pagination="state.pagination"
            @page-change="fetchPayments"
          />
        </div>

        

    </main>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editPayment ? 'Update Payment' : 'Create Payment'"
      @save="() => onSaveOrUpdate()"
      :disableSaveBtn="isLoading"
    >
      <div class="bg-white p-4 rounded-lg shadow-2xl space-y-2">
        <FormInput id="amount" type="number" label="Amount" v-model="form.amount" :error="errors.amount" />

        <div class="mb-4">
  <!-- Select Option -->
    <SelectOption
      v-model="form.payment_method"
      :list="list"
      label="Payment Method"
      placeholder="Select Payment Method"
      :error="errors.payment_method"
    />


  <!-- <p v-if="errors.payment_method" class="mt-1 text-sm text-red-600">
    {{ cleanError(errors.payment_method) }}
  </p> -->
</div>


        <!-- <FormInput id="phone" label="Phone" v-model="form.phone" :error="errors.phone" /> -->
        <FormInput id="payment_date" label="Payment-Date" type="date" v-model="form.payment_date" :error="errors.payment_date" />
        <!-- <FormInput id="reference_number" label="Referance No." v-model="form.reference_number" :error="errors.reference_number" /> -->

        <FormInput id="remark" label="Remarks" v-model="form.remark" :error="errors.remark" />
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
import SelectOption from "@/components/SelectOption.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from '@/utils/toast';
import { useFormErrors } from "@/composables/admin/useFormErrors";
import { usePrint } from '@/composables/admin/usePrint'

const invoiceRef = ref(null)
const { printElement } = usePrint()
const route = useRoute();
const router = useRouter();
const perPage = 20; // pagination size (matches controller)
const state = reactive({
  payments: [],
  supplier:[],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});


 // Normalize payment method
  const list = ['Easypaisa','JazzCash','Bank','Other']

const supplier_id = ref('');
const isLoading = ref(false);
const isLoadingSearch = ref(false);
const editPayment = ref(false);
const payment_id = ref('');
const showModal = ref(false);
const searchText = ref('');

// form
const form = reactive({
  id:'',
  supplier_id : '',
  amount: '',
  payment_method: '',
  payment_date: '',
  reference_number: '',
  remark: '',
});

const errors = reactive({
  amount: '',
  payment_method: '',
  payment_date: '',
  reference_number: '',
  remark: '',
});

const handleFormErrors = useFormErrors(errors);


// ------------------- Fetch Payments -------------------
const fetchPayments = async (url = "/supplier-payments") => {
  try {
    // distinguish loading states
    if (isLoadingSearch.value) {
      isLoadingSearch.value = true;
    } else {
      isLoading.value = true;
    }

    const response = await api.get(url);

    // Controller returns: { data: collection(paginated) , message }
    // We expect response.data.data to be a paginated resource (laravel)
    const paginated = response.data.data;
    // If backend returns resource collection, adjust accordingly:
    state.payments = paginated.data || paginated; // safe fallback
    state.pagination.currentPage = paginated.current_page ?? 1;
    state.pagination.lastPage = paginated.last_page ?? 1;
    state.pagination.nextPageUrl = paginated.next_page_url ?? null;
    state.pagination.prevPageUrl = paginated.prev_page_url ?? null;

    // fetch aggregates for visible payments
    // for (const s of state.payments) {
    //   // initialize zero to prevent undefined in render
    //   aggregates[s.id] = aggregates[s.id] || { purchased: 0, paid: 0 };
    //   // fetch each payment's aggregates asynchronously but not blocking UI
    //   fetchPaymentAggregates(s.id);
    // }
  } catch (error) {
    console.error("Error fetching payments:", error);
    toast.error("Failed to fetch payments");
  } finally {
    isLoading.value = false;
    isLoadingSearch.value = false;
  }
};


// ------------------- Reset Form -------------------
const resetForm = () => {
  form.amount = "";
  form.payment_date = "";
  form.payment_method = "";
  form.remark = "";
  Object.keys(errors).forEach((k) => (errors[k] = ""));
  showModal.value = false;
  editPayment.value = false;
  payment_id.value = "";
};

// ------------------- Edit Payment -------------------
const editPaymentOpen = (payment) => {

   console.log('paymenet---',payment)
  editPayment.value = true
  form.id = payment.id
  payment_id.value = payment.id
  form.supplier_id = payment.supplier_id
  form.amount = payment.amount
  form.payment_date = payment.payment_date
  form.remark = payment.remark


  //
  form.payment_method = list.find(
    m => m.toLowerCase() === payment.payment_method?.toLowerCase()?.trim()
  ) || 'Not found'

  showModal.value = true
}


const viewPayment = (payment) => {
  router.push({ name: 'admin.payment-detail', params: { id: payment.id } });
};

// ------------------- Save / Update Payment -------------------
const onSaveOrUpdate = async () => {
  isLoading.value = true;
  try {


    let response;

    if (!editPayment.value) {
      response = await api.post("/supplier-payments", form);
      // add to top of local list
      const newPayment = response.data.data ?? response.data.payment ?? response.data;
      state.payments.unshift(newPayment);
      toast.success(response.data.message || "Payment created successfully");
      resetForm();
    } else {
        // console.log('updating.............payment_id.value......-',payment_id.value)
      response = await api.put(`/supplier-payments/${payment_id.value}`, form);
      const updated = response.data.data ?? response.data.payment ?? response.data;
      const idx = state.payments.findIndex((s) => s.id === payment_id.value);
      if (idx !== -1) state.payments[idx] = updated;
      toast.success(response.data.message || "Payment updated successfully");
      resetForm();
    }


  } catch (error) {
    console.error("Error saving/updating payment:", error);
    handleFormErrors(error);
  } finally {
    isLoading.value = false;
  }
};

// ------------------- Delete Payment -------------------
const onDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this payment?")) return;
  isLoading.value = true;
  try {
    const response = await api.delete(`/supplier-payments/${id}`);
    // state.payments = state.payments.filter((s) => s.id !== id);
    
    if(response.data.success){
      fetchPayments();
      toast.success(response.data.message || "Payment deleted successfully");
    }


  } catch (error) {
    console.error("Error deleting payment:", error);
    toast.error("Failed to delete payment");
  } finally {
    isLoading.value = false;
  }
};



// <!-----BreadCrumb-->

// Home link
const homeRoute = "/admin/Supplier"
const homeLabel = "Supplier"

// Breadcrumb items
// Set `isBack: true` if this link should go back dynamically
// Optional `fallback` route if history is empty
const breadcrumbs = [
  { label: "Supplier-Detail", isBack: true, fallback: "/admin/Payment" },
  { label: "Supplier Payments", isBack: false, route: "#" }, // current page
]


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

// Function to go back or fallback
const goBack = (fallback) => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(fallback)
  }
}

const printInvoice = () =>{
    printElement(invoiceRef)
}
// ------------------- Mounted -------------------
onMounted(async () => {

  form.supplier_id = route.params?.supplier_id;
  await fetchSupplierDetail(route.params?.supplier_id);
//   console.log(form.supplier_id,'----');
  await fetchPayments();
});
</script>
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
