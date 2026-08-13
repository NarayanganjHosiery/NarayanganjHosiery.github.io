/* app.js — rendering, search, filters, hero, modals, toasts */
let currentFilter = { category:"all", subcategory:"all", sort:"featured", search:"" };
let quickViewId = null;

// Toasts
function showToast(msg, type=""){
  const wrap = document.getElementById("toasts");
  if(!wrap) return;
  const el = document.createElement("div");
  el.className = "toast " + (type==="ok"?"ok": type==="err"?"err":"");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transform="translateY(6px)"; el.style.transition=".3s"; }, 2600);
  setTimeout(()=> el.remove(), 3000);
}

// Header cart count init
document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount();
  renderCartDrawer();
  initHero();
  initProductsPage();
  initHomeProducts();
  initTopCats();
  initMap();
  initMobileNav();
  initBackToTop();
  // search inputs
  document.querySelectorAll("[data-search-input]").forEach(inp=>{
    inp.addEventListener("input", e=>{
      currentFilter.search = e.target.value.trim().toLowerCase();
      renderProducts();
    });
  });
});

function initMobileNav(){
  const btn = document.getElementById("hamburger");
  const drawer = document.getElementById("mobileNav");
  if(!btn||!drawer) return;
  btn.addEventListener("click", ()=> drawer.classList.add("open"));
  drawer.querySelector("[data-close-mobile]")?.addEventListener("click", ()=> drawer.classList.remove("open"));
  drawer.querySelector(".mobile-nav-backdrop")?.addEventListener("click", ()=> drawer.classList.remove("open"));
}

function initBackToTop(){
  const b = document.getElementById("backToTop");
  if(!b) return;
  window.addEventListener("scroll", ()=> b.classList.toggle("show", window.scrollY>400));
  b.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));
}

// Hero slider
let heroIndex=0, heroTimer=null;
function initHero(){
  const track = document.getElementById("heroTrack");
  const dotsWrap = document.getElementById("heroDots");
  if(!track || !HERO_SLIDES) return;
  track.innerHTML = HERO_SLIDES.map(s=>`
    <div class="hero-slide">
      <div class="hero-content">
        <div class="eyebrow">${s.eyebrow}</div>
        <h1 class="hero-title">${s.title}</h1>
        <p class="hero-desc">${s.desc}</p>
        <div class="hero-actions">
          <a href="${s.primaryLink}" class="btn btn-primary">${s.primaryText}</a>
          <a href="${s.secondaryLink}" class="btn btn-secondary">${s.secondaryText}</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-visual-inner">
          <img class="hero-img" src="${s.image}" alt="${s.title}" loading="lazy" onerror="this.style.display='none'">
          <div class="hero-placeholder"><div class="big">🛍️</div><p>Replace: ${s.image}</p></div>
        </div>
      </div>
    </div>
  `).join("");
  dotsWrap.innerHTML = HERO_SLIDES.map((_,i)=>`<button aria-label="Go to slide ${i+1}" data-dot="${i}" class="${i===0?'active':''}"></button>`).join("");
  dotsWrap.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click", ()=> goHero(parseInt(b.dataset.dot,10), true));
  });
  document.getElementById("heroPrev")?.addEventListener("click", ()=> goHero(heroIndex-1,true));
  document.getElementById("heroNext")?.addEventListener("click", ()=> goHero(heroIndex+1,true));
  track.addEventListener("mouseenter", stopHero);
  track.addEventListener("mouseleave", startHero);
  startHero();
  goHero(0,false);
}
function goHero(i, user){
  if(user) stopHero();
  const track = document.getElementById("heroTrack");
  if(!track) return;
  const n = HERO_SLIDES.length;
  heroIndex = (i+n)%n;
  track.style.transform = `translateX(-${heroIndex*100}%)`;
  document.querySelectorAll("#heroDots button").forEach((b,idx)=> b.classList.toggle("active", idx===heroIndex));
  if(user) startHero();
}
function startHero(){ stopHero(); heroTimer=setInterval(()=> goHero(heroIndex+1,false), 4200); }
function stopHero(){ if(heroTimer) clearInterval(heroTimer); heroTimer=null; }

function initTopCats(){
  const el = document.getElementById("topCats");
  if(!el) return;
  const cats = [
    {label:"Panjabi",icon:"👘",cat:"men",sub:"panjabi"},
    {label:"Shirt",icon:"👔",cat:"men",sub:"shirt"},
    {label:"T-Shirt",icon:"👕",cat:"men",sub:"t-shirt"},
    {label:"Polo",icon:"👕",cat:"men",sub:"polo-shirt"},
    {label:"Pant",icon:"👖",cat:"men",sub:"pant-trouser"},
    {label:"Women",icon:"👗",cat:"women",sub:"all"},
    {label:"Baby",icon:"👶",cat:"children",sub:"baby-clothing"},
    {label:"Hosiery",icon:"🧦",cat:"hosiery",sub:"all"},
  ];
  el.innerHTML = cats.map(c=>`
    <button class="top-cat" onclick="filterBy('${c.cat}','${c.sub}')">
      <div class="top-cat-icon">${c.icon}</div><b>${c.label}</b><span>দেখুন →</span>
    </button>
  `).join("");
}
function filterBy(cat, sub){
  currentFilter.category=cat; currentFilter.subcategory=sub;
  const url = `shop.html?cat=${cat}&sub=${sub}`;
  if(location.pathname.endsWith("shop.html")){ history.replaceState(null,"",url); applyFiltersFromURL(); renderProducts(); window.scrollTo({top: document.getElementById("products").offsetTop - 80, behavior:"smooth"}); }
  else location.href=url;
}

function applyFiltersFromURL(){
  const p = new URLSearchParams(location.search);
  currentFilter.category = p.get("cat") || "all";
  currentFilter.subcategory = p.get("sub") || "all";
  const q = p.get("q"); if(q) currentFilter.search=q;
  const sortSel = document.getElementById("sortSelect");
  if(sortSel && p.get("sort")) currentFilter.sort=p.get("sort");
  // sync UI
  document.querySelectorAll("[data-cat-chip]").forEach(ch=>{
    ch.classList.toggle("active", ch.dataset.catChip===currentFilter.category);
  });
  if(sortSel) sortSel.value=currentFilter.sort;
  const sInput = document.querySelector("[data-search-input]");
  if(sInput && currentFilter.search) sInput.value=currentFilter.search;
}

function initProductsPage(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  applyFiltersFromURL();
  // category chips
  document.querySelectorAll("[data-cat-chip]").forEach(ch=>{
    ch.addEventListener("click", ()=>{
      currentFilter.category=ch.dataset.catChip;
      currentFilter.subcategory="all";
      document.querySelectorAll("[data-cat-chip]").forEach(x=>x.classList.remove("active"));
      ch.classList.add("active");
      renderSubChips();
      renderProducts();
    });
  });
  document.getElementById("sortSelect")?.addEventListener("change", e=>{
    currentFilter.sort=e.target.value; renderProducts();
  });
  document.getElementById("clearFilters")?.addEventListener("click", ()=>{
    currentFilter={category:"all",subcategory:"all",sort:"featured",search:""};
    document.querySelectorAll("[data-cat-chip]").forEach(x=>x.classList.remove("active"));
    document.querySelector('[data-cat-chip="all"]')?.classList.add("active");
    const si=document.querySelector("[data-search-input]"); if(si) si.value="";
    document.getElementById("sortSelect").value="featured";
    renderSubChips(); renderProducts();
  });
  renderSubChips();
  renderProducts();
}

function initHomeProducts(){
  const grid = document.getElementById("homeProductGrid");
  if(!grid) return;
  const featured = PRODUCTS.filter(p=>p.featured).slice(0,8);
  grid.innerHTML = featured.map(cardHTML).join("");
}

function renderSubChips(){
  const wrap = document.getElementById("subChips");
  if(!wrap) return;
  let subs=[];
  if(currentFilter.category==="all") subs=[];
  else {
    const vals = [...new Set(PRODUCTS.filter(p=>p.category===currentFilter.category).map(p=>p.subcategory))];
    subs = vals;
  }
  if(subs.length===0){ wrap.innerHTML=""; return; }
  wrap.innerHTML = `<button class="chip ${currentFilter.subcategory==="all"?"active":""}" data-sub="all">সব</button>` + subs.map(s=>`<button class="chip ${currentFilter.subcategory===s?"active":""}" data-sub="${s}">${s}</button>`).join("");
  wrap.querySelectorAll("[data-sub]").forEach(b=>{
    b.addEventListener("click", ()=>{ currentFilter.subcategory=b.dataset.sub; renderSubChips(); renderProducts(); });
  });
}

function filteredProducts(){
  let list=[...PRODUCTS];
  if(currentFilter.category!=="all") list=list.filter(p=>p.category===currentFilter.category);
  if(currentFilter.subcategory!=="all") list=list.filter(p=>p.subcategory===currentFilter.subcategory);
  if(currentFilter.search){
    const q=currentFilter.search;
    list=list.filter(p=> (p.name+" "+p.nameEn+" "+p.category+" "+p.subcategory+" "+p.description).toLowerCase().includes(q));
  }
  if(currentFilter.sort==="price-asc") list.sort((a,b)=> getDisplayPrice(a)-getDisplayPrice(b));
  if(currentFilter.sort==="price-desc") list.sort((a,b)=> getDisplayPrice(b)-getDisplayPrice(a));
  if(currentFilter.sort==="newest") list.sort((a,b)=> b.id - a.id);
  if(currentFilter.sort==="featured") list.sort((a,b)=> (b.featured?1:0)-(a.featured?1:0));
  return list;
}

function renderProducts(){
  const grid = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if(!grid) return;
  const list = filteredProducts();
  if(countEl) countEl.textContent = `${list.length} টি পণ্য`;
  if(list.length===0){
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><p style="font-weight:700">কোন পণ্য পাওয়া যায়নি</p><p class="muted" style="font-size:13px">অন্য ক্যাটাগরি বা সার্চ চেষ্টা করুন</p></div>`;
    return;
  }
  grid.innerHTML = list.map(cardHTML).join("");
}

function cardHTML(p){
  const price=getDisplayPrice(p);
  const unit=getUnitLabel(p);
  return `<article class="pcard">
    <div class="pcard-media" onclick="openQuickView(${p.id})" style="cursor:pointer">
      ${p.discount?`<span class="badge">-${p.discount}%</span>`:""}
      ${p.badge?`<span class="badge green" style="left:auto;right:10px">${p.badge}</span>`:""}
      <span class="ph">${iconFor(p)}</span>
      <img src="${p.image}" alt="${p.name}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0" onload="this.style.opacity=1;this.previousElementSibling.style.display='none'" onerror="this.style.display='none'">
    </div>
    <div class="pcard-body">
      <div class="pcard-cat">${p.category} • ${p.subcategory}</div>
      <div class="pcard-title" onclick="openQuickView(${p.id})" style="cursor:pointer">${p.name}</div>
      <div class="stars">★★★★★ <span class="muted" style="font-size:11px">(4.8)</span></div>
      <div class="pcard-price"><span class="now">${CONFIG.CURRENCY}${price.toLocaleString('en-BD')}</span> ${p.oldPrice?`<span class="old">${CONFIG.CURRENCY}${p.oldPrice.toLocaleString('en-BD')}</span>`:""} <span class="unit">${unit}</span></div>
      <div class="pcard-meta"><span>স্টক: ${p.availableStock??p.stock}</span> • <span>${p.sizes.slice(0,3).join(", ")}</span></div>
      <div class="pcard-actions">
        <button class="btn btn-primary" onclick="addToCart(${p.id},1)">কার্টে যোগ করুন</button>
        <button class="btn-icon" aria-label="Quick view" onclick="openQuickView(${p.id})">👁️</button>
      </div>
    </div>
  </article>`;
}

// Quick view modal
function openQuickView(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  quickViewId=id;
  const price=getDisplayPrice(p);
  const unit=getUnitLabel(p);
  const modal=document.getElementById("quickModal");
  const body=document.getElementById("quickBody");
  if(!body||!modal) return;
  body.innerHTML = `
    <div class="modal-media"><span style="font-size:72px">${iconFor(p)}</span><img src="${p.image}" alt="${p.name}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0" onload="this.style.opacity=1" onerror="this.style.display='none'"></div>
    <div class="modal-body">
      <div class="pill">${p.category} • ${p.subcategory}</div>
      <h2 style="margin:10px 0 6px;font-size:20px">${p.name}</h2>
      <div class="stars">★★★★★ <span class="muted">(4.8 • 124 রিভিউ)</span></div>
      <div style="display:flex;align-items:baseline;gap:10px;margin:12px 0;flex-wrap:wrap">
        <span style="font-size:22px;font-weight:800">${CONFIG.CURRENCY}${price.toLocaleString('en-BD')}</span>
        ${p.oldPrice?`<span class="muted" style="text-decoration:line-through">${CONFIG.CURRENCY}${p.oldPrice.toLocaleString('en-BD')}</span><span class="pill">-${p.discount}%</span>`:""}
        <span class="unit" style="font-size:12px;background:#F1F5F9;padding:4px 8px;border-radius:999px">${unit}</span>
      </div>
      ${p.badge?`<div class="pill" style="margin-bottom:10px">${p.badge}</div>`:""}
      <p class="muted" style="font-size:14px">${p.description}</p>
      <div style="margin:14px 0">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px">সাইজ</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap" id="qvSizes">${p.sizes.map(s=>`<button class="chip" data-sz="${s}" onclick="pickSize(this)">${s}</button>`).join("")}</div>
      </div>
      <div style="margin:12px 0">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px">রঙ</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap" id="qvColors">${p.colors.map(c=>`<button class="chip" data-cl="${c}" onclick="pickColor(this)">${c}</button>`).join("")}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin:16px 0">
        <span style="font-weight:700;font-size:13px">পরিমাণ (${unit})</span>
        <span class="qty"><button onclick="qvQty(-1)">−</button><span id="qvQty">1</span><button onclick="qvQty(1)">+</button></span>
        <span class="muted" style="font-size:12px">স্টক: ${p.availableStock??p.stock}</span>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="flex:1" onclick="qvAdd()">কার্টে যোগ করুন</button>
        <a href="shop.html" class="btn btn-secondary">শপে যান</a>
      </div>
    </div>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  // pick first size/color
  body.querySelector("[data-sz]")?.classList.add("active");
  body.querySelector("[data-cl]")?.classList.add("active");
}
function pickSize(el){ el.parentElement.querySelectorAll(".chip").forEach(x=>x.classList.remove("active")); el.classList.add("active"); }
function pickColor(el){ el.parentElement.querySelectorAll(".chip").forEach(x=>x.classList.remove("active")); el.classList.add("active"); }
function qvQty(d){
  const el=document.getElementById("qvQty"); if(!el) return;
  let v=parseInt(el.textContent,10)+d; if(v<1) v=1;
  const p=PRODUCTS.find(x=>x.id===quickViewId); if(p) v=Math.min(v, p.availableStock??p.stock??99);
  el.textContent=v;
}
function qvAdd(){
  const qty=parseInt(document.getElementById("qvQty")?.textContent||"1",10);
  const size=document.querySelector("#qvSizes .active")?.dataset.sz || null;
  const color=document.querySelector("#qvColors .active")?.dataset.cl || null;
  addToCart(quickViewId, qty, {size,color});
  closeQuickView();
}
function closeQuickView(){
  document.getElementById("quickModal")?.classList.remove("open");
}
document.addEventListener("click", e=>{
  if(e.target.matches("[data-close-modal]") || e.target.classList.contains("modal-backdrop")) closeQuickView();
  if(e.target.matches("[data-close-drawer]") || e.target.classList.contains("drawer-backdrop")) closeCartDrawer();
});
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){ closeQuickView(); closeCartDrawer(); }
});

function openCartDrawer(){ document.getElementById("cartDrawer")?.classList.add("open"); renderCartDrawer(); }
function closeCartDrawer(){ document.getElementById("cartDrawer")?.classList.remove("open"); }

function initMap(){
  const frame=document.getElementById("gmapFrame");
  if(frame && CONFIG.MAPS_EMBED_SRC) frame.src = CONFIG.MAPS_EMBED_SRC;
}
