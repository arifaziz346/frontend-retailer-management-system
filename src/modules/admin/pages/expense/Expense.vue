<template>
  <!-- Loader -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
  >
    <VueSpinnerDots size="48px" color="#2563eb" />
  </div>

  <div class="bg-gray-50 min-h-screen p-6">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow">

      <h2 class="text-xl font-bold text-gray-800">
        <i class="pi pi-tags text-blue-600"></i>
        Expenses</h2>
      <button
        @click="openCreate"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
      >
        <i class="pi pi-plus"></i>
        <span>Add Expense</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mt-2 bg-white p-4 rounded-lg shadow items-end">
      <!-- Search Title -->
      <!-- <div class="flex-1 min-w-[200px]">
        <FormInput
          id="search"
          label="Search Title"
          v-model="filters.expense_title"
          @input="fetchExpenses(1)"
        />
      </div> -->

      <!-- Category Select -->
      <div class="w-auto min-w-[150px]">
        <SelectOption
          v-model="filters.expense_category_id"
          :list="categoryOptions"
          label="Category"
          placeholder="All Categories"
          @update:modelValue="fetchExpenses(1)"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="mt-6 bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full text-sm divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left text-gray-700 font-medium">Title</th>
            <th class="px-4 py-3 text-left text-gray-700 font-medium">Category</th>
            <th class="px-4 py-3 text-left text-gray-700 font-medium">Amount</th>
            <th class="px-4 py-3 text-left text-gray-700 font-medium">Date</th>
            <th class="px-4 py-3 text-center text-gray-700 font-medium">Action</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="exp in state.expenses"
            :key="exp.id"
          >
            <td class="px-4 py-3">{{ exp.expense_title }}</td>
            <td class="px-4 py-3">{{ exp.category?.name || "-" }}</td>
            <td class="px-4 py-3">Rs. {{ exp.amount }}</td>
            <td class="px-4 py-3">{{ exp.expense_date }}</td>

            <!-- Action Buttons -->
            <td class="px-4 py-3 flex flex-col sm:flex-row justify-center gap-2">
              <!-- Edit Button -->
              <button
                @click="openEdit(exp)"
                class="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
              >
                <i class="pi pi-pencil"></i>
                Edit
              </button>

              <!-- Delete Button -->
              <button
                @click="onDelete(exp.id)"
                class="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
              >
                <i class="pi pi-trash"></i>
                Delete
              </button>
            </td>
          </tr>

          <!-- No Data -->
          <tr v-if="!state.expenses.length">
            <td colspan="5" class="text-center py-6 text-gray-500">
              No expenses found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4">
      <Pagination
        :pagination="state.pagination"
        @page-change="fetchExpenses"
      />
    </div>

    <!-- Modal for Create/Edit -->
    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Expense' : 'Create Expense'"
      @save="onSave"
      :disableSaveBtn="isLoading"
    >
      <div class="space-y-4">
        <FormInput
          label="Title"
          v-model="form.expense_title"
          :error="errors.expense_title"
        />

        <FormInput
          label="Amount"
          type="number"
          v-model="form.amount"
          :error="errors.amount"
        />

        <FormInput
          label="Date"
          type="date"
          v-model="form.expense_date"
          :error="errors.expense_date"
        />

     <div class="flex items-end gap-2 w-full">
  <!-- Category Select -->
  <div class="flex-1 min-w-[150px]">
    <SelectOption
      v-model="form.expense_category_id"
      :list="categoryOptions"
      label="Category"
      placeholder="Select Category"
      :error="errors.expense_category_id"
    />
  </div>

  <!-- Add Category Button -->
  <div class="mt-6">
    <button
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md
             shadow-sm border border-green-700"
      @click="navigateToCategory()"
    >
      +Category
    </button>
  </div>
</div>



        <FormInput
          label="Remark"
          v-model="form.remark"
        />
      </div>
    </BaseModal>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/plugins/axios";
import Pagination from "@/components/admin/Pagination.vue";
import SelectOption from "@/components/SelectOption.vue";
import FormInput from "@/components/admin/FormInput.vue";
import BaseModal from "@/components/BaseModal.vue";
import { VueSpinnerDots } from "vue3-spinners";
import { toast } from "@/utils/toast";
import { useRouter } from "vue-router";
import { useFormErrors } from "@/composables/admin/useFormErrors";


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

/* FETCH EXPENSES WITH PAGINATION */
const fetchExpenses = async (page = 1) => {
  isLoading.value = true;
  try {
    const res = await api.get("/expenses", {
      params: {
        page,
        per_page: perPage,
        ...filters,
      },
    });

    state.expenses = res.data.data;

    state.pagination.currentPage = res.data.meta.current_page;
    state.pagination.lastPage = res.data.meta.last_page;
    state.pagination.nextPageUrl = res.data.links.next;
    state.pagination.prevPageUrl = res.data.links.prev;
  } finally {
    isLoading.value = false;
  }
};

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
  fetchExpenses(1)
  fetchCategories();
});
</script>
