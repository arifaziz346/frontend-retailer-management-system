<template>
    <div id="printMe"  class="thermal-print mx-auto text-center">
            
        
      <!-- Logo Section -->
      <div class="flex flex-col" >
        <img v-if="logo" :src="logo" alt="Logo" class="w-16 mx-auto logo" />
      
       
      <!-- Title -->
        <h1 class="text-lg font-bold title">{{ title }}</h1>
        <span class="text-md"><strong>Address:</strong>{{address}}</span>
        <span class="text-md"><strong>Phone:</strong>{{phone}}</span>
    </div>
    <hr class="border border-black"/>
      <!-- Info Section -->
      <div class="info text-md">
        <p v-for="(value, key) in info" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </p>
      </div>
  
      <!-- <div class="divider border-t border-dashed my-2"></div> -->
      <hr class="border border-black"/>
      <!-- Items Table -->
      <table class="items-table w-full text-md border-collapse">
        <thead>
          <tr class="border-b border-dashed">
            <th class="py-1">Description</th>
            <th class="py-1">Price</th>
            <th class="py-1">Qty</th>
            <th class="py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-b">
            <td class="py-1">{{ truncate(item.name) }}</td>
            <td class="py-1">{{ item.sale_price }}</td>
            <td class="py-1">{{ item.quantity }}</td>
            <td class="py-1">{{ (item.sale_price * item.quantity).toFixed(1) }}</td>
         </tr>
        </tbody>
      </table>
  
      <div class="divider border-t border-dashed my-4"></div>
  
      <!-- Totals Section -->
      <div class="totals text-md">
        <p v-for="(value, key) in totals" :key="key">
          <strong>{{ key }}:</strong> Rs.{{ value }}
        </p>
      </div>
  
      <!-- Footer -->
      <div class="footer mt-4 text-md font-semibold" v-if="footer">
        <p>{{ footer }}</p>
      </div>
    </div>
    <button
      id="printButton" 
      v-print="'#printMe'"
      class="w-auto h-auto text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 
    focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 text-center me-1
    mb-1 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
    dark:focus:ring-blue-800` hidden"
    >
      Print
    </button>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  defineProps({

    title: {
      type: String,
      default: "Order Receipt",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: null, // Path to the logo image
    },
    info: {
      type: Object,
      required: true, // Example: { Id: 123, Date: 'Jan 15, 2025', Name: 'John Doe', Phone: '1234567890' }
    },
    items: {
      type: Array,
      required: true, // Example: [{ id: 1, description: 'Item A', price: 100, qty: 2, amount: 200 }]
    },
    totals: {
      type: Object,
      required: true, // Example: { Total: 1000, Discount: 100, 'Grand Total': 900 }
    },
    footer: {
      type: String,
      default: "Software Developed By ATS-Chitral!",
    },
  });

  // Function to truncate text if it exceeds 20 characters
const truncate = (text) => {
  if (text && text.length > 20) {
    return text.substring(0, 20) + "...";
  }
  return text;
};

  const triggerPrintProgrammatically = () => {
  // Select the button with id="printButton"
  const printButton = document.getElementById("printButton");
  if (printButton) {
    // Trigger a click event on the button
    printButton.click();
  }
};
// Automatically trigger print when mounted
onMounted(() => {
    triggerPrintProgrammatically();
});
//   console.log('Thermal-Printer:',items)
  </script>
  
  <style scoped>
  .thermal-print {
    width: 80mm; /* 80mm thermal printer width */
  }
  
  </style>
  