<template>
  <!-- Loader -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
  >
    <VueSpinnerDots size="48px" color="#2563eb" />
  </div>

  <div class="bg-gray-50 min-h-screen p-4">
    <!-- Header -->
    <div class="flex justify-between items-center bg-white p-3 rounded shadow">
        <!-- Back arrow -->
    <button
      @click="goBack"
      class="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
    >
      <i class="pi pi-arrow-left"></i>
    </button>
      <h2 class="text-lg font-semibold flex items-center gap-2 text-gray-800">
  <i class="pi pi-tags text-blue-600"></i>
  Expense Categories
</h2>


      <Button
        size="sm"
        class="bg-blue-600 text-white"
        @click="openCreate"
      >
        <i class="pi pi-plus mr-1"></i> Add Category
      </Button>
    </div>

    <!-- Table -->
    <div class="mt-4 bg-white rounded shadow overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Category Name</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cat, index) in categories"
            :key="cat.id"
            class="border-t border-gray-300"
          >
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ cat.category_name }}</td>
             <!-- Action Buttons -->
            <td class="px-4 py-3 flex flex-col sm:flex-row justify-center gap-2">
              <!-- Edit Button -->
              <button
                @click="openEdit(cat)"
                class="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow text-xs"
              >
                <i class="pi pi-pencil"></i>
                Edit
              </button>

              <!-- Delete Button -->
              <button
                @click="onDelete(cat.id)"
                class="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow text-xs"
              >
                <i class="pi pi-trash"></i>
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!categories.length">
            <td colspan="3" class="text-center py-6 text-gray-500">
              No categories found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit Category' : 'Create Category'"
      @save="onSave"
      :disableSaveBtn="isLoading"
    >
      <FormInput
        id="category_name"
        label="Category Name"
        v-model="form.category_name"
        :error="errors.category_name"
      />
    </BaseModal>
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import { ref, reactive, onMounted } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import Button from "@/components/admin/Button.vue";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import { toast } from "@/utils/toast";
import { useFormErrors } from "@/composables/admin/useFormErrors";

const isLoading = ref(false);
const showModal = ref(false);
const editMode = ref(false);

const categories = ref([]);

const form = reactive({
  id: null,
  category_name: "",
});

const errors = reactive({
  category_name: "",
});

const handleErrors = useFormErrors(errors);

// Fetch
const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const res = await api.get("/expense-categories");
    categories.value = res.data.data;
  } finally {
    isLoading.value = false;
  }
};

// Create / Update
const onSave = async () => {
  isLoading.value = true;
  try {
    if (editMode.value) {
      await api.put(`/expense-categories/${form.id}`, form);
      toast.success("Category updated");
    } else {
      await api.post("/expense-categories", form);
      toast.success("Category created");
    }
    fetchCategories();
    reset();
  } catch (e) {
    handleErrors(e);
  } finally {
    isLoading.value = false;
  }
};

const openCreate = () => {
  reset();
  showModal.value = true;
};

const openEdit = (cat) => {
  form.id = cat.id;
  form.category_name = cat.category_name;
  editMode.value = true;
  showModal.value = true;
};

const onDelete = async (id) => {
  if (!confirm("Delete this category?")) return;
  await api.delete(`/expense-categories/${id}`);
  toast.success("Deleted");
  fetchCategories();
};


const goBack = () => {
  window.history.back(); // navigate to previous page
};

const reset = () => {
  form.id = null;
  form.category_name = "";
  editMode.value = false;
  showModal.value = false;
  Object.keys(errors).forEach(k => errors[k] = "");
};

onMounted(fetchCategories);
</script>
