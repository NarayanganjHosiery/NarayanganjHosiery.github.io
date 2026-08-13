/* cart.js — cart state + localStorage */
const CART_KEY = "nh_cart_v1";

function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }catch{ return []; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }

function getCart(){ return loadCart(); }

function cartCount(){
  return loadCart().reduce((s,i)=> s + i.qty, 0);
}
function cartSubtotal(){
  const cart = loadCart();
  return cart.reduce((s,i)=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    const price = p ? getDisplayPrice(p) : i.price;
    return s + price * i.qty;
  },0);
}
function updateCartCount(){
  const c = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach(el=>{
    el.textContent = c;
    el.style.display = c>0 ? "grid" : "none";
  });
}

function addToCart(productId, qty=1, opts={}){
  const p = PRODUCTS.find(x=>x.id===productId);
  if(!p) return;
  const cart = loadCart();
  const existing = cart.find(i=>i.id===productId && i.size===opts.size && i.color===opts.color);
  const addQty = Math.max(1, qty|0);
  const stock = p.availableStock ?? p.stock ?? 99;
  if(existing){
    const next = Math.min(stock, existing.qty + addQty);
    if(next===existing.qty){ showToast("স্টক সীমা পৌঁছে গেছে","err"); return; }
    existing.qty = next;
  } else {
    cart.push({ id:productId, qty: Math.min(addQty, stock), size: opts.size||null, color: opts.color||null, price: getDisplayPrice(p), name: p.name, image: p.image, unitLabel: getUnitLabel(p) });
  }
  saveCart(cart);
  showToast("কার্টে যোগ করা হয়েছে ✓","ok");
  renderCartDrawer();
}

function removeFromCart(index){
  const cart = loadCart();
  cart.splice(index,1);
  saveCart(cart);
  renderCartDrawer();
  renderCartPageIfAny();
}

function updateCartQty(index, delta){
  const cart = loadCart();
  if(!cart[index]) return;
  const p = PRODUCTS.find(x=>x.id===cart[index].id);
  const stock = p?.availableStock ?? p?.stock ?? 99;
  const next = cart[index].qty + delta;
  if(next<=0){ cart.splice(index,1); }
  else if(next>stock){ showToast("স্টক সীমা: "+stock,"err"); return; }
  else cart[index].qty = next;
  saveCart(cart);
  renderCartDrawer();
  renderCartPageIfAny();
}

function clearCart(){ saveCart([]); renderCartDrawer(); renderCartPageIfAny(); }

function renderCartDrawer(){
  const cart = loadCart();
  const body = document.getElementById("cartBody");
  const foot = document.getElementById("cartFoot");
  if(!body) return;
  if(cart.length===0){
    body.innerHTML = `<div class="empty" style="margin-top:12px"><p style="font-size:28px">🛒</p><p style="font-weight:700;margin-top:6px">কার্ট খালি</p><p class="muted" style="font-size:13px">পণ্য যোগ করুন এবং চেকআউট করুন</p><a href="shop.html" class="btn btn-primary" style="margin-top:12px">পণ্য দেখুন</a></div>`;
    if(foot) foot.style.display="none";
    return;
  }
  if(foot) foot.style.display="block";
  body.innerHTML = cart.map((it,idx)=>{
    const p = PRODUCTS.find(x=>x.id===it.id);
    const unit = it.unitLabel || getUnitLabel(p||{});
    const price = p ? getDisplayPrice(p) : it.price;
    return `<div class="cart-item">
      <div class="cart-item-media">${p ? `<span style="font-size:22px">${iconFor(p)}</span>` : "🛍️"}</div>
      <div>
        <div style="font-weight:700;font-size:13px;line-height:1.3">${it.name}</div>
        <div class="muted" style="font-size:11px">${unit} • ${CONFIG.CURRENCY}${price.toLocaleString('en-BD')}</div>
        ${it.size?`<div class="muted" style="font-size:11px">Size: ${it.size} ${it.color? "• "+it.color:""}</div>`:""}
        <div style="margin-top:8px;display:flex;align-items:center;gap:8px">
          <span class="qty"><button aria-label="decrease" onclick="updateCartQty(${idx},-1)">−</button><span>${it.qty}</span><button aria-label="increase" onclick="updateCartQty(${idx},1)">+</button></span>
          <span style="font-weight:800;font-size:13px">${CONFIG.CURRENCY}${(price*it.qty).toLocaleString('en-BD')}</span>
        </div>
      </div>
      <button class="icon-btn" style="width:32px;height:32px" aria-label="Remove" onclick="removeFromCart(${idx})">✕</button>
    </div>`;
  }).join("");

  const subtotal = cartSubtotal();
  const delivery = subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : CONFIG.DELIVERY_CHARGE;
  const total = subtotal + delivery;
  const footEl = document.getElementById("cartSummary");
  if(footEl){
    footEl.innerHTML = `
      <div class="summary-row"><span>সাবটোটাল</span><span>${CONFIG.CURRENCY}${subtotal.toLocaleString('en-BD')}</span></div>
      <div class="summary-row"><span>ডেলিভারি</span><span>${delivery===0? "ফ্রি" : CONFIG.CURRENCY+delivery.toLocaleString('en-BD')}</span></div>
      <div class="summary-row total"><span>মোট</span><span>${CONFIG.CURRENCY}${total.toLocaleString('en-BD')}</span></div>
      <a href="checkout.html" class="btn btn-primary" style="width:100%;margin-top:12px">ডেলিভারি কনফার্ম করুন →</a>
      <button onclick="clearCart()" class="btn btn-ghost" style="width:100%;margin-top:8px">কার্ট খালি করুন</button>
    `;
  }
}

function renderCartPageIfAny(){
  const el = document.getElementById("cartPageBody");
  if(!el) return;
  const cart = loadCart();
  if(cart.length===0){ el.innerHTML = `<div class="empty"><p style="font-size:28px">🛒</p><p>কার্ট খালি</p><a class="btn btn-primary" href="shop.html" style="margin-top:10px">কেনাকাটা শুরু করুন</a></div>`; return; }
  // rendered via same as drawer but in page context handled by drawerFoot logic
}

function iconFor(p){
  const map={panjabi:"👘",shirt:"👔","t-shirt":"👕","polo-shirt":"👕","pant-trouser":"👖",lungi:"🥻",underwear:"🩲","three-piece":"👗","salwar-kameez":"👗",saree:"🥻",socks:"🧦",gloves:"🧤",innerwear:"👚",undergarments:"👙","other-hosiery":"🧢",leggings:"🩱", "womens-tshirt":"👚","womens-hosiery":"🧦","baby-clothing":"👶","kids-tshirt":"👕","kids-pant":"👖","kids-shirt":"👔","childrens-hosiery":"🧦"};
  return map[p.subcategory] || "🛍️";
}
