<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
      <VueSpinnerDots size="40px" color="#2563eb" />
      <span class="text-xs font-bold text-blue-600 mt-4 tracking-widest uppercase">Syncing</span>
    </div>
  </div>

  <div class="bg-slate-50 min-h-screen pb-12">
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="bg-blue-600 p-2 rounded-lg">
            <i class="pi pi-tags text-white text-sm"></i>
          </div>
          <h2 class="text-xl font-extrabold text-slate-800 tracking-tight">Expenses</h2>
        </div>
        
        <button
          @click="openCreate"
          class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl shadow-md shadow-blue-200 transition-all font-semibold text-sm"
        >
          <i class="pi pi-plus text-xs"></i>
          <span>Add Expense</span>
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Expense</p>
        <p class="text-xl font-black text-slate-900 mt-1">
          <span class="text-blue-600 text-sm font-bold">Rs.</span> {{ totalExpenseAmount.toLocaleString() }}
        </p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Category</label>
        <SelectOption
          v-model="filters.expense_category_id"
          :list="categoryOptions"
          placeholder="All Categories"
          @update:modelValue="fetchExpenses()"
        />
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">From Date</label>
        <input 
          type="date" 
          v-model="filters.from_date"
          @change="fetchExpenses()"
          class="w-full mt-1 text-sm border-none focus:ring-0 text-slate-700 bg-transparent cursor-pointer"
        />
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">To Date</label>
        <input 
          type="date" 
          v-model="filters.to_date"
          @change="fetchExpenses()"
          class="w-full mt-1 text-sm border-none focus:ring-0 text-slate-700 bg-transparent cursor-pointer"
        />
      </div>
    </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Title</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th class="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th class="px-6 py-4 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="exp in state.expenses" :key="exp.id" class="hover:bg-blue-50/40 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{{ exp.expense_title }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {{ exp.category?.category_name || "Uncategorized" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-slate-900">
                  Rs. {{ Number(exp.amount).toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {{ exp.expense_date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-center items-center gap-3">
                    <button @click="openEdit(exp)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                    <button @click="onDelete(exp.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr v-if="!state.expenses.length">
                <td colspan="5" class="py-20 text-center">
                  <div class="flex flex-col items-center">
                    <div class="bg-slate-100 p-4 rounded-full mb-4">
                      <i class="pi pi-folder-open text-slate-400 text-3xl"></i>
                    </div>
                    <p class="text-slate-500 font-medium">No expenses found for this selection</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div 
        v-if="state.pagination.lastPage > 1" 
        class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <p class="text-xs font-medium text-slate-500 tracking-wide">
          Page {{ state.pagination.currentPage }} of {{ state.pagination.lastPage }}
        </p>
        <Pagination :pagination="state.pagination" @page-change="fetchExpenses" />
      </div>
    </div>

    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Expense' : 'New Expense Entry'"
      @save="onSave"
      :disableSaveBtn="isLoading"
    >
      <div class="space-y-5 p-2">
        <FormInput label="Expense Title" placeholder="e.g. Office Supplies" v-model="form.expense_title" :error="errors.expense_title" />
        
        <div class="grid grid-cols-2 gap-4">
          <FormInput label="Amount" type="number" v-model="form.amount" :error="errors.amount" />
          <FormInput label="Transaction Date" type="date" v-model="form.expense_date" :error="errors.expense_date" />
        </div>

        <div class="flex items-end gap-2 w-full">
          <div class="flex-1">
            <SelectOption
              v-model="form.expense_category_id"
              :list="categoryOptions"
              label="Select Category"
              :error="errors.expense_category_id"
            />
          </div>
          <button
            class="p-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-300 transition-colors"
            @click="navigateToCategory()"
            title="Add New Category"
          >
            <i class="pi pi-plus"> Category</i>
          </button>
        </div>

        <FormInput label="Remark (Optional)" placeholder="Add extra details here..." v-model="form.remark" />
      </div>
    </BaseModal>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted,computed,watch } from "vue";
import api from "@/plugins/axios";
import Pagination from "@/components/admin/Pagination.vue";
import SelectOption from "@/components/SelectOption.vue";
import FormInput from "@/components/admin/FormInput.vue";
import BaseModal from "@/components/BaseModal.vue";
import { VueSpinnerDots } from "vue3-spinners";
import { toast } from "@/utils/toast";
import { useRouter } from "vue-router";
import { useFormErrors } from "@/composables/admin/useFormErrors";
const totalExpenseAmount = ref(0)
const  router = useRouter();
const perPage = 20;

const isLoading = ref(false);
const showModal = ref(false);
const editMode = ref(false);

const state = reactive({
  expenses: [],
   pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const categories = ref([]);
const categoryOptions = ref([]);

const filters = reactive({
  expense_title: "",
  expense_category_id: "",
  from_date: '',
  to_date: ''
});

const form = reactive({
  id: null,
  expense_title: "",
  expense_category_id: "",
  amount: "",
  expense_date: "",
  remark: "",
});

const errors = reactive({});
const handleErrors = useFormErrors(errors);


// const totalExpenseAmount = computed(() => {
//   return state.expenses.reduce((sum, exp) => {
//     // Ensure amount is treated as a number
//     return sum + (Number(exp.amount) || 0);
//   }, 0);
// });

const fetchExpenses = async (url = '/expenses') => {
  isLoading.value = true

  try {
    const res = await api.get(url, {
      params: {
        ...filters
      }
    })

    const payload = res.data.data

    // ✅ pagination
    state.expenses = payload.expenses.data
    state.pagination.currentPage = payload.expenses.current_page
    state.pagination.lastPage = payload.expenses.last_page
    state.pagination.nextPageUrl = payload.expenses.next_page_url
    state.pagination.prevPageUrl = payload.expenses.prev_page_url

    // ✅ total expense (from backend)
    totalExpenseAmount.value = payload.total_expense_amount ?? 0

  } catch (e) {
    console.error('Expense fetch failed', e)
  } finally {
    isLoading.value = false
  }
}






/* FETCH CATEGORIES */
const fetchCategories = async () => {
  const res = await api.get("/expense-categories");
  categories.value = res.data.data;

  categoryOptions.value = categories.value.map(c => ({
    label: c.category_name,
    value: c.id,
  }));
};

/* SAVE */
// const onSave = async () => {
//   try {
//     if (editMode.value) {
//       await api.put(`/expenses/${form.id}`, form);
//       toast.success("Expense updated successfully");
//     } else {
//       await api.post("/expenses", form);
//       toast.success("Expense created successfully");
//     }
//     fetchExpenses(state.pagination.currentPage);
//     reset();
//   } catch (e) {
//     handleErrors(e);
//   }
// };
const onSave = async () => {
    isLoading.value = true
  try {
    // Create a copy of the form
    const payload = { ...form };

    // Remove the category object before sending
    delete payload.category;

    if (editMode.value) {
      await api.put(`/expenses/${form.id}`, payload);
      toast.success("Expense updated");
    } else {
      await api.post("/expenses", payload);
      toast.success("Expense created");
    }

    fetchExpenses();
    reset();
  } catch (e) {
    handleErrors(e);
  }finally {
    isLoading.value = false;
  }
};

/* ACTIONS */
const openCreate = () => {
  reset();
  showModal.value = true;
};

const openEdit = (exp) => {
  // Assign all fields first
  Object.assign(form, exp);

  // Fix category selection
  // If your expense object has 'category' object, use its id/value
  form.expense_category_id = exp.category?.id ?? exp.expense_category_id ?? null;

  editMode.value = true;
  showModal.value = true;
};



// const viewExpense = (exp) => {
//   alert(`Expense: ${exp.expense_title}`);
// };

const onDelete = async (id) => {

  try {
    if (!confirm("Delete this expense?")) return;
  await api.delete(`/expenses/${id}`);
  toast.success("Expense deleted");
  fetchExpenses(state.pagination.currentPage);

  } catch (error) {

  }finally {
    isLoading.value = false;
  }

};


watch(
  () => [filters.from_date, filters.to_date],
  () => fetchExpenses()
)



/* RESET */
const reset = () => {
  Object.keys(form).forEach(k => form[k] = "");
  form.id = null;
  editMode.value = false;
  showModal.value = false;
  Object.keys(errors).forEach(k => delete errors[k]);
};

const navigateToCategory = () => {
router.push('expense-category')
}

onMounted(() => {
  fetchExpenses()
  fetchCategories();
});
</script>
