<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Loader -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-white/70 z-50"
    >
      <VueSpinnerDots size="48px" color="#2563eb" />
    </div>

    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm"
    >
      <div class="flex items-center gap-2">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-gray-600 hover:text-blue-600"
        >
          <i class="pi pi-arrow-left mr-1"></i>
          <span>Back</span>
        </button>
        <h1 class="text-lg font-semibold text-gray-800">Users</h1>
      </div>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center gap-2"
        @click="openModal()"
      >
        <i class="pi pi-plus"></i>
        <span>Add User</span>
      </button>
    </header>

    <!-- ✅ Responsive Table -->
<!-- ✅ Responsive Table Section -->
<main class="p-4">
  <div class="bg-white shadow-md rounded-lg overflow-hidden">

    <!-- ✅ Scrollable Wrapper -->
    <div class="w-full overflow-x-auto grid grid-cols-1">
      <table class="min-w-[850px] w-full text-sm text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th class="px-4 py-3">#</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Phone</th>
            <th class="px-4 py-3">Region</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in state.users.data"
            :key="user.id"
            class="border-b border-gray-300 hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ index + 1 }}</td>
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.phone }}</td>
            <td class="px-4 py-2">{{ user.region }}</td>
            <td class="px-4 py-2">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  user.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
                ]"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-2 text-center">
              <button
                class="text-blue-600 hover:text-blue-800 mr-2"
                @click="editUser(user)"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                class="text-red-600 hover:text-red-800"
                @click="deleteUser(user.id)"
              >
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- ✅ End scroll wrapper -->

    <!-- ✅ Responsive Pagination -->
    <div
      class="flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 bg-gray-50 text-sm gap-3"
    >
      <button
        @click="fetchUsers(state.users.prev_page_url)"
        :disabled="!state.users.prev_page_url"
        class="w-full sm:w-auto text-center px-4 py-2 bg-gray-200 rounded font-medium disabled:opacity-50 hover:bg-gray-300 transition"
      >
        Prev
      </button>

      <span class="text-center w-full sm:w-auto">
        Page {{ state.users.current_page }} of {{ state.users.last_page }}
      </span>

      <button
        @click="fetchUsers(state.users.next_page_url)"
        :disabled="!state.users.next_page_url"
        class="w-full sm:w-auto text-center px-4 py-2 bg-gray-200 rounded font-medium disabled:opacity-50 hover:bg-gray-300 transition"
      >
        Next
      </button>
    </div>
  </div>
</main>




    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="editMode ? 'Edit User' : 'Add User'"
      @save="editMode ? updateUser() : createUser()"
      :disableSaveBtn = isLoading
    >
      <div class="space-y-4">
        <FormInput label="Name" v-model="form.name" :error="errors.name" />
        <FormInput label="Email" v-model="form.email" :error="errors.email" />
        <FormInput label="Phone" v-model="form.phone" :error="errors.phone" />
        <FormInput label="Region" v-model="form.region" :error="errors.region" />
        <select
          v-model="form.status"
          class="border rounded-lg w-full px-3 py-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <FormInput
          label="Password"
          type="password"
          v-model="form.password"
          :error="errors.password"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/plugins/axios";
import { toast } from "@/utils/toast";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue"
const isLoading = ref(false);
const showModal = ref(false);
const editMode = ref(false);

const state = reactive({
  users: { data: [] },
});

const form = reactive({
  id: null,
  name: "",
  email: "",
  phone: "",
  region: "",
  status: "active",
  password: "",
});

const errors = reactive({});

const resetForm = () => {
  form.id = null;
  form.name = "";
  form.email = "";
  form.phone = "";
  form.region = "";
  form.status = "active";
  form.password = "";
  Object.keys(errors).forEach((key) => (errors[key] = ""));
};

const fetchUsers = async (url = "/admin/users") => {
  try {
    isLoading.value = true;
    const res = await api.get(url);
    state.users = res.data.users;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const openModal = () => {
  resetForm();
  editMode.value = false;
  showModal.value = true;
};

const createUser = async () => {
  try {
    const res = await api.post("/admin/users", form);
    toast.success(res.data.message);
    showModal.value = false;
    fetchUsers();
  } catch (err) {
    if (err.response?.data?.errors)
    Object.assign(errors, err.response.data.errors);
  }
};

const editUser = (user) => {
  Object.assign(form, user);
  form.password = "";
  editMode.value = true;
  showModal.value = true;
};

const updateUser = async () => {
  try {
    const res = await api.put(`/admin/users/${form.id}`, form);
    toast.success(res.data.message);
    showModal.value = false;
    fetchUsers();
  } catch (err) {
    if (err.response?.data?.errors) Object.assign(errors, err.response.data.errors);
  }
};

const deleteUser = async (id) => {
  if (confirm("Are you sure you want to delete this user?")) {
    await api.delete(`/admin/users/${id}`);
    toast.success("User deleted successfully");
    fetchUsers();
  }
};

onMounted(() => fetchUsers());
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}
</style>
