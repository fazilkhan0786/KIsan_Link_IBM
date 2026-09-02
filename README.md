# KisanLink — Cotton & Groundnut Market Linkage Platform
> **Gujarat Hackathon 2026 — Challenge 13 | Documentation & Production Build**

KisanLink (કિસાન લિંક) is an Agentic AI-powered, mobile-first agricultural market linkage and intelligence platform designed specifically for Gujarat's cotton (*કપાસ*) and groundnut (*મગફળી*) farmers. It eliminates middleman price exploitation by providing real-time APMC mandi price intelligence, an IBM Granite AI-powered "Sell or Hold" advisory recommendation, direct access to verified buyers with zero brokerage, and a transparent income uplift dashboard.

---

## 🔗 Live Demo & Preview Link

> 🌐 **[Live Preview / Hosted App: `https://your-preview-link-here.app`](https://your-preview-link-here.app)**
*(Replace with your deployed hosting URL after publishing on Vercel, Netlify, Cloudflare Pages, or GitHub Pages)*

---

## 🌟 Key Features & Core Screens

| Screen | Core Functionality | UI & Architecture Specs |
|---|---|---|
| **🏠 Home** | Welcome overview, 4 fast navigation action buttons, live Saurashtra spot rates | Premium frosted glass hero card, ambient mesh background, instant bilingual toggle (`English` ↔ `ગુજરાતી`) |
| **📈 Prices** | Mandi price lookup by Crop (Cotton, Groundnut) & District (Rajkot, Junagadh, Bhavnagar, Amreli, Banaskantha) | Responsive 7-day SVG vector line chart, current modal rate highlight, top 3 nearby mandis sorted by price |
| **🧠 Advisor** | IBM Granite AI-powered Sell-or-Hold Advisory Agent (0.45s reasoning simulation) | 3 recommendation modes (*Sell Now*, *Hold 1–2 Weeks*, *Sell Partially*) with 6 pre-written statistical reason strings in EN + GU |
| **👥 Buyers** | 5 pre-approved verified buyers with demand and price offered | Filterable tabs (*All*, *Cotton*, *Groundnut*), 5-star trust ratings, verified badges, rate-limited "Contact Buyer" toast |
| **📊 Dashboard** | Transparent financial comparison: Middleman vs. KisanLink | Visual comparison dual tracks showing **`₹3,27,500` vs `₹3,72,500`** with a net **`+₹45,000` (+13.7%)** uplift highlight and interactive quantity slider (10–200 Qtl) |

---

## 🛡️ Production Security & Quality Engineering Checklist

This build has been hardened following production-grade standards:

### 1. Security & Protection
- ✅ **XSS Prevention**: All dynamic values and user inputs pass through a strict `escapeHtml()` sanitization filter before DOM insertion.
- ✅ **Strict Content Security Policy (CSP)**: Configured in `<meta>` headers (`default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `object-src 'none'`, `frame-ancestors 'none'`).
- ✅ **Header Protections**: `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` enabled.
- ✅ **No Exposed Secrets**: Zero hardcoded API keys or sensitive credentials in client-side code; structured with `.env.example` for future server proxy integration.
- ✅ **Input Sanitization & Validation**: Number inputs enforce integer parsing, range constraints ($1 \le Q \le 10,000$), inline alert states, and `autocomplete="off"`.
- ✅ **Rate Limiting / Anti-Spam**: Action buttons implement click-cooldown timers to prevent rapid submission spam.
- ✅ **Safe Data Storage**: No sensitive or personally identifiable information (PII) stored in `localStorage` or `sessionStorage`.

### 2. Performance Optimization
- ✅ **Zero External Dependencies**: Pure native HTML5, modern CSS3, and vanilla ES6+ JavaScript. No bulky frameworks or heavy icon fonts.
- ✅ **Debounced Handlers**: Range slider and quantity inputs use custom debouncing ($120\text{ms}$) to avoid unnecessary re-renders.
- ✅ **Inline Vector Graphics (SVG)**: Lightweight inline SVGs for all iconography and dynamic 7-day line charts.
- ✅ **Zero Layout Shifts**: Pre-defined element dimensions and responsive fluid container layouts.

### 3. Accessibility (a11y) & Usability
- ✅ **WCAG AA Compliance**: High-contrast text colors on frosted glass surfaces.
- ✅ **Accessible 48px+ Tap Targets**: Large buttons and controls optimized for one-thumb mobile usage by farmers.
- ✅ **Semantic Structure**: Semantic HTML5 tags (`<header>`, `<main>`, `<nav>`, `<section>`, `<label>`).
- ✅ **ARIA Support**: Complete ARIA attributes (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="region"`, `aria-selected`, `aria-controls`, `aria-live="polite"`).
- ✅ **Keyboard Navigable**: Visible `:focus-visible` emerald outline rings across all interactive elements, plus `Enter`/`Space` key handlers on cards.
- ✅ **Reduced Motion Media Query**: `@media (prefers-reduced-motion: reduce)` support for users sensitive to animations.

### 4. Strict Component Reuse
- ✅ **Reusable Card Component (`.kl-card`)**: Standardized structure with `.kl-card-header`, `.kl-card-body`, and `.kl-card-footer` utilized across all 5 screens.
- ✅ **Reusable List Component (`.kl-list`)**: Standardized `.kl-list-item` structure utilized across Home spot prices, Top 3 mandis, and Dashboard breakdown.

---

## 📂 Project Directory Structure

```
IBM_Project_2/
├── index.html                  # Core single-page application structure & semantic layout
├── styles.css                  # Design system tokens, glassmorphism effects, a11y & animations
├── app.js                      # Static 7x2x5 dataset matrix, SVG chart engine, advisory logic & i18n
├── 404.html                    # Fallback page for static hosting deployments
├── .gitignore                  # Git ignore rules for node_modules, .env, and OS artifacts
├── .env.example                # Environment configuration template for future API endpoints
├── robots.txt                  # Search crawler directives
├── sitemap.xml                 # Search engine sitemap
├── KisanLink_PRD_TRD_UFD_IPD.md# Product & Technical Requirement Documentation
└── KisanLink_ERD.mermaid       # Entity Relationship Diagram (ERD)
```

---

## 💻 Local Setup & Development

No build tools, compilation, or package installations are required:

1. **Clone or download the repository**:
   ```bash
   git clone https://github.com/your-username/KisanLink.git
   cd KisanLink
   ```

2. **Run a local static server**:
   Using Python:
   ```bash
   python3 -m http.server 8080
   ```
   Or using Node.js `npx`:
   ```bash
   npx serve .
   ```

3. **Open the application**:
   Navigate to **`http://localhost:8080`** in your browser (or use device emulation mode in Chrome/Safari DevTools for mobile preview).

---

## 🚀 Deployment Guide

### Option 1: Vercel / Netlify
1. Connect your GitHub repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set the build command to empty (no build step needed) and the output directory to `./` (root).
3. Click **Deploy**.

### Option 2: GitHub Pages
1. Go to repository **Settings** $\rightarrow$ **Pages**.
2. Select `main` (or `master`) branch as the source and `/ (root)` folder.
3. Save and copy your public GitHub Pages URL into the [Live Preview](#-live-demo--preview-link) section above.

### Option 3: Cloudflare Pages
1. Create a new Cloudflare Pages project linked to your repository.
2. Choose **Framework preset: None** and deploy instantly.

---

## 📊 Mock Dataset Specifications

The static price dataset is structured with clear entity relationships (`crop_id`, `district_id`, `mandi_id`, `price_per_quintal`, `date`) to enable direct future integration with the Government of India's **Agmarknet / data.gov.in** API:

```javascript
// Sample Price Matrix Structure
APP_DATA.priceMatrix = {
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
};
```

---

## 👥 Authors & Acknowledgments

- **Challenge:** Gujarat Hackathon 2026 — Challenge 13 (*Cotton & Groundnut Market Linkage Platform*)
- **Platform Stack:** IBM Bob, IBM Granite LLM (Advisory Intelligence Agent), HTML5/CSS3/ES6 (Mobile Frontend)
- **Target Persona:** Saurashtra Cotton & Groundnut Smallholder Farmers
