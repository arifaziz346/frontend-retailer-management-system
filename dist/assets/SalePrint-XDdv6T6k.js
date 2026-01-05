import{u as y}from"./useAboutStore-C2CUQFFb.js";import{r as n,j as $,l}from"./index-Ce5nBVLN.js";const w={__name:"SalePrint",props:{shopName:{type:String,default:""},shopAddress:{type:String,default:""},shopPhone:{type:String,default:""},logo:{type:String,default:null}},setup(r,{expose:c}){const e=y(),u=n(null);$(()=>{e.about&&(u.value=e.about),console.log("About in SalePrint --->",e.about?.phone_number)});const a=r,p=l(()=>a.shopName||e.about?.name||"My Shop"),h=l(()=>a.shopAddress||e.about?.address||"Shop Address"),v=l(()=>a.shopPhone||e.about?.phone_number||""),o=l(()=>a.shopPhone||e.about?.additional_phone||""),i=l(()=>a.logo||e.about?.image_url||""),t=n(null);return c({print:m=>{if(t.value=m,!t.value)return;const g=Array.isArray(t.value.items)&&t.value.items.length?t.value.items.map(s=>`
        <tr>
          <td>${s.name}</td>
          <td style="text-align:right">${s.quantity}</td>
          <td style="text-align:right">${s.sale_price}</td>
          <td style="text-align:right">${(s.quantity*s.sale_price).toFixed(2)}</td>
        </tr>`).join(""):"<tr><td colspan='4' style='text-align:center'>No items</td></tr>",b=`
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
        ${i.value?`<img src="${i.value}" class="logo"/>`:""}
        <h3>${p.value}</h3>
        <div class="center">${h.value}</div>
        <div class="center">${v.value}</div>
        ${o.value?`<div class="center">${o.value}</div>`:""}
        <div class="line"></div>

        <div>ID: ${t.value.id}</div>
        <div>Date: ${t.value.sale_date}</div>
        <div>Customer: ${t.value.customer?.name||"-"}</div>
        <div>Type: <b>${t.value.credit?"Credit":"Cash"}</b></div>

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
          <tbody>${g}</tbody>
        </table>

        <div class="line"></div>
        <table>
          <tr>
            <td>Items</td>
            <td class="right">${t.value.total_items||0}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td class="right">Rs. ${t.value.total_discount||0}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td class="right"><b>Rs. ${t.value.total_amount||0}</b></td>
          </tr>
        </table>

        <div class="line"></div>
        ${t.value.total_arrears?`<div class="center">Arrears: Rs.${t.value.total_arrears}</div>`:""}
        <div class="center">Thank You!</div>
      </div>
    </body>
    </html>
  `,d=window.open("","_blank");d.document.write(b),d.document.close()}}),()=>{}}};export{w as _};
