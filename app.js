/**
 * KisanLink (કિસાન લિંક) - Single Page Application Core Logic
 * Clean, secure, zero-dependency, bilingual (EN/GU) agricultural intelligence platform.
 * Hardened for security, accessibility (a11y), performance, and smooth glassmorphic UI.
 */

// Strict Mode Execution
"use strict";

// ==========================================================================
// 1. DATA LAYER: HARDCODED STATIC MOCK DATASETS
// ==========================================================================

const APP_DATA = Object.freeze({
  crops: [
    { id: "cotton", name_en: "Cotton (કપાસ)", name_gu: "કપાસ (Cotton)" },
    { id: "groundnut", name_en: "Groundnut (મગફળી)", name_gu: "મગફળી (Groundnut)" }
  ],
  districts: [
    { id: "rajkot", name_en: "Rajkot", name_gu: "રાજકોટ" },
    { id: "junagadh", name_en: "Junagadh", name_gu: "જૂનાગઢ" },
    { id: "bhavnagar", name_en: "Bhavnagar", name_gu: "ભાવનગર" },
    { id: "amreli", name_en: "Amreli", name_gu: "અમરેલી" },
    { id: "banaskantha", name_en: "Banaskantha", name_gu: "બનાસકાંઠા" }
  ],
  dates: {
    en: ["26 Aug", "27 Aug", "28 Aug", "29 Aug", "30 Aug", "31 Aug", "01 Sep"],
    gu: ["૨૬ ઓગ", "૨૭ ઓગ", "૨૮ ઓગ", "૨૯ ઓગ", "૩૦ ઓગ", "૩૧ ઓગ", "૦૧ સપ્ટે"]
  },
  // 7 Days x 2 Crops x 5 Districts Price Matrix (₹/Quintal)
  priceMatrix: {
    cotton: {
      rajkot:      [7280, 7310, 7350, 7320, 7390, 7420, 7480],
      junagadh:    [7220, 7250, 7290, 7310, 7360, 7380, 7440],
      bhavnagar:   [7180, 7200, 7240, 7260, 7300, 7330, 7370],
      amreli:      [7240, 7270, 7300, 7340, 7380, 7400, 7460],
      banaskantha: [7150, 7190, 7210, 7250, 7280, 7310, 7350]
    },
    groundnut: {
      rajkot:      [6120, 6160, 6190, 6240, 6280, 6310, 6360],
      junagadh:    [6180, 6210, 6250, 6290, 6340, 6370, 6420],
      bhavnagar:   [6080, 6110, 6150, 6180, 6220, 6260, 6310],
      amreli:      [6140, 6170, 6200, 6250, 6300, 6330, 6380],
      banaskantha: [5980, 6020, 6050, 6100, 6140, 6180, 6230]
    }
  },
  // Top 3 Mandis per District (with representative yard names & spreads)
  mandisByDistrict: {
    rajkot: [
      { name_en: "Gondal Market Yard", name_gu: "ગોંડલ માર્કેટ યાર્ડ", diff: 30, trend: "+₹30" },
      { name_en: "Rajkot Main APMC", name_gu: "રાજકોટ મુખ્ય APMC", diff: 0, trend: "+₹20" },
      { name_en: "Jetpur APMC Yard", name_gu: "જેતપુર APMC યાર્ડ", diff: -40, trend: "+₹15" }
    ],
    junagadh: [
      { name_en: "Junagadh APMC Yard", name_gu: "જૂનાગઢ APMC યાર્ડ", diff: 20, trend: "+₹40" },
      { name_en: "Keshod Market Yard", name_gu: "કેશોદ માર્કેટ યાર્ડ", diff: 0, trend: "+₹25" },
      { name_en: "Visavadar APMC", name_gu: "વિસાવદર APMC", diff: -30, trend: "+₹20" }
    ],
    bhavnagar: [
      { name_en: "Mahuva Market Yard", name_gu: "મહુવા માર્કેટ યાર્ડ", diff: 25, trend: "+₹35" },
      { name_en: "Bhavnagar APMC", name_gu: "ભાવનગર APMC", diff: 0, trend: "+₹30" },
      { name_en: "Talaja APMC Yard", name_gu: "તળાજા APMC યાર્ડ", diff: -40, trend: "+₹15" }
    ],
    amreli: [
      { name_en: "Amreli Main Yard", name_gu: "અમરેલી મુખ્ય યાર્ડ", diff: 20, trend: "+₹40" },
      { name_en: "Savarkundla APMC", name_gu: "સાવરકુંડલા APMC", diff: 0, trend: "+₹30" },
      { name_en: "Dhari Market Yard", name_gu: "ધારી માર્કેટ યાર્ડ", diff: -30, trend: "+₹20" }
    ],
    banaskantha: [
      { name_en: "Deesa Market Yard", name_gu: "ડીસા માર્કેટ યાર્ડ", diff: 30, trend: "+₹30" },
      { name_en: "Palanpur APMC", name_gu: "પાલનપુર APMC", diff: 0, trend: "+₹20" },
      { name_en: "Tharad APMC Yard", name_gu: "થરાદ APMC યાર્ડ", diff: -40, trend: "+₹15" }
    ]
  },
  // 6 Pre-written Static Reason Strings (English & Gujarati)
  advisoryReasons: {
    cotton: {
      sell: {
        en: "Current mandi arrivals are tightening and mill demand is at peak weekly levels (₹7,450/q).",
        gu: "હાલમાં મિલોની માંગ ઉચ્ચ સ્તરે છે અને કપાસના ભાવ શિખરે છે (₹૭,૪૫૦/ક્વિન્ટલ)."
      },
      hold: {
        en: "Export inquiry expected to rise next fortnight; prices projected to gain ₹150–₹200/quintal.",
        gu: "આગામી પખવાડિયામાં નિકાસ માંગ વધવાની ધારણા છે; ભાવ ₹૧૫૦-₹૨૦૦ વધવાની શક્યતા છે."
      },
      partial: {
        en: "Market volatility is high; liquidate 40-50% stock at current strong price to secure cashflow.",
        gu: "બજારમાં ઉતાર-ચઢાવ વધુ છે; જોખમ ઘટાડવા ૪૦-૫૦% જથ્થો હાલના સારા ભાવે વેચો."
      }
    },
    groundnut: {
      sell: {
        en: "Oil mill crushing demand is highest this week with peak procurement rates (₹6,350/q).",
        gu: "તેલ મિલોમાં પીલાણની માંગ વધુ છે અને હાલમાં સૌથી સારો ટેકાનો ભાવ મળી રહ્યો છે (₹૬,૩૫૦/ક્વિન્ટલ)."
      },
      hold: {
        en: "Arrival pressure in Saurashtra mandis easing soon; holding will yield better quality premiums.",
        gu: "સૌરાષ્ટ્રની માર્કેટિંગ યાર્ડમાં નવી આવક સ્થિર થતાં આગામી દિવસોમાં સારા પ્રીમિયમ મળશે."
      },
      partial: {
        en: "Secure production costs now with 50% lot sale, hold remaining for post-festival price bounce.",
        gu: "૫૦% માલ વેચી ઉત્પાદન ખર્ચ સુરક્ષિત કરો, બાકીનો જથ્થો તહેવાર પછીના સુધારા માટે રોકો."
      }
    }
  },
  // Static List of 5 Mock Buyers
  buyers: [
    {
      id: "buyer_1",
      name_en: "Gujarat Cotton Spinners Ltd.",
      name_gu: "ગુજરાત કોટન સ્પિનર્સ લી.",
      crop_id: "cotton",
      qty_en: "150 Quintals",
      qty_gu: "૧૫૦ ક્વિન્ટલ",
      price: 7480,
      trust: 5,
      location_en: "Rajkot Industrial Area",
      location_gu: "રાજકોટ ઔદ્યોગિક વિસ્તાર",
      badge_en: "Govt Certified Buyer",
      badge_gu: "સરકાર માન્ય ખરીદદાર"
    },
    {
      id: "buyer_2",
      name_en: "Saurashtra Agro Oil Industries",
      name_gu: "સૌરાષ્ટ્ર એગ્રો ઓઈલ ઇન્ડસ્ટ્રીઝ",
      crop_id: "groundnut",
      qty_en: "200 Quintals",
      qty_gu: "૨૦૦ ક્વિન્ટલ",
      price: 6420,
      trust: 5,
      location_en: "Junagadh By-pass",
      location_gu: "જૂનાગઢ બાયપાસ",
      badge_en: "Direct Exporter",
      badge_gu: "સીધા નિકાસકાર"
    },
    {
      id: "buyer_3",
      name_en: "Jay Sardar Ginning Mill",
      name_gu: "જય સરદાર જીનીંગ મીલ",
      crop_id: "cotton",
      qty_en: "80 Quintals",
      qty_gu: "૮૦ ક્વિન્ટલ",
      price: 7420,
      trust: 5,
      location_en: "Gondal Road, Rajkot",
      location_gu: "ગોંડલ રોડ, રાજકોટ",
      badge_en: "Instant 24h Payment",
      badge_gu: "૨૪ કલાકમાં પેમેન્ટ"
    },
    {
      id: "buyer_4",
      name_en: "Shree Radhe Krishna Oil Mill",
      name_gu: "શ્રી રાધે કૃષ્ણ ઓઈલ મીલ",
      crop_id: "groundnut",
      qty_en: "120 Quintals",
      qty_gu: "૧૨૦ ક્વિન્ટલ",
      price: 6380,
      trust: 4,
      location_en: "Amreli Road, Bhavnagar",
      location_gu: "અમરેલી રોડ, ભાવનગર",
      badge_en: "Verified FPO Partner",
      badge_gu: "વેરિફાઇડ FPO પાર્ટનર"
    },
    {
      id: "buyer_5",
      name_en: "Western India Commodities",
      name_gu: "વેસ્ટર્ન ઇન્ડિયા કોમોડિટીઝ",
      crop_id: "cotton",
      qty_en: "300 Quintals",
      qty_gu: "૩૦૦ ક્વિન્ટલ",
      price: 7450,
      trust: 5,
      location_en: "Deesa Highway, Banaskantha",
      location_gu: "ડીસા હાઇવે, બનાસકાંઠા",
      badge_en: "Bulk Procurement",
      badge_gu: "જથ્થાબંધ ખરીદદાર"
    }
  ]
});

// ==========================================================================
// 2. BILINGUAL DICTIONARY (ENGLISH & GUJARATI)
// ==========================================================================

const I18N = Object.freeze({
  en: {
    appName: "KisanLink",
    appTagline: "Gujarat Market Linkage Platform",
    langToggle: "ગુજરાતી",
    heroTitle: "Empowering Gujarat Farmers",
    heroSub: "Direct mandi price intelligence, AI advisory, and verified buyers without middleman cuts.",
    heroBadge: "IBM Bob & Granite AI",
    
    // Quick Nav Titles
    navHome: "Home",
    navPrices: "Prices",
    navAdvisor: "Advisor",
    navBuyers: "Buyers",
    navDashboard: "Dashboard",

    actionPricesTitle: "Check Today's Price",
    actionPricesSub: "Live Mandi & 7-Day Trend",
    actionAdvisorTitle: "Sell or Hold Advisory",
    actionAdvisorSub: "Granite AI Recommendation",
    actionBuyersTitle: "Direct Verified Buyers",
    actionBuyersSub: "5 Pre-Approved Mills",
    actionDashboardTitle: "Income Dashboard",
    actionDashboardSub: "Middleman vs KisanLink",

    // Market Snapshot
    snapshotTitle: "Today's Saurashtra Spot Prices",
    snapshotSub: "Updated 10 mins ago from APMC",

    // Prices Screen
    filterCropLabel: "Select Crop",
    filterDistrictLabel: "Select District",
    priceTrendTitle: "7-Day Price Trend",
    currentPriceLabel: "Current Modal Price",
    perQuintal: "₹ / Quintal",
    topMandisTitle: "Top 3 Nearby Mandis",
    topMandisSub: "Sorted by today's highest realized price",
    jumpToAdvisorBtn: "Check Sell/Hold Advisory for this crop",

    // Advisor Screen
    advisorFormTitle: "AI Sell-or-Hold Advisor",
    advisorFormSub: "Powered by IBM Granite LLM reasoning engine",
    qtyLabel: "Crop Quantity (in Quintals)",
    getAdviceBtn: "Analyze Market & Get Advice",
    analyzingText: "IBM Granite AI Reasoning...",
    recTitle: "Advisory Recommendation",
    recSell: "Sell Now",
    recHold: "Hold 1–2 Weeks",
    recPartial: "Sell Partially (50%)",
    confidenceBadge: "Granite AI High Confidence",
    findBuyersCTA: "View Matched Direct Buyers",
    viewDashboardCTA: "Calculate Net Profit Gained",
    invalidQtyError: "Please enter a valid harvest quantity between 1 and 10,000 Quintals.",

    // Buyers Screen
    buyersTitle: "Verified Direct Buyers",
    buyersSub: "Direct mill procurement with zero middleman brokerage",
    allCrops: "All Crops",
    cottonOnly: "Cotton",
    groundnutOnly: "Groundnut",
    qtyRequired: "Demand",
    offeredPrice: "Offer Price",
    contactBuyerBtn: "Contact Buyer",
    noBuyersFound: "No verified buyers found for this category.",

    // Dashboard Screen
    dashTitle: "Income Impact Comparison",
    dashSub: "Sample harvest sale: 50 Quintals direct comparison",
    middlemanLabel: "Via Middleman",
    kisanlinkLabel: "Via KisanLink",
    gainCallout: "Extra Income Gained",
    sampleSaleNote: "Based on 50 Quintals standard lot",
    breakdownTitle: "Financial Advantage Breakdown",
    savedCommission: "Middleman Commission Saved (4%)",
    weighingGain: "Fair Digital Weighing Protection",
    directPremium: "Direct Mill Premium",
    totalBenefit: "Total Extra Earnings in Hand",
    qtySliderLabel: "Adjust Quantity to Calculate Gain",
    calcGainSuffix: "Direct Farmer Gain"
  },
  gu: {
    appName: "કિસાન લિંક",
    appTagline: "ગુજરાત માર્કેટ લિંકેજ પ્લેટફોર્મ",
    langToggle: "English",
    heroTitle: "ગુજરાતના ખેડૂતો માટે સ્માર્ટ બજાર",
    heroSub: "દલાલ વગર સાચા માર્કેટ યાર્ડના ભાવ, AI વેચાણ સલાહ અને સીધા ખરીદદારો સાથે જોડાણ.",
    heroBadge: "IBM બોબ અને ગ્રેનાઇટ AI",
    
    // Quick Nav Titles
    navHome: "હોમ",
    navPrices: "ભાવ",
    navAdvisor: "સલાહકાર",
    navBuyers: "ખરીદદારો",
    navDashboard: "નફો/ડેશબોર્ડ",

    actionPricesTitle: "આજના બજાર ભાવ જુઓ",
    actionPricesSub: "યાર્ડ ભાવ અને ૭-દિવસનો ચાર્ટ",
    actionAdvisorTitle: "વેચવું કે રોકવું? (AI સલાહ)",
    actionAdvisorSub: "ગ્રેનાઇટ AI ની સચોટ ભલામણ",
    actionBuyersTitle: "સીધા વેરિફાઇડ ખરીદદારો",
    actionBuyersSub: "૫ પ્રમાણિત મિલો અને વેપારીઓ",
    actionDashboardTitle: "નફાનું સરવૈયું / ડેશબોર્ડ",
    actionDashboardSub: "દલાલ વિરુદ્ધ કિસાન લિંક",

    // Market Snapshot
    snapshotTitle: "આજના સૌરાષ્ટ્ર માર્કેટ યાર્ડ સ્પોટ ભાવ",
    snapshotSub: "APMC માંથી તાજા અપડેટ થયેલ ભાવ",

    // Prices Screen
    filterCropLabel: "પાક પસંદ કરો",
    filterDistrictLabel: "જિલ્લો પસંદ કરો",
    priceTrendTitle: "૭-દિવસનો ભાવ ટ્રેન્ડ ચાર્ટ",
    currentPriceLabel: "હાલનો સરેરાશ બજાર ભાવ",
    perQuintal: "₹ / ક્વિન્ટલ",
    topMandisTitle: "ટોપ ૩ નજીકના માર્કેટ યાર્ડ",
    topMandisSub: "આજના સૌથી વધુ ભાવ મુજબ ગોઠવેલ",
    jumpToAdvisorBtn: "આ પાક માટે વેચાણ સલાહ મેળવો",

    // Advisor Screen
    advisorFormTitle: "AI વેચાણ-રોકાણ સલાહકાર",
    advisorFormSub: "IBM ગ્રેનાઇટ LLM એનાલિટિક્સ આધારિત",
    qtyLabel: "પાકનો અંદાજિત જથ્થો (ક્વિન્ટલમાં)",
    getAdviceBtn: "બજાર ચકાસી સલાહ મેળવો",
    analyzingText: "IBM ગ્રેનાઇટ AI વિશ્લેષણ કરે છે...",
    recTitle: "AI સલાહકાર ભલામણ",
    recSell: "હમણાં વેચો (Sell Now)",
    recHold: "૧-૨ અઠવાડિયા રોકો (Hold)",
    recPartial: "અડધો પાક વેચો (૫૦%)",
    confidenceBadge: "ગ્રેનાઇટ AI સચોટ વિશ્લેષણ",
    findBuyersCTA: "યોગ્ય ખરીદદારોની યાદી જુઓ",
    viewDashboardCTA: "વધારાનો ચોખ્ખો નફો ગણો",
    invalidQtyError: "કૃપા કરીને ૧ થી ૧૦,૦૦૦ ક્વિન્ટલ વચ્ચે સાચો જથ્થો દાખલ કરો.",

    // Buyers Screen
    buyersTitle: "વેરિફાઇડ સીધા ખરીદદારો",
    buyersSub: "દલાલી કે કમિશન વગર સીધું મિલ સાથે જોડાણ",
    allCrops: "બધા પાક",
    cottonOnly: "કપાસ",
    groundnutOnly: "મગફળી",
    qtyRequired: "જરૂરિયાત",
    offeredPrice: "ઓફર ભાવ",
    contactBuyerBtn: "ખરીદદારનો સંપર્ક કરો",
    noBuyersFound: "આ કેટેગરી માટે કોઈ ખરીદદાર મળ્યા નથી.",

    // Dashboard Screen
    dashTitle: "નફાની સીધી સરખામણી",
    dashSub: "૫૦ ક્વિન્ટલના વેચાણ પર દલાલ વિરુદ્ધ કિસાન લિંક",
    middlemanLabel: "દલાલ / વચેટિયા દ્વારા",
    kisanlinkLabel: "કિસાન લિંક દ્વારા",
    gainCallout: "ખેડૂતનો સીધો વધારાનો નફો",
    sampleSaleNote: "૫૦ ક્વિન્ટલના પ્રમાણિત લોટ મુજબ ગણતરી",
    breakdownTitle: "નાણાકીય ફાયદાની વિગત",
    savedCommission: "બચેલી દલાલી અને કમિશન (૪%)",
    weighingGain: "ડિજિટલ કાંટાથી યોગ્ય વજન ફાયદો",
    directPremium: "મિલો દ્વારા સીધો ઊંચો ભાવ",
    totalBenefit: "ખેડૂતના હાથમાં મળતો ચોખ્ખો વધારાનો નફો",
    qtySliderLabel: "જથ્થો બદલીને નફો ગણો",
    calcGainSuffix: "ખેડૂતને સીધો ચોખ્ખો લાભ"
  }
});

// ==========================================================================
// 3. APPLICATION STATE & SECURITY UTILITIES
// ==========================================================================

const state = {
  lang: "en", // 'en' | 'gu'
  activeScreen: "home", // 'home' | 'prices' | 'advisor' | 'buyers' | 'dashboard'
  selectedCrop: "cotton",
  selectedDistrict: "rajkot",
  advisorQty: 50,
  buyerFilter: "all",
  dashboardQty: 50,
  isAnalyzing: false,
  contactCooldown: false
};

// XSS Prevention: Safe HTML Character Escaper
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Performance: Debounce Utility for Inputs and Sliders
function debounce(fn, delay = 120) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Input Validation Helper
function validateQuantity(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || !Number.isFinite(parsed) || parsed < 1 || parsed > 10000) {
    return { valid: false, value: 50 };
  }
  return { valid: true, value: parsed };
}

// ==========================================================================
// 4. CORE RENDER & INTERACTION FUNCTIONS
// ==========================================================================

// Initialize Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  try {
    initDropdowns();
    bindEvents();
    switchScreen("home");
    updateLanguageUI();
    renderHomeSnapshot();
    renderPriceScreen();
    renderAdvisorScreen();
    renderBuyersScreen();
    renderDashboardScreen();
  } catch (err) {
    showToast("Application initialized in safe mode.");
  }
});

// Initialize form dropdowns with crops & districts
function initDropdowns() {
  const cropSelects = [document.getElementById("price-crop-select"), document.getElementById("advisor-crop-select")];
  const distSelects = [document.getElementById("price-district-select"), document.getElementById("advisor-district-select")];

  cropSelects.forEach(select => {
    if (!select) return;
    select.innerHTML = APP_DATA.crops.map(crop => 
      `<option value="${escapeHtml(crop.id)}">${escapeHtml(state.lang === 'gu' ? crop.name_gu : crop.name_en)}</option>`
    ).join("");
    select.value = state.selectedCrop;
  });

  distSelects.forEach(select => {
    if (!select) return;
    select.innerHTML = APP_DATA.districts.map(dist => 
      `<option value="${escapeHtml(dist.id)}">${escapeHtml(state.lang === 'gu' ? dist.name_gu : dist.name_en)}</option>`
    ).join("");
    select.value = state.selectedDistrict;
  });
}

// Bind all UI interaction events
function bindEvents() {
  // Language Toggle Button
  const langBtn = document.getElementById("lang-toggle-btn");
  if (langBtn) {
    langBtn.addEventListener("click", toggleLanguage);
  }

  // Bottom Navigation Buttons (with ARIA tablist support)
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetScreen = btn.dataset.screen;
      if (targetScreen) {
        switchScreen(targetScreen);
      }
    });
  });

  // Home Quick Action Cards (Click and Keyboard Enter/Space)
  document.querySelectorAll(".home-action-card").forEach(card => {
    const triggerAction = () => {
      const target = card.dataset.target;
      if (target) {
        switchScreen(target);
      }
    };
    card.addEventListener("click", triggerAction);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerAction();
      }
    });
  });

  // Price Screen Dropdowns
  const priceCrop = document.getElementById("price-crop-select");
  const priceDist = document.getElementById("price-district-select");

  if (priceCrop) {
    priceCrop.addEventListener("change", (e) => {
      state.selectedCrop = e.target.value;
      const advCrop = document.getElementById("advisor-crop-select");
      if (advCrop) advCrop.value = state.selectedCrop;
      renderPriceScreen();
    });
  }

  if (priceDist) {
    priceDist.addEventListener("change", (e) => {
      state.selectedDistrict = e.target.value;
      const advDist = document.getElementById("advisor-district-select");
      if (advDist) advDist.value = state.selectedDistrict;
      renderPriceScreen();
    });
  }

  // Jump from Prices to Advisor
  const jumpAdvisorBtn = document.getElementById("jump-to-advisor-btn");
  if (jumpAdvisorBtn) {
    jumpAdvisorBtn.addEventListener("click", () => {
      switchScreen("advisor");
    });
  }

  // Advisor Screen Controls with Validation
  const advisorCrop = document.getElementById("advisor-crop-select");
  const advisorDist = document.getElementById("advisor-district-select");
  const advisorQtyInput = document.getElementById("advisor-qty-input");
  const getAdviceBtn = document.getElementById("get-advice-btn");
  const qtyErrorEl = document.getElementById("advisor-qty-error");

  if (advisorCrop) {
    advisorCrop.addEventListener("change", (e) => {
      state.selectedCrop = e.target.value;
      if (priceCrop) priceCrop.value = state.selectedCrop;
      renderAdvisorScreen();
    });
  }

  if (advisorDist) {
    advisorDist.addEventListener("change", (e) => {
      state.selectedDistrict = e.target.value;
      if (priceDist) priceDist.value = state.selectedDistrict;
      renderAdvisorScreen();
    });
  }

  if (advisorQtyInput) {
    advisorQtyInput.addEventListener("input", debounce((e) => {
      const { valid, value } = validateQuantity(e.target.value);
      if (!valid) {
        if (qtyErrorEl) {
          qtyErrorEl.style.display = "block";
          qtyErrorEl.textContent = I18N[state.lang].invalidQtyError;
        }
        advisorQtyInput.classList.add("kl-input-error");
      } else {
        if (qtyErrorEl) {
          qtyErrorEl.style.display = "none";
          qtyErrorEl.textContent = "";
        }
        advisorQtyInput.classList.remove("kl-input-error");
        state.advisorQty = value;
      }
    }, 150));
  }

  if (getAdviceBtn) {
    getAdviceBtn.addEventListener("click", triggerAdvisorAnalysis);
  }

  // Advisor CTAs
  const advFindBuyersBtn = document.getElementById("adv-find-buyers-btn");
  if (advFindBuyersBtn) {
    advFindBuyersBtn.addEventListener("click", () => {
      state.buyerFilter = state.selectedCrop;
      document.querySelectorAll(".buyer-tab-btn").forEach(btn => {
        const isMatch = btn.dataset.filter === state.selectedCrop;
        btn.classList.toggle("active", isMatch);
        btn.setAttribute("aria-selected", isMatch ? "true" : "false");
      });
      renderBuyersScreen();
      switchScreen("buyers");
    });
  }

  const advViewDashBtn = document.getElementById("adv-view-dash-btn");
  if (advViewDashBtn) {
    advViewDashBtn.addEventListener("click", () => {
      state.dashboardQty = state.advisorQty || 50;
      renderDashboardScreen();
      switchScreen("dashboard");
    });
  }

  // Buyers Screen Filter Tabs
  document.querySelectorAll(".buyer-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".buyer-tab-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      state.buyerFilter = btn.dataset.filter;
      renderBuyersScreen();
    });
  });

  // Dashboard Slider with Debouncing
  const dashSlider = document.getElementById("dash-qty-slider");
  if (dashSlider) {
    dashSlider.addEventListener("input", debounce((e) => {
      const val = parseInt(e.target.value, 10);
      state.dashboardQty = Number.isFinite(val) ? val : 50;
      renderDashboardScreen();
    }, 50));
  }
}

// Switch Active Screen with Accessible ARIA States
function switchScreen(screenName) {
  state.activeScreen = screenName;
  
  // Update Screens Visibility
  document.querySelectorAll(".kl-screen").forEach(screen => {
    screen.classList.remove("active");
  });
  const activeEl = document.getElementById(`screen-${screenName}`);
  if (activeEl) {
    activeEl.classList.add("active");
  }

  // Update Bottom Nav active and aria states
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    const isActive = btn.dataset.screen === screenName;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  // Smooth Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Render specific screen content dynamically
  if (screenName === "prices") renderPriceScreen();
  if (screenName === "advisor") renderAdvisorScreen();
  if (screenName === "buyers") renderBuyersScreen();
  if (screenName === "dashboard") renderDashboardScreen();
}

// Language Switch Handler
function toggleLanguage() {
  state.lang = state.lang === "en" ? "gu" : "en";
  initDropdowns();
  updateLanguageUI();
  renderPriceScreen();
  renderAdvisorScreen();
  renderBuyersScreen();
  renderDashboardScreen();
  renderHomeSnapshot();
  showToast(state.lang === "gu" ? "ભાષા બદલાઈ: ગુજરાતી" : "Language switched: English");
}

// Update all static i18n text labels in DOM
function updateLanguageUI() {
  const t = I18N[state.lang];

  // Header
  const appTitle = document.getElementById("app-title");
  const appTagline = document.getElementById("app-tagline");
  const langToggleText = document.getElementById("lang-toggle-text");

  if (appTitle) appTitle.textContent = t.appName;
  if (appTagline) appTagline.textContent = t.appTagline;
  if (langToggleText) langToggleText.textContent = t.langToggle;

  // Bottom Nav Labels
  const labels = {
    "nav-label-home": t.navHome,
    "nav-label-prices": t.navPrices,
    "nav-label-advisor": t.navAdvisor,
    "nav-label-buyers": t.navBuyers,
    "nav-label-dashboard": t.navDashboard,
    "hero-badge": t.heroBadge,
    "hero-title": t.heroTitle,
    "hero-sub": t.heroSub,
    "action-prices-title": t.actionPricesTitle,
    "action-prices-sub": t.actionPricesSub,
    "action-advisor-title": t.actionAdvisorTitle,
    "action-advisor-sub": t.actionAdvisorSub,
    "action-buyers-title": t.actionBuyersTitle,
    "action-buyers-sub": t.actionBuyersSub,
    "action-dash-title": t.actionDashboardTitle,
    "action-dash-sub": t.actionDashboardSub,
    "snapshot-title": t.snapshotTitle,
    "snapshot-sub": t.snapshotSub,
    "lbl-filter-crop": t.filterCropLabel,
    "lbl-filter-dist": t.filterDistrictLabel,
    "lbl-price-trend-title": t.priceTrendTitle,
    "lbl-current-price-tag": t.currentPriceLabel,
    "lbl-price-unit": t.perQuintal,
    "lbl-top-mandis-title": t.topMandisTitle,
    "lbl-top-mandis-sub": t.topMandisSub,
    "lbl-adv-title": t.advisorFormTitle,
    "lbl-adv-sub": t.advisorFormSub,
    "lbl-adv-crop": t.filterCropLabel,
    "lbl-adv-dist": t.filterDistrictLabel,
    "lbl-adv-qty": t.qtyLabel,
    "get-advice-btn-text": t.getAdviceBtn,
    "adv-conf-badge": t.confidenceBadge,
    "adv-rec-title": t.recTitle,
    "lbl-buyers-title": t.buyersTitle,
    "lbl-buyers-sub": t.buyersSub,
    "tab-filter-all": t.allCrops,
    "tab-filter-cotton": t.cottonOnly,
    "tab-filter-groundnut": t.groundnutOnly,
    "lbl-dash-title": t.dashTitle,
    "lbl-dash-sub": t.dashSub,
    "lbl-dash-gain-callout": t.gainCallout,
    "lbl-dash-middleman": t.middlemanLabel,
    "lbl-dash-kisanlink": t.kisanlinkLabel,
    "lbl-dash-sample-note": t.sampleSaleNote,
    "lbl-dash-breakdown-title": t.breakdownTitle,
    "lbl-dash-saved-comm": t.savedCommission,
    "lbl-dash-weigh-gain": t.weighingGain,
    "lbl-dash-mill-prem": t.directPremium,
    "lbl-dash-total-benefit": t.totalBenefit,
    "lbl-slider-label": t.qtySliderLabel
  };

  for (const [id, text] of Object.entries(labels)) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
}

// Render Snapshot on Home Screen
function renderHomeSnapshot() {
  const container = document.getElementById("home-snapshot-list");
  if (!container) return;

  const cottonPrice = APP_DATA.priceMatrix.cotton.rajkot[6];
  const groundnutPrice = APP_DATA.priceMatrix.groundnut.junagadh[6];

  container.innerHTML = `
    <li class="kl-list-item">
      <div class="kl-list-item-left">
        <div class="kl-list-item-avatar" aria-hidden="true">🌿</div>
        <div class="kl-list-item-text">
          <span class="kl-list-item-title">${escapeHtml(state.lang === 'gu' ? 'કપાસ (Cotton) - રાજકોટ યાર્ડ' : 'Cotton - Rajkot Mandi')}</span>
          <span class="kl-list-item-sub">2,400 Qtl arrivals today</span>
        </div>
      </div>
      <div class="kl-list-item-right">
        <span class="kl-list-item-price">₹${cottonPrice.toLocaleString()}</span>
        <span class="kl-list-item-trend trend-up">▲ +₹60/q</span>
      </div>
    </li>
    <li class="kl-list-item">
      <div class="kl-list-item-left">
        <div class="kl-list-item-avatar" style="background: var(--wheat-100); color: var(--wheat-800);" aria-hidden="true">🥜</div>
        <div class="kl-list-item-text">
          <span class="kl-list-item-title">${escapeHtml(state.lang === 'gu' ? 'મગફળી (Groundnut) - જૂનાગઢ APMC' : 'Groundnut - Junagadh APMC')}</span>
          <span class="kl-list-item-sub">1,850 Qtl arrivals today</span>
        </div>
      </div>
      <div class="kl-list-item-right">
        <span class="kl-list-item-price">₹${groundnutPrice.toLocaleString()}</span>
        <span class="kl-list-item-trend trend-up">▲ +₹50/q</span>
      </div>
    </li>
  `;
}

// Render Prices Screen (Price, SVG Chart, Top 3 Mandis)
function renderPriceScreen() {
  const crop = state.selectedCrop;
  const dist = state.selectedDistrict;
  const series = APP_DATA.priceMatrix[crop][dist];
  const currentPrice = series[series.length - 1];
  const prevPrice = series[series.length - 2];
  const diff = currentPrice - prevPrice;

  // 1. Current Price Value & Trend
  const priceValEl = document.getElementById("price-current-value");
  const priceTrendBadge = document.getElementById("price-current-trend-badge");
  
  if (priceValEl) {
    priceValEl.textContent = `₹${currentPrice.toLocaleString()}`;
  }
  
  if (priceTrendBadge) {
    const isUp = diff >= 0;
    priceTrendBadge.className = `kl-card-badge ${isUp ? 'kl-badge--green' : 'kl-badge--wheat'}`;
    priceTrendBadge.textContent = isUp ? `▲ +₹${diff} today` : `▼ -₹${Math.abs(diff)} today`;
  }

  // 2. Render SVG 7-Day Line Chart
  renderSVGChart(series);

  // 3. Render Top 3 Mandis
  const mandisContainer = document.getElementById("top-mandis-list");
  if (mandisContainer) {
    const mandis = APP_DATA.mandisByDistrict[dist] || APP_DATA.mandisByDistrict.rajkot;
    
    mandisContainer.innerHTML = mandis.map((m, idx) => {
      const mandiPrice = currentPrice + m.diff;
      return `
        <li class="kl-list-item">
          <div class="kl-list-item-left">
            <div class="kl-list-item-avatar ${idx === 0 ? '' : 'icon-wheat'}">#${idx + 1}</div>
            <div class="kl-list-item-text">
              <span class="kl-list-item-title">${escapeHtml(state.lang === 'gu' ? m.name_gu : m.name_en)}</span>
              <span class="kl-list-item-sub">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                ${escapeHtml(state.lang === 'gu' ? 'સરકારી યાર્ડ' : 'APMC Regulated')}
              </span>
            </div>
          </div>
          <div class="kl-list-item-right">
            <span class="kl-list-item-price">₹${mandiPrice.toLocaleString()}</span>
            <span class="kl-list-item-trend trend-up">${escapeHtml(m.trend)}</span>
          </div>
        </li>
      `;
    }).join("");
  }
}

// Generate crystal-clear, zero-dependency Responsive SVG Line Chart
function renderSVGChart(data) {
  const chartBox = document.getElementById("price-svg-chart-container");
  if (!chartBox) return;

  const width = 380;
  const height = 150;
  const paddingX = 32;
  const paddingTop = 24;
  const paddingBottom = 28;

  const minVal = Math.min(...data) - 40;
  const maxVal = Math.max(...data) + 40;
  const range = Math.max(maxVal - minVal, 1);

  const dates = APP_DATA.dates[state.lang];

  // Calculate coordinates safely
  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingBottom - ((val - minVal) / range) * (height - paddingTop - paddingBottom);
    return { x, y, val, date: dates[idx] };
  });

  // Construct SVG Path
  const linePath = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, "");
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - paddingBottom} L ${points[0].x},${height - paddingBottom} Z`;

  const svgContent = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="7-Day Mandi Price Trend Chart">
      <defs>
        <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2d6a4f" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="#52b788" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#52b788" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Horizontal Grid Lines -->
      <line class="chart-grid-line" x1="${paddingX}" y1="${paddingTop}" x2="${width - paddingX}" y2="${paddingTop}"/>
      <line class="chart-grid-line" x1="${paddingX}" y1="${(paddingTop + (height - paddingBottom)) / 2}" x2="${width - paddingX}" y2="${(paddingTop + (height - paddingBottom)) / 2}"/>
      <line class="chart-grid-line" x1="${paddingX}" y1="${height - paddingBottom}" x2="${width - paddingX}" y2="${height - paddingBottom}"/>

      <!-- Area and Line -->
      <path class="chart-area" d="${areaPath}"/>
      <path class="chart-line" d="${linePath}"/>

      <!-- Points, Labels and Values -->
      ${points.map((pt, i) => `
        <circle class="chart-point ${i === points.length - 1 ? 'chart-point-active' : ''}" cx="${pt.x}" cy="${pt.y}" role="presentation"/>
        ${(i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1) ? `
          <text class="chart-val-label" x="${pt.x}" y="${pt.y - 8}">₹${pt.val}</text>
        ` : ''}
        <text class="chart-label" x="${pt.x}" y="${height - 8}">${escapeHtml(pt.date)}</text>
      `).join("")}
    </svg>
  `;

  chartBox.innerHTML = svgContent;
}

// Render Advisor Screen & Recommendation
function renderAdvisorScreen() {
  const crop = state.selectedCrop;
  const t = I18N[state.lang];

  let recType = "sell";
  if (crop === "groundnut") {
    recType = "hold";
  }

  const recCard = document.getElementById("advisor-recommendation-card");
  const recBadge = document.getElementById("adv-rec-badge");
  const recActionText = document.getElementById("adv-rec-action-text");
  const recReasonBox = document.getElementById("adv-rec-reason-box");

  if (!recCard) return;

  // Clear previous style classes
  recCard.classList.remove("advisor-rec--sell", "advisor-rec--hold", "advisor-rec--partial");

  if (recType === "sell") {
    recCard.classList.add("advisor-rec--sell");
    recBadge.className = "kl-card-badge kl-badge--green";
    recBadge.textContent = "RECOMMENDED ACTION";
    recActionText.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ${escapeHtml(t.recSell)}
    `;
  } else if (recType === "hold") {
    recCard.classList.add("advisor-rec--hold");
    recBadge.className = "kl-card-badge kl-badge--wheat";
    recBadge.textContent = "RECOMMENDED ACTION";
    recActionText.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${escapeHtml(t.recHold)}
    `;
  } else {
    recCard.classList.add("advisor-rec--partial");
    recBadge.className = "kl-card-badge kl-badge--blue";
    recBadge.textContent = "RECOMMENDED ACTION";
    recActionText.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      ${escapeHtml(t.recPartial)}
    `;
  }

  // Pre-written static reason string per crop & action
  const reason = APP_DATA.advisoryReasons[crop][recType][state.lang];
  recReasonBox.textContent = `💡 ${reason}`;
}

// Trigger simulated AI reasoning loading state (with anti-spam rate limiting)
function triggerAdvisorAnalysis() {
  if (state.isAnalyzing) return;
  state.isAnalyzing = true;

  const btn = document.getElementById("get-advice-btn");
  const btnText = document.getElementById("get-advice-btn-text");
  const recCard = document.getElementById("advisor-recommendation-card");
  const t = I18N[state.lang];

  if (!btn || !btnText) {
    state.isAnalyzing = false;
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> <span>${escapeHtml(t.analyzingText)}</span>`;
  if (recCard) recCard.style.opacity = "0.4";

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
      <span id="get-advice-btn-text">${escapeHtml(t.getAdviceBtn)}</span>
    `;
    if (recCard) {
      recCard.style.opacity = "1";
    }
    renderAdvisorScreen();
    showToast(state.lang === "gu" ? "✅ AI સલાહ સફળતાપૂર્વક અપડેટ થઈ!" : "✅ AI Analysis Complete! Recommendation updated.");
    state.isAnalyzing = false;
  }, 450);
}

// Render Buyers Screen (Filterable 5 Static Verified Buyers with Empty State Support)
function renderBuyersScreen() {
  const listContainer = document.getElementById("buyers-list");
  if (!listContainer) return;

  const filter = state.buyerFilter;
  const filtered = APP_DATA.buyers.filter(b => {
    if (filter === "all") return true;
    return b.crop_id === filter;
  });

  const t = I18N[state.lang];

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="kl-card kl-empty-state">
        <div style="font-size: 2rem; margin-bottom: 8px;">🌾</div>
        <div style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${escapeHtml(t.noBuyersFound)}</div>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map(b => {
    const isCotton = b.crop_id === "cotton";
    return `
      <div class="kl-card kl-card--highlight">
        <div class="kl-card-header">
          <div class="kl-card-title-group">
            <div class="kl-card-icon ${isCotton ? '' : 'kl-card-icon--wheat'}" aria-hidden="true">
              ${isCotton ? '🌿' : '🥜'}
            </div>
            <div>
              <div class="kl-card-title">${escapeHtml(state.lang === 'gu' ? b.name_gu : b.name_en)}</div>
              <div class="kl-card-subtitle">${escapeHtml(state.lang === 'gu' ? b.location_gu : b.location_en)}</div>
            </div>
          </div>
          <span class="kl-card-badge kl-badge--green">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${escapeHtml(state.lang === 'gu' ? b.badge_gu : b.badge_en)}
          </span>
        </div>

        <div class="kl-card-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0;">
            <div style="background: rgba(255, 255, 255, 0.7); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.04);">
              <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">${escapeHtml(t.qtyRequired)}</span>
              <div style="font-weight: 800; font-size: 1rem;">${escapeHtml(state.lang === 'gu' ? b.qty_gu : b.qty_en)}</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.7); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.04);">
              <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">${escapeHtml(t.offeredPrice)}</span>
              <div style="font-weight: 900; font-size: 1.15rem; color: var(--green-800);">₹${b.price.toLocaleString()}/q</div>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);">
              Trust Rating:
            </span>
            <div class="trust-stars" aria-label="Rating ${b.trust} out of 5 stars">
              ${'★'.repeat(b.trust)}${'☆'.repeat(5 - b.trust)} <strong style="color: var(--text-main); font-size: 0.82rem; margin-left: 4px;">${b.trust}.0</strong>
            </div>
          </div>
        </div>

        <div class="kl-card-footer">
          <button class="kl-btn kl-btn--primary" onclick="contactBuyer('${escapeHtml(b.id)}')" type="button" aria-label="Contact buyer ${escapeHtml(state.lang === 'gu' ? b.name_gu : b.name_en)}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${escapeHtml(t.contactBuyerBtn)}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Contact Buyer Action - Shows Confirmation Toast (with Rate Limiting)
window.contactBuyer = function(buyerId) {
  if (state.contactCooldown) return;
  state.contactCooldown = true;

  const buyer = APP_DATA.buyers.find(b => b.id === buyerId);
  const name = buyer ? (state.lang === 'gu' ? buyer.name_gu : buyer.name_en) : "Buyer";
  const msg = state.lang === "gu"
    ? `✅ સંપર્ક જોડાઈ ગયો! ${escapeHtml(name)} ના અધિકારી ૨ કલાકમાં તમને ફોન કરશે.`
    : `✅ Contact initiated with ${escapeHtml(name)}! Buyer will call within 2 hours. SMS sent.`;
  showToast(msg);

  setTimeout(() => {
    state.contactCooldown = false;
  }, 600);
};

// Render Dashboard Screen (Large ₹ Gain Visual & Comparison Bars)
function renderDashboardScreen() {
  const qty = state.dashboardQty || 50;

  // Pricing constants for sample sale
  const middlemanBasePrice = 6700;
  const middlemanCutPerQtl = 150; // 4% brokerage + discount
  const middlemanNetPerQtl = middlemanBasePrice - middlemanCutPerQtl; // ₹6,550
  const middlemanTotal = qty * middlemanNetPerQtl;

  const kisanlinkPricePerQtl = 7450; // Direct mill procurement
  const kisanlinkTotal = qty * kisanlinkPricePerQtl;

  const netGain = kisanlinkTotal - middlemanTotal;
  const pctGain = ((netGain / middlemanTotal) * 100).toFixed(1);

  // Breakdown values
  const savedBrokerage = qty * 150;
  const directPriceDiff = qty * (kisanlinkPricePerQtl - middlemanBasePrice);
  const totalExtraEarnings = netGain;

  // DOM Elements
  const totalGainEl = document.getElementById("dash-gain-number");
  const pctGainEl = document.getElementById("dash-gain-pct");
  const middlemanValEl = document.getElementById("dash-middleman-val");
  const kisanlinkValEl = document.getElementById("dash-kisanlink-val");
  const middlemanBar = document.getElementById("dash-middleman-bar");
  const kisanlinkBar = document.getElementById("dash-kisanlink-bar");
  const sliderQtyLabel = document.getElementById("dash-slider-qty-val");
  const slider = document.getElementById("dash-qty-slider");

  // Breakdown metrics
  const savedCommEl = document.getElementById("dash-saved-comm-val");
  const directDiffEl = document.getElementById("dash-direct-diff-val");
  const totalBenefitEl = document.getElementById("dash-total-benefit-val");

  if (totalGainEl) totalGainEl.textContent = `+₹${netGain.toLocaleString()}`;
  if (pctGainEl) pctGainEl.textContent = `(+${pctGain}% extra income)`;
  if (middlemanValEl) middlemanValEl.textContent = `₹${middlemanTotal.toLocaleString()}`;
  if (kisanlinkValEl) kisanlinkValEl.textContent = `₹${kisanlinkTotal.toLocaleString()}`;

  // Bar Fill Widths
  if (kisanlinkBar) {
    kisanlinkBar.style.width = "100%";
    kisanlinkBar.textContent = `₹${kisanlinkTotal.toLocaleString()}`;
  }
  if (middlemanBar) {
    const ratio = Math.round((middlemanTotal / kisanlinkTotal) * 100);
    middlemanBar.style.width = `${ratio}%`;
    middlemanBar.textContent = `₹${middlemanTotal.toLocaleString()}`;
  }

  // Breakdown numbers
  if (savedCommEl) savedCommEl.textContent = `+₹${savedBrokerage.toLocaleString()}`;
  if (directDiffEl) directDiffEl.textContent = `+₹${directPriceDiff.toLocaleString()}`;
  if (totalBenefitEl) totalBenefitEl.textContent = `+₹${totalExtraEarnings.toLocaleString()}`;

  if (sliderQtyLabel) sliderQtyLabel.textContent = `${qty} Quintals`;
  if (slider) slider.value = qty;
}

// Global Toast Notification Manager (Accessible & Non-Intrusive)
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "kl-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ebc38e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
