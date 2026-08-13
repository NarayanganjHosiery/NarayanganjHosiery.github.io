/* checkout.js */
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount(); renderCheckoutSummary(); initDivisions(); initPayments(); initCheckoutForm();
});

function renderCheckoutSummary(){
  const wrap = document.getElementById("orderSummaryItems");
  const totals = document.getElementById("orderTotals");
  if(!wrap) return;
  const cart = loadCart();
  if(cart.length===0){
    wrap.innerHTML = `<div class="empty">কার্ট খালি — <a href="shop.html">পণ্য যোগ করুন</a></div>`;
    if(totals) totals.innerHTML="";
    return;
  }
  wrap.innerHTML = cart.map(it=>{
    const p = PRODUCTS.find(x=>x.id===it.id);
    const price = p? getDisplayPrice(p): it.price;
    return `<div class="order-item">
      <div style="width:48px;height:48px;border-radius:10px;background:#fff;display:grid;place-items:center;border:1px solid #F1F5F9">${p? iconFor(p): "🛍️"}</div>
      <div><div style="font-weight:700;font-size:13px">${it.name}</div><div class="muted" style="font-size:12px">${it.qty} × ${CONFIG.CURRENCY}${price.toLocaleString('en-BD')} ${it.unitLabel||""}</div></div>
      <div style="font-weight:800">${CONFIG.CURRENCY}${(price*it.qty).toLocaleString('en-BD')}</div>
    </div>`;
  }).join("");
  const subtotal = cartSubtotal();
  const delivery = subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_CHARGE;
  const total = subtotal + delivery;
  if(totals){
    totals.innerHTML = `
      <div class="summary-row"><span>সাবটোটাল</span><span>${CONFIG.CURRENCY}${subtotal.toLocaleString('en-BD')}</span></div>
      <div class="summary-row"><span>ডেলিভারি</span><span>${delivery===0? "ফ্রি": CONFIG.CURRENCY+delivery.toLocaleString('en-BD') }</span></div>
      <div class="summary-row total"><span>মোট</span><span>${CONFIG.CURRENCY}${total.toLocaleString('en-BD')}</span></div>
    `;
    totals.dataset.subtotal=subtotal; totals.dataset.delivery=delivery; totals.dataset.total=total;
  }
}

function initDivisions(){
  const divSel=document.getElementById("division");
  const distSel=document.getElementById("district");
  if(!divSel||!distSel) return;
  divSel.innerHTML = `<option value="">বিভাগ নির্বাচন করুন</option>` + Object.keys(BD_LOCATIONS).map(d=>`<option value="${d}">${d}</option>`).join("");
  divSel.addEventListener("change", ()=>{
    const d=divSel.value;
    const districts = BD_LOCATIONS[d] || [];
    distSel.innerHTML = `<option value="">জেলা নির্বাচন করুন</option>` + districts.map(x=>`<option value="${x}">${x}</option>`).join("");
    distSel.disabled = !d;
  });
}

function initPayments(){
  const wrap=document.getElementById("payOptions");
  if(!wrap) return;
  wrap.querySelectorAll(".pay-option").forEach(opt=>{
    opt.addEventListener("click", ()=>{
      wrap.querySelectorAll(".pay-option").forEach(o=>o.classList.remove("active"));
      opt.classList.add("active");
      opt.querySelector('input[type="radio"]').checked=true;
      toggleTxn();
    });
  });
  toggleTxn();
}
function getPayment(){ return document.querySelector('input[name="payment"]:checked')?.value || "cod"; }
function toggleTxn(){
  const m=getPayment();
  const box=document.getElementById("txnBox");
  if(!box) return;
  const need = m==="bkash" || m==="nagad";
  box.classList.toggle("show", need);
  const inp=document.getElementById("transactionId");
  if(inp) inp.required = need;
  // update info text
  const info=document.getElementById("payInfo");
  if(info){
    if(m==="cod") info.textContent="পণ্য হাতে পাওয়ার পর টাকা পরিশোধ করুন।";
    else if(m==="bkash") info.textContent=`bKash Send Money — ${CONFIG.BKASH_NUMBER} নম্বরে Send Money করার পর Transaction ID প্রদান করুন।`;
    else info.textContent=`Nagad Send Money — ${CONFIG.NAGAD_NUMBER} নম্বরে Send Money করার পর Transaction ID প্রদান করুন।`;
  }
}

function initCheckoutForm(){
  const form=document.getElementById("checkoutForm");
  if(!form) return;
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();
    if(!validateCheckout()) return;
    await submitOrder();
  });
}

function validateCheckout(){
  let ok=true;
  const form=document.getElementById("checkoutForm");
  const cart=loadCart();
  if(cart.length===0){ showToast("কার্ট খালি — পণ্য যোগ করুন","err"); return false; }

  const fields=[
    {id:"customerName", test:v=>v.trim().length>=2, msg:"নাম লিখুন (কমপক্ষে ২ অক্ষর)"},
    {id:"mobile", test:v=>/^01[3-9]\d{8}$/.test(v.trim()), msg:"সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)"},
    {id:"division", test:v=>!!v, msg:"বিভাগ নির্বাচন করুন"},
    {id:"district", test:v=>!!v, msg:"জেলা নির্বাচন করুন"},
    {id:"address", test:v=>v.trim().length>=6, msg:"বিস্তারিত ঠিকানা লিখুন"},
  ];
  fields.forEach(f=>{
    const el=document.getElementById(f.id);
    const field=el.closest(".field");
    const valid=f.test(el.value);
    field.classList.toggle("invalid", !valid);
    const err=field.querySelector(".err-msg");
    if(err) err.textContent = valid? "" : f.msg;
    if(!valid) ok=false;
  });
  // email optional but if filled must be valid
  const emailEl=document.getElementById("email");
  if(emailEl && emailEl.value.trim()){
    const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
    const field=emailEl.closest(".field");
    field.classList.toggle("invalid", !valid);
    if(!valid){ field.querySelector(".err-msg").textContent="সঠিক ইমেইল দিন"; ok=false; }
  }
  const pay=getPayment();
  if((pay==="bkash"||pay==="nagad")){
    const txn=document.getElementById("transactionId");
    const field=txn.closest(".field");
    const valid=txn.value.trim().length>=4;
    field.classList.toggle("invalid", !valid);
    field.querySelector(".err-msg").textContent = valid? "" : "Transaction ID আবশ্যক";
    if(!valid) ok=false;
  }
  if(!ok) showToast("অনুগ্রহ করে লাল চিহ্নিত ফিল্ডগুলো ঠিক করুন","err");
  return ok;
}

function generateOrderId(){
  const d=new Date();
  return "NH-" + d.getFullYear().toString().slice(-2) + String(d.getMonth()+1).padStart(2,"0") + String(d.getDate()).padStart(2,"0") + "-" + Math.random().toString(36).slice(2,7).toUpperCase();
}

let _submitting = false;

async function submitOrder(){
  if (_submitting) return;
  _submitting = true;
  const btn=document.getElementById("submitBtn");
  const orig=btn.textContent;
  btn.disabled=true; btn.textContent="প্রসেস হচ্ছে…";
  const cart=loadCart();
  const subtotal=cartSubtotal();
  const delivery = subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_CHARGE;
  const total=subtotal+delivery;
  const payload={
    orderId: generateOrderId(),
    timestamp: new Date().toISOString(),
    customerName: document.getElementById("customerName").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    email: document.getElementById("email").value.trim(),
    country: document.getElementById("country").value,
    division: document.getElementById("division").value,
    district: document.getElementById("district").value,
    address: document.getElementById("address").value.trim(),
    paymentMethod: getPayment(),
    transactionId: document.getElementById("transactionId")?.value.trim() || "",
    items: cart.map(it=>{
      const p=PRODUCTS.find(x=>x.id===it.id);
      return {
        id:it.id,
        name:it.name,
        category: p ? p.category : "",
        subcategory: p ? p.subcategory : "",
        qty:it.qty,
        quantity:it.qty,
        unitType: p ? (p.unitType || "dozen") : "dozen",
        unitLabel: it.unitLabel || (p ? getUnitLabel(p) : "dozen"),
        unitPrice: p?getDisplayPrice(p):it.price,
        subtotal: (p?getDisplayPrice(p):it.price)*it.qty,
        size:it.size, color:it.color
      };
    }),
    subtotal, deliveryCharge: delivery, total
  };

  try{
    if(CONFIG.ORDER_API_URL){
      const res=await fetch(CONFIG.ORDER_API_URL, {
        method:"POST",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error("Network error: " + res.status);
      // Try to parse response — Apps Script returns {success, orderSaved, emailSent}
      try {
        var json = await res.json();
        // If order was saved but email failed, still show success (email is behind the scenes)
        if (json && json.success === false && json.orderSaved !== true) {
          throw new Error(json.error || "Order save failed");
        }
        if (json && json.emailSent === false) {
          console.warn("Order saved but owner email failed to send:", json);
        }
      } catch(parseErr){
        // If response is not JSON or is success, treat as success
        if (parseErr.message && parseErr.message.indexOf("Order save failed") === 0) throw parseErr;
        // otherwise the order succeeded (Apps Script 2xx with non-JSON is still success)
      }
    } else {
      // demo mode — no network call, no email
      await new Promise(r=>setTimeout(r, 900));
      console.log("DEMO order payload:", payload);
    }
    // success — cart is cleared only after confirmed success
    localStorage.setItem("nh_last_order", JSON.stringify(payload));
    clearCart();
    showSuccess(payload);
  }catch(err){
    console.error(err);
    showToast("অর্ডার পাঠানো যায়নি — আবার চেষ্টা করুন","err");
  }finally{
    btn.disabled=false; btn.textContent=orig;
    _submitting = false;
  }
}

function showSuccess(payload){
  const sec=document.getElementById("checkoutSection");
  const succ=document.getElementById("successSection");
  if(sec) sec.style.display="none";
  if(succ){
    succ.style.display="block";
    document.getElementById("successOrderId").textContent = payload.orderId;
    document.getElementById("successName").textContent = payload.customerName;
    document.getElementById("successTotal").textContent = CONFIG.CURRENCY+payload.total.toLocaleString('en-BD');
    document.getElementById("successPay").textContent = payload.paymentMethod.toUpperCase();
    document.getElementById("successDistrict").textContent = payload.district;
  }
  window.scrollTo({top:0,behavior:"smooth"});
}
