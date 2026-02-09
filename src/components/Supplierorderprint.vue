<script setup>
import { ref, computed } from "vue";
import { useAboutStore } from '@/stores/useAboutStore';
import html2pdf from 'html2pdf.js';

const store = useAboutStore();
const order = ref(null);

// Shop details from Pinia Store
const finalShopName = computed(() => store.about?.name || "My Business");
const finalShopAddress = computed(() => store.about?.address || "Address Not Set");
const finalShopPhone = computed(() => store.about?.phone_number || "");
const shopLogoUrl = computed(() => store.about?.image_url || "");

/**
 * Converts image URL to Base64 to ensure it renders correctly in the PDF
 */
const imageToBase64 = (url) => {
  return new Promise((resolve) => {
    if (!url) return resolve('');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; 
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn("Base64 conversion error", e);
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = url;
  });
};

const downloadPDF = async (orderData) => {
  order.value = orderData;
  
  // Fetch logo as base64
  const logoBase64 = shopLogoUrl.value ? await imageToBase64(shopLogoUrl.value) : '';

  // Generate rows with EMPTY price/total columns for manual entry
  const itemsHtml = order.value.items.map((item, index) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 4px; text-align: center; font-size: 11px; border-left: 1px solid #eee;">${index + 1}</td>
      <td style="padding: 4px; font-size: 11px; border-left: 1px solid #eee;">${item.name}</td>
      <td style="padding: 4px; text-align: center; font-size: 11px; border-left: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 4px; border-left: 1px solid #eee; width: 80px;"></td> 
      <td style="padding: 4px; border-left: 1px solid #eee; border-right: 1px solid #eee; width: 80px;"></td> 
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333; background: #fff;">
      
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 8px; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${logoBase64 ? `<img src="${logoBase64}" style="height: 50px; width: auto; object-fit: contain;">` : ''}
          <div>
            <h1 style="margin: 0; font-size: 16px; text-transform: uppercase;">${finalShopName.value}</h1>
            <p style="margin: 0; font-size: 10px;">${finalShopAddress.value}</p>
            <p style="margin: 0; font-size: 10px;">Phone: ${finalShopPhone.value}</p>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 16px; color: #666; letter-spacing: 1px;">SUPPLIER ORDER</h2>
          <p style="margin: 2px 0; font-size: 10px;"><strong>Invoice:</strong> #${order.value.id}</p>
          <p style="margin: 2px 0; font-size: 10px;"><strong>Date:</strong> ${order.value.order_date}</p>
        </div>
      </div>

      <div style="margin: 10px 0; background: #f9f9f9; padding: 8px; border-radius: 4px; font-size: 11px; border: 1px solid #eee;">
        <p style="margin: 0;"><strong>To Supplier:</strong> ${order.value.supplier?.name || 'N/A'}</p>
        <p style="margin: 2px 0 0;"><strong>Contact:</strong> ${order.value.supplier?.phone || 'N/A'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border-top: 1px solid #444;">
        <thead>
          <tr style="background: #f2f2f2; color: #333; font-size: 11px;">
            <th style="padding: 6px; border: 1px solid #ddd; width: 30px;">#</th>
            <th style="padding: 6px; border: 1px solid #ddd; text-align: left;">Item Description</th>
            <th style="padding: 6px; border: 1px solid #ddd; width: 50px;">Qty</th>
            <th style="padding: 6px; border: 1px solid #ddd; text-align: right; width: 90px;">Unit Cost</th>
            <th style="padding: 6px; border: 1px solid #ddd; text-align: right; width: 90px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="font-size: 9px; color: #666;">
          Generated on: ${new Date().toLocaleString()}
        </div>
        <div style="text-align: center; width: 200px; border-top: 1px solid #333; padding-top: 5px;">
           <p style="font-size: 10px; margin: 0; font-weight: bold;">Authorized Signature</p>
        </div>
      </div>
    </div>
  `;

  // Create a clean container for capture
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  document.body.appendChild(element);

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Supplier_Order_${order.value.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 3, 
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation failed", error);
  } finally {
    document.body.removeChild(element);
  }
};

defineExpose({ downloadPDF });
</script>

<template>
  <div style="display: none;"></div>
</template>