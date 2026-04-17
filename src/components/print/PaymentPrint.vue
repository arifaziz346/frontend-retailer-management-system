<script setup>
import { ref, computed, watchEffect } from "vue";
import { useAboutStore } from '@/stores/useAboutStore'

// ---------------------
// 1️⃣ Pinia store
// ---------------------
const store = useAboutStore();

// Local reactive ref for about info
const about = ref(null);

// Sync store data to local ref
watchEffect(() => {
  if (store.about) {
    about.value = store.about;
  }
});

// ---------------------
// 2️⃣ Computed final values (Pulling from Store)
// ---------------------
const finalShopName = computed(() => store.about?.name || "-");
const finalShopAddress = computed(() => store.about?.address || "-");
const finalShopPhone = computed(() => store.about?.phone_number || "-");
const finalShopPhoneTwo = computed(() => store.about?.additional_phone || "-");
const finalLogo = computed(() => store.about?.image_url || "-");

// ---------------------
// 3️⃣ Reactive Payment data
// ---------------------
const payment = ref(null);
const customerName = ref("");

// ---------------------
// 4️⃣ Print function
// ---------------------
const print = (paymentData, name) => {
  payment.value = paymentData;
  customerName.value = name;

  if (!payment.value) return;

  const html = `
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      margin: 0;
      padding: 0;
      background: white;
    }
    .receipt {
      width: 80mm;
      padding: 8px;
      max-width: 100%;
    }
    table {
      width: 100%;
      font-size: 13px;
      border-collapse: collapse;
    }
    td {
      padding: 4px 0;
    }
    .line {
      border-top: 1px dashed #000;
      margin: 8px 0;
    }
    .center {
      text-align: center;
      font-size: 12px;
    }
    h3 {
      text-align: center;
      margin: 2px 0;
      font-size: 16px;
      font-weight: bold;
    }
    .logo {
      max-width: 100px;
      margin: 0 auto 4px;
      display: block;
    }
    .bold { font-weight: bold; }
    .right { text-align: right; }
    
    @media print {
      @page { size: auto; margin: 2mm; }
      body { margin: 2mm; padding: 0; }
    }
  </style>
</head>
<body onload="window.print(); setTimeout(()=>window.close(), 500)">
  <div class="receipt">
    
    <h3>${finalShopName.value}</h3>
    <div class="center">${finalShopAddress.value}</div>
    <div class="center">Ph: ${finalShopPhone.value}</div>
    ${finalShopPhoneTwo.value ? `<div class="center">Ph: ${finalShopPhoneTwo.value}</div>` : ""}
    
    <div class="line"></div>
    <div class="center"><b style="font-size: 14px;">PAYMENT RECEIPT</b></div>
    <div class="line"></div>

    <table>
      <tr>
        <td>Receipt No:</td>
        <td class="right bold">#${payment.value.id}</td>
      </tr>
      <tr>
        <td>Date:</td>
        <td class="right">${payment.value.paid_at}</td>
      </tr>
      <tr>
        <td>Customer:</td>
        <td class="right bold">${customerName.value}</td>
      </tr>
    </table>

    <div class="line"></div>
    
    <table style="margin: 10px 0;">
      <tr>
        <td><b style="font-size:16px">AMOUNT PAID:</b></td>
        <td class="right"><b style="font-size:18px">Rs. ${parseFloat(payment.value.amount).toFixed(2)}</b></td>
      </tr>
    </table>

    <div class="line"></div>
    
    <div style="font-size: 11px; margin-bottom: 10px;">
      <b>Note:</b> ${payment.value.note || 'N/A'}
    </div>

    <div class="center" style="margin-top: 20px;">
      _______________________<br>
      Authorized Signature
    </div>

    <div class="center" style="margin-top: 15px; font-size: 10px; color: #555;">
      Thank you for your payment!<br>
      Developed By CTS Chitral
    </div>
  </div>
</body>
</html>
`;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
};

// Expose print method to parent components
defineExpose({ print });
</script>

<template>
  <div class="hidden"></div>
</template>