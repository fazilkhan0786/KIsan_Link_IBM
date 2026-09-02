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
      { name_en: "Gondal Market Yard", name_gu: "ગોંડલ માર્કેટ યાર્ડ", diff: 30, trend: "+₹30", isBest: true },
      { name_en: "Rajkot Main APMC", name_gu: "રાજકોટ મુખ્ય APMC", diff: 0, trend: "+₹20", isBest: false },
      { name_en: "Jetpur APMC Yard", name_gu: "જેતપુર APMC યાર્ડ", diff: -40, trend: "+₹15", isBest: false }
    ],
    junagadh: [
      { name_en: "Junagadh APMC Yard", name_gu: "જૂનાગઢ APMC યાર્ડ", diff: 20, trend: "+₹40", isBest: true },
      { name_en: "Keshod Market Yard", name_gu: "કેશોદ માર્કેટ યાર્ડ", diff: 0, trend: "+₹25", isBest: false },
      { name_en: "Visavadar APMC", name_gu: "વિસાવદર APMC", diff: -30, trend: "+₹20", isBest: false }
    ],
    bhavnagar: [
      { name_en: "Mahuva Market Yard", name_gu: "મહુવા માર્કેટ યાર્ડ", diff: 25, trend: "+₹35", isBest: true },
      { name_en: "Bhavnagar APMC", name_gu: "ભાવનગર APMC", diff: 0, trend: "+₹30", isBest: false },
      { name_en: "Talaja APMC Yard", name_gu: "તળાજા APMC યાર્ડ", diff: -40, trend: "+₹15", isBest: false }
    ],
    amreli: [
      { name_en: "Amreli Main Yard", name_gu: "અમરેલી મુખ્ય યાર્ડ", diff: 20, trend: "+₹40", isBest: true },
      { name_en: "Savarkundla APMC", name_gu: "સાવરકુંડલા APMC", diff: 0, trend: "+₹30", isBest: false },
      { name_en: "Dhari Market Yard", name_gu: "ધારી માર્કેટ યાર્ડ", diff: -30, trend: "+₹20", isBest: false }
    ],
    banaskantha: [
      { name_en: "Deesa Market Yard", name_gu: "ડીસા માર્કેટ યાર્ડ", diff: 30, trend: "+₹30", isBest: true },
      { name_en: "Palanpur APMC", name_gu: "પાલનપુર APMC", diff: 0, trend: "+₹20", isBest: false },
      { name_en: "Tharad APMC Yard", name_gu: "થરાદ APMC યાર્ડ", diff: -40, trend: "+₹15", isBest: false }
    ]
  },
  // Structured AI Decision Intelligence Models
  decisionModels: {
    cotton: {
      action: "partial",
      actionTitle: { en: "HOLD PARTIALLY", gu: "અડધો પાક વેચો (૫૦%)" },
      confidence: 74,
      trendPct: "+2.7%",
      split: { sellPct: 40, holdPct: 60 },
      splitSellDesc: {
        en: "Secure immediate cashflow & cover harvest operational costs",
        gu: "હાલના સારા ભાવે ૪૦% જથ્થો વેચી રોકડ મેળવો અને ખર્ચ કાઢો"
      },
      splitHoldDesc: {
        en: "Target ₹7,650/q upside as export & spinning demand strengthens",
        gu: "નિકાસ માંગ વધતાં ₹૭,૬૫૦/ક્વિન્ટલના લક્ષ્ય માટે ૬૦% જથ્થો રોકો"
      },
      targetPrice: 7650,
      evidence: [
        {
          icon: "📈",
          title: { en: "Price Trend", gu: "ભાવ ટ્રેન્ડ" },
          desc: { en: "+2.7% steady gain over the last 7 days with consistent upward momentum.", gu: "છેલ્લા ૭ દિવસમાં ભાવમાં +૨.૭% નો સતત સુધારો અને મજબૂત વલણ." }
        },
        {
          icon: "🏢",
          title: { en: "Nearby Market Spread", gu: "નજીકના યાર્ડની સરખામણી" },
          desc: { en: "Gondal Market Yard is currently trading ₹30/q above local benchmark.", gu: "ગોંડલ માર્કેટ યાર્ડમાં સ્થાનિક કરતાં ₹૩૦/ક્વિન્ટલ ઊંચો ભાવ બોલાય છે." }
        },
        {
          icon: "📦",
          title: { en: "Market Arrivals", gu: "બજાર આવક અને માંગ" },
          desc: { en: "Saurashtra mandi arrivals are stabilizing while ginning & mill inquiries remain steady.", gu: "સૌરાષ્ટ્ર યાર્ડમાં નવી આવક સ્થિર છે અને જીનીંગ મિલોની સક્રિય માંગ છે." }
        },
        {
          icon: "🎯",
          title: { en: "Suggested Action", gu: "ભલામણ કરેલ પગલું" },
          desc: { en: "Avoid selling entire harvest at once; staged 40/60 selling split optimizes realization.", gu: "આજે બધો માલ વેચવાને બદલે ૪૦/૬૦ ના પ્રમાણમાં વેચી સરેરાશ નફો વધારો." }
        }
      ]
    },
    groundnut: {
      action: "hold",
      actionTitle: { en: "HOLD 1–2 WEEKS", gu: "૧-૨ અઠવાડિયા રોકો (HOLD)" },
      confidence: 82,
      trendPct: "+4.1%",
      split: { sellPct: 20, holdPct: 80 },
      splitSellDesc: {
        en: "Sell 20% only if immediate working capital is necessary",
        gu: "જો તાત્કાલિક રોકડની જરૂર હોય તો જ ૨૦% વેચો"
      },
      splitHoldDesc: {
        en: "Hold 80% for 10–14 days for post-festival oil mill buying surge",
        gu: "તહેવાર પછી તેલ મિલોની મોટી માંગ માટે ૮૦% જથ્થો સાચવી રાખો"
      },
      targetPrice: 6580,
      evidence: [
        {
          icon: "📈",
          title: { en: "Price Trend", gu: "ભાવ ટ્રેન્ડ" },
          desc: { en: "+4.1% solid gain from ₹6,180 to ₹6,420/q over past week.", gu: "છેલ્લા અઠવાડિયામાં ₹૬,૧૮૦ થી વધીને ₹૬,૪૨૦/ક્વિન્ટલ સુધી તેજી." }
        },
        {
          icon: "🏢",
          title: { en: "Nearby Market Spread", gu: "નજીકના યાર્ડની સરખામણી" },
          desc: { en: "Junagadh & Keshod APMC offer higher realization on high-oil seed varieties.", gu: "જૂનાગઢ અને કેશોદ APMC માં સારી ગુણવત્તા પર પ્રીમિયમ ભાવ મળે છે." }
        },
        {
          icon: "🏭",
          title: { en: "Crusher Demand", gu: "તેલ મિલોની ખરીદી" },
          desc: { en: "Regional oil crushers operating at high capacity with low buffer inventories.", gu: "તેલ મિલોમાં પીલાણ ક્ષમતા વધી છે અને બફર સ્ટોક ઓછો છે." }
        },
        {
          icon: "🎯",
          title: { en: "Suggested Action", gu: "ભલામણ કરેલ પગલું" },
          desc: { en: "Hold majority harvest for 10–14 days to maximize season-peak returns.", gu: "વધુ ભાવ મેળવવા માટે મોટો જથ્થો ૧૦-૧૪ દિવસ સાચવી રાખો." }
        }
      ]
    }
  },
  // Static List of 5 Sample Buyers (Clearly Labeled as Prototype Profiles)
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
      badge_en: "Sample Profile · Spinning Mill",
      badge_gu: "સેમ્પલ પ્રોફાઇલ · સ્પિનિંગ મિલ"
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
      badge_en: "Demo Partner · Oil Industries",
      badge_gu: "ડેમો પાર્ટનર · ઓઇલ ઇન્ડસ્ટ્રીઝ"
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
      badge_en: "Sample Profile · Ginning Mill",
      badge_gu: "સેમ્પલ પ્રોફાઇલ · જીનીંગ મીલ"
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
      badge_en: "Demo Partner · Oil Mill",
      badge_gu: "ડેમો પાર્ટનર · ઓઇલ મીલ"
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
      badge_en: "Sample Profile · Commodity Buyer",
      badge_gu: "સેમ્પલ પ્રોફાઇલ · કોમોડિટી ખરીદદાર"
    }
  ]
});

// ==========================================================================
// 2. BILINGUAL DICTIONARY (ENGLISH & GUJARATI)
// ==========================================================================

const I18N = Object.freeze({
  en: {
    appName: "KisanLink",
    appTagline: "AI Market Linkage & Decision Support",
    langToggle: "ગુજરાતી",
    
    // Hero
    heroPillText: "AI Decision Support for Gujarat Farmers",
    heroTitle: "Make the right selling decision.",
    heroSub: "Better prices. Better markets. Better decisions for Gujarat’s farmers.",
    heroCtaBtnText: "Get Selling Recommendation",
    
    // Flow Steps
    flowStep1: "Market Data",
    flowStep2: "Trend Analysis",
    flowStep3: "AI Advisory",
    flowStep4: "Selling Strategy",

    // Quick Nav Titles
    navHome: "Home",
    navPrices: "Prices",
    navAdvisor: "Advisor",
    navBuyers: "Buyers",
    navDashboard: "Dashboard",

    actionPricesTitle: "Compare Mandis",
    actionPricesSub: "Rates & 7-Day Trends",
    actionAdvisorTitle: "Sell or Hold Advisor",
    actionAdvisorSub: "Granite AI Recommendation",
    actionBuyersTitle: "Sample Buyer Profiles",
    actionBuyersSub: "Direct Mill Linkage",
    actionDashboardTitle: "Income Impact",
    actionDashboardSub: "Strategy vs Distress Sale",

    // Market Snapshot
    snapshotTitle: "Today's Saurashtra Spot Prices",
    snapshotSub: "Demonstration snapshot based on Gujarat APMC market structure",

    // Illustrative Impact Story
    impactBadge: "Illustrative Example",
    impactTitle: "How a Smarter Selling Decision Creates Value",
    impactSub: "Scenario based on 80 Quintals Cotton harvest in Saurashtra",
    impactTradLabel: "Traditional Rushed Sale",
    impactTradNote: "Sold 100% on day 1 to local middleman",
    impactKlLabel: "KisanLink Staged Strategy",
    impactKlNote: "Sold 40% for cash, held 60% for peak week",
    impactDiffText: "Illustrative Potential Difference:",
    impactDisclaimer: "*Illustrative calculation based on prototype APMC benchmark spreads. Demonstrates decision value, not guaranteed profit.",

    // Prices Screen
    filterCropLabel: "Select Crop",
    filterDistrictLabel: "Select District",
    priceTrendTitle: "7-Day Price Trend",
    chartSub: "Daily APMC Closing",
    currentPriceLabel: "Current Modal Price",
    perQuintal: "₹ / Quintal",
    topMandisTitle: "Top 3 Nearby Mandis",
    topMandisSub: "Compare nearby yards for better realization",
    bestNearbyTag: "⭐ Best Nearby Option",
    jumpAdvisorBtn: "Get Selling Recommendation for this crop",

    // Advisor Screen
    advTitle: "AI Sell-or-Hold Advisor",
    advSub: "Market Advisor powered by IBM Granite",
    qtyLabel: "Harvest Quantity (in Quintals)",
    getAdviceBtn: "Analyze Market & Get Advice",
    analyzingText: "IBM Granite AI Reasoning...",
    engineTag: "IBM Granite Market Advisor",
    whyTitle: "Why this recommendation?",
    stratBadge: "Actionable Strategy",
    stratTitle: "Suggested Selling Strategy",
    bestMandiLabel: "Best Nearby Market:",
    pipelineNote: "Market Data → IBM Granite Reasoning → Farmer-Friendly Strategy",
    advBuyersBtn: "View Sample Matched Buyers",
    advDashBtn: "Estimate Selling Income Impact",
    invalidQtyError: "Please enter a valid harvest quantity between 1 and 10,000 Quintals.",

    // Buyers Screen
    buyerDemoTag: "Prototype Demo",
    buyersTitle: "Sample Buyer Marketplace",
    buyersSub: "Demo profiles for direct mill linkage with zero middleman brokerage",
    allCrops: "All Crops",
    cottonOnly: "Cotton",
    groundnutOnly: "Groundnut",
    qtyRequired: "Demand",
    offeredPrice: "Offer Price",
    contactBuyerBtn: "Contact Buyer",
    noBuyersFound: "No sample buyers found for this category.",

    // Dashboard Screen
    dashTitle: "Income Impact Estimation",
    dashSub: "Illustrative scenario: Staged selling & direct linkage vs. middleman distress sale",
    dashGainCallout: "Estimated Strategy Uplift",
    middlemanLabel: "Via Traditional Middleman Sale",
    kisanlinkLabel: "Via KisanLink Selling Strategy",
    sampleSaleNote: "Potential Direct Farmer Difference",
    sliderLabel: "Adjust Quantity to Estimate Gain",
    sliderSub: "Simulate potential outcomes for your harvest",
    breakdownTitle: "Estimated Advantage Breakdown",
    breakdownSub: "Component-wise financial difference",
    savedCommission: "Middleman Brokerage Saved (4%)",
    savedCommissionSub: "Zero commission cut",
    weighingGain: "Digital Weighing Protection",
    weighingGainSub: "Standard fair weighment without cuts",
    directPremium: "Strategic Timing & Direct Price Gain",
    directPremiumSub: "Selling decision realization difference",
    totalBenefit: "Total Estimated Extra Realization",
    totalBenefitSub: "Direct to Farmer",
    dashDisclaimer: "*Prototype calculations based on mock Saurashtra market spreads. Realization depends on actual crop grade, moisture, and APMC daily auction rates."
  },
  gu: {
    appName: "કિસાન લિંક",
    appTagline: "ગુજરાત માર્કેટ લિંકેજ અને વેચાણ નિર્ણય",
    langToggle: "English",
    
    // Hero
    heroPillText: "ગુજરાતના ખેડૂતો માટે AI વેચાણ નિર્ણય સહાય",
    heroTitle: "યોગ્ય વેચાણ નિર્ણય લો.",
    heroSub: "વધુ સારા ભાવ. શ્રેષ્ઠ બજાર યાર્ડ. ગુજરાતના ખેડૂતો માટે સચોટ વેચાણ નિર્ણય.",
    heroCtaBtnText: "વેચાણ ભલામણ મેળવો",

    // Flow Steps
    flowStep1: "બજાર ભાવ",
    flowStep2: "ટ્રેન્ડ વિશ્લેષણ",
    flowStep3: "AI સલાહ",
    flowStep4: "વેચાણ વ્યૂહરચના",

    // Quick Nav Titles
    navHome: "હોમ",
    navPrices: "ભાવ",
    navAdvisor: "સલાહકાર",
    navBuyers: "ખરીદદારો",
    navDashboard: "નફો/ડેશબોર્ડ",

    actionPricesTitle: "બજાર યાર્ડ સરખાવો",
    actionPricesSub: "આજના ભાવ અને ૭-દિવસનો ટ્રેન્ડ",
    actionAdvisorTitle: "વેચવું કે રોકવું? (AI સલાહ)",
    actionAdvisorSub: "ગ્રેનાઇટ AI વેચાણ ભલામણ",
    actionBuyersTitle: "નમૂના ખરીદદારોની યાદી",
    actionBuyersSub: "દલાલ વગર મિલ જોડાણ",
    actionDashboardTitle: "નફાનું સરવૈયું",
    actionDashboardSub: "વ્યૂહરચના વિરુદ્ધ ઉતાવળિયું વેચાણ",

    // Market Snapshot
    snapshotTitle: "આજના સૌરાષ્ટ્ર માર્કેટ યાર્ડ સ્પોટ ભાવ",
    snapshotSub: "ગુજરાત APMC માળખા આધારિત ડેમો માર્કેટ સ્નેપશોટ",

    // Illustrative Impact Story
    impactBadge: "ઉદાહરણરૂપ સરખામણી",
    impactTitle: "સમજુ વેચાણ નિર્ણયથી ખેડૂતને થતો ફાયદો",
    impactSub: "સૌરાષ્ટ્રમાં ૮૦ ક્વિન્ટલ કપાસના વેચાણ પર આધારિત ઉદાહરણ",
    impactTradLabel: "પરંપરાગત ઉતાવળિયું વેચાણ",
    impactTradNote: "દલાલને પ્રથમ દિવસે જ બધો માલ વેચી દીધો",
    impactKlLabel: "કિસાન લિંક તબક્કાવાર વ્યૂહરચના",
    impactKlNote: "૪૦% રોકડ માટે વેચ્યો, ૬૦% તેજીમાં વેચ્યો",
    impactDiffText: "અંદાજિત સંભવિત તફાવત:",
    impactDisclaimer: "*પ્રોટોટાઇપ બજાર ગણતરી પર આધારિત ઉદાહરણ. નિર્ણયનું મહત્વ દર્શાવે છે, બાંહેધરીકૃત નફો નથી.",

    // Prices Screen
    filterCropLabel: "પાક પસંદ કરો",
    filterDistrictLabel: "જિલ્લો પસંદ કરો",
    priceTrendTitle: "૭-દિવસનો ભાવ ટ્રેન્ડ ચાર્ટ",
    chartSub: "દૈનિક APMC ક્લોઝિંગ",
    currentPriceLabel: "હાલનો સરેરાશ બજાર ભાવ",
    perQuintal: "₹ / ક્વિન્ટલ",
    topMandisTitle: "ટોપ ૩ નજીકના માર્કેટ યાર્ડ",
    topMandisSub: "વધુ ભાવ મેળવવા નજીકના યાર્ડ સરખાવો",
    bestNearbyTag: "⭐ શ્રેષ્ઠ નજીકનો વિકલ્પ",
    jumpAdvisorBtn: "આ પાક માટે વેચાણ ભલામણ મેળવો",

    // Advisor Screen
    advTitle: "AI વેચાણ-રોકાણ સલાહકાર",
    advSub: "IBM ગ્રેનાઇટ LLM એનાલિટિક્સ આધારિત",
    qtyLabel: "પાકનો જથ્થો (ક્વિન્ટલમાં)",
    getAdviceBtn: "બજાર ચકાસી સલાહ મેળવો",
    analyzingText: "IBM ગ્રેનાઇટ AI વિશ્લેષણ કરે છે...",
    engineTag: "IBM ગ્રેનાઇટ માર્કેટ એડવાઇઝર",
    whyTitle: "આ ભલામણ શા માટે?",
    stratBadge: "અમલ કરવા યોગ્ય વ્યૂહરચના",
    stratTitle: "સૂચવેલ વેચાણ વ્યૂહરચના",
    bestMandiLabel: "શ્રેષ્ઠ નજીકનું માર્કેટ યાર્ડ:",
    pipelineNote: "બજાર ડેટા → IBM ગ્રેનાઇટ વિશ્લેષણ → ખેડૂત-હિત લક્ષી વ્યૂહરચના",
    advBuyersBtn: "નમૂના ખરીદદારોની યાદી જુઓ",
    advDashBtn: "વેચાણ નફાનું અંદાજિત સરવૈયું",
    invalidQtyError: "કૃપા કરીને ૧ થી ૧૦,૦૦૦ ક્વિન્ટલ વચ્ચે સાચો જથ્થો દાખલ કરો.",

    // Buyers Screen
    buyerDemoTag: "ડેમો પ્રોટોટાઇપ",
    buyersTitle: "નમૂના ખરીદદારોની માર્કેટપ્લેસ",
    buyersSub: "દલાલી વગર સીધું મિલ સાથે જોડાણ દર્શાવતી ડેમો પ્રોફાઇલ",
    allCrops: "બધા પાક",
    cottonOnly: "કપાસ",
    groundnutOnly: "મગફળી",
    qtyRequired: "જરૂરિયાત",
    offeredPrice: "ઓફર ભાવ",
    contactBuyerBtn: "ખરીદદારનો સંપર્ક કરો",
    noBuyersFound: "આ કેટેગરી માટે કોઈ ખરીદદાર મળ્યા નથી.",

    // Dashboard Screen
    dashTitle: "નફાની અંદાજિત સરખામણી",
    dashSub: "વ્યૂહરચના આધારિત વેચાણ વિરુદ્ધ દલાલ દ્વારા ઉતાવળિયા વેચાણની સરખામણી",
    dashGainCallout: "વ્યૂહરચનાથી અંદાજિત વધારો",
    middlemanLabel: "પરંપરાગત દલાલ દ્વારા વેચાણ",
    kisanlinkLabel: "કિસાન લિંક વેચાણ વ્યૂહરચના દ્વારા",
    sampleSaleNote: "ખેડૂતને મળતો સંભવિત સીધો લાભ",
    sliderLabel: "જથ્થો બદલીને અંદાજ મેળવો",
    sliderSub: "તમારા પાક મુજબ સંભવિત નફાનું સિમ્યુલેશન",
    breakdownTitle: "નાણાકીય ફાયદાની વિગત",
    breakdownSub: "ઘટક મુજબ સંભવિત વધારાની આવક",
    savedCommission: "બચેલી દલાલી અને કમિશન (૪%)",
    savedCommissionSub: "કોઈ દલાલી કપાત નહીં",
    weighingGain: "ડિજિટલ કાંટાથી યોગ્ય વજન ફાયદો",
    weighingGainSub: "કોઈ છૂપી વજન કપાત વગર",
    directPremium: "સમયસર વેચાણ અને સીધો ઊંચો ભાવ",
    directPremiumSub: "યોગ્ય નિર્ણયથી મળેલ વધારાનો દર",
    totalBenefit: "ખેડૂતના હાથમાં મળતો કુલ વધારાનો નફો",
    totalBenefitSub: "ખેડૂતને સીધો મળવાપાત્ર",
    dashDisclaimer: "*સૌરાષ્ટ્ર યાર્ડના મોક ડેટા મુજબ અંદાજિત ગણતરી. વાસ્તવિક ભાવ પાકની ગુણવત્તા, ભેજ અને દૈનિક હરાજી પર આધાર રાખે છે."
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

  // Hero Primary CTA on Home Screen
  const heroCtaBtn = document.getElementById("hero-advisor-cta");
  if (heroCtaBtn) {
    heroCtaBtn.addEventListener("click", () => {
      switchScreen("advisor");
    });
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
        renderAdvisorScreen();
      }
    }, 120));
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
    }, 40));
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

  // Complete UI Labels Mapping
  const labels = {
    // Bottom Nav
    "nav-label-home": t.navHome,
    "nav-label-prices": t.navPrices,
    "nav-label-advisor": t.navAdvisor,
    "nav-label-buyers": t.navBuyers,
    "nav-label-dashboard": t.navDashboard,

    // Hero Section
    "hero-pill-text": t.heroPillText,
    "hero-title": t.heroTitle,
    "hero-sub": t.heroSub,
    "hero-cta-btn-text": t.heroCtaBtnText,

    // Decision Flow Bar
    "flow-step-1": t.flowStep1,
    "flow-step-2": t.flowStep2,
    "flow-step-3": t.flowStep3,
    "flow-step-4": t.flowStep4,

    // Quick Action Cards
    "action-prices-title": t.actionPricesTitle,
    "action-prices-sub": t.actionPricesSub,
    "action-advisor-title": t.actionAdvisorTitle,
    "action-advisor-sub": t.actionAdvisorSub,
    "action-buyers-title": t.actionBuyersTitle,
    "action-buyers-sub": t.actionBuyersSub,
    "action-dash-title": t.actionDashboardTitle,
    "action-dash-sub": t.actionDashboardSub,

    // Market Snapshot
    "snapshot-title": t.snapshotTitle,
    "snapshot-sub": t.snapshotSub,

    // Illustrative Impact Story
    "lbl-impact-badge": t.impactBadge,
    "lbl-impact-title": t.impactTitle,
    "lbl-impact-sub": t.impactSub,
    "lbl-impact-trad-label": t.impactTradLabel,
    "lbl-impact-trad-note": t.impactTradNote,
    "lbl-impact-kl-label": t.impactKlLabel,
    "lbl-impact-kl-note": t.impactKlNote,
    "lbl-impact-diff-text": t.impactDiffText,
    "lbl-impact-disclaimer": t.impactDisclaimer,

    // Prices Screen
    "lbl-filter-crop": t.filterCropLabel,
    "lbl-filter-dist": t.filterDistrictLabel,
    "lbl-price-trend-title": t.priceTrendTitle,
    "lbl-chart-sub": t.chartSub,
    "lbl-current-price-tag": t.currentPriceLabel,
    "lbl-price-unit": t.perQuintal,
    "lbl-top-mandis-title": t.topMandisTitle,
    "lbl-top-mandis-sub": t.topMandisSub,
    "lbl-best-nearby-tag": t.bestNearbyTag,
    "lbl-jump-advisor-btn": t.jumpAdvisorBtn,

    // Advisor Screen
    "lbl-adv-title": t.advTitle,
    "lbl-adv-sub": t.advSub,
    "lbl-adv-crop": t.filterCropLabel,
    "lbl-adv-dist": t.filterDistrictLabel,
    "lbl-adv-qty": t.qtyLabel,
    "get-advice-btn-text": t.getAdviceBtn,
    "lbl-adv-engine-tag": t.engineTag,
    "lbl-why-title": t.whyTitle,
    "lbl-strat-badge": t.stratBadge,
    "lbl-strat-title": t.stratTitle,
    "lbl-adv-mandi-label": t.bestMandiLabel,
    "lbl-adv-pipeline": t.pipelineNote,
    "lbl-adv-buyers-btn": t.advBuyersBtn,
    "lbl-adv-dash-btn": t.advDashBtn,

    // Buyers Screen
    "lbl-buyer-demo-tag": t.buyerDemoTag,
    "lbl-buyers-title": t.buyersTitle,
    "lbl-buyers-sub": t.buyersSub,
    "tab-filter-all": t.allCrops,
    "tab-filter-cotton": t.cottonOnly,
    "tab-filter-groundnut": t.groundnutOnly,

    // Dashboard Screen
    "lbl-dash-title": t.dashTitle,
    "lbl-dash-sub": t.dashSub,
    "lbl-dash-gain-callout": t.dashGainCallout,
    "lbl-dash-middleman": t.middlemanLabel,
    "lbl-dash-kisanlink": t.kisanlinkLabel,
    "lbl-dash-sample-note": t.sampleSaleNote,
    "lbl-slider-label": t.sliderLabel,
    "lbl-slider-sub": t.sliderSub,
    "lbl-dash-breakdown-title": t.breakdownTitle,
    "lbl-dash-breakdown-sub": t.breakdownSub,
    "lbl-dash-saved-comm": t.savedCommission,
    "lbl-dash-saved-comm-sub": t.savedCommissionSub,
    "lbl-dash-weigh-gain": t.weighingGain,
    "lbl-dash-weigh-gain-sub": t.weighingGainSub,
    "lbl-dash-mill-prem": t.directPremium,
    "lbl-dash-mill-prem-sub": t.directPremiumSub,
    "lbl-dash-total-benefit": t.totalBenefit,
    "lbl-dash-total-sub": t.totalBenefitSub,
    "lbl-dash-disclaimer": t.dashDisclaimer
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
          <span class="kl-list-item-sub">2,400 Qtl arrivals · Modal Price</span>
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
          <span class="kl-list-item-sub">1,850 Qtl arrivals · Modal Price</span>
        </div>
      </div>
      <div class="kl-list-item-right">
        <span class="kl-list-item-price">₹${groundnutPrice.toLocaleString()}</span>
        <span class="kl-list-item-trend trend-up">▲ +₹50/q</span>
      </div>
    </li>
  `;
}

// Render Prices Screen (Price, SVG Chart, Top 3 Mandis, Best Nearby Callout)
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

  // 3. Render Top 3 Mandis & Best Nearby Option
  const mandisContainer = document.getElementById("top-mandis-list");
  const bestNearbyTextEl = document.getElementById("best-nearby-mandi-text");
  const mandis = APP_DATA.mandisByDistrict[dist] || APP_DATA.mandisByDistrict.rajkot;
  const bestMandi = mandis.find(m => m.isBest) || mandis[0];

  if (bestNearbyTextEl) {
    const bestName = state.lang === 'gu' ? bestMandi.name_gu : bestMandi.name_en;
    bestNearbyTextEl.textContent = state.lang === 'gu'
      ? `${bestName} સ્થાનિક યાર્ડ કરતાં +₹${bestMandi.diff}/ક્વિન્ટલ વધુ ભાવ આપે છે`
      : `${bestName} offers +₹${bestMandi.diff}/q over local rate`;
  }

  if (mandisContainer) {
    mandisContainer.innerHTML = mandis.map((m, idx) => {
      const mandiPrice = currentPrice + m.diff;
      return `
        <li class="kl-list-item">
          <div class="kl-list-item-left">
            <div class="kl-list-item-avatar ${m.isBest ? '' : 'icon-wheat'}">#${idx + 1}</div>
            <div class="kl-list-item-text">
              <span class="kl-list-item-title">${escapeHtml(state.lang === 'gu' ? m.name_gu : m.name_en)} ${m.isBest ? '⭐' : ''}</span>
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

// Render Advisor Screen & Deep Recommendation Models
function renderAdvisorScreen() {
  const crop = state.selectedCrop;
  const dist = state.selectedDistrict;
  const qty = state.advisorQty || 50;
  const model = APP_DATA.decisionModels[crop] || APP_DATA.decisionModels.cotton;
  
  const series = APP_DATA.priceMatrix[crop][dist];
  const currentPrice = series[series.length - 1];

  const recCard = document.getElementById("advisor-recommendation-card");
  const recBadge = document.getElementById("adv-conf-badge");
  const recActionText = document.getElementById("adv-rec-action-text");
  
  // 1. Current Condition Strip
  const cropObj = APP_DATA.crops.find(c => c.id === crop);
  const distObj = APP_DATA.districts.find(d => d.id === dist);
  const cropName = state.lang === 'gu' ? cropObj.name_gu : cropObj.name_en;
  const distName = state.lang === 'gu' ? distObj.name_gu : distObj.name_en;

  const condCropDistEl = document.getElementById("adv-cond-crop-dist");
  const condPriceEl = document.getElementById("adv-cond-price");
  const condTrendEl = document.getElementById("adv-cond-trend");

  if (condCropDistEl) condCropDistEl.textContent = `${cropName} · ${distName}`;
  if (condPriceEl) condPriceEl.textContent = `₹${currentPrice.toLocaleString()} / quintal`;
  if (condTrendEl) condTrendEl.textContent = `7-Day Trend: ${model.trendPct}`;

  if (!recCard) return;

  // 2. Action Type Styling & Confidence Badge
  recCard.classList.remove("advisor-rec--sell", "advisor-rec--hold", "advisor-rec--partial");
  recCard.classList.add(`advisor-rec--${model.action}`);

  if (recActionText) {
    recActionText.textContent = model.actionTitle[state.lang];
  }

  if (recBadge) {
    recBadge.className = `kl-card-badge ${model.action === 'sell' ? 'kl-badge--green' : model.action === 'hold' ? 'kl-badge--wheat' : 'kl-badge--blue'}`;
    recBadge.textContent = state.lang === 'gu' ? `વિશ્વાસ: ${model.confidence}%` : `Confidence: ${model.confidence}%`;
  }

  // 3. Render "Why this recommendation?" 4 Structured Evidence Cards
  const evidenceGrid = document.getElementById("adv-evidence-grid");
  if (evidenceGrid) {
    evidenceGrid.innerHTML = model.evidence.map(item => `
      <div class="evidence-card">
        <div class="evidence-card-icon" aria-hidden="true">${item.icon}</div>
        <div class="evidence-card-content">
          <div class="evidence-card-title">${escapeHtml(item.title[state.lang])}</div>
          <div class="evidence-card-desc">${escapeHtml(item.desc[state.lang])}</div>
        </div>
      </div>
    `).join("");
  }

  // 4. Render Suggested Strategy Split (Percentages & Dynamic Calculated Quintals)
  const sellPct = model.split.sellPct;
  const holdPct = model.split.holdPct;
  const sellQty = Math.round((qty * sellPct) / 100);
  const holdQty = qty - sellQty;

  const splitSellBar = document.getElementById("adv-split-sell-bar");
  const splitHoldBar = document.getElementById("adv-split-hold-bar");
  const splitSellPctEl = document.getElementById("adv-split-sell-pct");
  const splitSellQtyEl = document.getElementById("adv-split-sell-qty");
  const splitSellDescEl = document.getElementById("adv-split-sell-desc");
  const splitHoldPctEl = document.getElementById("adv-split-hold-pct");
  const splitHoldQtyEl = document.getElementById("adv-split-hold-qty");
  const splitHoldDescEl = document.getElementById("adv-split-hold-desc");

  if (splitSellBar) {
    splitSellBar.style.width = `${sellPct}%`;
    splitSellBar.textContent = state.lang === 'gu' ? `વેચો ${sellPct}%` : `Sell ${sellPct}%`;
  }
  if (splitHoldBar) {
    splitHoldBar.style.width = `${holdPct}%`;
    splitHoldBar.textContent = state.lang === 'gu' ? `રોકો ${holdPct}%` : `Hold ${holdPct}%`;
  }

  if (splitSellPctEl) splitSellPctEl.textContent = state.lang === 'gu' ? `હમણાં વેચો (${sellPct}%)` : `Sell ${sellPct}% Now`;
  if (splitSellQtyEl) splitSellQtyEl.textContent = state.lang === 'gu' ? `${sellQty} ક્વિન્ટલ @ ₹${currentPrice.toLocaleString()}` : `${sellQty} Quintals @ ₹${currentPrice.toLocaleString()}`;
  if (splitSellDescEl) splitSellDescEl.textContent = model.splitSellDesc[state.lang];

  if (splitHoldPctEl) splitHoldPctEl.textContent = state.lang === 'gu' ? `જથ્થો રોકો (${holdPct}%)` : `Hold ${holdPct}%`;
  if (splitHoldQtyEl) splitHoldQtyEl.textContent = state.lang === 'gu' ? `${holdQty} ક્વિન્ટલ (૧-૨ અઠવાડિયા)` : `${holdQty} Quintals (1–2 Weeks)`;
  if (splitHoldDescEl) splitHoldDescEl.textContent = model.splitHoldDesc[state.lang];

  // 5. Best Nearby Mandi inside Advisor
  const mandis = APP_DATA.mandisByDistrict[dist] || APP_DATA.mandisByDistrict.rajkot;
  const bestMandi = mandis.find(m => m.isBest) || mandis[0];
  const advNearbyNameEl = document.getElementById("adv-nearby-mandi-name");
  const advNearbyPriceEl = document.getElementById("adv-nearby-mandi-price");
  const advNearbyDiffEl = document.getElementById("adv-nearby-mandi-diff");

  if (advNearbyNameEl) advNearbyNameEl.textContent = state.lang === 'gu' ? bestMandi.name_gu : bestMandi.name_en;
  if (advNearbyPriceEl) advNearbyPriceEl.textContent = `₹${(currentPrice + bestMandi.diff).toLocaleString()} / quintal`;
  if (advNearbyDiffEl) advNearbyDiffEl.textContent = `(+₹${bestMandi.diff} vs local)`;
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
    showToast(state.lang === "gu" ? "✅ IBM ગ્રેનાઇટ AI વિશ્લેષણ પૂર્ણ! ભલામણ તૈયાર છે." : "✅ IBM Granite AI Analysis Complete! Selling recommendation updated.");
    state.isAnalyzing = false;
  }, 450);
}

// Render Buyers Screen (Filterable 5 Sample Buyers with Transparent Prototype Labels)
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
              Buyer Rating:
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
    ? `✅ ડેમો સંપર્ક નોંધાયો: ${escapeHtml(name)} સાથે જોડાણ શરૂ થયું. SMS મોકલાયો.`
    : `✅ Demo inquiry initiated with ${escapeHtml(name)}! Sample SMS notification sent.`;
  showToast(msg);

  setTimeout(() => {
    state.contactCooldown = false;
  }, 600);
};

// Render Dashboard Screen (Connected to Slider & Staged Selling Simulation)
function renderDashboardScreen() {
  const qty = state.dashboardQty || 50;

  // Benchmark Pricing for comparison
  const middlemanBasePrice = 6700;
  const middlemanCutPerQtl = 150; // 4% brokerage + discount
  const middlemanNetPerQtl = middlemanBasePrice - middlemanCutPerQtl; // ₹6,550
  const middlemanTotal = qty * middlemanNetPerQtl;

  const kisanlinkPricePerQtl = 7450; // Staged strategy + direct mill procurement
  const kisanlinkTotal = qty * kisanlinkPricePerQtl;

  const netGain = kisanlinkTotal - middlemanTotal;
  const pctGain = ((netGain / middlemanTotal) * 100).toFixed(1);

  // Breakdown values
  const savedBrokerage = qty * 150;
  const digitalWeighingGain = qty * 70;
  const strategicTimingGain = netGain - savedBrokerage - digitalWeighingGain;

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
  if (pctGainEl) pctGainEl.textContent = `(+${pctGain}% extra realization)`;
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
  if (directDiffEl) directDiffEl.textContent = `+₹${strategicTimingGain.toLocaleString()}`;
  if (totalBenefitEl) totalBenefitEl.textContent = `+₹${netGain.toLocaleString()}`;

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

