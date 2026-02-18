import{u as x}from"./useAboutStore-B2JNWMwA.js";import{r as c,j as _,l as i}from"./index-Dz19EDY6.js";const A={__name:"SalePrint",props:{shopName:{type:String,default:""},shopAddress:{type:String,default:""},shopPhone:{type:String,default:""},logo:{type:String,default:null}},setup(u,{expose:p}){const e=x(),v=c(null);_(()=>{e.about&&(v.value=e.about),console.log("About in SalePrint --->",e.about?.phone_number)});const a=u,h=i(()=>a.shopName||e.about?.name||"My Shop"),m=i(()=>a.shopAddress||e.about?.address||"Shop Address"),g=i(()=>a.shopPhone||e.about?.phone_number||""),s=i(()=>a.shopPhone||e.about?.additional_phone||""),n=i(()=>a.logo||e.about?.image_url||""),t=c(null),b=l=>{if(t.value=l,!t.value)return;const f=Array.isArray(t.value.items)&&t.value.items.length?t.value.items.map(o=>`
        <tr>
          <td>${o.name}</td>
          <td style="text-align:right">${o.quantity}</td>
          <td style="text-align:right">${o.sale_price}</td>
          <td style="text-align:right">${(o.quantity*o.sale_price).toFixed(2)}</td>
        </tr>`).join(""):"<tr><td colspan='4' style='text-align:center'>No items</td></tr>",$=`
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <style>
    body { font-family: monospace; margin:0; padding:0; }
    .receipt { width:80mm; padding:8px; }
    table { width:100%; font-size:14px; border-collapse:collapse; }
    td { padding:2px 0; }
    .line { border-top:1px dashed #000; margin:6px 0; }
    .right { text-align:right; }
    h3 { text-align:center; margin:2px 0; }
    .center { text-align:center; }
    .logo { max-width:150px; margin: 0 auto 4px; display:block; }
    @media print { @page { size:auto; margin:3mm; } }
  </style>
</head>
<body onload="window.print(); setTimeout(()=>window.close(), 500)">
  <div class="receipt">
    ${n.value?`<img src="${n.value}" class="logo"/>`:""}
    <h3>${h.value}</h3>
    <div class="center">${m.value}</div>
    <div class="center">Ph-${g.value}</div>
    ${s.value?`<div class="center">Ph-:${s.value}</div>`:""}
    <div class="line"></div>

    <div>ID: ${t.value.id}</div>
    <div>Date: ${t.value.sale_date}</div>
    <div>Customer: ${t.value.customer?.name||"-"}</div>
    <div>Type: <b>${y(t.value.credit)}</b></div>

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
      <tbody>${f}</tbody>
    </table>

    <div class="line"></div>
    <table>
      <tr>
        <td>Items</td>
        <td class="right">${t.value.total_items||0}</td>
      </tr>
      
      <tr>
        <td><b>Total</b></td>
        <td class="right"><b>Rs. ${t.value.total_amount||0}</b></td>
      </tr>
    </table>

    <div class="line"></div>
    ${t.value.total_arrears?`<div class="center">Arrears: Rs.${t.value.total_arrears}</div>`:""}
    <div class="center">Developed By ATS Chitral</div>
    
  </div>
</body>
</html>
`,r=window.open("","_blank");r.document.write($),r.document.close()},d={null:"Fast Pay",0:"Invoice Only",1:"Credit Sale",2:"Advance Hold"},y=l=>l==null?d.null:d[l]||"Unknown";return p({print:b}),()=>{}}};export{A as _};
