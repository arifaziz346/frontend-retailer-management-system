import{r as l,j as K,l as w,c as r,o as n,A as Q,k as D,m as W,a as t,b as v,u as X,h as U,t as i,e as z,F as Z,x as tt,q as M,i as et,f as k,y as A,w as st,v as ot}from"./index-CKghTH19.js";import{a as P}from"./axios-CBe-jvwZ.js";import{_ as B}from"./BaseModal-B8hD0v1c.js";import{_ as F}from"./FormInput-CTvp5BdR.js";import{_ as at}from"./Pagination-CW6DylXg.js";import{u as rt}from"./useAboutStore-CAy5AaSs.js";import{V as nt}from"./vue-spinner-tail-BEOJRwnu.js";import{t as S}from"./toast-BWxgGeSH.js";import{u as lt}from"./useFormErrors-BWkWHfi_.js";import{_ as it}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./stringHelpers-DhATn_QK.js";const dt={class:"hidden"},ut={__name:"PaymentPrint",setup(I,{expose:N}){const p=rt(),m=l(null);K(()=>{p.about&&(m.value=p.about)});const _=w(()=>p.about?.name||"-"),b=w(()=>p.about?.address||"-"),h=w(()=>p.about?.phone_number||"-"),x=w(()=>p.about?.additional_phone||"-");w(()=>p.about?.image_url||"-");const c=l(null),f=l("");return N({print:(y,d)=>{if(c.value=y,f.value=d,!c.value)return;const $=`
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
    
    <h3>${_.value}</h3>
    <div class="center">${b.value}</div>
    <div class="center">Ph: ${h.value}</div>
    ${x.value?`<div class="center">Ph: ${x.value}</div>`:""}
    
    <div class="line"></div>
    <div class="center"><b style="font-size: 14px;">PAYMENT RECEIPT</b></div>
    <div class="line"></div>

    <table>
      <tr>
        <td>Receipt No:</td>
        <td class="right bold">#${c.value.id}</td>
      </tr>
      <tr>
        <td>Date:</td>
        <td class="right">${c.value.paid_at}</td>
      </tr>
      <tr>
        <td>Customer:</td>
        <td class="right bold">${f.value}</td>
      </tr>
    </table>

    <div class="line"></div>
    
    <table style="margin: 10px 0;">
      <tr>
        <td><b style="font-size:16px">AMOUNT PAID:</b></td>
        <td class="right"><b style="font-size:18px">Rs. ${parseFloat(c.value.amount).toFixed(2)}</b></td>
      </tr>
    </table>

    <div class="line"></div>
    
    <div style="font-size: 11px; margin-bottom: 10px;">
      <b>Note:</b> ${c.value.note||"N/A"}
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
`,g=window.open("","_blank");g.document.write($),g.document.close()}}),(y,d)=>(n(),r("div",dt))}},ct={key:0,class:"fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"},pt={class:"flex flex-col items-center space-y-3"},mt={key:1,class:"flex flex-col min-h-screen bg-gray-50/50 overflow-x-hidden p-2 sm:p-4 md:p-6"},xt={class:"w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4"},gt={class:"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"},bt={class:"flex items-center gap-3 min-w-0"},ft={class:"min-w-0"},vt={class:"text-base sm:text-lg font-bold text-gray-900 truncate"},yt={class:"flex flex-wrap items-center gap-3 w-full sm:w-auto"},_t={class:"flex-1 sm:flex-none flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 border border-green-100"},ht={class:"text-sm sm:text-base font-black text-green-700 leading-tight"},wt={class:"flex-1"},kt={key:0,class:"bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"},Pt={class:"overflow-x-auto"},Ct={class:"w-full text-left"},$t={class:"divide-y divide-gray-50"},Vt={class:"px-4 py-4 font-mono font-bold text-xs text-gray-900"},Dt={class:"px-4 py-4"},St={class:"text-sm font-black text-blue-700"},Nt={class:"px-4 py-4"},jt={key:0,class:"inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase"},Rt={key:1,class:"inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase"},zt={class:"px-4 py-4 text-xs text-gray-600 whitespace-nowrap"},At={class:"px-4 py-4"},Et={class:"flex items-center justify-center gap-2"},Tt=["onClick"],Ut=["onClick"],Mt=["onClick"],Bt=["onClick"],Ft={class:"p-4 bg-gray-50/50 border-t border-gray-100"},It={key:1,class:"flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-gray-100 shadow-sm"},Ot={class:"space-y-4 p-1"},Lt={class:"space-y-2"},Ht={class:"grid grid-cols-2 gap-3"},qt={key:0,class:"w-2 h-2 rounded-full bg-white animate-pulse"},Yt={key:0,class:"w-2 h-2 rounded-full bg-white animate-pulse"},Gt={key:0,class:"text-[10px] text-red-500 font-semibold mt-1"},Jt={class:"flex flex-col gap-1"},Kt={key:0,class:"text-[10px] text-red-500 font-medium"},Qt={key:0,class:"space-y-6 py-2"},Wt={class:"flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100"},Xt={class:"text-2xl font-black text-blue-700"},Zt={class:"text-right"},te={class:"grid grid-cols-2 gap-4"},ee={class:"p-3 bg-white border border-gray-100 rounded-xl"},se={class:"text-sm font-bold text-gray-800"},oe={class:"p-3 bg-white border border-gray-100 rounded-xl"},ae={class:"text-sm font-bold text-gray-800"},re={class:"space-y-1.5"},ne={class:"p-4 bg-gray-50 rounded-xl text-sm text-gray-600 italic border border-gray-100 min-h-[80px]"},le={__name:"Customer_Payments",setup(I){const N=Q(),p=et(),m=l(N.params.id),_=l(null),b=l(!1),h=l(!1),x=l(!1),c=l(!1),f=l(!1),C=l(null),y=l([]),d=l(null),$=D({currentPage:1,lastPage:1,nextPageUrl:null,prevPageUrl:null}),g=D({customer:{},total_paid:0}),o=D({customer_id:"",amount:"",paid_at:"",note:"",status:null}),u=D({amount:"",paid_at:"",note:"",status:""}),O=lt(u),j=async()=>{try{const s=await P.get(`/credit/customer/${m.value}`);g.customer=s.data.data.Customer,g.total_paid=s.data.data.CreditDetail.total_paid}catch(s){console.error("Error fetching customer stats",s)}},V=async(s=null)=>{b.value=!0;try{const e=await P.get(s||`/payments/customer/${m.value}`);y.value=e.data.data.data,Object.assign($,{currentPage:e.data.data.current_page,lastPage:e.data.data.last_page,nextPageUrl:e.data.data.next_page_url,prevPageUrl:e.data.data.prev_page_url})}catch(e){console.error("Error fetching payments",e)}finally{b.value=!1}},L=async()=>{h.value=!0,Object.keys(u).forEach(s=>u[s]="");try{const s={customer_id:m.value,amount:o.amount,paid_at:o.paid_at,note:o.note,status:o.status===1?1:null};let e;f.value?e=await P.put(`/payments/${C.value}`,s):e=await P.post("/payments",s),e.data.success&&(S.success(e.data.message),await Promise.all([V(),j()]),T())}catch(s){O(s)}finally{h.value=!1}},H=async s=>{if(confirm("Delete this payment record permanently?")){b.value=!0;try{const e=await P.delete(`/payments/${s}`);e.data.success&&(S.success(e.data.message),await Promise.all([V(),j()]))}catch{S.error("Delete failed")}finally{b.value=!1}}},q=s=>{_.value?_.value.print(s,g.customer.name):S.error("Printer component not initialized")},E=()=>{T(),x.value=!0},Y=s=>{d.value=s,c.value=!0},G=s=>{f.value=!0,C.value=s.id,o.customer_id=m.value,o.amount=s.amount,o.paid_at=s.paid_at,o.note=s.note,o.status=s.status,x.value=!0},T=()=>{o.customer_id=m.value,o.amount="",o.paid_at=new Date().toISOString().split("T")[0],o.note="",o.status=null,f.value=!1,C.value=null,Object.keys(u).forEach(s=>u[s]=""),x.value=!1},J=()=>p.back();return W(()=>{j(),V(),o.customer_id=m.value}),(s,e)=>b.value?(n(),r("div",ct,[t("div",pt,[v(X(nt),{size:"48px",color:"#2563eb"}),e[8]||(e[8]=t("p",{class:"text-blue-600 text-sm font-medium animate-pulse"}," Loading, please wait... ",-1))])])):(n(),r("div",mt,[t("div",xt,[t("div",gt,[t("div",bt,[t("button",{onClick:e[0]||(e[0]=U(a=>J(),["prevent"])),class:"flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200 transition-all"},[...e[9]||(e[9]=[t("svg",{class:"w-5 h-5",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M15 19l-7-7 7-7"})],-1)])]),t("div",ft,[t("h1",vt,i(g.customer.name),1),e[10]||(e[10]=t("p",{class:"text-xs text-gray-500 font-medium uppercase tracking-wider"},"Payment History",-1))])]),t("div",yt,[t("div",_t,[e[12]||(e[12]=t("div",{class:"w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"},[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M5 13l4 4L19 7"})])],-1)),t("div",null,[e[11]||(e[11]=t("p",{class:"text-[10px] uppercase font-bold text-green-500 leading-none text-nowrap"},"Collected Total",-1)),t("p",ht,"Rs. "+i(g.total_paid),1)])]),t("button",{onClick:U(E,["prevent"]),class:"flex-1 sm:flex-none h-11 sm:h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"},[...e[13]||(e[13]=[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M12 4v16m8-8H4"})],-1),z(" Add Payment ",-1)])])])])]),t("main",wt,[y.value.length?(n(),r("div",kt,[t("div",Pt,[t("table",Ct,[e[14]||(e[14]=t("thead",null,[t("tr",{class:"bg-gray-50 border-b border-gray-100"},[t("th",{class:"px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider"},"ID"),t("th",{class:"px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider"},"Amount"),t("th",{class:"px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider"},"Status"),t("th",{class:"px-4 py-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider"},"Paid Date"),t("th",{class:"px-4 py-3 text-center text-[10px] font-bold uppercase text-gray-400 tracking-wider"},"Actions")])],-1)),t("tbody",$t,[(n(!0),r(Z,null,tt(y.value,a=>(n(),r("tr",{key:a.id,class:"hover:bg-blue-50/20 transition-all"},[t("td",Vt,"#"+i(a.id),1),t("td",Dt,[t("span",St,"Rs. "+i(a.amount),1)]),t("td",Nt,[a.status==1?(n(),r("span",jt," Pending ")):(n(),r("span",Rt," Complete "))]),t("td",zt,i(a.paid_at),1),t("td",At,[t("div",Et,[t("button",{onClick:R=>q(a),class:"h-8 px-3 text-[11px] font-bold bg-amber-50 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-all border border-amber-100"}," Print ",8,Tt),t("button",{onClick:R=>Y(a),class:"h-8 px-3 text-[11px] font-bold bg-blue-50 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all"}," View ",8,Ut),t("button",{onClick:R=>G(a),class:"h-8 px-3 text-[11px] font-bold bg-gray-100 text-gray-600 rounded-md hover:bg-gray-800 hover:text-white transition-all border border-gray-200"}," Edit ",8,Mt),t("button",{onClick:R=>H(a.id),class:"h-8 px-3 text-[11px] font-bold bg-white text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all border border-red-100"}," Delete ",8,Bt)])])]))),128))])])]),t("div",Ft,[v(at,{pagination:$,onPageChange:V},null,8,["pagination"])])])):(n(),r("div",It,[e[15]||(e[15]=t("img",{src:"https://cdn-icons-png.flaticon.com/512/4076/4076549.png",alt:"No Data",class:"w-24 h-24 opacity-30 mb-4"},null,-1)),e[16]||(e[16]=t("h2",{class:"text-lg font-bold text-gray-700"},"No Payments Recorded",-1)),e[17]||(e[17]=t("p",{class:"text-gray-400 text-sm mt-1"},"Start by adding a new payment for this customer.",-1)),t("button",{onClick:E,class:"mt-4 text-blue-600 text-sm font-bold hover:underline"}," + Create First Payment ")]))]),v(B,{modelValue:x.value,"onUpdate:modelValue":e[6]||(e[6]=a=>x.value=a),title:f.value?"Edit Payment Record":"Record New Payment",onSave:L,disableSaveBtn:h.value},{default:M(()=>[t("div",Ot,[v(F,{modelValue:o.amount,"onUpdate:modelValue":e[1]||(e[1]=a=>o.amount=a),label:"Payment Amount (Rs.)",type:"number",placeholder:"e.g. 5000",error:u.amount},null,8,["modelValue","error"]),v(F,{modelValue:o.paid_at,"onUpdate:modelValue":e[2]||(e[2]=a=>o.paid_at=a),label:"Date of Payment",type:"date",error:u.paid_at},null,8,["modelValue","error"]),t("div",Lt,[e[20]||(e[20]=t("label",{class:"text-xs font-bold text-gray-500 uppercase tracking-wide"},"Status",-1)),t("div",Ht,[t("button",{type:"button",onClick:e[3]||(e[3]=a=>o.status=null),class:A([o.status===null?"bg-green-600 text-white border-green-600 shadow-md":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50","py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2"])},[o.status===null?(n(),r("div",qt)):k("",!0),e[18]||(e[18]=z(" Complete ",-1))],2),t("button",{type:"button",onClick:e[4]||(e[4]=a=>o.status=1),class:A([o.status==1?"bg-amber-500 text-white border-amber-500 shadow-md":"bg-white text-gray-500 border-gray-200 hover:bg-gray-50","py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2"])},[o.status==1?(n(),r("div",Yt)):k("",!0),e[19]||(e[19]=z(" Pending ",-1))],2)]),u.status?(n(),r("p",Gt,i(u.status),1)):k("",!0)]),t("div",Jt,[e[21]||(e[21]=t("label",{class:"text-xs font-bold text-gray-500 uppercase"},"Note / Description",-1)),st(t("textarea",{"onUpdate:modelValue":e[5]||(e[5]=a=>o.note=a),rows:"3",class:"w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all",placeholder:"Reference number or reason..."},null,512),[[ot,o.note]]),u.note?(n(),r("p",Kt,i(u.note),1)):k("",!0)])])]),_:1},8,["modelValue","title","disableSaveBtn"]),v(B,{modelValue:c.value,"onUpdate:modelValue":e[7]||(e[7]=a=>c.value=a),title:"Payment Details",showSaveBtn:!1},{default:M(()=>[d.value?(n(),r("div",Qt,[t("div",Wt,[t("div",null,[e[22]||(e[22]=t("p",{class:"text-[10px] font-bold text-gray-400 uppercase"},"Amount Paid",-1)),t("p",Xt,"Rs. "+i(d.value.amount),1)]),t("div",Zt,[e[23]||(e[23]=t("p",{class:"text-[10px] font-bold text-gray-400 uppercase"},"Status",-1)),t("span",{class:A([d.value.status==1?"bg-amber-100 text-amber-700":"bg-green-100 text-green-700","inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase"])},i(d.value.status==1?"Pending":"Complete"),3)])]),t("div",te,[t("div",ee,[e[24]||(e[24]=t("p",{class:"text-[10px] font-bold text-gray-400 uppercase"},"Transaction ID",-1)),t("p",se,"#"+i(d.value.id),1)]),t("div",oe,[e[25]||(e[25]=t("p",{class:"text-[10px] font-bold text-gray-400 uppercase"},"Date",-1)),t("p",ae,i(d.value.paid_at),1)])]),t("div",re,[e[26]||(e[26]=t("p",{class:"text-[10px] font-bold text-gray-400 uppercase px-1"},"Note/Description",-1)),t("div",ne,i(d.value.note||"No description provided for this transaction."),1)])])):k("",!0)]),_:1},8,["modelValue"]),v(ut,{ref_key:"printRef",ref:_},null,512)]))}},ye=it(le,[["__scopeId","data-v-c17147f0"]]);export{ye as default};
