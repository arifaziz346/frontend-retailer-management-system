<template>
  <!-- Loader -->
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-white/70 z-50"
  >
    <VueSpinnerDots size="48px" color="#2563eb" />
  </div>

  <div v-else class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b px-4 py-3 shadow-sm flex items-center">
      <button @click="$router.go(-1)" class="text-gray-600 hover:text-blue-600">
        ← Back
      </button>
      <h1 class="ml-3 text-lg font-semibold">Route Permissions</h1>
    </header>

    <!-- Table -->
    <main class="p-4">
      <div class="bg-white shadow rounded-lg overflow-x-auto">
        <table class="w-full text-sm border-collapse text-center">
          <thead class="bg-gray-100 uppercase text-xs">
            <tr>
              <th class="px-3 py-2">#</th>
              <th class="px-3 py-2">Route Name</th>
              <th class="px-3 py-2">Path</th>
              <!-- <th v-for="a in actions" :key="a" class="px-3 py-2 text-center">
                {{ a }}
              </th> -->
              <th class="px-3 py-2 text-center">Page Access Permission</th>
              <!-- <th class="px-3 py-2 text-center">View</th>
              <th class="px-3 py-2 text-center">Create</th>
              <th class="px-3 py-2 text-center">Update</th>
              <th class="px-3 py-2 text-center">Delete</th> -->
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(route, index) in all_routes"
              :key="route.name"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-3 py-2">{{ index + 1 }}</td>

              <td class="px-3 py-2 font-medium">
                {{ route.path_name || 'N/A' }}
              </td>

              <td class="px-3 py-2 text-gray-600">
                {{ route.path || 'N/A' }}
              </td>

              <td class="px-3 py-e text-gray-600">
                <input
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  :checked="route.is_granted"
                  :disabled="savingKey === route.permissionKey"
                  @change="togglePermission(route.id,route.is_granted)"
                />
              </td>
              <!-- <td class="px-3 py-e text-gray-600">
                <input
                  v-if="route.name!==''"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  :checked="route.name"
                  :disabled="savingKey === route.permissionKey"
                  @change="togglePermission(route, action)"
                />
              </td> -->
              <!-- <td class="px-3 py-e text-gray-600">
                <input
                  v-if="route.name!==''"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  :checked="route.name"
                  :disabled="savingKey === route.permissionKey"
                  @change="togglePermission(route, action)"
                />
              </td>
              <td class="px-3 py-e text-gray-600">
                <input
                  v-if="route.name!==''"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  :checked="route.name"
                  :disabled="savingKey === route.permissionKey"
                  @change="togglePermission(route, action)"
                />
              </td>
              <td class="px-3 py-e text-gray-600">
                <input
                  v-if="route.name!==''"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  :checked="route.name"
                  :disabled="savingKey === route.permissionKey"
                  @change="togglePermission(route, action)"
                />
              </td> -->

              <!-- Toggles -->
              <!-- <td
                v-for="action in actions"
                :key="action"
                class="px-3 py-2 text-center"
              >
                <input
                  v-if="route.name!==''"
                  type="checkbox"
                  class="w-4 h-4 cursor-pointer"
                  :checked="route.name"
                  :disabled="savingKey === route.permissionKey"
                  @change="togglePermission(route, action)"
                />
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { VueSpinnerDots } from 'vue3-spinners'
import { toast } from "@/utils/toast";
import api from '@/plugins/axios'
import { update } from 'lodash';
const routes = ref([]);
const router = useRouter()
const route = useRoute();
const isLoading = ref(false)
const savingKey = ref(null)
const user_id = ref(route.params.id)
const all_routes = ref();
console.log('user-id',user_id.value)


/* Convert route name to permission key */
// const makePermissionKey = (routeName) => {
//   return routeName ? routeName.replace(/\./g, '-') : 'unknown'
// }

// console.log('router routes----',router.getRoutes());
// // 1️⃣ Extract routes (name & path)
// routes.value = router.getRoutes()
//   .filter(r => r.name) // remove unnamed
//   .map(r => ({
//     path_name: r.name,
//     path: r.path,
//     is_granted: true
//   }));


// const allRoutes = router.getRoutes()
//     .filter(r => r.name) // ignore unnamed routes
//     .map(r => ({
//       path_name: r.name,
//       path: r.path,
//       is_granted: true // default granted
//     }));

// const allRoutes = router.getRoutes();
// console.log('all routes--',allRoutes);

// Function to load routes and send to backend
// const syncRoutes = async () => {
//   isLoading.value = true;

//   try {
//     isLoading.value = true
//     // 1️⃣ Get all named routes from router
//     const allRoutes = router.getRoutes()
//       .filter(r => r.name) // remove unnamed routes
//       .map(r => ({
//         path_name: r.name,
//         path: r.path,
//         is_granted: true // default granted
//       }));

//     // 2️⃣ Update reactive variable
//     routes.value = allRoutes;

//     // 3️⃣ Send all routes to backend to update/create permissions
//     const res = await api.post('/user_permissions/', {
//       user_id: user_id.value,
//       permissions: routes.value // send entire array
//     });

//     all_routes.value = res.data.data

//     console.log('All routes synced successfully!', res.data);
//   } catch (err) {
//     console.error('Error syncing routes:', err);
//   } finally {
//     isLoading.value = false;
//   }
// };

const fetchingPermission =async ()=>{
  isLoading.value = true
try {
  const res = await api.get('/user_permissions/permissions');
  all_routes.value = res.data.data

} catch (error) {
  console.log(error)

}finally{
  isLoading.value =false
}
  
}

const togglePermission = async (route_id,is_granted) =>{

   isLoading.value = true
  try {
 const res = await api.post('/user_permissions/update-permission', {
      id:route_id,
      is_granted: is_granted // send entire array
    });


    if(res.data.success){
      fetchingPermission();
      toast.success(res.data.message)
      
    }


    
  } catch (error) {
     console.log('error-',error)
  }finally{
    isLoading.value = false
  }

}


// Auto-run every time page opens
onMounted(() => {
  fetchingPermission();
  // syncRoutes();
});
</script>
