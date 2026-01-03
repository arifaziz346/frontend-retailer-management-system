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

  // Generate table rows for items
  const itemsHtml =
    Array.isArray(sale.value.items) && sale.value.items.length
      ? sale.value.items
          .map(
            (item) => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align:right">${item.quantity}</td>
          <td style="text-align:right">${item.sale_price}</td>
          <td style="text-align:right">${(
            item.quantity * item.sale_price
          ).toFixed(2)}</td>
        </tr>`
          )
          .join("")
      : "<tr><td colspan='4' style='text-align:center'>No items</td></tr>";

  // Full HTML for receipt
  const html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice</title>
      <style>
        body { font-family: monospace; margin:0; padding:0; }
        .receipt { width:80mm; padding:8px; }
        table { width:100%; font-size:12px; border-collapse:collapse; }
        td { padding:2px 0; }
        .line { border-top:1px dashed #000; margin:6px 0; }
        .right { text-align:right; }
        h3 { text-align:center; margin:2px 0; }
        .center { text-align:center; }
        .logo { max-width:50px; margin: 0 auto 4px; display:block; }
        @media print { @page { size:auto; margin:3mm; } }
      </style>
    </head>
    <body onload="window.print(); setTimeout(()=>window.close(), 500)">
      <div class="receipt">
        ${finalLogo.value ? `<img src="${finalLogo.value}" class="logo"/>` : ""}
        <h3>${finalShopName.value}</h3>
        <div class="center">${finalShopAddress.value}</div>
        <div class="center">${finalShopPhone.value}</div>
        ${finalShopPhoneTwo.value ? `<div class="center">${finalShopPhoneTwo.value}</div>` : ""}
        <div class="line"></div>

        <div>ID: ${sale.value.id}</div>
        <div>Date: ${sale.value.sale_date}</div>
        <div>Customer: ${sale.value.customer?.name || "-"}</div>
        <div>Type: <b>${sale.value.credit ? "Credit" : "Cash"}</b></div>

        <div class="line"></div>
        <table>
          <thead>
            <tr>
              <td>Item</td>
              <td class="right">Qty</td>
              <td class="right">Price</td>
              <td class="right">Total</td>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div class="line"></div>
        <table>
          <tr>
            <td>Items</td>
            <td class="right">${sale.value.total_items || 0}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td class="right">Rs. ${sale.value.total_discount || 0}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td class="right"><b>Rs. ${sale.value.total_amount || 0}</b></td>
          </tr>
        </table>

        <div class="line"></div>
        ${sale.value.total_arrears ? `<div class="center">Arrears: Rs.${sale.value.total_arrears}</div>` : ""}
        <div class="center">Thank You!</div>
      </div>
    </body>
    </html>
  `;

  // Open in new window and print
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
};

// Expose print method
defineExpose({ print });
</script>
