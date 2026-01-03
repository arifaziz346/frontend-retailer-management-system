<template>

    <!----------------Pulse Loader ----------->
 <!-- 🔵 Loader (when loading) -->
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
    <!-- ✅ Page Header -->
    <header
      class="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
    <BackButton/>
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
       Item Categories
      </h1>

      <Button
        variant="primary"
        size="sm"
        class="flex items-center justify-center gap-2"
        @click="() => {  editCategory = false; showAdminModal(); }"
      >
        <i class="pi pi-plus text-sm"> Category</i>
      </Button>
    </header>

    <!-- ✅ Category Grid -->
     <!-- Check Empty -->
     <div v-if="state.categories && state.categories.length">
    <main
      class="flex flex-row gap-4 p-4 sm:p-6 max-w-7xl mx-auto w-full"
    >

      <CategoryTable
      :categories="state.categories"
      @view="onView"
      @delete="onDelete"
      @edit="edit"/>




    </main>
    </div>

    <!-- No Data Message -->
  <div
    v-else
    class="flex flex-col items-center justify-center h-[60vh] text-center"
  >
    <img
      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
      alt="No Data"
      class="w-32 h-32 opacity-70 mb-4"
    />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">
      No Category Found
    </h2>
    <p class="text-gray-500">
      Try adding new products to see them listed here.
    </p>
  </div>


<!-- ✅ Modal outside the loading logic -->
  <div class="p-6 bg-white border-slate-200">
    <BaseModal
      v-model="showModal"
      :title="editCategory ? 'Edit Category' : 'Create Category'"
      @save="() => (editCategory ? onUpdateCategory() : createCategory())"
    >
      <div class="bg-white p-4 rounded-lg shadow-2xl">
        <FormInput
          id="name"
          label="Name"
          v-model="form.category_name"
          :error="errors.category_name"
        />

        <!-- Reusable uploader -->

      </div>
    </BaseModal>
  </div>

  </div>

</template>

<script setup>
import api from "@/plugins/axios";
import Button from "@/components/admin/Button.vue";
import CategoryTable from "@/components/admin/CategoryTable.vue";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import { useFormErrors } from "@/composables/admin/useFormErrors";
import BackButton from "@/components/BackButton.vue";
import { ref, reactive,onMounted } from "vue";
import { useRouter } from "vue-router";
import { VueSpinner,VueSpinnerDots  } from 'vue3-spinners'
import { toast } from '@/utils/toast'
const isLoading = ref(false);
const editCategory = ref(false);
const showModal = ref(false)
const newCategory = ref('')
const category_id = ref(null);
const previewImage = ref(null);
const router = useRouter();
const state = reactive({
  categories: [],
})
const form = reactive({
  category_name: '',
})

const errors = reactive({
  category_name: '',
})

const handleFormErrors = useFormErrors(errors)




const showAdminModal = () => {
  showModal.value = true;
  resetForm()
};

const fetchCategories = async () => {
    isLoading.value = true;
    try {
      const response = await api.get("/categories");
      state.categories = response.data.categories;
      console.log("Fetched categories:", response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      isLoading.value = false;
    }
};

const createCategory = async ()=>{

    console.log('Creating Category Start')
    isLoading.value = true

    try {
         console.log('After try')
        const formData = new FormData()
        formData.append('category_name', form.category_name)

        const response = await api.post(`/categories`,formData);

         const data = response.data
           if(data.success){
           toast.success(data.message)
         showModal.value = false
         fetchCategories();
         }



    } catch (error) {
     console.log("creating categorie",error)
     handleFormErrors(error)
    }
    finally{
        isLoading.value = false
    }

}


const onUpdateCategory = async () => {
  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append("category_name", form.category_name);

    //  Why use POST + _method=PUT?
    //  Because you are sending FormData — many APIs block PUT/PATCH with multipart/form-data.
    //  Laravel handles this perfectly.
    // const response = await api.post(`/categories/${category_id.value}?_method=PUT`, formData);
    const response = await api.put(`/categories/${category_id.value}`, {
        category_name: form.category_name
    });
    const data = response.data;

    if (data.success) {
      toast.success(data.message);

      const index = state.categories.findIndex(c => c.id === category_id.value);
      if (index !== -1) {
        state.categories[index] = data.category;
      }

      showModal.value = false;
      form.category_name = "";
    }

  } catch (error) {
    console.error("Update Error:", error);
    handleFormErrors(error);
  } finally {
    isLoading.value = false;
  }
};

//Delete Category
const onDelete = async (id) => {
    isLoading.value = true
  try {

      const response = await api.delete(`/categories/${id}`);
    // Refresh the category list after deletion
    // fetchCategories();
    const data = response.data;
    if(data.success){
      toast.success(data.message)
        //It is used to delete from current screen
        const index = state.categories.findIndex(c => c.id === id)
        if (index !== -1) {
               state.categories.splice(index, 1)
               }
         }
     showModal.value = false

  } catch (error) {
    console.error("Error deleting category:", error);
  }
  finally{
    isLoading.value = false
  }
};




const edit = (cat) => {
    resetForm()
  showModal.value = true
  form.category_name = cat.category_name  //category_name ✅ wrap in array
  editCategory.value = true
  category_id.value = cat.id
// console.log('Editing:', cat)
}

const resetForm = ()=>{
    form.category_name = ''
    errors.category_name = ''
}

const onView = (category) => {
    const id = category.id
     router.push({
    name: 'admin.products',  // 👈 This should match your route name in router/index.js
    params: { 'id':id,'category_name':category.category_name }   // 👈 Dynamic parameter
  })
}

onMounted(() => {
  fetchCategories();
})
</script>
