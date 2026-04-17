import{u as S}from"./useAboutStore-CAy5AaSs.js";import{r as p,j as A,l as i}from"./index-CKghTH19.js";const z={__name:"SalePrint",props:{shopName:{type:String,default:""},shopAddress:{type:String,default:""},shopPhone:{type:String,default:""},logo:{type:String,default:null}},setup(c,{expose:u}){const e=S(),v=p(null);A(()=>{e.about&&(v.value=e.about),console.log("About in SalePrint --->",e.about?.phone_number)});const o=c,h=i(()=>o.shopName||e.about?.name||"My Shop"),m=i(()=>o.shopAddress||e.about?.address||"Shop Address"),b=i(()=>o.shopPhone||e.about?.phone_number||""),l=i(()=>o.shopPhone||e.about?.additional_phone||""),d=i(()=>o.logo||e.about?.image_url||""),t=p(null),g=a=>{if(t.value=a,!t.value)return;const y=Array.isArray(t.value.items)&&t.value.items.length?t.value.items.map(n=>{const w=parseFloat(n.quantity).toFixed(3).replace(/\.?0+$/,""),$=parseFloat(n.sale_price).toFixed(2),_=(n.quantity*n.sale_price).toFixed(2);return`
        <tr>
          <td style="padding-bottom:1px"><b>${n.name}</b></td>
        </tr>
        <tr>
          <td style="padding-top:1px; font-size:17px; font-weight:900; color:#000; letter-spacing:0.5px">
            <b>Qty: ${w} | Price: ${$} | Total: ${_}</b>
          </td>
        </tr>`}).join(""):"<tr><td style='text-align:center'>No items</td></tr>",f=`
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
    ${d.value?`<img src="${d.value}" class="logo"/>`:""}
    <h3>${h.value}</h3>
    <div class="center">${m.value}</div>
    <div class="center">Ph-${b.value}</div>
    ${l.value?`<div class="center">Ph-:${l.value}</div>`:""}
    <div class="line"></div>

    <div>ID: ${t.value.id}</div>
    <div>Date: ${t.value.sale_date}</div>
    <div>Customer: ${t.value.customer?.name||"-"}</div>
    <div>Type: <b>${x(t.value.credit)}</b></div>

    <div class="line"></div>
    <table>
      <tbody>${y}</tbody>
    </table>

    <div class="line"></div>
    <table>
      <tr>
        <td><b style="font-size:14px">GRAND TOTAL:</b></td>
        <td class="right"><b style="font-size:14px">Rs. ${parseFloat(t.value.total_amount||0).toFixed(2)}</b></td>
      </tr>
    </table>

    <div class="line"></div>
    ${t.value.total_arrears?`<div class="center"><b>Arrears: Rs. ${parseFloat(t.value.total_arrears).toFixed(2)}</b></div>`:""}
    <div class="center" style="margin-top: 4px; font-size: 11px">Developed By CTS Chitral</div>
    
  </div>
</body>
</html>
`,r=window.open("","_blank");r.document.write(f),r.document.close()},s={null:"Fast Pay",0:"Invoice Only",1:"Credit Sale",2:"Advance Hold"},x=a=>a==null?s.null:s[a]||"Unknown";return u({print:g}),()=>{}}};export{z as _};
