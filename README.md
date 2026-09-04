# 🌾 Ministry of Consumer Affairs, Food & Public Distribution
## Agricultural Crop Procurement & Direct Benefit Transfer (DBT) Portal

An ultra-modern, responsive, production-ready government web portal engineered for Indian farmers to streamline agricultural produce registration, procurement center slot reservations, real-time live token queues with countdown tracking, weighbridge verification, and direct subsidy payments (DBT).

---

## 🚀 Key Modules & Connected Architecture

1. **🔐 Farmer Authentication & Registration**:
   - Secure Login with phone number formatting and password masking.
   - Streamlined New Farmer Registration with instant profile sync and prefilled login credentials.
   - Logout button in navbar to safely switch back to the login screen.

2. **🌾 Clean Dashboard & Service Modules**:
   - Clean, focused hero section highlighting official portal desk.
   - 6 Core Connected Modules with progressive unlocking and sequential validation.

3. **📅 Module 1 — Procurement Schedule**:
   - Village-level crop intake calendar (September Paddy, October Cotton, November Maize, December Groundnut, January Paddy, February Chilli for *Village ABC*).
   - Notice for upcoming registration and slot booking announcements.

4. **📝 Module 2 — Form Filling (Crop Registration)**:
   - Agricultural produce selection, expected weight entry, bank account number & IFSC.
   - Clears older session data on fresh login and auto-advances to Procurement Center & Slot Booking.

6. **🏛️ Module 3 — Procurement Center & Slot Booking**:
   - Designated Center: `STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)`.
   - Preferred date picker & morning/afternoon slots with decrementing availability counters.
   - Instant booking confirmation & live queue initiation.

7. **🪙 Module 4 — Token Status & Live Queue**:
   - State-of-the-art **Static 3D Gold Coin Token** (`#TK-8492`).
   - Comprehensive intake details displayed above the coin.
   - **Real-Time 15-Second Countdown Timer** activating strictly after slot selection.
   - Transitions to `0s (LIVE!) - YOUR TURN RIGHT NOW` with direct button to Finalize Procurement.

8. **⚖️ Module 5 — Finalize Procurement & Payment**:
   - Verified Actual Weight slip ($\text{Actual} \le \text{Expected}$), moisture FAQ grade, and calculated MSP amount.
   - Authorize & Release Direct Payment (DBT) transfer.

9. **💳 Module 6 — Payment History & DBT Statements**:
   - **⚡ JUST RECEIVED**: Dedicated card highlighting the latest DBT payment released.
   - **📜 PAST RECEIVED**: Historical table of all past settled government vouchers.
   - **📄 Official Government DBT Receipt Voucher**: Printable modal slip with beneficiary details, UTR reference, QR code seal, and browser print action.

10. **🔔 Notification Bell Deep-Links**:
    - Notifications increment dynamically on events and reset to 0 upon viewing.
    - Clicking any notification item directly opens the respective service module.

---

## 🛠️ Technology Stack

- **Core**: Vanilla HTML5 (Semantic, Accessible, SEO-optimized)
- **Styling**: Vanilla CSS3 (Custom Design System, Glassmorphism, Responsive Grid & Flexbox, 3D Gold Coin Shader)
- **Logic**: Vanilla JavaScript (Zero External Runtime Dependencies, LocalStorage Persistence, Event-driven architecture)
- **Fonts**: *Cormorant Garamond*, *DM Serif Display*, *Plus Jakarta Sans* via Google Fonts

---

## 📦 Deployment Instructions

### 1. 🌐 Deploy to GitHub Pages (Free & Instant)
1. Initialize git in the folder:
   ```bash
   git init
   git add .
   git commit -m "Initial production release of Crop Procurement System"
   ```
2. Create a new repository on GitHub and link it:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, navigate to **Settings** > **Pages**.
4. Under **Branch**, select `main` and root `/` folder, then click **Save**.
5. Your portal will be live at `https://<YOUR-USERNAME>.github.io/<REPO-NAME>/`.

---

### 2. ▲ Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel` (or connect your GitHub repository in the [Vercel Dashboard](https://vercel.com)).
2. Run in the project directory:
   ```bash
   vercel
   ```
3. The included `vercel.json` will automatically configure caching, clean URLs, and security headers.

---

### 3. 🌿 Deploy to Netlify
1. Drag and drop the project folder directly onto [Netlify Drop](https://app.netlify.com/drop).
2. Or connect via Netlify CLI:
   ```bash
   npx netlify deploy --prod --dir=.
   ```
3. The included `netlify.toml` will handle production headers and asset routing.

---

### 4. 💻 Running Locally
To test or present locally:
```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .
```
Then visit **`http://localhost:3000`** in your browser.

---

## 📄 License
Government of India Digital Services / Ministry of Consumer Affairs, Food & Public Distribution.
