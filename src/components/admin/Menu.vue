<template>
  <div class="flex flex-row h-full">
<nav class="mt-1 items-center justify-center w-[130px] bg-gray-250 text-black text-sm z-40">
    <ol>
<!--Dashboard -->
      <li>
        <RouterLink
          :class="getLinkClasses('dashboard')"
          to="/admin/dashboard"
          @click="isMobile() && emit('close-menu')"
        >
          <i class="pi pi-chart-bar"></i>
          <button class="hover:underline underline-offset-1 " type="button">
            Dashboard
          </button>
        </RouterLink>
      </li>

      <!-- Kitchen Link with Dropdown -->
      <li>
        <div class="relative dropdown">
          <div
            @click.prevent="toggleLink('subject')"
            :class="getLinkClasses('subject')"
            class="flex flex-col items-center justify-center m-3 rounded-md border p-1 cursor-pointer bg-white-200 border-transparent"
          >
            <i class="pi pi-question"></i>
            <button
            class="hover:underline underline-offset-1" type="button">
              Question
            </button>

          </div>
          <!-- Dropdown Links -->
          <transition name="slide">
            <ul
              v-if="activeLink === 'subject'"
              class="m-1 text-xs ml-7 text-start"
            >

              <li>
                <RouterLink
                  class="block hover:bg-gray-100 rounded bg-white-200"
                  to="/admin/tests"
                  @click="isMobile() && emit('close-menu')"
                >
                  • Tests
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  class="block hover:bg-gray-100 rounded bg-white-200"
                  to="/admin/all-questions"
                  @click="isMobile() && emit('close-menu')"
                >
                  • All
                </RouterLink>
              </li>

            </ul>
          </transition>
        </div>
      </li>

      <!-- Order Link with Dropdown -->



      <!-- Admins Link -->
      <li>
        <RouterLink
          :class="getLinkClasses('admins')"
          to="/admin"
          @click="isMobile() && emit('close-menu')"
        >
          <i class="pi pi-users"></i>
          <button class="hover:underline underline-offset-1 " type="button">
            Admins
          </button>
        </RouterLink>
      </li>

      <!-- Customer Link -->
      <li>
        <RouterLink
          @click="closeMenus"
          :class="getLinkClasses('user')"
          to="/admin/user"
        >
          <i class="pi pi-user-plus"></i>
          <button class="hover:underline underline-offset-1 "
          @click="isMobile() && emit('close-menu')"
          type="button">
            Users
          </button>
        </RouterLink>
      </li>

      <!-- About Link -->
      <li>
        <RouterLink
          :class="getLinkClasses('about')"
          to="/admin/about"
          @click="isMobile() && emit('close-menu')"
        >
          <i class="pi pi-cog"></i>
          <button class="hover:underline underline-offset-1 " type="button">
            About
          </button>
        </RouterLink>
      </li>


      <!-- Subscription Plans Link -->
      <li>
        <RouterLink
          :class="getLinkClasses('about')"
          to="/admin/subscription/plan"
          @click="isMobile() && emit('close-menu')"
        >
          <i class="pi pi-money-bill"></i>
          <button class="hover:underline underline-offset-1 " type="button">
            Subscription Plans
          </button>
        </RouterLink>
      </li>

      <li>
        <RouterLink
          :class="getLinkClasses('about')"
          to="/admin/user-apply-subscription/"
          @click="isMobile() && emit('close-menu')"
        >
          <i class="pi pi-bookmark"></i>
          <button class="hover:underline underline-offset-1 " type="button">
            Subscriptions
          </button>
        </RouterLink>
      </li>

      <!--Message-->
      <li>
        <RouterLink
          :class="getLinkClasses('message')"
          to="/admin/contact/messages"
          @click="isMobile() && emit('close-menu')"
        >
           <i class="pi pi-envelope"></i>
          <button class="hover:underline underline-offset-1 " type="button">
            Message
          </button>
        </RouterLink>
      </li>

    </ol>
  </nav>
  <!-- It will draw vertical line between the sidebar and main content -->
  <!-- <div class="w-px bg-gray-300 h-full "></div> -->
</div>
  </template>
<style scoped>
/* Slide transition for dropdown */
.slide-enter-active, .slide-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to, .slide-leave-from {
  max-height: 100px; /* Adjust this to fit your content */
  opacity: 1;
}
</style>
<script setup>
import axios from 'axios';
import { ref,computed,inject } from 'vue';
import { RouterLink,useRouter } from 'vue-router';
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const not_display_backup_button_online = import.meta.env.VITE_BACKUP_PRODUCTION_ONLINE;
// const $cookies = inject('$cookies');
const route = useRouter();
const isLoading = ref(false)
// Helper to detect mobile
const isMobile = () => window.innerWidth < 768;
const emit = defineEmits(['close-menu']);

// const logout = async () =>{
//   try {
//     isLoading.value = true
//     const response = await axios.post(`${apiBaseUrl}/logout`);

//   if($cookies.get('access_token')){
//     $cookies.set('access_token','')
//     $cookies.set('user','')
//   }
//   route.push('/login/admin');

//   } catch (error) {
//     console.log('Fail to logout')
//     isLoading.value = false
//   }
//   finally{
//     isLoading.value = false
//   }

// }
// State to manage the currently active link
const activeLink = ref('');

// Function to check if a link is active
const isActiveLink = (name) => {
  return activeLink.value === name;
};

// Function to compute the classes based on active link
const getLinkClasses = (name) => {
  return [
    'flex flex-col items-center justify-center m-3 rounded-md border p-1 cursor-pointer',
    isActiveLink(name)
      ? 'bg-white border-gray-300'
      : 'bg-gray-200 border-transparent'
  ];
};

// Toggle the active link
const toggleLink = (name) => {
  // If the link is already active, deactivate it; otherwise, activate it
  activeLink.value = activeLink.value === name ? '' : name;
};
</script>
