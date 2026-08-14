# নারায়ণগঞ্জ হোসিয়ারি, পাবনা — Narayanganj Hosiery, Pabna

Static retail e-commerce website — HTML5 + CSS3 + Vanilla JS only. GitHub Pages ready.

## Features
- Hero slider (autoplay, arrows, dots, pause on hover)
- Top Categories horizontal strip + 4 big category cards
- 24 demo products across Men / Women / Children / Hosiery
- Search, category/subcategory filter, sorting
- Product cards with প্রতি ডজন pricing, discounts, wholesale badge
- Quick view modal with size/color/qty
- Cart drawer with localStorage persistence, qty controls, subtotal/total
- Checkout: buyer info, Bangladesh division→district, payment (COD / bKash / Nagad), transaction ID validation
- Order submission to Google Apps Script Web App (with demo mode fallback)
- Success page, Google Maps embed, responsive, accessible

## Folder Structure
```
/
├── index.html | shop.html | checkout.html | about.html | contact.html
├── css/style.css | responsive.css | checkout.css
├── js/config.js | products.js | cart.js | app.js | checkout.js
├── assets/images/hero/ | assets/products/
├── google-apps-script/Code.gs
└── README.md
```

## Run Locally
Just open `index.html` in a browser. Or: `npx serve .` / VS Code Live Server.

## Add / Edit Products
Edit `js/products.js` — each product has `dozenPrice`, `unitType: "dozen"|"piece"`, `retailUnitLabel`, `availableStock`, etc. Replace `image` paths with files in `assets/products/`.

## Change Prices
Edit `dozenPrice` / `price` / `oldPrice` in `js/products.js`. Delivery charge in `js/config.js` → `DELIVERY_CHARGE`.

## Business Info
Edit `js/config.js` — phone, Facebook, address, Maps URL.

## bKash/Nagad Number
`js/config.js` → `BKASH_NUMBER` / `NAGAD_NUMBER` (currently 01711483621).

## Google Apps Script Order Endpoint
1. Create Google Sheet → Extensions → Apps Script
2. Paste `google-apps-script/Code.gs`
3. Deploy → New deployment → Web app → Execute as Me, Access: Anyone
4. Copy Web App URL → paste into `js/config.js` → `ORDER_API_URL`
5. Leave empty for demo mode (orders log to console, cart clears, success shows).

## Deploy to GitHub Pages
1. Push to GitHub repo
2. Settings → Pages → Source: `main` branch, `/ (root)` → Save
3. Use relative paths (already configured)

## Replace Product Images
Put JPG/WEBP files in `assets/products/` and update `image` in `js/products.js`. Hero slides: `assets/images/hero/slide-1.png` / `slide-2.png` / `slide-3.png` (configured in `js/config.js` → `HERO_SLIDES`). Actual files on disk are `.png` — use the exact extension (GitHub Pages is case-sensitive).

## Change Delivery Charge
`js/config.js` → `DELIVERY_CHARGE` and `FREE_DELIVERY_THRESHOLD`.

## Notes
- No login/signup — guest checkout only.
- Transaction ID required for bKash/Nagad, not for COD.
- Never collect PIN/OTP.
"# Narayanganj_Hosiery" 
