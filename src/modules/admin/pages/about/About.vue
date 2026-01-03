<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div class="flex flex-col items-center">
        <VueSpinnerDots size="50px" color="#2563eb" />
        <p class="text-blue-600 font-medium mt-2">Processing...</p>
      </div>
    </div>

    <header class="bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-800">Business Information</h1>
        <p class="text-sm text-slate-500">Manage your contact details and social links</p>
      </div>
      <button 
        v-if="!state.about"
        @click="openModal" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
      >
        <i class="pi pi-plus"></i> Add Information
      </button>
    </header>

    <main class="p-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="state.about" class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th class="px-6 py-4 border-b">Logo</th>
                <th class="px-6 py-4 border-b">Business Name</th>
                <th class="px-6 py-4 border-b">Contact Info</th>
                <th class="px-6 py-4 border-b">Location</th>
                <th class="px-6 py-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <img v-if="state.about.image_url" :src="state.about.image_url" class="w-12 h-12 object-contain rounded bg-slate-100 p-1" alt="Logo" />
                  <div v-else class="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400"><i class="pi pi-image"></i></div>
                </td>
                <td class="px-6 py-4 font-semibold text-slate-800">{{ state.about.name }}</td>
                <td class="px-6 py-4 text-slate-600">
                  <div class="flex flex-col">
                    <span>{{ state.about.email }}</span>
                    <span class="text-xs text-slate-400">{{ state.about.phone_number }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ state.about.city }}</td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button @click="editAbout(state.about)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><i class="pi pi-pencil"></i></button>
                    <button @click="deleteAbout(state.about.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><i class="pi pi-trash"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="py-20 text-center">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" class="w-24 mx-auto opacity-20 mb-4" />
          <h3 class="text-slate-400 font-medium">No about information recorded yet</h3>
        </div>
      </div>
    </main>

    <BaseModal v-model="showModal" :title="form.id ? 'Update Business Information' : 'Add Business Information'" @save="handleSubmit" :disableSaveBtn="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
           <ImageUploader
            v-model="form.logo"
            label="Logo"
            :error="errors.logo"
            :multiple="false"
            :preview="previewImage"/>
        </div>
        <FormInput label="Name" v-model="form.name" :error="errors.name" />
        <FormInput label="Email" type="email" v-model="form.email" :error="errors.email" />
        <FormInput label="Phone 1" v-model="form.phone_number" :error="errors.phone_number" />
        <FormInput label="Phone 2 (Optional)" v-model="form.additional_phone" :error="errors.additional_phone" />
        <FormInput label="Land Line Number 2 (Optional)" v-model="form.land_line_number" :error="errors.land_line_number" />
        <FormInput label="City" v-model="form.city" :error="errors.city" />
        <FormInput label="Hours" v-model="form.operating_hours" :error="errors.operating_hours" placeholder="e.g. 9AM - 9PM" />
        <!-- <div class="md:col-span-2 border-t border-slate-100 my-2 pt-4"><h3 class="text-sm font-bold text-slate-700">Social & Map</h3></div> -->
        <!-- <FormInput label="Facebook" v-model="form.facebook" :error="errors.facebook" />
        <FormInput label="Instagram" v-model="form.instagram" :error="errors.instagram" />
        <div class="md:col-span-2">
            <FormInput label="Map Link" v-model="form.embed_map_link" :error="errors.embed_map_link" />
        </div> -->
        <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-slate-700 mb-1">Address</label>
            <textarea v-model="form.address" rows="3" class="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-blue-500"></textarea>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/plugins/axios";
import { toast } from "@/utils/toast";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import { VueSpinnerDots } from "vue3-spinners";

const showModal = ref(false);
const isLoading = ref(false);
const previewImage = ref(null);
const state = reactive({ about: null });
const errors = reactive({});

const form = reactive({
  id: null,
  name: "",
  phone_number: "",
  additional_phone: "",
  land_line_number: "",
  address: "",
  city: "",
  email: "",
  operating_hours: "",
  facebook: "",
  instagram: "",
  youtube: "",
  embed_map_link: "",
  logo: null
});


const openModal = () => {
  if (state.about) {
    // If data exists, treat "Add" click as an "Edit"
    editAbout(state.about);
  } else {
    // If no data, reset and open blank
    resetForm();
    showModal.value = true;
  }
};

const resetForm = () => {
  Object.assign(form, { id: null, name: "", phone_number: "", additional_phone: "", address: "", city: "", email: "", operating_hours: "", facebook: "", instagram: "", youtube: "", embed_map_link: "", logo: null });
  previewImage.value = null;
  Object.keys(errors).forEach(k => errors[k] = "");
};

const fetchAbout = async () => {
  isLoading.value = true;
  try {
    const res = await api.get("/admin/about");
    state.about = res.data.data;
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  for (const key in errors) errors[key] = "";

  try {
    const formData = new FormData();

    for (const key in form) {
      const value = form[key];

      // Skip nulls, empty strings, and the virtual 'image_url' field
      if (value === null || value === '' || value === undefined || key === 'image_url') {
        continue;
      }

      if (key === 'logo') {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value) && value[0] instanceof File) {
          formData.append(key, value[0]);
        }
        // If it's a string (the old URL), we just skip it
      } else {
        formData.append(key, value);
      }
    }

    const url = form.id ? `/admin/update-about/${form.id}` : `/admin/about`;
    const response = await api.post(url, formData);

    toast.success(response.data.message);
    showModal.value = false;
    await fetchAbout();
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    }
  } finally {
    isLoading.value = false;
  }
};

const editAbout = (about) => {
  console.log('edit ',about.image_url);
  Object.assign(form, about);
  form.logo = about.image_url || null;

  showModal.value = true;
};

const deleteAbout = async (id) => {
  if (!confirm("Delete this information?")) return;
  try {
    isLoading.value = true;
    await api.delete(`/admin/about/${id}`);
    toast.success("Information deleted");
    state.about = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAbout);
</script>