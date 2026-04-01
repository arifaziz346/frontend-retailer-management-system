<script setup>
import { ref, computed, watchEffect } from "vue";
import { useAboutStore } from '@/stores/useAboutStore'

// ---------------------
// 1️⃣ Pinia store
// ---------------------
const store = useAboutStore();

// Local reactive ref for about info
const about = ref(null);

// Safe assignment and debug logging
watchEffect(() => {
  if (store.about) {
    about.value = store.about;
  }
  console.log('About in SalePrint --->', store.about?.phone_number);
});

// ---------------------
// 2️⃣ Props (static defaults only)
// ---------------------
const props = defineProps({
  shopName: { type: String, default: "" },
  shopAddress: { type: String, default: "" },
  shopPhone: { type: String, default: "" },
  logo: { type: String, default: null },
});

// ---------------------
// 3️⃣ Computed final values (safe & reactive)
// ---------------------
const finalShopName = computed(() =>
  props.shopName || store.about?.name || "My Shop"
 
);


const finalShopAddress = computed(() =>
  props.shopAddress || store.about?.address || "Shop Address"
);

const finalShopPhone = computed(() =>
  props.shopPhone || store.about?.phone_number || ""
);

const finalShopPhoneTwo = computed(() =>
  props.shopPhone || store.about?.additional_phone || ""
);



const finalLogo = computed(() =>
  props.logo || store.about?.image_url || ""
);

// ---------------------
// 4️⃣ Reactive sale data
// ---------------------
const sale = ref(null);

// ---------------------
// 5️⃣ Print function
// ---------------------
const print = (saleData) => {
  sale.value = saleData; // assign the sale to reactive ref
  if (!sale.value) return;

  // Generate items with improved thermal printer layout
  const itemsHtml =
    Array.isArray(sale.value.items) && sale.value.items.length
      ? sale.value.items
          .map(
            (item) => {
              const qty = parseFloat(item.quantity).toFixed(3).replace(/\.?0+$/, ''); // Remove trailing zeros
              const price = parseFloat(item.sale_price).toFixed(2);
              const total = (item.quantity * item.sale_price).toFixed(2);
              return `
        <tr>
          <td style="padding-bottom:1px"><b>${item.name}</b></td>
        </tr>
        <tr>
          <td style="padding-top:1px; font-size:12px">
            Qty: ${qty} | Price: ${price} | Total: ${total}
          </td>
        </tr>`;
            }
          )
          .join("")
      : "<tr><td style='text-align:center'>No items</td></tr>";

  // Full HTML for receipt
const html = `
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
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
      padding: 3px 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .line {
      border-top: 1px dashed #000;
      margin: 8px 0;
    }
    .right {
      text-align: right;
    }
    h3 {
      text-align: center;
      margin: 2px 0;
      font-size: 16px;
      font-weight: bold;
    }
    .center {
      text-align: center;
      font-size: 12px;
    }
    .logo {
      max-width: 100px;
      margin: 0 auto 4px;
      display: block;
    }
    /* Item rows styling for thermal printer */
    tbody tr:nth-child(odd) td {
      padding-top: 2px;
      padding-bottom: 2px;
    }
    tbody tr:nth-child(even) td {
      padding-top: 1px;
      padding-bottom: 6px;
      font-size: 11px;
      color: #333;
    }
    @media print {
      @page {
        size: auto;
        margin: 2mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body onload="window.print(); setTimeout(()=>window.close(), 500)">
  <div class="receipt">
    ${finalLogo.value ? `<img src="${finalLogo.value}" class="logo"/>` : ""}
    <h3>${finalShopName.value}</h3>
    <div class="center">${finalShopAddress.value}</div>
    <div class="center">Ph-${finalShopPhone.value}</div>
    ${finalShopPhoneTwo.value ? `<div class="center">Ph-:${finalShopPhoneTwo.value}</div>` : ""}
    <div class="line"></div>

    <div>ID: ${sale.value.id}</div>
    <div>Date: ${sale.value.sale_date}</div>
    <div>Customer: ${sale.value.customer?.name || "-"}</div>
    <div>Type: <b>${getCreditLabel(sale.value.credit)}</b></div>

    <div class="line"></div>
    <table>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="line"></div>
    <table>
      <tr>
        <td><b style="font-size:14px">GRAND TOTAL:</b></td>
        <td class="right"><b style="font-size:14px">Rs. ${parseFloat(sale.value.total_amount || 0).toFixed(2)}</b></td>
      </tr>
    </table>

    <div class="line"></div>
    ${sale.value.total_arrears ? `<div class="center"><b>Arrears: Rs. ${parseFloat(sale.value.total_arrears).toFixed(2)}</b></div>` : ""}
    <div class="center" style="margin-top: 4px; font-size: 11px">Developed By CTS Chitral</div>
    
  </div>
</body>
</html>
`;
// <tr>
          //   <td>Discount</td>
          //   <td class="right">Rs. ${sale.value.total_discount || 0}</td>
          // </tr>
  // Open in new window and print
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
};


// Map credit values to readable names
const creditTypeMap = {
  null: 'Fast Pay',         // immediate payment, no credit involved
  0: 'Invoice Only',        // no credit, invoice created with customer name
  1: 'Credit Sale',         // customer purchases on credit
  2: 'Advance Hold',        // full payment received in advance
};

// Function to get label safely
const getCreditLabel = (credit) => {
  // handle null explicitly
  if (credit === null || credit === undefined) return creditTypeMap.null;
  return creditTypeMap[credit] || 'Unknown';
};
// Expose print method
defineExpose({ print });
</script>
