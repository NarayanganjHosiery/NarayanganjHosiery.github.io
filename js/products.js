/* products.js — Demo product database
   Replace prices/images/names with real data.
   unitType: "dozen" | "piece"  | retailUnitLabel controls cart label.
   dozenPrice = price per dozen; piecePrice = per piece (if unitType piece)
   Prices are in BDT (৳). All demo prices are placeholder — edit freely. */

const PRODUCTS = [
  {
    id: 1, name: "প্রিমিয়াম কটন পাঞ্জাবি", nameEn: "Premium Cotton Panjabi",
    category: "men", subcategory: "panjabi",
    dozenPrice: 4800, price: 4800, oldPrice: 5600, discount: 14,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 50,
    image: "assets/products/panjabi-1.jpg",
    description: "আরামদায়ক প্রিমিয়াম কটন পাঞ্জাবি — উৎসব ও দৈনন্দিন ব্যবহারের জন্য।",
    sizes: ["M","L","XL","XXL"], colors: ["সাদা","কালো","নেভি"], stock: 50, featured: true, badge: "Wholesale Available"
  },
  {
    id: 2, name: "ক্লাসিক ফরমাল শার্ট", nameEn: "Classic Formal Shirt",
    category: "men", subcategory: "shirt",
    dozenPrice: 4200, price: 4200, oldPrice: 5000, discount: 16,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 40,
    image: "assets/products/shirt-1.jpg",
    description: "অফিস ও অনুষ্ঠানের জন্য ক্লাসিক ফরমাল শার্ট।",
    sizes: ["M","L","XL"], colors: ["সাদা","আকাশী","ধূসর"], stock: 40, featured: true, badge: "Wholesale Available"
  },
  {
    id: 3, name: "কটন টি-শার্ট", nameEn: "Cotton T-Shirt",
    category: "men", subcategory: "t-shirt",
    dozenPrice: 3600, price: 3600, oldPrice: 4200, discount: 14,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 60,
    image: "assets/products/tshirt-1.jpg",
    description: "নরম কটন টি-শার্ট — দৈনন্দিন আরামের জন্য।",
    sizes: ["M","L","XL","XXL"], colors: ["কালো","সাদা","লাল","নেভি"], stock: 60, featured: true, badge: "Wholesale Available"
  },
  {
    id: 4, name: "পোলো শার্ট", nameEn: "Polo Shirt",
    category: "men", subcategory: "polo-shirt",
    dozenPrice: 4000, price: 4000, oldPrice: 4800, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 45,
    image: "assets/products/polo-1.jpg",
    description: "স্টাইলিশ পোলো শার্ট — ক্যাজুয়াল ও স্মার্ট লুক।",
    sizes: ["M","L","XL"], colors: ["নেভি","কালো","সবুজ"], stock: 45, featured: false, badge: "Wholesale Available"
  },
  {
    id: 5, name: "জিন্স প্যান্ট", nameEn: "Jeans Pant",
    category: "men", subcategory: "pant-trouser",
    dozenPrice: 6000, price: 6000, oldPrice: 7200, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 30,
    image: "assets/products/pant-1.jpg",
    description: "টেকসই ডেনিম জিন্স প্যান্ট।",
    sizes: ["30","32","34","36"], colors: ["নীল","কালো","ধূসর"], stock: 30, featured: true, badge: "Wholesale Available"
  },
  {
    id: 6, name: "সুতি লুঙ্গি", nameEn: "Cotton Lungi",
    category: "men", subcategory: "lungi",
    dozenPrice: 3000, price: 3000, oldPrice: 3600, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 80,
    image: "assets/products/lungi-1.jpg",
    description: "আরামদায়ক সুতি লুঙ্গি — ঘর ও বাইরের জন্য।",
    sizes: ["Free"], colors: ["চেক","নীল","সবুজ"], stock: 80, featured: false, badge: "Wholesale Available"
  },
  {
    id: 7, name: "পুরুষদের আন্ডারওয়্যার (৬ পিস সেট)", nameEn: "Men's Underwear 6pc",
    category: "men", subcategory: "underwear",
    dozenPrice: 1800, price: 1800, oldPrice: 2100, discount: 14,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 100,
    image: "assets/products/underwear-m-1.jpg",
    description: "নরম ও টেকসই পুরুষদের আন্ডারওয়্যার।",
    sizes: ["M","L","XL"], colors: ["সাদা","ধূসর","নেভি"], stock: 100, featured: false, badge: "Wholesale Available"
  },
  {
    id: 8, name: "থ্রি-পিস কটন", nameEn: "Three Piece Cotton",
    category: "women", subcategory: "three-piece",
    dozenPrice: 7200, price: 7200, oldPrice: 8500, discount: 15,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 35,
    image: "assets/products/threepc-1.jpg",
    description: "মার্জিত কটন থ্রি-পিস — প্রতিদিনের জন্য।",
    sizes: ["M","L","XL"], colors: ["লাল","নীল","সবুজ","কালো"], stock: 35, featured: true, badge: "Wholesale Available"
  },
  {
    id: 9, name: "সালোয়ার কামিজ", nameEn: "Salwar Kameez",
    category: "women", subcategory: "salwar-kameez",
    dozenPrice: 6500, price: 6500, oldPrice: 7500, discount: 13,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 30,
    image: "assets/products/salwar-1.jpg",
    description: "আরামদায়ক সালোয়ার কামিজ সেট।",
    sizes: ["M","L","XL"], colors: ["গোলাপি","বেগুনি","আকাশী"], stock: 30, featured: false, badge: "Wholesale Available"
  },
  {
    id: 10, name: "তাঁতের শাড়ি", nameEn: "Tant Saree",
    category: "women", subcategory: "saree",
    dozenPrice: 9600, price: 9600, oldPrice: 11500, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 20,
    image: "assets/products/saree-1.jpg",
    description: "ঐতিহ্যবাহী তাঁতের শাড়ি — উৎসবের জন্য।",
    sizes: ["Free"], colors: ["লাল","সবুজ","হলুদ"], stock: 20, featured: true, badge: "Wholesale Available"
  },
  {
    id: 11, name: "মহিলাদের টি-শার্ট", nameEn: "Women's T-Shirt",
    category: "women", subcategory: "womens-tshirt",
    dozenPrice: 3200, price: 3200, oldPrice: 3800, discount: 16,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 50,
    image: "assets/products/wtshirt-1.jpg",
    description: "ক্যাজুয়াল মহিলাদের টি-শার্ট।",
    sizes: ["S","M","L","XL"], colors: ["গোলাপি","সাদা","কালো"], stock: 50, featured: false, badge: "Wholesale Available"
  },
  {
    id: 12, name: "লেগিংস", nameEn: "Leggings",
    category: "women", subcategory: "leggings",
    dozenPrice: 2400, price: 2400, oldPrice: 3000, discount: 20,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 70,
    image: "assets/products/leggings-1.jpg",
    description: "স্ট্রেচেবল আরামদায়ক লেগিংস।",
    sizes: ["S","M","L","XL"], colors: ["কালো","নেভি","ধূসর"], stock: 70, featured: false, badge: "Wholesale Available"
  },
  {
    id: 13, name: "বেবি ড্রেস সেট", nameEn: "Baby Dress Set",
    category: "children", subcategory: "baby-clothing",
    dozenPrice: 3800, price: 3800, oldPrice: 4500, discount: 16,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 40,
    image: "assets/products/baby-1.jpg",
    description: "নরম কটন বেবি ড্রেস — নবজাতকের জন্য।",
    sizes: ["0-6M","6-12M","1-2Y"], colors: ["গোলাপি","নীল","হলুদ"], stock: 40, featured: true, badge: "Wholesale Available"
  },
  {
    id: 14, name: "কিডস টি-শার্ট", nameEn: "Kids T-Shirt",
    category: "children", subcategory: "kids-tshirt",
    dozenPrice: 2800, price: 2800, oldPrice: 3300, discount: 15,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 60,
    image: "assets/products/kidstshirt-1.jpg",
    description: "রঙিন কিডস টি-শার্ট — শিশুদের প্রিয়।",
    sizes: ["2Y","4Y","6Y","8Y"], colors: ["লাল","নীল","হলুদ","সবুজ"], stock: 60, featured: true, badge: "Wholesale Available"
  },
  {
    id: 15, name: "কিডস প্যান্ট", nameEn: "Kids Pant",
    category: "children", subcategory: "kids-pant",
    dozenPrice: 3200, price: 3200, oldPrice: 3800, discount: 16,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 45,
    image: "assets/products/kidspant-1.jpg",
    description: "টেকসই কিডস প্যান্ট।",
    sizes: ["2Y","4Y","6Y","8Y"], colors: ["নীল","কালো","ধূসর"], stock: 45, featured: false, badge: "Wholesale Available"
  },
  {
    id: 16, name: "কিডস শার্ট", nameEn: "Kids Shirt",
    category: "children", subcategory: "kids-shirt",
    dozenPrice: 3000, price: 3000, oldPrice: 3600, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 35,
    image: "assets/products/kidsshirt-1.jpg",
    description: "স্টাইলিশ কিডস শার্ট।",
    sizes: ["2Y","4Y","6Y","8Y"], colors: ["সাদা","আকাশী","নেভি"], stock: 35, featured: false, badge: "Wholesale Available"
  },
  {
    id: 17, name: "মোজা (১২ জোড়া)", nameEn: "Socks 12 Pairs",
    category: "hosiery", subcategory: "socks",
    dozenPrice: 1200, price: 1200, oldPrice: 1500, discount: 20,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 120,
    image: "assets/products/socks-1.jpg",
    description: "নরম কটন মোজা — ১২ জোড়া প্যাক।",
    sizes: ["Free","M","L"], colors: ["কালো","সাদা","ধূসর"], stock: 120, featured: true, badge: "Wholesale Available"
  },
  {
    id: 18, name: "হাত মোজা", nameEn: "Gloves",
    category: "hosiery", subcategory: "gloves",
    dozenPrice: 1400, price: 1400, oldPrice: 1700, discount: 18,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 80,
    image: "assets/products/gloves-1.jpg",
    description: "শীতের জন্য উষ্ণ হাত মোজা।",
    sizes: ["Free","M","L"], colors: ["কালো","ধূসর","নেভি"], stock: 80, featured: false, badge: "Wholesale Available"
  },
  {
    id: 19, name: "গেঞ্জি / ভেস্ট", nameEn: "Vest / Genji",
    category: "hosiery", subcategory: "innerwear",
    dozenPrice: 2000, price: 2000, oldPrice: 2400, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 90,
    image: "assets/products/vest-1.jpg",
    description: "সুতি গেঞ্জি — দৈনন্দিন ব্যবহারের জন্য।",
    sizes: ["M","L","XL"], colors: ["সাদা","ধূসর"], stock: 90, featured: false, badge: "Wholesale Available"
  },
  {
    id: 20, name: "মহিলাদের ইনারওয়্যার সেট", nameEn: "Women's Innerwear Set",
    category: "hosiery", subcategory: "undergarments",
    dozenPrice: 2600, price: 2600, oldPrice: 3200, discount: 19,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 60,
    image: "assets/products/innerwear-1.jpg",
    description: "আরামদায়ক মহিলাদের ইনারওয়্যার।",
    sizes: ["S","M","L","XL"], colors: ["গোলাপি","সাদা","কালো"], stock: 60, featured: false, badge: "Wholesale Available"
  },
  {
    id: 21, name: "টুপি / ক্যাপ", nameEn: "Cap",
    category: "hosiery", subcategory: "other-hosiery",
    dozenPrice: 1800, price: 1800, oldPrice: 2200, discount: 18,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 70,
    image: "assets/products/cap-1.jpg",
    description: "ক্যাজুয়াল ক্যাপ — সব বয়সের জন্য।",
    sizes: ["Free"], colors: ["কালো","নেভি","লাল"], stock: 70, featured: false, badge: "Wholesale Available"
  },
  {
    id: 22, name: "প্রিমিয়াম লুঙ্গি — প্রিমিয়াম চেক", nameEn: "Premium Check Lungi",
    category: "men", subcategory: "lungi",
    dozenPrice: 3600, price: 3600, oldPrice: 4200, discount: 14,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 55,
    image: "assets/products/lungi-2.jpg",
    description: "প্রিমিয়াম চেক ডিজাইন লুঙ্গি।",
    sizes: ["Free"], colors: ["চেক-নীল","চেক-সবুজ"], stock: 55, featured: true, badge: "Wholesale Available"
  },
  {
    id: 23, name: "বেবি মোজা (১২ জোড়া)", nameEn: "Baby Socks 12 Pairs",
    category: "children", subcategory: "childrens-hosiery",
    dozenPrice: 1000, price: 1000, oldPrice: 1300, discount: 23,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 100,
    image: "assets/products/babysocks-1.jpg",
    description: "নরম বেবি মোজা — ১২ জোড়া।",
    sizes: ["0-12M"], colors: ["গোলাপি","নীল","সাদা"], stock: 100, featured: false, badge: "Wholesale Available"
  },
  {
    id: 24, name: "মহিলাদের হোসিয়ারি মোজা", nameEn: "Women's Hosiery Socks",
    category: "women", subcategory: "womens-hosiery",
    dozenPrice: 1500, price: 1500, oldPrice: 1800, discount: 17,
    unitType: "dozen", retailUnitLabel: "প্রতি ডজন",
    minimumOrderQuantity: 1, availableStock: 75,
    image: "assets/products/whosiery-1.jpg",
    description: "মহিলাদের জন্য নরম হোসিয়ারি মোজা।",
    sizes: ["Free"], colors: ["কালো","ত্বক","সাদা"], stock: 75, featured: false, badge: "Wholesale Available"
  }
];

// Helper: effective display price (dozenPrice for dozen, price for piece)
function getDisplayPrice(p){ return p.dozenPrice ?? p.price; }
function getUnitLabel(p){ return p.retailUnitLabel || (p.unitType==="dozen" ? "প্রতি ডজন" : "প্রতি পিস"); }
