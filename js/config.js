/* Narayanganj Hosiery — Central Configuration
   Edit values here; no need to hunt through other files. */

const CONFIG = {
  // Paste your deployed Google Apps Script Web App URL here.
  // Leave empty to run in demo mode (orders show success locally without sending).
  ORDER_API_URL: "https://script.google.com/macros/s/AKfycbwxw0vCQUmtA1RkcQnYmHgPRFVstJWE89DIrNCWGjv9k3QefDpjchqfxYsWVgLrZJpQ/exec",

  // Delivery charge in BDT — change easily here
  DELIVERY_CHARGE: 80,
  FREE_DELIVERY_THRESHOLD: 5000,

  // Payment receive numbers
  BKASH_NUMBER: "01711483621",
  NAGAD_NUMBER: "01711483621",

  // Business contact
  PHONE_DISPLAY: "01711-483621",
  PHONE_TEL: "01711483621",
  FACEBOOK_URL: "https://www.facebook.com/md.belal.hossain.122481",
  MAPS_URL: "https://maps.app.goo.gl/VRsFene5daTmZyXH8",
  ADDRESS: "264Q+Q52, Pabna College Rd, Pabna 6600",
  BUSINESS_NAME_BN: "নারায়ণগঞ্জ হোসিয়ারি, পাবনা",
  BUSINESS_NAME_EN: "Narayanganj Hosiery, Pabna",
  OWNER: "Md Belal Hosstain",

  // Google Maps embed src
  MAPS_EMBED_SRC: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6311.760970521538!2d89.2353981!3d24.0068616!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fe9bc9e6b237df%3A0x84a379d0333e56b1!2z4Kao4Ka-4Kaw4Ka-4Kav4Ka84Kaj4KaX4Kae4KeN4KacIOCmueCni-CmuOCmv-Cmr-CmvOCmvuCmsOCmvywg4Kaq4Ka-4Kas4Kao4Ka-!5e1!3m2!1sen!2sbd!4v1786591432416!5m2!1sen!2sbd",

  // SEO
  SITE_URL: "https://yourusername.github.io/narayanganj-hosiery/",
  CURRENCY: "৳",
};

// Bangladesh divisions → districts
const BD_LOCATIONS = {
  "Dhaka": ["Dhaka","Gazipur","Narayanganj","Tangail","Kishoreganj","Manikganj","Munshiganj","Faridpur","Madaripur","Shariatpur","Rajbari","Gopalganj","Narsingdi"],
  "Chattogram": ["Chattogram","Cox's Bazar","Cumilla","Brahmanbaria","Chandpur","Feni","Noakhali","Lakshmipur","Rangamati","Khagrachhari","Bandarban"],
  "Rajshahi": ["Rajshahi","Pabna","Natore","Sirajganj","Bogra","Naogaon","Chapainawabganj","Joypurhat"],
  "Khulna": ["Khulna","Bagerhat","Satkhira","Jessore","Jhenaidah","Magura","Narail","Kushtia","Chuadanga","Meherpur"],
  "Barishal": ["Barishal","Bhola","Patuakhali","Pirojpur","Barguna","Jhalokati"],
  "Sylhet": ["Sylhet","Moulvibazar","Habiganj","Sunamganj"],
  "Rangpur": ["Rangpur","Dinajpur","Nilphamari","Gaibandha","Kurigram","Lalmonirhat","Panchagarh","Thakurgaon"],
  "Mymensingh": ["Mymensingh","Jamalpur","Netrokona","Sherpur"]
};

// Hero slides — replace image paths with real files in assets/images/hero/
const HERO_SLIDES = [
  {
    image: "assets/images/hero/slide-1.jpg",
    eyebrow: "নতুন কালেকশন ২০২৬",
    title: "নতুন পোশাকের সংগ্রহ",
    desc: "নারী, পুরুষ ও শিশুদের জন্য মানসম্মত পোশাক ও হোসিয়ারি — এক ছাদের নিচে।",
    primaryText: "এখনই কেনাকাটা করুন",
    primaryLink: "shop.html",
    secondaryText: "পণ্য দেখুন",
    secondaryLink: "#products"
  },
  {
    image: "assets/images/hero/slide-2.jpg",
    eyebrow: "খুচরা ও পাইকারি",
    title: "ভালো মান, ন্যায্য দাম",
    desc: "পাইকারি বিক্রয় উপলব্ধ — প্রতি ডজন সাশ্রয়ী মূল্যে।",
    primaryText: "পাইকারি দেখুন",
    primaryLink: "shop.html?filter=hosiery",
    secondaryText: "যোগাযোগ করুন",
    secondaryLink: "contact.html"
  },
  {
    image: "assets/images/hero/slide-3.jpg",
    eyebrow: "পাবনার বিশ্বস্ত দোকান",
    title: "পাবনার বিশ্বস্ত পোশাকের দোকান",
    desc: "Narayanganj Hosiery, Pabna — আন্তরিক সেবা, নির্ভরযোগ্য মান।",
    primaryText: "আমাদের সম্পর্কে",
    primaryLink: "about.html",
    secondaryText: "লোকেশন দেখুন",
    secondaryLink: "contact.html#map"
  }
];
