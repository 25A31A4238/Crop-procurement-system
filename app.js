/**
 * Crop Procurement Center - Farmer Login & Portal Interactions
 * Connected Architecture for Ministry of Consumer Affairs, Food & Public Distribution
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const loginForm = document.getElementById('loginForm');
  const mobileInput = document.getElementById('mobileNumber');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const iconEye = togglePasswordBtn?.querySelector('.icon-eye');
  const iconEyeOff = togglePasswordBtn?.querySelector('.icon-eye-off');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = loginBtn?.querySelector('.btn-text');
  const btnArrow = loginBtn?.querySelector('.btn-arrow');
  const btnLoader = loginBtn?.querySelector('.btn-loader');
  const toastContainer = document.getElementById('toastContainer');

  // Modal elements
  const openRegisterBtn = document.getElementById('openRegisterBtn');
  const closeRegisterBtn = document.getElementById('closeRegisterBtn');
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');

  // Dashboard & Modal Elements
  const loginScreen = document.getElementById('loginScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const logoutBtn = document.getElementById('logoutBtn');
  const dashFarmerName = document.getElementById('dashFarmerName');
  const dashFarmerMobile = document.getElementById('dashFarmerMobile');
  
  const dashDetailModal = document.getElementById('dashDetailModal');
  const closeDashModalBtn = document.getElementById('closeDashModalBtn');
  const dashModalCategory = document.getElementById('dashModalCategory');
  const dashModalTitle = document.getElementById('dashModalTitle');
  const dashModalBody = document.getElementById('dashModalBody');
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const moduleCards = document.querySelectorAll('.module-card');

  // Receipt Modal Elements
  const receiptModal = document.getElementById('receiptModal');
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');
  const receiptModalBody = document.getElementById('receiptModalBody');

  // --- Constants & MSP Registry ---
  const CROP_MSP_RATES = {
    'Wheat': 2275,
    'Paddy / Rice': 2183,
    'Mustard': 5650,
    'Soybean': 4600,
    'Cotton': 7020,
    'Gram / Chana': 5440,
    'Maize': 2090
  };

  // --- Stored State / Persistent Database Simulation ---
  let farmerBank = {
    account: localStorage.getItem('cpc_bank_account') || '',
    ifsc: localStorage.getItem('cpc_bank_ifsc') || ''
  };

  let slotState = {
    morning: parseInt(localStorage.getItem('cpc_slot_morning') || '10', 10),
    afternoon: parseInt(localStorage.getItem('cpc_slot_afternoon') || '10', 10),
    center: 'STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)',
    tokenNumber: 'TK-8492'
  };

  let isSlotBooked = localStorage.getItem('cpc_slot_booked') === 'true';
  let isTimerCompleted = localStorage.getItem('cpc_timer_completed') === 'true';
  let countdownSeconds = parseInt(localStorage.getItem('cpc_countdown_seconds') || '15', 10);
  let countdownInterval = null;
  let bookedSlotDetails = {
    date: localStorage.getItem('cpc_booked_date') || '2026-09-05',
    slot: localStorage.getItem('cpc_booked_slot') || 'Morning Slot (08:00 AM - 12:00 PM)'
  };

  let registeredFarmer = {
    name: localStorage.getItem('cpc_farmer_name') || 'Rahul',
    mobile: localStorage.getItem('cpc_farmer_mobile') || '9876543210'
  };

  // --- Check if an active consignment & token is in progress awaiting DBT settlement ---
  function hasActiveInProgressProcurement() {
    const hasCrop = !!localStorage.getItem('cpc_submitted_crop');
    const hasSlot = (localStorage.getItem('cpc_slot_booked') === 'true') || isSlotBooked;
    const isFinalized = localStorage.getItem('cpc_procurement_finalized') === 'true';
    return hasCrop && hasSlot && !isFinalized;
  }
  window.hasActiveInProgressProcurement = hasActiveInProgressProcurement;

  // --- Official Central Procurement Center Exit Gate Pass Renderer ---
  function renderExitGatePassHtml(passData) {
    const passId = passData.passId || 'EGP-2026-849201';
    const token = passData.token || '#TK-8492';
    const farmer = passData.farmer || ((registeredFarmer.name || 'Rahul') + ' (Village ABC)');
    const crop = passData.crop || 'Wheat (48.00 Qtl)';
    const reason = passData.reason || 'MSP rate / valuation below farmer expectation';
    const date = passData.date || 'Today';
    const time = passData.time || '12:00 PM';

    return `
      <div class="exit-gatepass-card">
        <div class="gatepass-header">
          <div>
            <span class="badge-tag" style="background: #FFF3CD; color: #856404; margin-bottom: 4px;">OFFICIAL WITHDRAWAL RECORD</span>
            <h3 style="font-size: 16px; font-weight: 800; color: #143525; margin: 2px 0;">CENTRAL PROCUREMENT CENTER EXIT GATE PASS</h3>
            <p style="font-size: 11px; color: #64746A; margin: 0;">State Agricultural Cooperative Center (Village ABC) • Code: CPC-AP-VIL-ABC-04</p>
          </div>
          <div class="gatepass-stamp">
            CLEARED FOR EXIT
          </div>
        </div>

        <div style="background: #F4EFE6; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 10.5px; font-weight: 700; color: #7A5112;">GATE PASS NUMBER</span>
            <p style="font-size: 14px; font-weight: 800; color: #143525; margin: 0;">${passId}</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10.5px; font-weight: 700; color: #7A5112;">ISSUED AT</span>
            <p style="font-size: 12px; font-weight: 700; color: #143525; margin: 0;">${date} • ${time}</p>
          </div>
        </div>

        <table class="gatepass-table">
          <tbody>
            <tr>
              <td>Registered Farmer</td>
              <td><strong>${farmer}</strong></td>
            </tr>
            <tr>
              <td>Intake Token Number</td>
              <td><strong><code>${token}</code></strong></td>
            </tr>
            <tr>
              <td>Withdrawn Produce</td>
              <td><strong>${crop}</strong></td>
            </tr>
            <tr>
              <td>Withdrawal Classification</td>
              <td><strong style="color: #C0392B;">Price Valuation Declined by Farmer</strong></td>
            </tr>
            <tr>
              <td>Stated Reason</td>
              <td>${reason}</td>
            </tr>
            <tr>
              <td>Security Gate Clearance</td>
              <td><strong>Weighbridge Bay 2 → Exit Gate 1 (Clear to Depart)</strong></td>
            </tr>
            <tr>
              <td>Registration Lock Status</td>
              <td><strong style="color: #1E824C;">✓ Unlocked • Eligible for New Produce Registration</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px;">
          <button type="button" class="modal-submit-btn" onclick="window.goToFormFilling();" style="flex: 2; min-width: 220px; background: #1E824C;">
            <span>🌱 Fill New Crop Registration Form (Module 2)</span>
            <span>→</span>
          </button>
          <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.print();" style="flex: 1; min-width: 140px;">
            <span>Print Gate Pass 🖨️</span>
          </button>
        </div>
      </div>
    `;
  }
  window.renderExitGatePassHtml = renderExitGatePassHtml;

  // --- Regional Language Translations for Farmer Dashboard (Telugu, Hindi, Tamil, Malayalam) ---
  const FARMER_TRANSLATIONS = {
    en: {
      systemName: "MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION, INDIA",
      portalTitle: "Crop Procurement Portal",
      centerActive: "Procurement Active (Kharif 2026-27)",
      logoutBtn: "LOGOUT",
      heroBadge: "OFFICIAL FARMER DESK",
      heroTitle: "Farmer Procurement Dashboard",
      heroDesc: "Welcome to the integrated procurement & MSP payment portal. Select any module below to schedule slots, register crop produce, track weighbridge tokens, or download direct DBT payment receipts.",
      servicesHeading: "Select Procurement Service",
      servicesTag: "6 SERVICES AVAILABLE",
      mod1Title: "PROCUREMENT SCHEDULE",
      mod1Desc: "View crop-wise MSP calendars, procurement operational schedules, daily intake quotas, and purchase limits.",
      mod1Action: "View Schedule",
      mod2Title: "FORM FILLING",
      mod2Desc: "Register new agricultural produce, enter harvest yield quintals, land survey numbers, and bank DBT details.",
      mod2Action: "Fill Crop Form",
      mod3Title: "PROCUREMENT CENTER & SLOT BOOKING",
      mod3Desc: "Choose your designated cooperative center, select preferred intake date, and reserve real-time weighbridge slots.",
      mod3Action: "Book Center Slot",
      mod4Title: "LIVE TOKEN QUEUE STATUS",
      mod4Desc: "Monitor live weighbridge gate countdowns, track truck convoy queue positions, and view active token numbers.",
      mod4Action: "Track Live Queue",
      mod5Title: "FINALIZE PROCUREMENT & PAYMENT",
      mod5Desc: "Inspect verified gross weights, view certified moisture assaying grades, and confirm direct bank DBT transfer.",
      mod5Action: "Authorize DBT Payment",
      mod6Title: "TRANSACTION & PAYMENT HISTORY",
      mod6Desc: "Access Direct Benefit Transfer (DBT) bank logs, government payment voucher receipts, and transaction reference numbers.",
      mod6Action: "View Statements",
      switchSuccess: "Language switched to English"
    },
    te: {
      systemName: "వినియోగదారుల వ్యవహారాలు, ఆహార & ప్రజా పంపిణీ మంత్రిత్వ శాఖ, భారతదేశం",
      portalTitle: "రైతు పంట సేకరణ పోర్టల్",
      centerActive: "సేకరణ చురుకుగా ఉంది (ఖరీఫ్ 2026-27)",
      logoutBtn: "లాగ్ అవుట్",
      heroBadge: "అధికారిక రైతు విభాగం",
      heroTitle: "రైతు పంట సేకరణ డాష్‌బోర్డ్",
      heroDesc: "సమీకృత పంట సేకరణ & కనీస మద్దతు ధర (MSP) చెల్లింపు పోర్టల్‌కు స్వాగతం. స్లాట్‌లను బుక్ చేసుకోవడానికి, పంటను నమోదు చేయడానికి, తూకం టోకెన్‌లను ట్రాక్ చేయడానికి లేదా DBT రసీదులను డౌన్‌లోడ్ చేయడానికి క్రింది సేవను ఎంచుకోండి.",
      servicesHeading: "సేకరణ సేవను ఎంచుకోండి",
      servicesTag: "6 సేవలు అందుబాటులో ఉన్నాయి",
      mod1Title: "సేకరణ షెడ్యూల్",
      mod1Desc: "పంటల వారీగా MSP క్యాలెండర్లు, కొనుగోలు షెడ్యూల్‌లు, రోజువారీ కోటాలు మరియు కొనుగోలు పరిమితులను చూడండి.",
      mod1Action: "షెడ్యూల్ చూడండి",
      mod2Title: "పంట నమోదు ఫారం",
      mod2Desc: "కొత్త పంటను నమోదు చేయండి, దిగుబడి క్వింటాళ్లు, భూమి సర్వే నంబర్ మరియు బ్యాంక్ DBT వివరాలను నమోదు చేయండి.",
      mod2Action: "ఫారమ్ పూరించండి",
      mod3Title: "సేకరణ కేంద్రం & స్లాట్ బుకింగ్",
      mod3Desc: "మీ సహకార కేంద్రాన్ని ఎంచుకోండి, తేదీని ఎంచుకోండి మరియు నిజ-సమయ వేయింగ్‌బ్రిడ్జ్ స్లాట్‌లను రిజర్వ్ చేసుకోండి.",
      mod3Action: "స్లాట్ బుక్ చేయండి",
      mod4Title: "లైవ్ టోకెన్ క్యూ స్థితి",
      mod4Desc: "లైవ్ వేయింగ్‌బ్రిడ్జ్ గేట్ కౌంట్‌డౌన్, క్యూలో మీ స్థానం మరియు యాక్టివ్ టోకెన్ నంబర్‌ను పర్యవేక్షించండి.",
      mod4Action: "లైవ్ క్యూ చూడండి",
      mod5Title: "సేకరణ & చెల్లింపును ఖరారు చేయండి",
      mod5Desc: "ధృవీకరించబడిన నికర బరువును తనిఖీ చేయండి, తేమ పరీక్ష గ్రేడ్‌ను వీక్షించండి మరియు బ్యాంక్ DBT బదిలీని నిర్ధారించండి.",
      mod5Action: "DBT చెల్లింపును నిర్ధారించండి",
      mod6Title: "లావాదేవీలు & చెల్లింపు చరిత్ర",
      mod6Desc: "డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (DBT) బ్యాంక్ లాగ్‌లు, ప్రభుత్వ చెల్లింపు రసీదులు మరియు UTR నంబర్‌లను పొందండి.",
      mod6Action: "స్టేట్‌మెంట్‌లను చూడండి",
      switchSuccess: "భాష తెలుగులోకి మార్చబడింది"
    },
    hi: {
      systemName: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय, भारत",
      portalTitle: "फसल खरीद पोर्टल",
      centerActive: "खरीद केंद्र सक्रिय (खरीफ 2026-27)",
      logoutBtn: "लॉग आउट",
      heroBadge: "आधिकारिक किसान पटल",
      heroTitle: "किसान फसल खरीद डैशबोर्ड",
      heroDesc: "एकीकृत खरीद और एमएसपी भुगतान पोर्टल में आपका स्वागत है। स्लॉट बुक करने, फसल पंजीकृत करने, वेईब्रिज टोकन ट्रैक करने या प्रत्यक्ष डीबीटी रसीद डाउनलोड करने के लिए नीचे किसी भी सेवा का चयन करें।",
      servicesHeading: "खरीद सेवा का चयन करें",
      servicesTag: "6 सेवाएं उपलब्ध",
      mod1Title: "खरीद अनुसूची",
      mod1Desc: "फसल-वार एमएसपी कैलेंडर, खरीद कार्यक्रम, दैनिक कोटा और खरीद सीमाएं देखें।",
      mod1Action: "अनुसूची देखें",
      mod2Title: "फसल पंजीकरण फॉर्म",
      mod2Desc: "नई कृषि उपज पंजीकृत करें, उपज वजन (क्विंटल), भूमि सर्वे नंबर और बैंक डीबीटी विवरण दर्ज करें।",
      mod2Action: "फॉर्म भरें",
      mod3Title: "खरीद केंद्र और स्लॉट बुकिंग",
      mod3Desc: "सहकारी केंद्र चुनें, पसंदीदा तिथि चुनें और वास्तविक समय में वेईब्रिज स्लॉट आरक्षित करें।",
      mod3Action: "स्लॉट बुक करें",
      mod4Title: "लाइव टोकन कतार स्थिति",
      mod4Desc: "वेईब्रिज गेट काउंटडाउन, वाहनों की कतार स्थिति और सक्रिय टोकन नंबर की वास्तविक स्थिति देखें।",
      mod4Action: "लाइव कतार देखें",
      mod5Title: "खरीद और भुगतान अंतिम रूप दें",
      mod5Desc: "सत्यापित वजन की जांच करें, प्रमाणित नमी ग्रेड देखें और बैंक डीबीटी हस्तांतरण की पुष्टि करें।",
      mod5Action: "डीबीटी भुगतान अधिकृत करें",
      mod6Title: "लेनदेन और भुगतान इतिहास",
      mod6Desc: "प्रत्यक्ष लाभ अंतरण (डीबीटी) बैंक लॉग, सरकारी भुगतान रसीदें और लेनदेन संदर्भ संख्याएं प्राप्त करें।",
      mod6Action: "विवरण देखें",
      switchSuccess: "भाषा हिन्दी में बदल दी गई है"
    },
    ta: {
      systemName: "நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம், இந்தியா",
      portalTitle: "பயிர் கொள்முதல் போர்டல்",
      centerActive: "கொள்முதல் மையம் செயலில் உள்ளது (காரிஃப் 2026-27)",
      logoutBtn: "வெளியேறு",
      heroBadge: "அதிகாரப்பூர்வ உழவர் பிரிவு",
      heroTitle: "உழவர் பயிர் கொள்முதல் டாஷ்போர்டு",
      heroDesc: "ஒருங்கிணைந்த கொள்முதல் மற்றும் குறைந்தபட்ச ஆதரவு விலை (MSP) போர்ட்டலுக்கு வரவேற்கிறோம். ஸ்லாட்டுகளை முன்பதிவு செய்ய, பயிரை பதிவு செய்ய, எடை மேடை டோக்கன்களை கண்காணிக்க அல்லது DBT ரசீதுகளைப் பெற கீழே உள்ள சேவையைத் தேர்ந்தெடுக்கவும்.",
      servicesHeading: "கொள்முதல் சேவையைத் தேர்ந்தெடுக்கவும்",
      servicesTag: "6 சேவைகள் உள்ளன",
      mod1Title: "கொள்முதல் அட்டவணை",
      mod1Desc: "பயிர்வாரியான MSP காலண்டர், செயல்பாட்டு அட்டவணை மற்றும் கொள்முதல் வரம்புகளைப் பார்க்கவும்.",
      mod1Action: "அட்டவணையைப் பார்க்கவும்",
      mod2Title: "பயிர் பதிவு படிவம்",
      mod2Desc: "புதிய பயிரைப் பதிவு செய்க, விளைச்சல் குவிண்டால், சர்வே எண் மற்றும் வங்கி விவரங்களை உள்ளிடவும்.",
      mod2Action: "படிவம் நிரப்பவும்",
      mod3Title: "கொள்முதல் மையம் & ஸ்லாட் முன்பதிவு",
      mod3Desc: "கூட்டுறவு மையத்தைத் தேர்வுசெய்து, தேதியைத் தேர்ந்தெடுத்து எடை மேடை ஸ்லாட்டை முன்பதிவு செய்யவும்.",
      mod3Action: "ஸ்லாட் முன்பதிவு செய்க",
      mod4Title: "நேரலை டோக்கன் வரிசை நிலை",
      mod4Desc: "எடை மேடை கவுண்டவுன், வரிசை நிலை மற்றும் செயலில் உள்ள டோக்கன் எண்ணைக் கண்காணிக்கவும்.",
      mod4Action: "நேரலையைக் கண்காணிக்கவும்",
      mod5Title: "கொள்முதல் & கட்டணத்தை இறுதி செய்க",
      mod5Desc: "சரிபார்க்கப்பட்ட எடையைச் சரிபார்க்கவும், ஈரப்பத மதிப்பீட்டைப் பார்க்கவும், வங்கி DBT-ஐ உறுதிப்படுத்தவும்.",
      mod5Action: "DBT கட்டணத்தை உறுதிசெய்க",
      mod6Title: "பரிவர்த்தனை & கட்டண வரலாறு",
      mod6Desc: "நேரடி நன்மை பரிமாற்ற (DBT) பதிவுகள், அரசு கட்டண ரசீதுகள் மற்றும் UTR எண்களைப் பார்க்கவும்.",
      mod6Action: "அறிக்கைகளைப் பார்க்கவும்",
      switchSuccess: "மொழி தமிழுக்கு மாற்றப்பட்டது"
    },
    ml: {
      systemName: "ഉപഭോക്തൃകാര്യ, ഭക്ഷ്യ-പൊതുവിതരണ മന്ത്രാലയം, ഇന്ത്യ",
      portalTitle: "വിള സംഭരണ പോർട്ടൽ",
      centerActive: "സംഭരണ കേന്ദ്രം സജീവം (ഖാരിഫ് 2026-27)",
      logoutBtn: "ലോഗൗട്ട്",
      heroBadge: "ഔദ്യോഗിക കർഷക വിഭാഗം",
      heroTitle: "കർഷക വിള സംഭരണ ഡാഷ്‌ബോർഡ്",
      heroDesc: "സംയോജിത സംഭരണ, താങ്ങുവില (MSP) പോർട്ടലിലേക്ക് സ്വാഗതം. സ്ലോട്ട് ബുക്ക് ചെയ്യാനും വിള രജിസ്റ്റർ ചെയ്യാനും വെയ്ബ്രിഡ്ജ് ടോക്കണുകൾ ട്രാക്ക് ചെയ്യാനും ഡിബിടി രസീതുകൾ ഡൗൺലോഡ് ചെയ്യാനും താഴെയുള്ള സേവനം തിരഞ്ഞെടുക്കുക.",
      servicesHeading: "സംഭരണ സേവനം തിരഞ്ഞെടുക്കുക",
      servicesTag: "6 സേവനങ്ങള്‍ ലഭ്യമാണ്",
      mod1Title: "സംഭരണ കലണ്ടർ",
      mod1Desc: "വിള തിരിച്ചുള്ള താങ്ങുവില കലണ്ടറും ദൈനംദിന സംഭരണ പരിധികളും പരിശോധിക്കുക.",
      mod1Action: "കലണ്ടർ കാണുക",
      mod2Title: "വിള രജിസ്ട്രേഷൻ ഫോം",
      mod2Desc: "പുതിയ വിള രജിസ്റ്റർ ചെയ്യുക, വിളവ് (ക്വിന്റൽ), സർവേ നമ്പർ, ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ നൽകുക.",
      mod2Action: "ഫോം പൂരിപ്പിക്കുക",
      mod3Title: "സംഭരണ കേന്ദ്രവും സ്ലോട്ട് ബുക്കിംഗും",
      mod3Desc: "സഹകരണ കേന്ദ്രം തിരഞ്ഞെടുത്ത് തത്സമയ വെയ്ബ്രിഡ്ജ് സ്ലോട്ട് ബുക്ക് ചെയ്യുക.",
      mod3Action: "സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
      mod4Title: "തത്സമയ ടോക്കൺ ക്യൂ നില",
      mod4Desc: "വെയ്ബ്രിഡ്ജ് ഗേറ്റ് കൗണ്ട്ഡൗണും ടോക്കൺ നമ്പറിന്റെ തത്സമയ ക്യൂ നിലയും പരിശോധിക്കുക.",
      mod4Action: "ക്യൂ പരിശോധിക്കുക",
      mod5Title: "സംഭരണവും പേയ്‌മെന്റും പൂർത്തിയാക്കുക",
      mod5Desc: "സ്ഥിരീകരിച്ച തൂക്കം പരിശോധിച്ച് ഗുണനിലവാര സർട്ടിഫിക്കറ്റും ബാങ്ക് ഡിബിടി പേയ്‌മെന്റും സ്ഥിരീകരിക്കുക.",
      mod5Action: "ഡിബിടി പേയ്‌മെന്റ് ഉറപ്പാക്കുക",
      mod6Title: "ഇടപാടുകളും പേയ്‌മെന്റ് ചരിത്രവും",
      mod6Desc: "ബാങ്ക് ഡിബിടി വിവരങ്ങൾ, സർക്കാർ പേയ്‌മെന്റ് രസീതുകൾ, യുടിആర్ നമ്പറുകൾ എന്നിവ പരിശോധിക്കുക.",
      mod6Action: "സ്റ്റേറ്റ്‌മെന്റുകൾ കാണുക",
      switchSuccess: "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി"
    }
  };

  function applyFarmerLanguage(lang, notify = true) {
    const currentLang = FARMER_TRANSLATIONS[lang] ? lang : 'en';
    localStorage.setItem('cpc_selected_lang', currentLang);
    const t = FARMER_TRANSLATIONS[currentLang];

    // Update navbar select dropdown
    const selectEl = document.getElementById('farmerLangSelect');
    if (selectEl) selectEl.value = currentLang;

    // Update hero pills
    const pills = document.querySelectorAll('.lang-pill');
    pills.forEach(p => {
      if (p.getAttribute('data-lang') === currentLang) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Update language pill label
    const elLangLabel = document.getElementById('farmerLangPillLabel');
    if (elLangLabel) {
      const labels = {
        en: 'PORTAL LANGUAGE',
        te: 'LANGUAGE / భాష',
        hi: 'LANGUAGE / भाषा',
        ta: 'LANGUAGE / மொழி',
        ml: 'LANGUAGE / ഭാഷ'
      };
      elLangLabel.textContent = labels[currentLang] || 'PORTAL LANGUAGE';
    }

    // Update header & hero
    const elSystemName = document.querySelector('#dashboardScreen .dash-system-name');
    if (elSystemName) elSystemName.textContent = t.systemName;

    const elPortalTitle = document.querySelector('#dashboardScreen .dash-portal-title');
    if (elPortalTitle) elPortalTitle.textContent = t.portalTitle;

    const elCenterStatus = document.querySelector('#dashboardScreen .dash-center-badge span:last-child');
    if (elCenterStatus) elCenterStatus.textContent = t.centerActive;

    const elLogoutBtn = document.querySelector('#logoutBtn span');
    if (elLogoutBtn) elLogoutBtn.textContent = t.logoutBtn;

    const elHeroBadge = document.querySelector('#dashboardScreen .hero-badge');
    if (elHeroBadge) elHeroBadge.textContent = t.heroBadge;

    const elHeroTitle = document.querySelector('#dashboardScreen .hero-title');
    if (elHeroTitle) elHeroTitle.textContent = t.heroTitle;

    const elHeroDesc = document.querySelector('#dashboardScreen .hero-desc');
    if (elHeroDesc) elHeroDesc.textContent = t.heroDesc;

    const elServicesHeading = document.querySelector('#dashboardScreen .section-heading');
    if (elServicesHeading) elServicesHeading.textContent = t.servicesHeading;

    const elServicesTag = document.querySelector('#dashboardScreen .section-tag');
    if (elServicesTag) elServicesTag.textContent = t.servicesTag;

    // Update Modules 1 to 6 Cards
    const modMap = [
      { id: 'cardSchedule', title: t.mod1Title, desc: t.mod1Desc, action: t.mod1Action },
      { id: 'cardFormFilling', title: t.mod2Title, desc: t.mod2Desc, action: t.mod2Action },
      { id: 'cardSlotBooking', title: t.mod3Title, desc: t.mod3Desc, action: t.mod3Action },
      { id: 'cardTokenStatus', title: t.mod4Title, desc: t.mod4Desc, action: t.mod4Action },
      { id: 'cardFinalize', title: t.mod5Title, desc: t.mod5Desc, action: t.mod5Action },
      { id: 'cardPaymentHistory', title: t.mod6Title, desc: t.mod6Desc, action: t.mod6Action }
    ];

    modMap.forEach(m => {
      const card = document.getElementById(m.id);
      if (card) {
        const titleEl = card.querySelector('.module-title');
        const descEl = card.querySelector('.module-desc');
        const actionEl = card.querySelector('.module-action span:first-child');
        if (titleEl) titleEl.textContent = m.title;
        if (descEl) descEl.textContent = m.desc;
        if (actionEl) actionEl.textContent = m.action;
      }
    });

    if (notify) {
      showToast(t.switchSuccess, 'info');
    }
  }

  window.applyFarmerLanguage = applyFarmerLanguage;

  // Role Switcher Elements
  const tabFarmerLogin = document.getElementById('tabFarmerLogin');
  const tabOfficerLogin = document.getElementById('tabOfficerLogin');
  const authStepIndicator = document.getElementById('authStepIndicator');
  const loginFormTitle = document.getElementById('loginFormTitle');
  const identifierLabel = document.getElementById('identifierLabel');
  const identifierIcon = document.getElementById('identifierIcon');
  const passwordLabel = document.getElementById('passwordLabel');
  const loginBtnText = document.getElementById('loginBtnText');
  const rememberMeText = document.getElementById('rememberMeText');
  const registerPromptArea = document.getElementById('registerPromptArea');

  let currentLoginRole = 'farmer'; // 'farmer' | 'officer'

  // --- Dynamic Skin Synchronization for Quick Switch Dock ---
  function updateQuickSwitchSkin(activePortal) {
    const officerBtn = document.getElementById('quickSwitchOfficerBtn');
    const farmerBtn = document.getElementById('quickSwitchFarmerBtn');
    if (!officerBtn && !farmerBtn) return;

    if (activePortal === 'farmer') {
      if (farmerBtn) {
        farmerBtn.classList.add('active');
        farmerBtn.setAttribute('aria-selected', 'true');
        farmerBtn.style.setProperty('background', '#DFC396', 'important');
        farmerBtn.style.setProperty('color', '#143525', 'important');
        farmerBtn.style.setProperty('font-weight', '800', 'important');
        farmerBtn.style.setProperty('border', '1.5px solid #DFC396', 'important');
        farmerBtn.style.setProperty('box-shadow', '0 3px 12px rgba(223, 195, 150, 0.5)', 'important');
      }
      if (officerBtn) {
        officerBtn.classList.remove('active');
        officerBtn.setAttribute('aria-selected', 'false');
        officerBtn.style.setProperty('background', 'rgba(255, 255, 255, 0.12)', 'important');
        officerBtn.style.setProperty('color', '#FFFFFF', 'important');
        officerBtn.style.setProperty('font-weight', '600', 'important');
        officerBtn.style.setProperty('border', '1px solid rgba(223, 195, 150, 0.35)', 'important');
        officerBtn.style.setProperty('box-shadow', 'none', 'important');
      }
    } else if (activePortal === 'officer') {
      if (officerBtn) {
        officerBtn.classList.add('active');
        officerBtn.setAttribute('aria-selected', 'true');
        officerBtn.style.setProperty('background', '#DFC396', 'important');
        officerBtn.style.setProperty('color', '#143525', 'important');
        officerBtn.style.setProperty('font-weight', '800', 'important');
        officerBtn.style.setProperty('border', '1.5px solid #DFC396', 'important');
        officerBtn.style.setProperty('box-shadow', '0 3px 12px rgba(223, 195, 150, 0.5)', 'important');
      }
      if (farmerBtn) {
        farmerBtn.classList.remove('active');
        farmerBtn.setAttribute('aria-selected', 'false');
        farmerBtn.style.setProperty('background', 'rgba(255, 255, 255, 0.12)', 'important');
        farmerBtn.style.setProperty('color', '#FFFFFF', 'important');
        farmerBtn.style.setProperty('font-weight', '600', 'important');
        farmerBtn.style.setProperty('border', '1px solid rgba(223, 195, 150, 0.35)', 'important');
        farmerBtn.style.setProperty('box-shadow', 'none', 'important');
      }
    }
  }
  window.updateQuickSwitchSkin = updateQuickSwitchSkin;

  // --- Control Visibility of Quick Switch Dock (Only in Dashboards, never on Login Screen) ---
  function setQuickDockVisible(visible) {
    const dock = document.getElementById('quickPortalDock');
    if (!dock) return;
    if (visible) {
      dock.classList.remove('hidden');
    } else {
      dock.classList.add('hidden');
    }
  }
  window.setQuickDockVisible = setQuickDockVisible;

  function setLoginRole(role) {
    currentLoginRole = role;
    clearFieldError('mobileGroup');
    clearFieldError('passwordGroup');

    if (role === 'officer') {
      tabOfficerLogin?.classList.add('active');
      tabFarmerLogin?.classList.remove('active');
      updateQuickSwitchSkin('officer');
      if (authStepIndicator) authStepIndicator.textContent = 'OFFICER DESK / 02';
      if (loginFormTitle) loginFormTitle.innerHTML = '<span class="line-1">OFFICER</span><span class="line-2">LOGIN</span>';
      if (identifierLabel) identifierLabel.textContent = 'Officer ID';
      if (mobileInput) {
        mobileInput.placeholder = 'e.g. OFF-8492 or DESK-03';
        mobileInput.value = localStorage.getItem('cpc_officer_id') || 'OFF-8492';
        mobileInput.setAttribute('autocomplete', 'username');
      }
      if (identifierIcon) {
        identifierIcon.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        `;
      }
      if (passwordLabel) passwordLabel.textContent = 'Officer Password';
      if (passwordInput) passwordInput.value = 'officer123';
      if (loginBtnText) loginBtnText.textContent = 'OFFICER LOGIN';
      if (rememberMeText) rememberMeText.textContent = 'REMEMBER OFFICER ID';
      if (registerPromptArea) {
        registerPromptArea.innerHTML = '<span style="font-size: 12.5px; color: #5B6B5F; font-weight: 500;">🏛️ Designated Procurement Center Staff & Assayer Portal</span>';
      }
    } else {
      tabFarmerLogin?.classList.add('active');
      tabOfficerLogin?.classList.remove('active');
      updateQuickSwitchSkin('farmer');
      if (authStepIndicator) authStepIndicator.textContent = 'FARMER PORTAL / 01';
      if (loginFormTitle) loginFormTitle.innerHTML = '<span class="line-1">FARMER</span><span class="line-2">LOGIN</span>';
      if (identifierLabel) identifierLabel.textContent = 'Mobile number';
      if (mobileInput) {
        mobileInput.placeholder = 'e.g. 07123 456 789';
        mobileInput.value = localStorage.getItem('cpc_farmer_mobile') || '9876543210';
        mobileInput.setAttribute('autocomplete', 'tel');
      }
      if (identifierIcon) {
        identifierIcon.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        `;
      }
      if (passwordLabel) passwordLabel.textContent = 'Password';
      if (passwordInput) passwordInput.value = 'farmer123';
      if (loginBtnText) loginBtnText.textContent = 'LOGIN';
      if (rememberMeText) rememberMeText.textContent = 'REMEMBER ME';
      if (registerPromptArea) {
        registerPromptArea.innerHTML = 'Don\'t have an account? Then <button type="button" id="openRegisterBtn" class="link-register">create an account.</button>';
        const newOpenBtn = document.getElementById('openRegisterBtn');
        if (newOpenBtn && registerModal) {
          newOpenBtn.addEventListener('click', () => registerModal.classList.remove('hidden'));
        }
      }
    }
  }

  if (tabFarmerLogin) tabFarmerLogin.addEventListener('click', () => setLoginRole('farmer'));
  if (tabOfficerLogin) tabOfficerLogin.addEventListener('click', () => setLoginRole('officer'));

  // Pre-fill remembered credentials if any
  const savedMobile = localStorage.getItem('cpc_farmer_mobile');
  if (savedMobile && mobileInput) {
    mobileInput.value = savedMobile;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  // --- 1. Password Visibility Toggle ---
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      if (iconEye && iconEyeOff) {
        iconEye.classList.toggle('hidden', isPassword);
        iconEyeOff.classList.toggle('hidden', !isPassword);
      }
    });
  }

  // --- 2. Format Mobile / Officer Input on Typing ---
  if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
      clearFieldError('mobileGroup');
      if (currentLoginRole === 'farmer') {
        let val = e.target.value.replace(/[^\d\s+]/g, '');
        e.target.value = val;
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      clearFieldError('passwordGroup');
    });
  }

  // --- 3. Login Form Submit Handler -> Transition to Dashboard Interface ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (currentLoginRole === 'officer') {
        const officerIdVal = mobileInput.value.trim();
        const passwordVal = passwordInput.value.trim();
        let isValid = true;

        if (!officerIdVal) {
          setFieldError('mobileGroup', 'mobileError', 'Please enter your Procurement Officer ID');
          isValid = false;
        } else if (officerIdVal.length < 3) {
          setFieldError('mobileGroup', 'mobileError', 'Officer ID must be at least 3 characters');
          isValid = false;
        }

        if (!passwordVal) {
          setFieldError('passwordGroup', 'passwordError', 'Please enter your officer password');
          isValid = false;
        } else if (passwordVal.length < 4) {
          setFieldError('passwordGroup', 'passwordError', 'Password must be at least 4 characters');
          isValid = false;
        }

        if (!isValid) return;

        if (rememberMeCheckbox?.checked) {
          localStorage.setItem('cpc_officer_id', officerIdVal);
        }

        setButtonLoading(true);

        setTimeout(() => {
          setButtonLoading(false);
          showToast(`Procurement Officer Login Successful — Welcome Officer (${officerIdVal})`, 'success');
          
          // Reset assaying certification state so demo consignments always require certification first
          localStorage.setItem('cpc_assaying_certified', 'false');

          // Populate officer desk with current farmer details and full history
          populateOfficerDeskDetails(officerIdVal);

          // Switch to dedicated Officer Dashboard
          const officerDashboardScreen = document.getElementById('officerDashboardScreen');
          if (loginScreen && officerDashboardScreen) {
            loginScreen.classList.add('hidden');
            if (dashboardScreen) dashboardScreen.classList.add('hidden');
            officerDashboardScreen.classList.remove('hidden');
            setQuickDockVisible(true);
            updateQuickSwitchSkin('officer');

            // Explicitly display Procurement History view immediately upon login
            if (typeof window.switchOfficerDeskTab === 'function') {
              window.switchOfficerDeskTab('history');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 600);

        return;
      }

      // Farmer Login Flow
      const mobileVal = mobileInput.value.trim();
      const passwordVal = passwordInput.value.trim();
      let isValid = true;

      // Validate Mobile Number
      const digitsOnly = mobileVal.replace(/\D/g, '');
      if (!mobileVal) {
        setFieldError('mobileGroup', 'mobileError', 'Please enter your registered mobile number');
        isValid = false;
      } else if (digitsOnly.length < 10) {
        setFieldError('mobileGroup', 'mobileError', 'Mobile number must be at least 10 digits');
        isValid = false;
      }

      // Validate Password
      if (!passwordVal) {
        setFieldError('passwordGroup', 'passwordError', 'Please enter your password');
        isValid = false;
      } else if (passwordVal.length < 4) {
        setFieldError('passwordGroup', 'passwordError', 'Password must be at least 4 characters');
        isValid = false;
      }

      if (!isValid) return;

      // Handle Remember Me
      if (rememberMeCheckbox?.checked) {
        localStorage.setItem('cpc_farmer_mobile', mobileVal);
      } else {
        localStorage.removeItem('cpc_farmer_mobile');
      }

      // Button loading state
      setButtonLoading(true);

      setTimeout(() => {
        setButtonLoading(false);
        
        // Move previous session's latest payment to past received list
        moveLatestPaymentToPast();

        // Reset produce, weight, survey, and bank details so the user enters fresh values every time
        localStorage.removeItem('cpc_submitted_crop');
        localStorage.removeItem('cpc_submitted_qty');
        localStorage.removeItem('cpc_submitted_survey');
        localStorage.removeItem('cpc_bank_account');
        localStorage.removeItem('cpc_bank_ifsc');
        localStorage.removeItem('cpc_slot_booked');
        localStorage.removeItem('cpc_timer_completed');
        localStorage.removeItem('cpc_countdown_seconds');
        localStorage.removeItem('cpc_procurement_finalized');
        farmerBank.account = '';
        farmerBank.ifsc = '';
        isSlotBooked = false;
        isTimerCompleted = false;
        countdownSeconds = 15;
        clearInterval(countdownInterval);

        // Toast message
        showToast('Farmer Login Successful — Welcome to Portal', 'success');

        // Reset past notifications to zero on fresh farmer login
        resetNotificationCenter();

        // Update dashboard farmer profile
        if (dashFarmerMobile) dashFarmerMobile.textContent = '+91 ' + (mobileVal || registeredFarmer.mobile);
        if (dashFarmerName) dashFarmerName.textContent = registeredFarmer.name || 'Rahul';

        // Switch screens smoothly
        if (loginScreen && dashboardScreen) {
          loginScreen.classList.add('hidden');
          dashboardScreen.classList.remove('hidden');
          setQuickDockVisible(true);
          updateQuickSwitchSkin('farmer');
          window.scrollTo({ top: 0, behavior: 'smooth' });

          // Apply saved regional language on login
          applyFarmerLanguage(localStorage.getItem('cpc_selected_lang') || 'en', false);
        }
      }, 600);
    });
  }

  // --- 4. Notification Bell System with Deep-Links ---
  const notifBadge = notifBtn?.querySelector('.notif-badge');
  const notifCountTag = notifDropdown?.querySelector('.notif-count-tag');
  const notifList = notifDropdown?.querySelector('.notif-list');

  function resetNotificationCenter() {
    if (notifBadge) {
      notifBadge.textContent = '0';
      notifBadge.classList.add('zero');
    }
    if (notifCountTag) {
      notifCountTag.textContent = '0 New';
    }
    if (notifList) {
      notifList.innerHTML = `
        <div class="notif-empty-state" style="padding: 24px 16px; text-align: center; color: #64746A; font-size: 13px;">
          <p style="font-weight: 600; margin-bottom: 4px; color: #3E4B41;">No new notifications</p>
          <p style="font-size: 12px; color: #7B8B7F; line-height: 1.4;">Live center alerts, form confirmations, and DBT settlements will appear here.</p>
        </div>
      `;
    }
  }

  function addNotificationAlert(title, message, targetModule = 'form-filling') {
    if (!notifList) return;

    const emptyState = notifList.querySelector('.notif-empty-state');
    if (emptyState) emptyState.remove();

    const notifItem = document.createElement('div');
    notifItem.className = 'notif-item unread';
    notifItem.setAttribute('data-target-module', targetModule);
    notifItem.setAttribute('title', 'Click to open service directly');
    notifItem.innerHTML = `
      <span class="notif-dot"></span>
      <div class="notif-item-content">
        <p class="notif-title">${title}</p>
        <p class="notif-text">${message}</p>
        <span class="notif-time">Just now • Click to open →</span>
      </div>
    `;

    notifItem.addEventListener('click', () => {
      notifDropdown.classList.add('hidden');
      openModuleDetail(targetModule);
    });

    notifList.prepend(notifItem);

    if (notifBadge) {
      let count = parseInt(notifBadge.textContent || '0', 10) || 0;
      notifBadge.textContent = (count + 1).toString();
      notifBadge.classList.remove('zero');
    }
    if (notifCountTag) {
      let count = parseInt(notifBadge?.textContent || '1', 10);
      notifCountTag.textContent = `${count} New`;
    }
  }

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpening = notifDropdown.classList.contains('hidden');
      notifDropdown.classList.toggle('hidden');

      if (isOpening) {
        if (notifBadge) {
          notifBadge.textContent = '0';
          notifBadge.classList.add('zero');
        }
        if (notifCountTag) {
          notifCountTag.textContent = '0 New';
        }
        const unreadItems = notifDropdown.querySelectorAll('.notif-item');
        unreadItems.forEach(item => {
          item.classList.remove('unread');
          const dot = item.querySelector('.notif-dot');
          if (dot) dot.classList.add('read');
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.add('hidden');
      }
    });
  }

  // --- Master Consolidated Procurement History & DBT Ledger ---
  const DEFAULT_CENTER_HISTORY = [
    { date: 'Today, 03-Sep-2026', time: '09:30 AM', utr: 'GOV-DBT-984210', crop: 'Paddy / Rice (40.00 Qtl)', weight: '40.00 Qtl', amount: '₹ 87,320.00', farmer: 'Suresh Patel (Village ABC)', survey: 'Survey #310/2B', bank: 'A/C 1811664901 (SBIN0001234)', bankAccount: '1811664901', bankIfsc: 'SBIN0001234', gate: 'Gate 1', token: '#TK-8488', status: '✓ Completed & DBT Settled', source: 'Center Intake' },
    { date: 'Today, 03-Sep-2026', time: '10:15 AM', utr: 'GOV-DBT-719403', crop: 'Mustard (22.00 Qtl)', weight: '22.00 Qtl', amount: '₹ 1,24,300.00', farmer: 'Ramesh Rao (Village ABC)', survey: 'Survey #118/1A', bank: 'A/C 1811664902 (SBIN0001234)', bankAccount: '1811664902', bankIfsc: 'SBIN0001234', gate: 'Gate 2', token: '#TK-8489', status: '✓ Completed & DBT Settled', source: 'Center Intake' },
    { date: 'Today, 03-Sep-2026', time: '11:45 AM', utr: 'GOV-DBT-440192', crop: 'Soybean (15.00 Qtl)', weight: '15.00 Qtl', amount: '₹ 69,000.00', farmer: 'Kavita Devi (Village ABC)', survey: 'Survey #204/C', bank: 'A/C 1811664903 (SBIN0001234)', bankAccount: '1811664903', bankIfsc: 'SBIN0001234', gate: 'Gate 1', token: '#TK-8490', status: '✓ Completed & DBT Settled', source: 'Center Intake' },
    { date: 'Today, 03-Sep-2026', time: '01:20 PM', utr: 'GOV-DBT-319802', crop: 'Maize (30.00 Qtl)', weight: '30.00 Qtl', amount: '₹ 62,700.00', farmer: 'Anil Kumar (Village ABC)', survey: 'Survey #55/3', bank: 'A/C 1811664904 (SBIN0001234)', bankAccount: '1811664904', bankIfsc: 'SBIN0001234', gate: 'Gate 2', token: '#TK-8491', status: '✓ Completed & DBT Settled', source: 'Center Intake' }
  ];

  function getMasterProcurementHistory() {
    try {
      const stored = localStorage.getItem('cpc_master_procurement_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch(e) {}
    localStorage.setItem('cpc_master_procurement_history', JSON.stringify(DEFAULT_CENTER_HISTORY));
    return [...DEFAULT_CENTER_HISTORY];
  }

  function recordProcurementToMasterHistory(entry) {
    const list = getMasterProcurementHistory();
    // Verify no exact duplicate by UTR
    if (!list.some(item => item.utr === entry.utr)) {
      list.unshift(entry);
      localStorage.setItem('cpc_master_procurement_history', JSON.stringify(list));
    }
    try {
      if (typeof renderOfficerHistory === 'function') {
        renderOfficerHistory();
      }
    } catch(e) {}
  }

  window.getMasterProcurementHistory = getMasterProcurementHistory;
  window.recordProcurementToMasterHistory = recordProcurementToMasterHistory;

  // --- 5. Payment Session Archiver: Move Latest to Past ---
  function moveLatestPaymentToPast() {
    try {
      const storedLatest = localStorage.getItem('cpc_latest_payment');
      if (storedLatest) {
        const latestObj = JSON.parse(storedLatest);
        if (latestObj && latestObj.utr) {
          recordProcurementToMasterHistory(latestObj);
          localStorage.removeItem('cpc_latest_payment');
          localStorage.removeItem('cpc_procurement_finalized');
        }
      }
    } catch(e) {}
  }

  // --- 6. Logout Handler ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      moveLatestPaymentToPast();

      localStorage.removeItem('cpc_submitted_crop');
      localStorage.removeItem('cpc_submitted_qty');
      localStorage.removeItem('cpc_submitted_survey');
      localStorage.removeItem('cpc_bank_account');
      localStorage.removeItem('cpc_bank_ifsc');
      localStorage.removeItem('cpc_slot_booked');
      localStorage.removeItem('cpc_timer_completed');
      localStorage.removeItem('cpc_countdown_seconds');
      localStorage.removeItem('cpc_procurement_finalized');
      farmerBank.account = '';
      farmerBank.ifsc = '';
      isSlotBooked = false;
      isTimerCompleted = false;
      countdownSeconds = 15;
      clearInterval(countdownInterval);

      if (dashboardScreen && loginScreen) {
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        setQuickDockVisible(false);
        updateQuickSwitchSkin('farmer');
        showToast('Logged out of Farmer Portal', 'info');
      }
    });
  }

  // --- 6. Module Cards Click Handlers ---
  moduleCards.forEach(card => {
    card.addEventListener('click', () => {
      const moduleKey = card.getAttribute('data-module');
      openModuleDetail(moduleKey);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const moduleKey = card.getAttribute('data-module');
        openModuleDetail(moduleKey);
      }
    });
  });

  // ==========================================================================
  // REAL-WORLD WEIGHBRIDGE QUEUE MANAGEMENT DATA & HELPERS
  // ==========================================================================
  const DEFAULT_QUEUE_MEMBERS = [
    { token: '#TK-8487', name: 'Ramesh Naidu', vehicle: 'AP-39-TK-1142', crop: 'Paddy (Grade A)', qty: '45.0 Qtl' },
    { token: '#TK-8488', name: 'Venkat Reddy', vehicle: 'AP-26-TR-8819', crop: 'Cotton (Medium)', qty: '32.5 Qtl' },
    { token: '#TK-8489', name: 'K. Lakshmi Narayana', vehicle: 'AP-04-TX-9901', crop: 'Wheat (FAQ)', qty: '60.0 Qtl' },
    { token: '#TK-8490', name: 'Srinivas Rao', vehicle: 'AP-16-TG-2304', crop: 'Paddy (Grade A)', qty: '40.0 Qtl' },
    { token: '#TK-8491', name: 'Appala Swamy', vehicle: 'AP-31-TK-5567', crop: 'Maize (Hybrid)', qty: '28.0 Qtl' }
  ];

  function getQueueState(sec) {
    if (sec <= 0 || isTimerCompleted) {
      return {
        vehiclesAhead: 0,
        activeMemberIndex: 5,
        estWait: '0s (Gate Clear)',
        servingToken: '#TK-8492 (YOUR TURN)',
        userStatus: '🚨 ACTIVE AT GATE 2'
      };
    }
    const vehiclesAhead = Math.min(5, Math.max(1, Math.ceil(sec / 3)));
    const activeMemberIndex = 5 - vehiclesAhead; // 0..4
    const servingToken = DEFAULT_QUEUE_MEMBERS[activeMemberIndex] ? DEFAULT_QUEUE_MEMBERS[activeMemberIndex].token : '#TK-8487';
    const estWait = `~${sec}s remaining`;
    const userStatus = `#${vehiclesAhead + 1} in Queue`;

    return {
      vehiclesAhead,
      activeMemberIndex,
      estWait,
      servingToken,
      userStatus
    };
  }

  function renderQueueTableRows(sec) {
    const qState = getQueueState(sec);
    const userCrop = localStorage.getItem('cpc_submitted_crop') || 'Paddy (Grade A)';
    const userQty = (localStorage.getItem('cpc_submitted_qty') || '50') + ' Qtl';
    const userToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
    const userName = (dashFarmerName ? dashFarmerName.textContent : '') || registeredFarmer.name || 'Rahul Sharma';

    let html = '';

    DEFAULT_QUEUE_MEMBERS.forEach((m, idx) => {
      let rowClass = '';
      let statusBadge = '';

      if (idx < qState.activeMemberIndex || qState.vehiclesAhead === 0) {
        rowClass = 'queue-row-cleared';
        statusBadge = '<span class="queue-badge cleared">✓ Cleared &amp; Unloaded</span>';
      } else if (idx === qState.activeMemberIndex && qState.vehiclesAhead > 0) {
        rowClass = 'queue-row-active';
        statusBadge = '<span class="queue-badge weighing"><span class="live-dot-pulse"></span> Weighbridge Bay 1 (Active)</span>';
      } else {
        rowClass = '';
        statusBadge = '<span class="queue-badge waiting">⏳ In Center Line</span>';
      }

      html += `
        <tr class="${rowClass}">
          <td style="font-weight: 700; font-family: monospace;">${m.token}</td>
          <td>
            <strong>${m.name}</strong>
            <div style="font-size: 10.5px; color: #7B8B7F;">${m.vehicle}</div>
          </td>
          <td>${m.crop} <span style="font-size: 11px; color: #64746A;">(${m.qty})</span></td>
          <td>${statusBadge}</td>
        </tr>
      `;
    });

    // Add User's row
    const isUserActive = qState.vehiclesAhead === 0;
    const userRowClass = isUserActive ? 'queue-row-user live-now' : 'queue-row-user';
    const userBadge = isUserActive 
      ? '<span class="queue-badge your-turn"><span class="live-dot-pulse"></span> 🚨 PROCEED TO BAY 2 (NOW LIVE)</span>'
      : `<span class="queue-badge waiting">⏳ Waiting (#${qState.vehiclesAhead + 1} in line)</span>`;

    html += `
      <tr class="${userRowClass}">
        <td style="font-weight: 800; font-family: monospace; color: #143525;">${userToken} (YOU)</td>
        <td>
          <strong style="color: #143525;">${userName}</strong>
          <div style="font-size: 10.5px; color: #1E824C; font-weight: 600;">Vehicle: AP-29-BA-5512</div>
        </td>
        <td>${userCrop} <span style="font-size: 11px; color: #143525; font-weight: 600;">(${userQty})</span></td>
        <td>${userBadge}</td>
      </tr>
    `;

    return html;
  }

  function updateLiveQueueDisplay(sec) {
    const qState = getQueueState(sec);
    const kpiAhead = document.getElementById('queueKpiAhead');
    const kpiServing = document.getElementById('queueKpiServing');
    const kpiWait = document.getElementById('queueKpiWait');
    const kpiUser = document.getElementById('queueKpiUser');
    const tableBody = document.getElementById('queueTableBody');

    if (kpiAhead) {
      if (qState.vehiclesAhead === 0) {
        kpiAhead.textContent = '0 (ENTRY GRANTED)';
        kpiAhead.className = 'queue-kpi-val cleared';
      } else {
        kpiAhead.textContent = qState.vehiclesAhead;
        kpiAhead.className = 'queue-kpi-val highlight-ahead';
      }
    }
    if (kpiServing) kpiServing.textContent = qState.servingToken;
    if (kpiWait) kpiWait.textContent = qState.estWait;
    if (kpiUser) kpiUser.textContent = qState.userStatus;
    if (tableBody) tableBody.innerHTML = renderQueueTableRows(sec);
  }

  // --- 7. Core Interface Renderer: openModuleDetail ---
  function openModuleDetail(moduleKey) {
    if (!dashDetailModal || !dashModalBody) return;

    const curLang = localStorage.getItem('cpc_selected_lang') || 'en';
    const t = FARMER_TRANSLATIONS[curLang] || FARMER_TRANSLATIONS.en;

    let title = '';
    let category = 'PROCUREMENT SERVICE';
    let bodyHtml = '';

    switch (moduleKey) {
      case 'schedule':
        title = t.mod1Title;
        category = `${t.mod1Title} • KHARIF MARKETING SEASON (KMS 2026-27)`;
        bodyHtml = `
          <!-- 1. Real-World Center Operational Banner -->
          <div class="schedule-context-banner">
            <div class="schedule-context-left">
              <span class="schedule-season-tag">OFFICIAL KHARIF MARKETING SEASON (KMS) 2026-27</span>
              <h3 class="schedule-center-title">State Agricultural Cooperative Center (Village ABC)</h3>
              <p class="schedule-center-sub">Designated Central Procurement Center • Center Code: <strong>CPC-AP-VIL-ABC-04</strong> • Operating Hours: <strong>08:00 AM – 05:00 PM</strong></p>
            </div>
            <div class="schedule-context-badge">
              <span class="live-dot-pulse"></span>
              <span>LIVE INTAKE &amp; WEIGHMENT ACTIVE</span>
            </div>
          </div>

          <!-- 2. Real-World Center Operations & Capacity KPI Summary -->
          <div class="schedule-kpi-grid">
            <div class="schedule-kpi-card">
              <span class="kpi-label">ACTIVE CROPS</span>
              <span class="kpi-value">5 Commodities</span>
              <span class="kpi-sub">Paddy, Cotton, Maize, Groundnut, Ragi</span>
            </div>
            <div class="schedule-kpi-card">
              <span class="kpi-label">DAILY INTAKE CAP</span>
              <span class="kpi-value">1,200 Qtl / Day</span>
              <span class="kpi-sub">24 Weighbridge Slots per Day</span>
            </div>
            <div class="schedule-kpi-card">
              <span class="kpi-label">FARMER QUOTA</span>
              <span class="kpi-value">25 Qtl / Farmer / Day</span>
              <span class="kpi-sub">Max 100 Qtl Seasonal Ceiling</span>
            </div>
            <div class="schedule-kpi-card">
              <span class="kpi-label">DBT SETTLEMENT</span>
              <span class="kpi-value" style="color: #1E824C;">24 – 48 Hours</span>
              <span class="kpi-sub">Direct Bank Account Credit</span>
            </div>
          </div>

          <!-- 3. Government MSP Crop Procurement Calendar & Intake Matrix -->
          <div class="payment-section-heading" style="margin-top: 10px; margin-bottom: 6px;">
            <span>📋 OFFICIAL MSP PROCUREMENT SCHEDULE &amp; OPERATIONAL CALENDAR</span>
          </div>
          <div class="detail-table-wrap" style="margin-top: 6px; margin-bottom: 20px;">
            <table class="detail-table schedule-table">
              <thead>
                <tr>
                  <th>Crop &amp; Official Grade</th>
                  <th>Govt. MSP (₹/Qtl)</th>
                  <th>Farmer Registration</th>
                  <th>Weighbridge Intake Window</th>
                  <th>Assaying FAQ Standard</th>
                  <th>Intake Status</th>
                  <th>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                <tr class="schedule-row-active">
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 22px;">🌾</span>
                      <div>
                        <strong>Paddy (Common &amp; Grade A)</strong>
                        <div style="font-size: 11px; color: #7B8B7F;">Kharif 2026-27 Primary Crop</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style="color: #143525; font-size: 13.5px;">₹2,320 – ₹2,340</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 600;">+ ₹117 MSP Increase</div>
                  </td>
                  <td>15 Aug – 25 Sep 2026</td>
                  <td>
                    <strong>01 Sep – 31 Dec 2026</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 700;">● Today Open for Weighment</div>
                  </td>
                  <td>Moisture ≤ 17.0%<br>Foreign Matter ≤ 1.0%</td>
                  <td><span class="badge-tag badge-success">🟢 Live Intake Active</span></td>
                  <td>
                    <button type="button" class="btn-schedule-action" onclick="window.goToSlotBooking();" title="Book Weighbridge Slot for Paddy">
                      Book Slot →
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 22px;">☁️</span>
                      <div>
                        <strong>Cotton (Medium &amp; Long Staple)</strong>
                        <div style="font-size: 11px; color: #7B8B7F;">CCI Designated Procurement</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style="color: #143525; font-size: 13.5px;">₹7,121 – ₹7,521</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 600;">+ ₹501 MSP Increase</div>
                  </td>
                  <td>01 Sep – 15 Oct 2026</td>
                  <td>
                    <strong>15 Oct 2026 – 15 Feb 2027</strong>
                    <div style="font-size: 10.5px; color: #D35400;">Intake starts 15 Oct</div>
                  </td>
                  <td>Moisture ≤ 8.0%<br>Trash Content ≤ 3.5%</td>
                  <td><span class="badge-tag" style="background: #FFF3CD; color: #856404; border: 1px solid #FFEEBA;">🟡 Registration Open</span></td>
                  <td>
                    <button type="button" class="btn-schedule-action outline" onclick="window.goToFormFilling();" title="Register Cotton Harvest in Form Filling">
                      Register Crop →
                    </button>
                  </td>
                </tr>

                <tr class="schedule-row-active">
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 22px;">🌽</span>
                      <div>
                        <strong>Maize (Kharif FAQ)</strong>
                        <div style="font-size: 11px; color: #7B8B7F;">Cooperative Feed &amp; Grain Pool</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style="color: #143525; font-size: 13.5px;">₹2,225</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 600;">+ ₹135 MSP Increase</div>
                  </td>
                  <td>20 Aug – 30 Sep 2026</td>
                  <td>
                    <strong>10 Sep – 30 Nov 2026</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 700;">● Slots Open (Bay 1 &amp; 2)</div>
                  </td>
                  <td>Moisture ≤ 14.0%<br>Weeviled Grain ≤ 1.0%</td>
                  <td><span class="badge-tag badge-success">🟢 Live Intake Active</span></td>
                  <td>
                    <button type="button" class="btn-schedule-action" onclick="window.goToSlotBooking();" title="Book Weighbridge Slot for Maize">
                      Book Slot →
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 22px;">🥜</span>
                      <div>
                        <strong>Groundnut (In Shell Pods)</strong>
                        <div style="font-size: 11px; color: #7B8B7F;">NAFED Oilseeds Scheme</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style="color: #143525; font-size: 13.5px;">₹6,783</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 600;">+ ₹406 MSP Increase</div>
                  </td>
                  <td>15 Sep – 31 Oct 2026</td>
                  <td>
                    <strong>01 Nov 2026 – 15 Jan 2027</strong>
                    <div style="font-size: 10.5px; color: #64746A;">Intake starts 01 Nov</div>
                  </td>
                  <td>Moisture ≤ 8.0%<br>Shelling Recovery ≥ 70%</td>
                  <td><span class="badge-tag badge-pending">📅 Upcoming Window</span></td>
                  <td>
                    <button type="button" class="btn-schedule-action outline" onclick="window.goToFormFilling();" title="Pre-register Groundnut Produce">
                      Pre-Register →
                    </button>
                  </td>
                </tr>

                <tr class="schedule-row-active">
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 22px;">🌾</span>
                      <div>
                        <strong>Ragi / Finger Millet (Shree Anna)</strong>
                        <div style="font-size: 11px; color: #7B8B7F;">Nutri-Cereal Special Pool</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style="color: #143525; font-size: 13.5px;">₹4,290</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 600;">+ ₹444 MSP Increase</div>
                  </td>
                  <td>01 Sep – 30 Sep 2026</td>
                  <td>
                    <strong>05 Sep – 15 Dec 2026</strong>
                    <div style="font-size: 10.5px; color: #1E824C; font-weight: 700;">● Intake Active</div>
                  </td>
                  <td>Moisture ≤ 12.0%<br>Immature Grain ≤ 3.0%</td>
                  <td><span class="badge-tag badge-success">🟢 Live Intake Active</span></td>
                  <td>
                    <button type="button" class="btn-schedule-action" onclick="window.goToSlotBooking();" title="Book Weighbridge Slot for Ragi">
                      Book Slot →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 4. Real-World End-to-End Workflow Pathway (Matching Website Modules 1 to 6) -->
          <div class="schedule-workflow-roadmap">
            <div class="roadmap-header">
              <h4>🔄 REAL-WORLD END-TO-END WEBSITE WORKFLOW (6 PHASES)</h4>
              <p>How the Procurement Schedule integrates with each operational module in this portal:</p>
            </div>
            <div class="roadmap-steps-grid">
              <div class="roadmap-step-card current" onclick="window.goToSchedule();" title="Phase 1: You are currently viewing the Procurement Schedule">
                <span class="step-badge">STAGE 01</span>
                <div class="step-icon">📅</div>
                <strong class="step-title">Procurement Schedule</strong>
                <p class="step-desc">Verify MSP prices, active intake dates, and daily center quotas.</p>
                <span class="step-status-tag">Active Viewing</span>
              </div>

              <div class="roadmap-step-card" onclick="window.goToFormFilling();" title="Proceed to Phase 2: Produce Registration Form">
                <span class="step-badge">STAGE 02</span>
                <div class="step-icon">📝</div>
                <strong class="step-title">Produce Registration</strong>
                <p class="step-desc">Register land survey #, crop variety, harvest weight &amp; bank DBT.</p>
                <span class="step-jump-link">Open Module 2 →</span>
              </div>

              <div class="roadmap-step-card" onclick="window.goToSlotBooking();" title="Proceed to Phase 3: Center &amp; Slot Booking">
                <span class="step-badge">STAGE 03</span>
                <div class="step-icon">⏰</div>
                <strong class="step-title">Slot Reservation</strong>
                <p class="step-desc">Book morning/afternoon slot at Village ABC cooperative center.</p>
                <span class="step-jump-link">Open Module 3 →</span>
              </div>

              <div class="roadmap-step-card" onclick="window.goToTokenStatus();" title="Proceed to Phase 4: Live Token Queue Status">
                <span class="step-badge">STAGE 04</span>
                <div class="step-icon">🎟️</div>
                <strong class="step-title">Live Queue Status</strong>
                <p class="step-desc">Track token #TK-8492 with 5-vehicle countdown dispatching.</p>
                <span class="step-jump-link">Open Module 4 →</span>
              </div>

              <div class="roadmap-step-card" onclick="window.goToFinalizeProcurement();" title="Proceed to Phase 5: Finalize Procurement &amp; Assaying">
                <span class="step-badge">STAGE 05</span>
                <div class="step-icon">⚖️</div>
                <strong class="step-title">Assaying &amp; Stamp</strong>
                <p class="step-desc">Quality inspection, moisture grading &amp; official stamp certification.</p>
                <span class="step-jump-link">Open Module 5 →</span>
              </div>

              <div class="roadmap-step-card" onclick="window.goToPaymentHistory();" title="Proceed to Phase 6: Direct Benefit Transfer (DBT)">
                <span class="step-badge">STAGE 06</span>
                <div class="step-icon">💳</div>
                <strong class="step-title">DBT Settlement</strong>
                <p class="step-desc">Direct government bank credit within 24-48h with live UTR receipt.</p>
                <span class="step-jump-link">Open Module 6 →</span>
              </div>
            </div>
          </div>

          <!-- 5. Government Quality Guidelines & Operational Notice Box -->
          <div class="schedule-notice-box">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <span style="font-size: 24px;">📢</span>
              <div>
                <strong style="color: #143525; font-size: 13.5px;">Official Central Guidelines for Kharif 2026-27 Intake:</strong>
                <ul style="margin: 6px 0 0 18px; padding: 0; font-size: 12px; color: #4A584E; line-height: 1.6;">
                  <li><strong>Mandatory Documents at Weighbridge Gate:</strong> Farmer Registration Token Receipt, Aadhaar Card, Land Record/Patta Passbook (Survey No.), and Bank Passbook copy.</li>
                  <li><strong>Quality Inspection Protocol:</strong> Paddy moisture must not exceed 17.0%. Produce above 17% must be dried in the center's drying yard before electronic weighment.</li>
                  <li><strong>Direct Benefit Transfer (DBT) Assurance:</strong> Central treasury settlement is initiated into your Aadhaar-linked bank account within 24 to 48 hours of Assayer certification.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 6. Direct Workflow Navigation Bar -->
          <div class="workflow-nav-bar">
            <button type="button" class="workflow-btn workflow-btn-primary" onclick="window.goToFormFilling();">
              <span>Register Produce for Intake (Module 2)</span>
              <span>🌱</span>
            </button>
            <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.goToSlotBooking();">
              <span>Book Weighbridge Slot (Module 3)</span>
              <span>📅</span>
            </button>
            <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.print();" style="flex: none; min-width: 150px;">
              <span>Print Official Schedule</span>
              <span>🖨️</span>
            </button>
          </div>
        `;
        break;

      case 'form-filling':
        title = t.mod2Title;
        category = `${t.mod2Title} & PRODUCE INTAKE`;

        // STRICT CHECK: One In-Progress Consignment Policy
        if (hasActiveInProgressProcurement()) {
          const activeCrop = localStorage.getItem('cpc_submitted_crop') || 'Paddy / Rice';
          const activeQty = localStorage.getItem('cpc_submitted_qty') || '50.00';
          const activeSurvey = localStorage.getItem('cpc_submitted_survey') || 'Survey #402/1A';
          const activeToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
          const activeSlotDate = localStorage.getItem('cpc_booked_date') || '2026-09-05';
          const activeSlotTime = localStorage.getItem('cpc_booked_slot') || 'Morning Slot (08:00 AM - 12:00 PM)';
          const isTimerDone = localStorage.getItem('cpc_timer_completed') === 'true';
          const isCert = (localStorage.getItem('cpc_certified_token') === activeToken) && (localStorage.getItem('cpc_assaying_certified') === 'true');

          let stageText = 'Stage 4: Live Weighbridge Queue Dispatch';
          if (isCert) {
            stageText = 'Stage 5 Certified • Awaiting DBT Settlement (Stage 6)';
          } else if (isTimerDone) {
            stageText = 'Stage 5: Weighbridge Assaying Gate (Awaiting Officer Stamp)';
          }

          bodyHtml = `
            <div class="reg-locked-container">
              <div class="reg-locked-header">
                <div class="reg-locked-icon-wrap">🔒</div>
                <div>
                  <span class="reg-locked-badge">ONE CONSIGNMENT POLICY ACTIVE</span>
                  <h3 class="reg-locked-title">PRODUCE REGISTRATION FORM LOCKED</h3>
                  <p class="reg-locked-desc">
                    You currently have an active produce consignment in progress (Token <strong>${activeToken}</strong>). Under central government procurement guidelines, farmers cannot submit another registration form until the in-progress Direct Benefit Transfer (DBT) payment is completed, or until the consignment is declined.
                  </p>
                </div>
              </div>

              <!-- Active Consignment Status Box -->
              <div class="reg-locked-card">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F0EDE6; padding-bottom: 8px; margin-bottom: 12px;">
                  <span style="font-size: 12px; font-weight: 800; color: #143525;">ACTIVE CONSIGNMENT SUMMARY</span>
                  <span class="badge-tag badge-success" style="font-size: 10.5px;">● In Intake Pipeline</span>
                </div>
                <div class="reg-locked-grid">
                  <div class="reg-locked-item">
                    <span class="reg-locked-label">Active Token</span>
                    <span class="reg-locked-val" style="color: #1E824C;">${activeToken}</span>
                  </div>
                  <div class="reg-locked-item">
                    <span class="reg-locked-label">Commodity &amp; Quantity</span>
                    <span class="reg-locked-val">${activeCrop} • ${activeQty} Qtl</span>
                  </div>
                  <div class="reg-locked-item">
                    <span class="reg-locked-label">Land Record</span>
                    <span class="reg-locked-val">${activeSurvey}</span>
                  </div>
                  <div class="reg-locked-item">
                    <span class="reg-locked-label">Booked Slot</span>
                    <span class="reg-locked-val">${activeSlotDate} (${activeSlotTime.split('(')[0]})</span>
                  </div>
                  <div class="reg-locked-item" style="grid-column: 1 / -1;">
                    <span class="reg-locked-label">Current Pipeline Stage</span>
                    <span class="reg-locked-val" style="color: #856404;">${stageText}</span>
                  </div>
                </div>

                <div class="reg-locked-progress-wrap">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #7A5112;">
                    <span>CONSIGNMENT LIFECYCLE PROGRESS</span>
                    <span>1 Active In-Pipeline</span>
                  </div>
                  <div class="reg-progress-steps">
                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 2<br>Form Filled</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 3<br>Slot Booked</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isTimerDone ? 'done' : 'current'}">${isTimerDone ? '✓' : '4'}</div>
                      <span class="reg-step-label">Stage 4<br>Queue Dispatch</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'done' : (isTimerDone ? 'current' : '')}">${isCert ? '✓' : '5'}</div>
                      <span class="reg-step-label">Stage 5<br>Assaying &amp; Price</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'current' : ''}">6</div>
                      <span class="reg-step-label">Stage 6<br>DBT Release</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Direct Navigation to Advance the Consignment -->
              <div>
                <p style="font-size: 12px; font-weight: 700; color: #143525; margin-bottom: 8px;">
                  Continue Your Active Consignment:
                </p>
                <div class="reg-locked-actions">
                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToTokenStatus();">
                    <span>🎟️ Track Token Queue (Module 4)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToFinalizeProcurement();">
                    <span>⚖️ Review Price &amp; Assaying (Module 5)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav secondary" onclick="window.goToPaymentHistory();">
                    <span>💳 DBT Payment History (Module 6)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav danger" onclick="window.initiateDeclinePriceFlow();">
                    <span>❌ Decline Price &amp; Release Lock</span>
                    <span>✕</span>
                  </button>
                </div>
              </div>
            </div>
          `;
          break;
        }

        const currentSavedCrop = localStorage.getItem('cpc_submitted_crop') || '';
        const currentSavedQty = localStorage.getItem('cpc_submitted_qty') || '';
        const currentSavedSurvey = localStorage.getItem('cpc_submitted_survey') || '';

        bodyHtml = `
          <form id="dashFarmerRegForm" onsubmit="event.preventDefault(); window.submitFarmerFormFilling();">
            <div class="modal-form-grid single-col">
              <div class="modal-input-group full-width">
                <label for="ffName">Farmer Full Name (Default)</label>
                <input type="text" id="ffName" value="${registeredFarmer.name || 'Rahul'}" readonly style="background: #F4EFE6; font-weight: 600; color: #143525; cursor: default;">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffMobile">Registered Mobile Number (Default)</label>
                <input type="tel" id="ffMobile" value="${registeredFarmer.mobile || '9876543210'}" readonly style="background: #F4EFE6; font-weight: 600; color: #143525; cursor: default;">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffVillage">Designated Procurement Village (Default)</label>
                <input type="text" id="ffVillage" value="VILLAGE ABC" readonly style="background: #F4EFE6; font-weight: 600; color: #143525; cursor: default;">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffSurvey">Land Survey Number *</label>
                <input type="text" id="ffSurvey" value="${currentSavedSurvey}" required placeholder="e.g. Survey #402/1A or Plot 12B">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffCrop">Agricultural Produce / Crop *</label>
                <select id="ffCrop" required>
                  <option value="" disabled ${!currentSavedCrop ? 'selected' : ''}>Select Agricultural Produce ▼</option>
                  <option value="Wheat" ${currentSavedCrop === 'Wheat' ? 'selected' : ''}>Wheat - MSP ₹2,275/Qtl</option>
                  <option value="Paddy / Rice" ${currentSavedCrop === 'Paddy / Rice' ? 'selected' : ''}>Paddy / Rice - MSP ₹2,183/Qtl</option>
                  <option value="Mustard" ${currentSavedCrop === 'Mustard' ? 'selected' : ''}>Mustard - MSP ₹5,650/Qtl</option>
                  <option value="Soybean" ${currentSavedCrop === 'Soybean' ? 'selected' : ''}>Soybean - MSP ₹4,600/Qtl</option>
                  <option value="Cotton" ${currentSavedCrop === 'Cotton' ? 'selected' : ''}>Cotton - MSP ₹7,020/Qtl</option>
                  <option value="Gram / Chana" ${currentSavedCrop === 'Gram / Chana' ? 'selected' : ''}>Gram / Chana - MSP ₹5,440/Qtl</option>
                  <option value="Maize" ${currentSavedCrop === 'Maize' ? 'selected' : ''}>Maize - MSP ₹2,090/Qtl</option>
                </select>
              </div>

              <div class="modal-input-group full-width">
                <label for="ffQty">Expected Crop Weight *</label>
                <div class="input-with-unit">
                  <input type="number" id="ffQty" min="1" max="5000" step="0.5" value="${currentSavedQty}" required placeholder="Enter expected weight in Quintals">
                  <span class="unit-badge">QUINTALS</span>
                </div>
              </div>

              <div class="modal-input-group full-width" style="margin-top: 6px;">
                <label for="ffBank">Bank Account Number *</label>
                <input type="text" id="ffBank" value="${farmerBank.account || ''}" required placeholder="Enter bank account number">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffIfsc">Bank IFSC Code *</label>
                <input type="text" id="ffIfsc" value="${farmerBank.ifsc || ''}" required placeholder="Enter IFSC code" maxlength="11" style="text-transform: uppercase;">
              </div>
            </div>

            <button type="submit" class="modal-submit-btn" style="margin-top: 20px;">
              <span>SUBMIT FORM</span>
              <span>→</span>
            </button>
          </form>
        `;
        break;

      case 'slot-booking':
        title = t.mod3Title;
        category = `${t.mod3Title} & QUEUE ALLOCATION`;

        if (isSlotBooked) {
          const bookedCrop = localStorage.getItem('cpc_submitted_crop') || 'Produce';
          const bookedQty = localStorage.getItem('cpc_submitted_qty') || '0';
          const activeToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #1E824C; border-radius: 14px; padding: 32px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">🎟️</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                SLOT ALREADY CONFIRMED &amp; TOKEN ACTIVE
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 480px; margin: 0 auto 18px auto;">
                You have already booked a weighbridge intake slot for <strong>${bookedSlotDetails.date} (${bookedSlotDetails.slot})</strong> for <strong>${bookedCrop} (${bookedQty} Qtl)</strong>. Active Token <strong>${activeToken}</strong> has been generated and is in the weighbridge dispatch queue.
              </p>
              <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <button type="button" class="modal-submit-btn" onclick="window.goToTokenStatus();" style="max-width: 320px;">
                  <span>Track Live Token &amp; Weighbridge Queue</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          `;
          break;
        }

        const submittedCropLabel = localStorage.getItem('cpc_submitted_crop');
        const submittedQtyVal = localStorage.getItem('cpc_submitted_qty');

        if (!submittedCropLabel || !submittedQtyVal) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">📝</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                CROP REGISTRATION FORM REQUIRED
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Please fill the <strong>Form Filling and Crop Registration</strong> form first with your agricultural produce, expected weight, and bank details before booking a procurement slot.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToFormFilling();" style="max-width: 340px; margin: 0 auto;">
                <span>Go to Form Filling & Crop Registration</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else {
          bodyHtml = `
            <div style="background: #F9F5EE; border: 1px solid #DFC396; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #7A5112; text-transform: uppercase;">Ready for Delivery</span>
                <p style="font-size: 13.5px; font-weight: 700; color: #143525; margin-top: 2px;">${submittedCropLabel} • ${submittedQtyVal} Quintals</p>
              </div>
              <button type="button" class="btn-modal-back" onclick="window.goToFormFilling();" style="font-size: 11px; padding: 4px 10px;">Edit Produce ✎</button>
            </div>

            <form id="slotBookingForm" onsubmit="event.preventDefault(); window.submitSlotBooking();">
              <div class="modal-form-grid single-col">
                <div class="modal-input-group full-width">
                  <label>PROCUREMENT CENTER</label>
                  <input type="text" value="STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)" readonly style="background: #F3ECE2; font-weight: 600; color: #143525; border-color: var(--accent-gold);">
                </div>

                <div class="modal-input-group full-width">
                  <label for="slotProcurementDate">Preferred Intake Date *</label>
                  <input type="date" id="slotProcurementDate" value="${bookedSlotDetails.date || '2026-09-05'}" required>
                </div>

                <div class="modal-input-group full-width">
                  <label>Select Preferred Time Window *</label>
                  <div class="slot-select-grid">
                    <label class="slot-card-option">
                      <input type="radio" name="slotTimeChoice" value="morning" checked>
                      <div class="slot-card-info">
                        <strong>Morning Slot (08:00 AM - 12:00 PM)</strong>
                        <span class="slot-avail-badge" id="morningSlotCount">${slotState.morning} Slots Available</span>
                      </div>
                    </label>
                    <label class="slot-card-option">
                      <input type="radio" name="slotTimeChoice" value="afternoon">
                      <div class="slot-card-info">
                        <strong>Afternoon Slot (01:00 PM - 05:00 PM)</strong>
                        <span class="slot-avail-badge" id="afternoonSlotCount">${slotState.afternoon} Slots Available</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" class="modal-submit-btn" style="margin-top: 20px;">
                <span>Confirm Reservation & Generate Live Token</span>
                <span>→</span>
              </button>
            </form>
          `;
        }
        break;

      case 'token-status':
        title = t.mod4Title;
        category = `${t.mod4Title} & WEIGHBRIDGE DISPATCH & LIVE TOKEN`;

        if (!isSlotBooked) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">🎟️</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                SLOT BOOKING REQUIRED
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 460px; margin: 0 auto 16px auto;">
                Please complete your slot booking in the <strong>Procurement Center & Slot Booking</strong> option to generate your token number and start the real-world queue tracker with 5 default vehicles ahead.
              </p>
              <div style="display: flex; flex-direction: column; gap: 10px; max-width: 360px; margin: 0 auto;">
                <button type="button" class="modal-submit-btn" onclick="window.goToSlotBooking();">
                  <span>Go to Procurement Center &amp; Slot Booking</span>
                  <span>→</span>
                </button>
                <button type="button" class="modal-submit-btn" onclick="window.resimulateLiveQueue();" style="background: transparent; border: 1.5px solid #DFC396; color: #143525; box-shadow: none;">
                  <span>⚡ Instant Demo: Start 5-Vehicle Live Queue</span>
                  <span>▶</span>
                </button>
              </div>
            </div>
          `;
        } else {
          let gateText = 'Weighbridge Gate 2 (North Entry)';
          let dateSlotText = `${bookedSlotDetails.date}, ${bookedSlotDetails.slot}`;

          let timerHeader = isTimerCompleted ? 'WEIGHBRIDGE QUEUE STATUS' : '⏱️ LIVE WEIGHBRIDGE QUEUE COUNTDOWN';
          let badgeClass = isTimerCompleted ? 'badge-success' : 'badge-pending';
          let badgeText = isTimerCompleted ? 'YOUR TURN RIGHT NOW' : 'Queue Processing...';
          let digitDisplay = isTimerCompleted ? '0s (LIVE!)' : countdownSeconds + 's';
          let digitClass = isTimerCompleted ? 'live-alert' : '';
          let progressWidth = (countdownSeconds / 15) * 100;
          let subtextMsg = isTimerCompleted 
            ? '✅ Token #TK-8492 is active at Weighbridge Gate 2. 0 vehicles ahead! Please enter for assaying & payment.'
            : 'Slot confirmed! Real-world weighbridge queue active. Vehicles ahead are decreasing in real-time.';

          const qState = getQueueState(countdownSeconds);

          bodyHtml = `
            <!-- 1. Center Operational Details -->
            <div class="detail-table-wrap" style="margin-top: 4px; margin-bottom: 16px;">
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td><strong>Procurement Center</strong></td>
                    <td>STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)</td>
                  </tr>
                  <tr>
                    <td><strong>Assigned Weighbridge</strong></td>
                    <td>${gateText}</td>
                  </tr>
                  <tr>
                    <td><strong>PROCUREMENT OFFICER</strong></td>
                    <td>Inspector V. S. Deshmukh (Desk 3)</td>
                  </tr>
                  <tr>
                    <td><strong>Reserved Slot</strong></td>
                    <td>${dateSlotText}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 2. Static 3D Gold Coin (ONLY TOKEN NUMBER) -->
            <div class="coin-3d-stage">
              <div class="coin-3d-wrap" title="Procurement Token #TK-8492">
                <div class="coin-shine-glimmer"></div>
                <div class="coin-inner-ring">
                  <span class="coin-token-text">#TK-8492</span>
                </div>
              </div>
              <div class="coin-shadow-aura"></div>
            </div>

            <!-- 3. REAL-WORLD LIVE QUEUE MANAGEMENT BOARD (5 MEMBERS DEFAULT + YOU) -->
            <div class="queue-board-container">
              <!-- KPI Summary Cards -->
              <div class="queue-kpi-grid">
                <div class="queue-kpi-card">
                  <div class="queue-kpi-label">VEHICLES AHEAD</div>
                  <div id="queueKpiAhead" class="queue-kpi-val ${qState.vehiclesAhead === 0 ? 'cleared' : 'highlight-ahead'}">
                    ${qState.vehiclesAhead === 0 ? '0 (ENTRY GRANTED)' : qState.vehiclesAhead}
                  </div>
                  <div class="queue-kpi-sub">5 Default in Queue</div>
                </div>
                <div class="queue-kpi-card">
                  <div class="queue-kpi-label">CURRENT ON SCALE</div>
                  <div id="queueKpiServing" class="queue-kpi-val" style="font-size: 14.5px;">
                    ${qState.servingToken}
                  </div>
                  <div class="queue-kpi-sub">Weighbridge Bay 1</div>
                </div>
                <div class="queue-kpi-card">
                  <div class="queue-kpi-label">EST. WAIT TIME</div>
                  <div id="queueKpiWait" class="queue-kpi-val" style="font-size: 14.5px;">
                    ${qState.estWait}
                  </div>
                  <div class="queue-kpi-sub">Real-Time Sensor Feed</div>
                </div>
                <div class="queue-kpi-card">
                  <div class="queue-kpi-label">YOUR STATUS</div>
                  <div id="queueKpiUser" class="queue-kpi-val" style="font-size: 13.5px;">
                    ${qState.userStatus}
                  </div>
                  <div class="queue-kpi-sub">Token #TK-8492</div>
                </div>
              </div>

              <!-- Live Queue Table of 5 Members + You -->
              <div class="queue-table-wrap">
                <table class="queue-table">
                  <thead>
                    <tr>
                      <th style="width: 16%;">Token #</th>
                      <th style="width: 32%;">Farmer &amp; Vehicle</th>
                      <th style="width: 24%;">Commodity</th>
                      <th style="width: 28%;">Live Queue Stage</th>
                    </tr>
                  </thead>
                  <tbody id="queueTableBody">
                    ${renderQueueTableRows(countdownSeconds)}
                  </tbody>
                </table>
              </div>

              <!-- Re-simulate / Status Footer Bar -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
                <button type="button" class="queue-resimulate-btn" onclick="window.resimulateLiveQueue();" title="Restart the real-world 5-member decreasing count simulation">
                  <span>🔄 Re-simulate 5-Vehicle Queue</span>
                </button>
                <span style="font-size: 11px; color: #64746A;">
                  ● Real-time electronic weighbridge queue synchronization active
                </span>
              </div>
            </div>

            <!-- 4. Real-Time Working Countdown Timer -->
            <div class="live-countdown-card">
              <div class="countdown-header-row">
                <span class="countdown-title">${timerHeader}</span>
                <span id="countdownStatusBadge" class="badge-tag ${badgeClass}">
                  ${badgeText}
                </span>
              </div>

              <div class="countdown-digit-wrap">
                <span id="countdownDisplay" class="countdown-digit ${digitClass}">
                  ${digitDisplay}
                </span>
              </div>

              <div class="countdown-progress-bar-bg">
                <div id="countdownProgressBar" class="countdown-progress-bar-fill" style="width: ${progressWidth}%"></div>
              </div>

              <p style="font-size: 12.5px; color: #64746A; margin-top: 10px;" id="countdownSubtext">
                ${subtextMsg}
              </p>
            </div>

            <div id="liveTurnActionArea" class="${isTimerCompleted ? '' : 'hidden'}" style="margin-top: 18px; width: 100%;">
              <button type="button" class="modal-submit-btn" onclick="window.goToFinalizeProcurement();">
                <span>FINALIZE PROCUREMENT</span>
                <span>→</span>
              </button>
            </div>
          `;
        }
        break;

      case 'finalize-procurement':
        title = t.mod5Title;
        category = `${t.mod5Title} & DBT AUTHORIZATION`;

        const isFinalized = localStorage.getItem('cpc_procurement_finalized') === 'true';

        // Check if farmer recently declined offer and has an Exit Gate Pass
        const latestDeclinedRaw = localStorage.getItem('cpc_latest_declined_pass');
        let latestDeclined = null;
        try { if (latestDeclinedRaw) latestDeclined = JSON.parse(latestDeclinedRaw); } catch(e) {}

        if (latestDeclined && !isSlotBooked && !hasActiveInProgressProcurement()) {
          bodyHtml = renderExitGatePassHtml(latestDeclined);
          break;
        }

        if (isFinalized) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">✅</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                NO LATEST PROCUREMENT PAYMENTS AWAITING SETTLEMENT
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 460px; margin: 0 auto 20px auto;">
                The previous Direct Benefit Transfer (DBT) payment has been successfully authorized and credited directly to your bank account. No pending intake batch is awaiting settlement.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToPaymentHistory();" style="max-width: 340px; margin: 0 auto;">
                <span>View Payment History & DBT Statements</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else if (!isSlotBooked) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">🎟️</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                PROCUREMENT SLOT & TOKEN REQUIRED
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Please book a slot in <strong>Procurement Center & Slot Booking</strong> first to generate your token before proceeding to weighbridge verification and payment.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToSlotBooking();" style="max-width: 340px; margin: 0 auto;">
                <span>Go to Procurement Center & Slot Booking</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else if (!isTimerCompleted) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">⏳</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                TOKEN QUEUE IN PROGRESS (${countdownSeconds}s REMAINING)
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Token #TK-8492 is currently in queue. Please wait until the 15-second countdown timer completes and your turn is reached before finalizing procurement and payment.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToTokenStatus();" style="max-width: 340px; margin: 0 auto;">
                <span>View Live Token Status (${countdownSeconds}s)</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else {
          const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
          const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
          
          // Verified actual weight <= Expected weight
          let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
          if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;

          const mspPerQtl = CROP_MSP_RATES[submittedCrop] || 2275;
          const totalApprovedAmount = actualWeightVal * mspPerQtl;

          const formattedExpected = expectedWeightVal.toFixed(2) + ' Quintals';
          const formattedActual = actualWeightVal.toFixed(2) + ' Quintals';
          const formattedMsp = '₹ ' + mspPerQtl.toLocaleString('en-IN') + ' per Quintal';
          const formattedTotal = '₹ ' + totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          bodyHtml = `
            <p style="margin-bottom: 14px; font-size: 13.5px; color: #4A5836;">
              Official weighbridge weight slip and quality certification ready for final farmer authorization:
            </p>
            <div class="detail-table-wrap">
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td><strong>Procurement Center</strong></td>
                    <td>STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)</td>
                  </tr>
                  <tr>
                    <td><strong>CROP / PRODUCE</strong></td>
                    <td><strong>${submittedCrop}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>EXPECTED WEIGHT</strong></td>
                    <td>${formattedExpected}</td>
                  </tr>
                  <tr>
                    <td><strong>ACTUAL VERIFIED WEIGHT</strong></td>
                    <td><strong style="color: #143525;">${formattedActual}</strong> <span style="font-size: 11px; color: #1E824C; background: #E8F7EE; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">(Verified Gross ≤ Expected)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Moisture Content & Grade</strong></td>
                    <td>10.8% • Grade FAQ (Fair Average Quality Certified)</td>
                  </tr>
                  <tr>
                    <td><strong>Government MSP Rate</strong></td>
                    <td>${formattedMsp}</td>
                  </tr>
                  <tr style="background: #FAF3E6;">
                    <td><strong style="font-size: 14.5px; color: #143525;">Total Approved DBT Amount</strong></td>
                    <td><strong style="font-size: 18px; color: #143525;">${formattedTotal}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          `;

          const activeTokenForModule = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
          const certifiedTokenForModule = localStorage.getItem('cpc_certified_token');
          const isModuleCertified = (certifiedTokenForModule === activeTokenForModule) && (localStorage.getItem('cpc_assaying_certified') === 'true');

          if (isModuleCertified) {
            bodyHtml += `
              <button type="button" class="modal-submit-btn" onclick="window.finalizePaymentAction('${formattedTotal}');" style="margin-top: 20px;">
                <span>FINALIZE PROCUREMENT &amp; CONFIRM DBT PAYMENT</span>
                <span>✓</span>
              </button>
            `;
          } else {
            bodyHtml += `
              <div style="background: #FFF8E7; border: 1.5px dashed #DFC396; border-radius: 10px; padding: 16px; margin-top: 20px; text-align: center;">
                <p style="font-size: 13.5px; font-weight: 700; color: #8C6510; margin-bottom: 6px;">
                  🔒 Quality Assaying Report Pending Officer Approval
                </p>
                <p style="font-size: 12px; color: #5A6A5E; line-height: 1.45; margin-bottom: 12px;">
                  Before Direct Benefit Transfer (DBT) payment can be authorized, the weighbridge gross weight and moisture report must be approved and certified by the Procurement Officer.
                </p>
                <button type="button" class="btn-officer-action" onclick="closeDashModal(); window.switchToOfficerPortal();" style="display: inline-block; padding: 8px 18px; font-size: 12px; background: #DFC396; color: #143525; font-weight: 800; border: none; border-radius: 6px; cursor: pointer;">
                  <span>🏛️ Go to Officer Desk to Approve &amp; Certify</span>
                </button>
              </div>
            `;
          }

          // Farmer Statutory Price Protection & Decline Option
          bodyHtml += `
            <div class="decline-price-container">
              <div class="decline-price-header">
                <div>
                  <span class="decline-price-tag">STATUTORY FARMER RIGHT</span>
                  <h4 class="decline-price-title">Not satisfied with the evaluated MSP price or net payable amount?</h4>
                  <p class="decline-price-desc">
                    Under statutory cooperative procurement regulations, you are not obligated to sell if the assessed moisture deductions, weighbridge weight (<strong>${formattedActual}</strong>), or net MSP valuation (<strong>${formattedTotal}</strong>) do not meet your expectations. You have the full right to decline this offer without penalty and withdraw your produce with an official Exit Gate Pass.
                  </p>
                </div>
              </div>
              <button type="button" id="btnDeclinePrice" class="btn-decline-price-offer" onclick="window.initiateDeclinePriceFlow();" title="Decline evaluated price offer and withdraw produce">
                <span>❌ DECLINE PRICE OFFER &amp; WITHDRAW PRODUCE</span>
              </button>
            </div>
          `;
        }
        break;

      case 'payment-history':
        title = 'TRANSACTION & PAYMENT HISTORY';
        category = 'DIRECT BENEFIT TRANSFER (DBT) & TRANSACTION STATEMENTS';

        const allTransactions = getMasterProcurementHistory();

        let latestPaymentData = null;
        try {
          latestPaymentData = JSON.parse(localStorage.getItem('cpc_latest_payment'));
        } catch(e) {}

        // If no active session latest, use the most recent transaction from history
        if (!latestPaymentData && allTransactions && allTransactions.length > 0) {
          latestPaymentData = allTransactions[0];
        }

        // Calculate summary metrics
        let totalDbtNum = 0;
        let totalWeightNum = 0;
        allTransactions.forEach(item => {
          let amt = parseFloat((item.amount || '0').replace(/[^\d.]/g, '')) || 0;
          totalDbtNum += amt;
          let wt = item.crop?.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : (item.weight || '40.00 Qtl');
          totalWeightNum += (parseFloat(wt.replace(/[^\d.]/g, '')) || 0);
        });

        const formattedTotalDbt = '₹ ' + totalDbtNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const primaryAcc = farmerBank.account || localStorage.getItem('cpc_bank_account') || (latestPaymentData?.bankAccount) || '1811664901';
        const primaryIfsc = farmerBank.ifsc || localStorage.getItem('cpc_bank_ifsc') || (latestPaymentData?.bankIfsc) || 'SBIN0001234';

        let justReceivedHtml = '';
        if (latestPaymentData) {
          justReceivedHtml = `
            <div class="just-received-card">
              <div class="just-received-top">
                <span class="just-received-badge">⚡ LATEST TRANSACTION SETTLEMENT</span>
                <button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${latestPaymentData.utr}');" style="font-size: 11px; padding: 4px 10px;">
                  <span>Print Receipt 📄</span>
                </button>
              </div>
              <div class="just-received-amount">${latestPaymentData.amount}</div>
              <div class="just-received-grid">
                <div class="just-received-cell">
                  <span>Transaction UTR</span>
                  <strong><code>${latestPaymentData.utr}</code></strong>
                </div>
                <div class="just-received-cell">
                  <span>Token #</span>
                  <strong><code>${latestPaymentData.token || '#TK-8492'}</code></strong>
                </div>
                <div class="just-received-cell">
                  <span>Crop & Verified Weight</span>
                  <strong>${latestPaymentData.crop}</strong>
                </div>
                <div class="just-received-cell">
                  <span>Credited Date</span>
                  <strong>${latestPaymentData.date}</strong>
                </div>
                <div class="just-received-cell">
                  <span>Credited Bank Account</span>
                  <strong>A/C ${latestPaymentData.bankAccount || primaryAcc} (${latestPaymentData.bankIfsc || primaryIfsc})</strong>
                </div>
                <div class="just-received-cell">
                  <span>Status</span>
                  <strong style="color: #1E824C;">● Direct DBT Credited</strong>
                </div>
              </div>
            </div>
          `;
        }

        let transactionRowsHtml = allTransactions.map((item, idx) => {
          const itemBank = item.bank || (item.bankAccount ? `A/C ${item.bankAccount}` : `A/C ${primaryAcc}`);
          const itemWeight = item.crop?.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : (item.weight || 'Verified Qtl');
          const cropName = item.crop?.split('(')[0].trim() || 'Agricultural Produce';
          return `
            <tr>
              <td>${item.date}</td>
              <td><strong><code>${item.token || `#TK-${8492 - idx}`}</code></strong></td>
              <td><code>${item.utr}</code></td>
              <td><strong>${cropName}</strong></td>
              <td>${itemWeight}</td>
              <td><strong style="color: #1E824C;">${item.amount}</strong></td>
              <td><small>${itemBank}</small></td>
              <td><span class="badge-tag badge-success">${item.status || '✓ Completed & DBT Settled'}</span></td>
              <td>
                <button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${item.utr}');" style="padding: 3px 8px; font-size: 11px;">Receipt 📄</button>
              </td>
            </tr>
          `;
        }).join('');

        bodyHtml = `
          <p style="margin-bottom: 14px; font-size: 13.5px; color: #4A5836;">
            Official direct government MSP subsidy & procurement bank settlement statements for <strong>${registeredFarmer.name || 'Rahul'}</strong>:
          </p>

          <!-- Summary Statistic Chips -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 18px;">
            <div style="background: #F4EAD9; border: 1.5px solid #DFC396; border-radius: 10px; padding: 10px 14px;">
              <span style="font-size: 11px; font-weight: 700; color: #7A694F; text-transform: uppercase;">Total DBT Credited</span>
              <div style="font-size: 17px; font-weight: 800; color: #143525; margin-top: 2px;">${formattedTotalDbt}</div>
            </div>
            <div style="background: #FFFFFF; border: 1.5px solid #DFC396; border-radius: 10px; padding: 10px 14px;">
              <span style="font-size: 11px; font-weight: 700; color: #7B8B7F; text-transform: uppercase;">Settled Transactions</span>
              <div style="font-size: 17px; font-weight: 800; color: #143525; margin-top: 2px;">${allTransactions.length} Completed</div>
            </div>
            <div style="background: #FFFFFF; border: 1.5px solid #DFC396; border-radius: 10px; padding: 10px 14px;">
              <span style="font-size: 11px; font-weight: 700; color: #7B8B7F; text-transform: uppercase;">Total Produce Sold</span>
              <div style="font-size: 17px; font-weight: 800; color: #143525; margin-top: 2px;">${totalWeightNum.toFixed(2)} Quintals</div>
            </div>
          </div>

          <!-- 1. FEATURED / LATEST SETTLEMENT SECTION -->
          <div class="payment-section-heading">
            <span>⚡ LATEST TRANSACTION SETTLEMENT</span>
          </div>
          ${justReceivedHtml}

          <!-- 2. ALL TRANSACTION RECORDS SECTION -->
          <div class="payment-section-heading" style="margin-top: 20px;">
            <span>📜 ALL TRANSACTION RECORDS &amp; DBT STATEMENTS</span>
          </div>
          <div class="detail-table-wrap">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Token #</th>
                  <th>Transaction / UTR No.</th>
                  <th>Crop</th>
                  <th>Net Weight</th>
                  <th>DBT Amount</th>
                  <th>Bank Account</th>
                  <th>Status</th>
                  <th>Voucher</th>
                </tr>
              </thead>
              <tbody>
                ${transactionRowsHtml}
              </tbody>
            </table>
          </div>

          <div class="workflow-nav-bar">
            <button type="button" class="workflow-btn workflow-btn-primary" onclick="window.print();">
              <span>Print Consolidated Statement (PDF)</span>
              <span>🖨️</span>
            </button>
            <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.goToFormFilling();">
              <span>Submit Next Crop Batch</span>
              <span>🌱</span>
            </button>
          </div>
        `;
        break;
    }

    if (dashModalTitle) dashModalTitle.textContent = title;
    if (dashModalCategory) dashModalCategory.textContent = category;
    dashModalBody.innerHTML = bodyHtml;

    dashDetailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // If token status module is opened, check if timer should run
    if (moduleKey === 'token-status') {
      startTokenCountdownTimer();
    }
  }

  // --- Real-Time Live Countdown Timer Handler with 5-Member Queue Decreasing Count ---
  function startTokenCountdownTimer() {
    clearInterval(countdownInterval);

    if (!isSlotBooked || isTimerCompleted) {
      updateLiveQueueDisplay(0);
      return;
    }

    // Immediately render current queue status
    updateLiveQueueDisplay(countdownSeconds);

    if (countdownSeconds > 0) {
      countdownInterval = setInterval(() => {
        if (countdownSeconds > 0 && isSlotBooked && !isTimerCompleted) {
          countdownSeconds--;
          localStorage.setItem('cpc_countdown_seconds', countdownSeconds.toString());

          const display = document.getElementById('countdownDisplay');
          const bar = document.getElementById('countdownProgressBar');
          if (display) display.textContent = countdownSeconds + 's';
          if (bar) bar.style.width = ((countdownSeconds / 15) * 100) + '%';

          // Update real-world 5-member queue decreasing count live
          updateLiveQueueDisplay(countdownSeconds);

          if (countdownSeconds === 0) {
            clearInterval(countdownInterval);
            isTimerCompleted = true;
            localStorage.setItem('cpc_timer_completed', 'true');
            handleTokenTurnReached();
          }
        }
      }, 1000);
    } else {
      isTimerCompleted = true;
      localStorage.setItem('cpc_timer_completed', 'true');
      handleTokenTurnReached();
    }
  }

  function handleTokenTurnReached() {
    const display = document.getElementById('countdownDisplay');
    const badge = document.getElementById('countdownStatusBadge');
    const subtext = document.getElementById('countdownSubtext');
    const actionArea = document.getElementById('liveTurnActionArea');

    if (display) {
      display.textContent = '0s (LIVE!)';
      display.classList.add('live-alert');
    }
    if (badge) {
      badge.className = 'badge-tag badge-success';
      badge.textContent = 'YOUR TURN RIGHT NOW';
    }
    if (subtext) {
      subtext.textContent = '✅ Token #TK-8492 is active! Vehicles ahead: 0. Please enter Weighbridge Gate 2.';
    }
    if (actionArea) {
      actionArea.classList.remove('hidden');
    }

    // Ensure queue board reflects 0 vehicles ahead and green highlight
    updateLiveQueueDisplay(0);

    const liveMsg = 'It is your turn right now! Vehicles ahead: 0. Please proceed to FINALIZE PROCUREMENT & PAYMENT for further procedure.';
    showToast(liveMsg, 'success');

    // Add alert notification with deep-link
    addNotificationAlert('🚨 TOKEN #TK-8492 IS LIVE!', liveMsg, 'finalize-procurement');
  }

  // --- Re-simulate Live Queue Handler ---
  window.resimulateLiveQueue = function() {
    isSlotBooked = true;
    isTimerCompleted = false;
    countdownSeconds = 15;
    localStorage.setItem('cpc_slot_booked', 'true');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');
    openModuleDetail('token-status');
    startTokenCountdownTimer();
    showToast('🔄 Real-world 5-member queue simulation restarted (15s decreasing countdown)', 'info');
  };

  // --- Inter-Module Global Navigation Links ---
  window.goToSchedule = function() {
    openModuleDetail('schedule');
  };

  window.goToFormFilling = function() {
    openModuleDetail('form-filling');
  };

  window.goToSlotBooking = function() {
    openModuleDetail('slot-booking');
  };

  window.goToTokenStatus = function() {
    openModuleDetail('token-status');
  };

  window.goToFinalizeProcurement = function() {
    openModuleDetail('finalize-procurement');
  };

  window.goToPaymentHistory = function() {
    openModuleDetail('payment-history');
  };

  window.openModuleDetail = openModuleDetail;
  window.closeDashModal = closeDashModal;



  // --- Form Filling Submission Handler ---
  window.submitFarmerFormFilling = function() {
    // STRICT LOCK: Farmer cannot fill another form while an in-progress consignment is awaiting DBT completion
    if (hasActiveInProgressProcurement()) {
      const activeToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
      showToast(`⚠️ Registration Locked! Active consignment (${activeToken}) is already in progress. Complete DBT settlement first.`, 'error');
      return;
    }

    const name = document.getElementById('ffName')?.value.trim();
    const mobile = document.getElementById('ffMobile')?.value.trim();
    const village = document.getElementById('ffVillage')?.value.trim();
    const survey = document.getElementById('ffSurvey')?.value.trim();
    const crop = document.getElementById('ffCrop')?.value;
    const qty = document.getElementById('ffQty')?.value.trim();
    const bankAc = document.getElementById('ffBank')?.value.trim();
    const ifsc = document.getElementById('ffIfsc')?.value.trim();

    if (!name || !mobile || !village || !survey || !crop || !qty || !bankAc || !ifsc) {
      showToast('Please fill all mandatory (*) fields including Land Survey Number, Bank Account & IFSC', 'error');
      return;
    }

    farmerBank.account = bankAc;
    farmerBank.ifsc = ifsc;

    // Persist crop, quantity, survey, and bank details
    if (crop) localStorage.setItem('cpc_submitted_crop', crop);
    if (qty) localStorage.setItem('cpc_submitted_qty', qty);
    if (survey) localStorage.setItem('cpc_submitted_survey', survey);
    if (bankAc) localStorage.setItem('cpc_bank_account', bankAc);
    if (ifsc) localStorage.setItem('cpc_bank_ifsc', ifsc);

    // RESET token countdown cycle & procurement finalized state for new crop submission
    clearInterval(countdownInterval);
    isSlotBooked = false;
    isTimerCompleted = false;
    countdownSeconds = 15;
    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');
    localStorage.setItem('cpc_procurement_finalized', 'false');

    // Notification toast
    const successMsg = 'Your form has been successfully filled, go to slot selection for booking your slot.';
    showToast(successMsg, 'success');

    // Reset bell notifications on fresh form submission & add new alert with deep link
    resetNotificationCenter();
    addNotificationAlert(`Form Registered (${crop})`, successMsg, 'slot-booking');

    // Auto-advance seamlessly to Slot Booking interface
    setTimeout(() => {
      openModuleDetail('slot-booking');
    }, 300);
  };

  // --- Slot Booking Submission Handler ---
  window.submitSlotBooking = function() {
    const selectedSlotRadio = document.querySelector('input[name="slotTimeChoice"]:checked');
    const chosenSlotType = selectedSlotRadio ? selectedSlotRadio.value : 'morning';
    const chosenDate = document.getElementById('slotProcurementDate')?.value || '2026-09-05';
    const slotTitle = chosenSlotType === 'morning' ? 'Morning Slot (08:00 AM - 12:00 PM)' : 'Afternoon Slot (01:00 PM - 05:00 PM)';

    // Decrease slot count by 1
    if (chosenSlotType === 'morning' && slotState.morning > 0) {
      slotState.morning -= 1;
      localStorage.setItem('cpc_slot_morning', slotState.morning.toString());
    } else if (chosenSlotType === 'afternoon' && slotState.afternoon > 0) {
      slotState.afternoon -= 1;
      localStorage.setItem('cpc_slot_afternoon', slotState.afternoon.toString());
    }

    // Mark slot as booked & reset 15-second queue
    isSlotBooked = true;
    isTimerCompleted = false;
    countdownSeconds = 15;
    bookedSlotDetails.date = chosenDate;
    bookedSlotDetails.slot = slotTitle;

    localStorage.setItem('cpc_slot_booked', 'true');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');
    localStorage.setItem('cpc_booked_date', chosenDate);
    localStorage.setItem('cpc_booked_slot', slotTitle);

    // Start timer immediately in background
    startTokenCountdownTimer();

    // Notification toast
    const toastMsg = `Slot booked successfully at STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC) for ${chosenDate}! Token #TK-8492 is now in queue.`;
    showToast(toastMsg, 'success');

    // Add notification with deep-link
    addNotificationAlert(`Slot Confirmed #TK-8492`, `Booked on ${chosenDate} (${slotTitle}). Token queue started.`, 'token-status');

    // Auto-advance seamlessly to Token Status interface
    setTimeout(() => {
      openModuleDetail('token-status');
    }, 300);
  };

  // --- Finalize Payment Release Handler ---
  window.finalizePaymentAction = function(amountStr, customToken) {
    const activeTokenToCheck = customToken || localStorage.getItem('cpc_active_token_no') || '#TK-8492';
    const stampEl = document.getElementById('activeTokenCertifiedStamp');
    const isStampPresent = stampEl && !stampEl.classList.contains('hidden');
    const isCertified = (localStorage.getItem('cpc_certified_token') === activeTokenToCheck) && 
                        (localStorage.getItem('cpc_assaying_certified') === 'true') && 
                        isStampPresent;

    if (!isCertified || !isStampPresent) {
      showToast('⚠️ Certified Stamp Missing on Token! Assaying report must be certified & stamped before authorizing DBT payment.', 'error');
      
      const btnDbt = document.getElementById('btnOfficerReleaseDbt');
      if (btnDbt) {
        btnDbt.classList.remove('btn-shake-locked');
        void btnDbt.offsetWidth;
        btnDbt.classList.add('btn-shake-locked');
        setTimeout(() => btnDbt.classList.remove('btn-shake-locked'), 600);
      }

      const btnCertify = document.getElementById('btnCertifyAssaying');
      if (btnCertify) {
        btnCertify.scrollIntoView({ behavior: 'smooth', block: 'center' });
        btnCertify.classList.remove('certify-attention-pulse');
        void btnCertify.offsetWidth;
        btnCertify.classList.add('certify-attention-pulse');
        setTimeout(() => btnCertify.classList.remove('certify-attention-pulse'), 1500);
      }
      return false;
    }

    const displayAmount = amountStr || '₹ 1,09,200.00';
    const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
    const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
    let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
    if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;

    const todayStr = 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newUtr = 'GOV-DBT-' + Math.floor(100000 + Math.random() * 900000);
    
    let cycleCount = 0;
    try {
      cycleCount = parseInt(localStorage.getItem('cpc_cycle_count') || '0', 10);
    } catch(e) {}
    cycleCount++;
    localStorage.setItem('cpc_cycle_count', cycleCount.toString());

    const tokenNo = customToken || localStorage.getItem('cpc_active_token_no') || `#TK-${8492 + (cycleCount - 1)}`;
    const isDemo = localStorage.getItem('cpc_is_demo') === 'true';
    const demoFarmer = localStorage.getItem('cpc_demo_farmer');
    const farmerDisplayName = (isDemo && demoFarmer)
      ? `${demoFarmer} (Village ABC)`
      : (registeredFarmer.name ? `${registeredFarmer.name} (Village ABC)` : 'Rahul (Village ABC)');
    const farmerSurveyVal = localStorage.getItem('cpc_submitted_survey') || 'Survey #402/1A';
    const farmerAccVal = localStorage.getItem('cpc_bank_account') || farmerBank.account || '1811664901';
    const farmerIfscVal = localStorage.getItem('cpc_bank_ifsc') || farmerBank.ifsc || 'SBIN0001234';

    const newPayment = {
      date: todayStr,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      utr: newUtr,
      token: tokenNo,
      farmer: farmerDisplayName,
      survey: farmerSurveyVal,
      crop: `${submittedCrop} (${actualWeightVal} Qtl)`,
      weight: `${actualWeightVal} Qtl`,
      amount: displayAmount,
      bankAccount: farmerAccVal,
      bankIfsc: farmerIfscVal,
      bank: `A/C ${farmerAccVal} (IFSC: ${farmerIfscVal})`,
      gate: 'Gate 2',
      status: '✓ Completed & DBT Settled',
      source: isDemo ? 'Demo Consignment Intake' : 'Center Intake'
    };

    // Store latest settled UTR so the history table can visually highlight this new record
    localStorage.setItem('cpc_latest_settled_utr', newUtr);

    // Record permanently in Central Master Procurement Registry
    recordProcurementToMasterHistory(newPayment);

    // Save in session storage
    localStorage.setItem('cpc_latest_payment', JSON.stringify(newPayment));
    localStorage.setItem('cpc_procurement_finalized', 'true');

    // Reset slot status after DBT completion
    isSlotBooked = false;
    isTimerCompleted = false;
    countdownSeconds = 15;
    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');

    const creditedAccount = farmerAccVal;

    // Reset previously entered values of Crop, Weight, Survey for next cycle
    localStorage.removeItem('cpc_submitted_crop');
    localStorage.removeItem('cpc_submitted_qty');
    localStorage.removeItem('cpc_submitted_survey');
    localStorage.removeItem('cpc_is_demo');
    localStorage.removeItem('cpc_demo_farmer');
    localStorage.removeItem('cpc_certified_token');
    localStorage.setItem('cpc_assaying_certified', 'false');

    showToast(`Payment of ${displayAmount} authorized! Transferred via DBT to Bank Account (Ref: ${newUtr}).`, 'success');

    // Add alert notification with deep-link
    addNotificationAlert('💰 DBT PAYMENT CREDITED', `${displayAmount} credited to Bank A/C ${creditedAccount} (Ref: ${newUtr}).`, 'payment-history');

    // Update Officer Queue Table immediately with this new procurement record
    populateOfficerDeskDetails();

    // If on Farmer Dashboard, auto-advance seamlessly to Payment History interface
    const officerScreen = document.getElementById('officerDashboardScreen');
    const isOfficerActive = officerScreen && !officerScreen.classList.contains('hidden');
    if (!isOfficerActive) {
      setTimeout(() => {
        openModuleDetail('payment-history');
      }, 300);
    }
  };

  // --- Farmer Decline Procurement Price Flow & Dialog ---
  window.initiateDeclinePriceFlow = function() {
    const dashModalTitle = document.getElementById('dashModalTitle');
    const dashModalCategory = document.getElementById('dashModalCategory');
    const dashModalBody = document.getElementById('dashModalBody');
    if (!dashModalBody) return;

    if (dashModalCategory) dashModalCategory.textContent = 'FARMER PRICE PROTECTION • STATUTORY OPTION';
    if (dashModalTitle) dashModalTitle.textContent = 'DECLINE MSP VALUATION & WITHDRAW PRODUCE';

    const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
    const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
    let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
    if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;
    const mspPerQtl = CROP_MSP_RATES[submittedCrop] || 2275;
    const totalApprovedAmount = actualWeightVal * mspPerQtl;
    const formattedActual = actualWeightVal.toFixed(2) + ' Quintals';
    const formattedMsp = '₹ ' + mspPerQtl.toLocaleString('en-IN') + ' per Quintal';
    const formattedTotal = '₹ ' + totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    dashModalBody.innerHTML = `
      <div class="decline-dialog-card">
        <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px;">
          <div style="font-size: 32px;">⚠️</div>
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #721C24; margin: 0 0 4px 0;">
              DECLINE THIS MSP PROCUREMENT OFFER?
            </h3>
            <p style="font-size: 12.5px; color: #5A6A5E; line-height: 1.45; margin: 0;">
              You are currently reviewing the evaluated valuation for <strong>${submittedCrop} (${formattedActual})</strong> with net DBT payout of <strong>${formattedTotal}</strong> at <strong>${formattedMsp}</strong>.
            </p>
          </div>
        </div>

        <div style="background: #FAF7F2; border: 1px solid #DFC396; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px;">
          <span style="font-size: 11px; font-weight: 800; color: #7A5112; text-transform: uppercase;">Statutory Farmer Protection Guarantee:</span>
          <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 11.5px; color: #4A584E; line-height: 1.5;">
            <li>Zero penalty or deduction will be charged for declining this procurement valuation.</li>
            <li>An official Central Procurement Center Exit Gate Pass will be generated instantly for vehicle dispatch.</li>
            <li>Your produce registration lock will be immediately released, allowing you to submit a new harvest registration form.</li>
          </ul>
        </div>

        <label style="font-size: 11.5px; font-weight: 800; color: #143525; text-transform: uppercase;">
          Please Select Reason for Declining Price Offer:
        </label>

        <div class="decline-reasons-group">
          <label class="decline-reason-option">
            <input type="radio" name="declineReasonChoice" value="MSP valuation or total payout is below market expectations" checked>
            <span>MSP valuation / total payout is below my price expectations</span>
          </label>
          <label class="decline-reason-option">
            <input type="radio" name="declineReasonChoice" value="Dispute with weighbridge gross weight or moisture deduction reading">
            <span>Dispute with weighbridge gross weight or moisture deduction reading</span>
          </label>
          <label class="decline-reason-option">
            <input type="radio" name="declineReasonChoice" value="Prefer to store in cooperative warehouse for future seasonal sale">
            <span>Prefer to store in cooperative warehouse for future seasonal sale</span>
          </label>
          <label class="decline-reason-option">
            <input type="radio" name="declineReasonChoice" value="Selling produce directly to private local millers / open market">
            <span>Selling produce directly to private local millers / open market</span>
          </label>
        </div>

        <div class="decline-action-bar">
          <button type="button" class="btn-decline-cancel" onclick="openModuleDetail('finalize-procurement');">
            ← Cancel &amp; Keep Offer
          </button>
          <button type="button" class="btn-decline-confirm" onclick="window.executeDeclinePriceOffer();">
            ✓ Confirm Decline &amp; Issue Gate Pass
          </button>
        </div>
      </div>
    `;
  };

  // --- Farmer Decline Procurement Price Execution ---
  window.executeDeclinePriceOffer = function() {
    const selectedReasonRadio = document.querySelector('input[name="declineReasonChoice"]:checked');
    const selectedReason = selectedReasonRadio ? selectedReasonRadio.value : 'MSP valuation below farmer expectations';

    const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
    const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
    let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
    if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;
    const formattedActual = actualWeightVal.toFixed(2) + ' Qtl';
    const mspPerQtl = CROP_MSP_RATES[submittedCrop] || 2275;
    const totalApprovedAmount = actualWeightVal * mspPerQtl;
    const activeToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
    const todayStr = 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const gatePassId = 'EGP-2026-' + Math.floor(100000 + Math.random() * 900000);

    const declineRecord = {
      date: todayStr,
      time: timeStr,
      passId: gatePassId,
      utr: 'WITHDRAWN-' + Math.floor(100000 + Math.random() * 900000),
      token: activeToken,
      farmer: (registeredFarmer.name || 'Rahul') + ' (Village ABC)',
      survey: localStorage.getItem('cpc_submitted_survey') || 'Survey #402/1A',
      crop: `${submittedCrop} (${formattedActual})`,
      weight: formattedActual,
      amount: '₹ 0.00 (Declined)',
      bankAccount: farmerBank.account || '1811664901',
      bankIfsc: farmerBank.ifsc || 'SBIN0001234',
      bank: 'Withdrawn by Farmer',
      gate: 'Exit Gate 1',
      status: '❌ Declined by Farmer (Unsatisfactory Price)',
      source: 'Farmer Withdrawal',
      reason: selectedReason
    };

    // Permanently log in master procurement registry
    recordProcurementToMasterHistory(declineRecord);

    // Save latest gate pass for display
    localStorage.setItem('cpc_latest_declined_pass', JSON.stringify(declineRecord));

    // RELEASE IN-PROGRESS CONSIGNMENT & FORM REGISTRATION LOCK
    isSlotBooked = false;
    isTimerCompleted = false;
    countdownSeconds = 15;
    clearInterval(countdownInterval);

    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');
    localStorage.removeItem('cpc_submitted_crop');
    localStorage.removeItem('cpc_submitted_qty');
    localStorage.removeItem('cpc_submitted_survey');
    localStorage.removeItem('cpc_certified_token');
    localStorage.setItem('cpc_assaying_certified', 'false');
    localStorage.removeItem('cpc_procurement_finalized');

    // Notify farmer
    showToast(`Price offer declined. Exit Gate Pass ${gatePassId} generated. Produce registration form unlocked.`, 'info');
    addNotificationAlert('❌ Produce Withdrawn (Price Declined)', `Exit Gate Pass ${gatePassId} issued for ${submittedCrop}. Registration form unlocked.`, 'finalize-procurement');

    // Refresh officer desk queue if open
    populateOfficerDeskDetails();

    // Render Exit Gate Pass slip in modal
    const dashModalBody = document.getElementById('dashModalBody');
    const dashModalTitle = document.getElementById('dashModalTitle');
    const dashModalCategory = document.getElementById('dashModalCategory');
    if (dashModalCategory) dashModalCategory.textContent = 'CONSIGNMENT WITHDRAWAL • GATE PASS';
    if (dashModalTitle) dashModalTitle.textContent = 'VEHICLE EXIT GATE PASS';
    if (dashModalBody) {
      dashModalBody.innerHTML = renderExitGatePassHtml(declineRecord);
    }
  };

  // --- Official Government DBT Receipt Voucher Modal ---
  window.openReceiptModal = function(utr) {
    if (!receiptModal || !receiptModalBody) return;

    let targetPayment = null;
    try {
      const latest = JSON.parse(localStorage.getItem('cpc_latest_payment'));
      if (latest && latest.utr === utr) targetPayment = latest;
    } catch(e) {}

    if (!targetPayment) {
      try {
        const masterList = getMasterProcurementHistory();
        targetPayment = masterList.find(p => p.utr === utr);
      } catch(e) {}
    }

    if (!targetPayment) {
      targetPayment = {
        date: 'Today, 03-Sep-2026',
        utr: utr || 'GOV-DBT-984210',
        token: '#TK-8492',
        farmer: registeredFarmer.name ? `${registeredFarmer.name} (Village ABC)` : 'Rahul (Village ABC)',
        survey: 'Survey #402/1A',
        crop: 'Wheat (48.00 Qtl)',
        amount: '₹ 1,09,200.00',
        bankAccount: '1811664901',
        bankIfsc: 'SBIN0001234',
        status: '✓ Credited via DBT'
      };
    }

    const displayAcc = targetPayment.bankAccount || farmerBank.account || localStorage.getItem('cpc_bank_account') || '1811664901';
    const displayIfsc = targetPayment.bankIfsc || farmerBank.ifsc || localStorage.getItem('cpc_bank_ifsc') || 'SBIN0001234';
    const displayFarmer = targetPayment.farmer || registeredFarmer.name || 'Rahul (Village ABC)';
    const displaySurvey = targetPayment.survey || 'Survey #402/1A';
    const displayToken = targetPayment.token || '#TK-8492';
    const isDeclinedVoucher = targetPayment.status && targetPayment.status.includes('Declined');
    const voucherPortalTitle = isDeclinedVoucher ? 'Consignment Withdrawal Gate Pass' : 'DBT Payment Receipt Voucher';
    const voucherTag = isDeclinedVoucher ? `Official Withdrawal Record • Token <code>${displayToken}</code>` : `Official Settlement Receipt • Token <code>${displayToken}</code>`;

    receiptModalBody.innerHTML = `
      <div class="receipt-header">
        <span class="receipt-gov-title">Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
        <h3 class="receipt-portal-title" id="receiptTitle">${voucherPortalTitle}</h3>
        <span class="receipt-tag">${voucherTag}</span>
      </div>

      <div class="receipt-grid">
        <div class="receipt-cell">
          <span class="receipt-cell-label">Beneficiary Farmer</span>
          <span class="receipt-cell-val">${displayFarmer}</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Mobile Number</span>
          <span class="receipt-cell-val">+91 ${registeredFarmer.mobile || '9876543210'}</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Land Survey Number</span>
          <span class="receipt-cell-val"><code>${displaySurvey}</code></span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Procure Batch / Crop</span>
          <span class="receipt-cell-val"><strong>${targetPayment.crop}</strong></span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">${isDeclinedVoucher ? 'Withdrawal Status' : 'Credited Bank Account'}</span>
          <span class="receipt-cell-val">${isDeclinedVoucher ? 'Withdrawn by Farmer (Price Declined)' : `A/C ${displayAcc} (IFSC: ${displayIfsc})`}</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Reference ID</span>
          <span class="receipt-cell-val"><code>${targetPayment.utr}</code></span>
        </div>
      </div>

      <div class="receipt-total-banner" style="${isDeclinedVoucher ? 'background: #721C24;' : ''}">
        <div>
          <span class="receipt-total-label">${isDeclinedVoucher ? 'OFFER DECLINED BY FARMER (ZERO CHARGES)' : 'DIRECT BENEFIT TRANSFER (DBT) AMOUNT'}</span>
          <div style="font-size: 11px; opacity: 0.85; margin-top: 2px;">Status: ${targetPayment.status} • ${targetPayment.date}</div>
        </div>
        <div class="receipt-total-val">${targetPayment.amount}</div>
      </div>

      <div class="receipt-actions">
        <button type="button" class="workflow-btn workflow-btn-primary" onclick="window.print();" style="flex: 1;">
          <span>Print / Save Voucher (PDF)</span>
          <span>🖨️</span>
        </button>
        <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.closeReceiptModal();" style="flex: 1;">
          <span>Close Voucher</span>
        </button>
      </div>
    `;

    receiptModal.classList.remove('hidden');
  };

  function closeReceiptModal() {
    if (receiptModal) receiptModal.classList.add('hidden');
  }
  window.closeReceiptModal = closeReceiptModal;
  if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', closeReceiptModal);

  // --- Close Dashboard Modal ---
  function closeDashModal() {
    if (dashDetailModal) {
      dashDetailModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (closeDashModalBtn) closeDashModalBtn.addEventListener('click', closeDashModal);
  if (dashDetailModal) {
    dashDetailModal.addEventListener('click', (e) => {
      if (e.target === dashDetailModal) closeDashModal();
    });
  }

  // --- Registration Modal Handlers ---
  if (openRegisterBtn && registerModal) {
    openRegisterBtn.addEventListener('click', () => {
      registerModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeModal = () => {
    if (registerModal) {
      registerModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', closeModal);
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (receiptModal && !receiptModal.classList.contains('hidden')) {
        closeReceiptModal();
      } else if (dashDetailModal && !dashDetailModal.classList.contains('hidden')) {
        closeDashModal();
      } else if (registerModal && !registerModal.classList.contains('hidden')) {
        closeModal();
      }
    }
  });

  // Format registration mobile input
  const regMobileInput = document.getElementById('regMobile');
  if (regMobileInput) {
    regMobileInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^\d\s+]/g, '');
    });
  }

  // Handle Registration Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('regFullName')?.value.trim();
      const regMob = document.getElementById('regMobile')?.value.trim();
      const regPass = document.getElementById('regPassword')?.value.trim();

      const digitsOnly = (regMob || '').replace(/\D/g, '');
      if (!fullName) {
        showToast('Please enter your full name', 'error');
        return;
      }
      if (!regMob || digitsOnly.length < 10) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
      }
      if (!regPass || regPass.length < 4) {
        showToast('Password must be at least 4 characters', 'error');
        return;
      }

      registeredFarmer = {
        name: fullName,
        mobile: regMob
      };
      localStorage.setItem('cpc_farmer_name', fullName);
      localStorage.setItem('cpc_farmer_mobile', regMob);

      closeModal();
      showToast(`Account created successfully for ${fullName}! Please login.`, 'success');
      
      // Auto pre-fill the login mobile & password inputs
      if (mobileInput && regMob) {
        mobileInput.value = regMob;
      }
      if (passwordInput && regPass) {
        passwordInput.value = regPass;
      }
      registerForm.reset();
    });
  }

  // --- Officer Workspace View Switcher (History vs Live Intake) ---
  window.switchOfficerDeskTab = function(tabName) {
    const historyView = document.getElementById('officerHistoryView');
    const intakeView = document.getElementById('officerIntakeView');
    const historyBtn = document.getElementById('officerTabHistoryBtn');
    const intakeBtn = document.getElementById('officerTabIntakeBtn');

    if (tabName === 'history') {
      if (historyView) historyView.classList.remove('hidden');
      if (intakeView) intakeView.classList.add('hidden');
      historyBtn?.classList.add('active');
      intakeBtn?.classList.remove('active');
      historyBtn?.setAttribute('aria-selected', 'true');
      intakeBtn?.setAttribute('aria-selected', 'false');
      renderOfficerHistory();
    } else {
      if (intakeView) intakeView.classList.remove('hidden');
      if (historyView) historyView.classList.add('hidden');
      intakeBtn?.classList.add('active');
      historyBtn?.classList.remove('active');
      intakeBtn?.setAttribute('aria-selected', 'true');
      historyBtn?.setAttribute('aria-selected', 'false');
    }
  };

  // --- Dynamic Rendering of Full Consolidated Procurement History from Central Ledger ---
  function renderOfficerHistory(filterQuery = '') {
    const officerHistoryTableBody = document.getElementById('officerHistoryTableBody');
    const officerHistoryCountTag = document.getElementById('officerHistoryCountTag');
    const officerHistoryTabCounter = document.getElementById('officerHistoryTabCounter');
    const histStatCount = document.getElementById('histStatCount');
    const histStatWeight = document.getElementById('histStatWeight');
    const histStatAmount = document.getElementById('histStatAmount');

    const masterHistoryList = getMasterProcurementHistory();

    let totalWeightNum = 0;
    let totalAmountNum = 0;

    masterHistoryList.forEach(item => {
      let weightStr = item.crop.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : (item.weight || '40.00 Qtl');
      let weightVal = parseFloat(weightStr.replace(/[^\d.]/g, '')) || 0;
      totalWeightNum += weightVal;

      let amountVal = parseFloat(item.amount.replace(/[^\d.]/g, '')) || 0;
      totalAmountNum += amountVal;
    });

    if (officerHistoryCountTag) {
      officerHistoryCountTag.textContent = `${masterHistoryList.length} TOTAL SETTLED RECORDS`;
    }
    if (officerHistoryTabCounter) {
      officerHistoryTabCounter.textContent = `${masterHistoryList.length} Settled`;
    }
    if (histStatCount) {
      histStatCount.textContent = `${masterHistoryList.length} Consignments`;
    }
    if (histStatWeight) {
      histStatWeight.textContent = `${totalWeightNum.toFixed(2)} Quintals`;
    }
    if (histStatAmount) {
      histStatAmount.textContent = `₹ ${totalAmountNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    if (!officerHistoryTableBody) return;

    let filteredList = masterHistoryList;
    if (filterQuery && filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase();
      filteredList = masterHistoryList.filter(item =>
        (item.farmer && item.farmer.toLowerCase().includes(q)) ||
        (item.token && item.token.toLowerCase().includes(q)) ||
        (item.crop && item.crop.toLowerCase().includes(q)) ||
        (item.utr && item.utr.toLowerCase().includes(q)) ||
        (item.survey && item.survey.toLowerCase().includes(q))
      );
    }

    if (filteredList.length === 0) {
      officerHistoryTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 28px; color: #7B8B7F; font-size: 13px;">
            🔍 No procurement records found matching "<strong>${filterQuery}</strong>". Click CLEAR to view all records.
          </td>
        </tr>
      `;
      return;
    }

    let historyHtml = '';
    const latestSettledUtr = localStorage.getItem('cpc_latest_settled_utr');
    filteredList.forEach(item => {
      let weightStr = item.crop.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : (item.weight || '40.00 Qtl');
      const surveyDisplay = item.survey || 'Survey #402/1A';
      const cropNameOnly = item.crop.split('(')[0].trim();
      const isLatest = item.utr === latestSettledUtr;
      const rowClass = isLatest ? 'class="row-newly-settled"' : '';
      const rowStyle = isLatest ? 'style="background: #EAF7EE; border-left: 4.5px solid #1E824C;"' : '';
      const statusBadge = isLatest
        ? `<span class="badge-tag badge-success" style="background: #1E824C; color: #FFFFFF; font-weight: 700;">✓ Just Settled (${item.token})</span>`
        : `<span class="badge-tag badge-success">${item.status}</span>`;

      historyHtml += `
        <tr ${rowClass} ${rowStyle}>
          <td>${item.date}</td>
          <td><strong><code>${item.token || '#TK-8490'}</code></strong></td>
          <td><strong>${item.farmer}</strong></td>
          <td><code>${surveyDisplay}</code></td>
          <td><strong>${cropNameOnly}</strong></td>
          <td><strong style="color: #143525;">${weightStr}</strong></td>
          <td><strong style="color: #1E824C;">${item.amount}</strong></td>
          <td><code>${item.utr}</code></td>
          <td>${statusBadge}</td>
          <td><button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${item.utr}');" style="padding: 3px 8px; font-size: 11px;">Voucher 📄</button></td>
        </tr>
      `;
    });

    officerHistoryTableBody.innerHTML = historyHtml;
  }
  window.renderOfficerHistory = renderOfficerHistory;

  // --- Render Today's Center Intake Queue Table ---
  function renderOfficerQueue(hasActiveConsignment, formattedActual, submittedCrop) {
    const officerQueueTableBody = document.getElementById('officerQueueTableBody');
    const officerQueueCountTag = document.getElementById('officerQueueCountTag');
    if (!officerQueueTableBody) return;

    const masterHistoryList = getMasterProcurementHistory();
    let queueHtml = '';

    // If there is an active live consignment at gate desk, prepend it first
    if (hasActiveConsignment) {
      queueHtml += `
        <tr style="background: #F2F9F4; border-left: 4px solid #1E824C;">
          <td><strong><code>#TK-8492</code></strong></td>
          <td><strong>${registeredFarmer.name || 'Rahul'} (Village ABC)</strong></td>
          <td><strong>${submittedCrop}</strong></td>
          <td>${formattedActual}</td>
          <td>Gate 2</td>
          <td><span class="badge-tag badge-success">● Active at Assaying Desk</span></td>
          <td><button type="button" class="btn-modal-back" onclick="window.officerInspectCurrent();" style="padding: 3px 8px; font-size: 11px;">Inspect 🔍</button></td>
        </tr>
      `;
    }

    masterHistoryList.forEach(item => {
      queueHtml += `
        <tr>
          <td><strong><code>${item.token || '#TK-8490'}</code></strong></td>
          <td><strong>${item.farmer}</strong></td>
          <td>${item.crop}</td>
          <td>${item.crop.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : (item.weight || 'Verified Qtl')}</td>
          <td>${item.gate || 'Gate 2'}</td>
          <td><span class="badge-tag badge-success">${item.status} (${item.amount})</span></td>
          <td><button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${item.utr}');" style="padding: 3px 8px; font-size: 11px;">Voucher 📄</button></td>
        </tr>
      `;
    });

    officerQueueTableBody.innerHTML = queueHtml;

    if (officerQueueCountTag) {
      const totalCount = masterHistoryList.length + (hasActiveConsignment ? 1 : 0);
      officerQueueCountTag.textContent = `${totalCount} CONSIGNMENTS IN TODAY'S QUEUE`;
    }
  }

  // --- Officer Desk Logic & Actions ---
  function populateOfficerDeskDetails(officerId) {
    const offFarmerName = document.getElementById('offFarmerName');
    const offFarmerMobile = document.getElementById('offFarmerMobile');
    const offCropName = document.getElementById('offCropName');
    const offExpectedWeight = document.getElementById('offExpectedWeight');
    const offActualWeight = document.getElementById('offActualWeight');
    const offMspRate = document.getElementById('offMspRate');
    const offTotalAmount = document.getElementById('offTotalAmount');
    const offBankDetails = document.getElementById('offBankDetails');
    const officerProfileId = document.getElementById('officerProfileId');
    const activeQueueRow = document.getElementById('activeQueueRow');
    const officerNoActiveTokenCard = document.getElementById('officerNoActiveTokenCard');
    const officerActiveConsignmentCard = document.getElementById('officerActiveConsignmentCard');
    const officerGateTag = document.getElementById('officerGateTag');
    const officerLiveIntakeBadge = document.getElementById('officerLiveIntakeBadge');

    if (officerProfileId && officerId) {
      officerProfileId.textContent = 'OFFICER ID: ' + officerId;
    }

    const slotBookedState = localStorage.getItem('cpc_slot_booked') === 'true';
    const timerCompletedState = localStorage.getItem('cpc_timer_completed') === 'true';
    const isFinalizedState = localStorage.getItem('cpc_procurement_finalized') === 'true';
    const hasActiveConsignment = slotBookedState && timerCompletedState && !isFinalizedState;

    const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
    const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
    let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
    if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;
    const formattedActual = actualWeightVal.toFixed(2) + ' Quintals';

    if (!hasActiveConsignment) {
      // No active token at gate
      if (officerNoActiveTokenCard) officerNoActiveTokenCard.classList.remove('hidden');
      if (officerActiveConsignmentCard) officerActiveConsignmentCard.classList.add('hidden');
      if (activeQueueRow) activeQueueRow.classList.add('hidden');
      if (officerGateTag) {
        officerGateTag.textContent = 'NO ACTIVE CONSIGNMENT AT GATE';
        officerGateTag.style.background = '#F0EDE6';
        officerGateTag.style.color = '#7B8B7F';
        officerGateTag.style.border = '1px solid #D8C7B0';
      }
      if (officerLiveIntakeBadge) {
        officerLiveIntakeBadge.textContent = 'Standby';
        officerLiveIntakeBadge.className = 'officer-tab-badge-live';
      }
    } else {
      // Active token present & 15s timer completed
      if (officerNoActiveTokenCard) officerNoActiveTokenCard.classList.add('hidden');
      if (officerActiveConsignmentCard) officerActiveConsignmentCard.classList.remove('hidden');
      if (activeQueueRow) activeQueueRow.classList.remove('hidden');
      if (officerGateTag) {
        officerGateTag.textContent = 'LIVE AT WEIGHBRIDGE GATE 2';
        officerGateTag.style.background = '#143525';
        officerGateTag.style.color = '#DFC396';
        officerGateTag.style.border = '1px solid #DFC396';
      }
      if (officerLiveIntakeBadge) {
        officerLiveIntakeBadge.textContent = '● 1 Active';
        officerLiveIntakeBadge.className = 'officer-tab-badge-live active-live';
      }

      const mspPerQtl = CROP_MSP_RATES[submittedCrop] || 2275;
      const totalApprovedAmount = actualWeightVal * mspPerQtl;

      const formattedExpected = expectedWeightVal.toFixed(2) + ' Quintals';
      const formattedMsp = '₹ ' + mspPerQtl.toLocaleString('en-IN') + ' per Quintal';
      const formattedTotal = '₹ ' + totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // Exact bank details entered by farmer during form filling
      const farmerAcc = localStorage.getItem('cpc_bank_account') || farmerBank.account || '181166';
      const farmerIfsc = localStorage.getItem('cpc_bank_ifsc') || farmerBank.ifsc || 'SBIN0001234';
      const farmerSurvey = localStorage.getItem('cpc_submitted_survey') || 'Survey #402/1A';

      const offSurveyCell = document.getElementById('offSurveyCell');
      if (offSurveyCell) offSurveyCell.textContent = `Village ABC (${farmerSurvey})`;

      const isDemo = localStorage.getItem('cpc_is_demo') === 'true';
      const demoFarmer = localStorage.getItem('cpc_demo_farmer');
      const demoMobile = localStorage.getItem('cpc_demo_farmer_mobile');
      const currentFarmerName = (isDemo && demoFarmer) ? demoFarmer : (registeredFarmer.name || 'Rahul');
      const currentFarmerMobile = (isDemo && demoMobile) ? demoMobile : (registeredFarmer.mobile || '9876543210');
      const currentToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';

      const offFarmerHeading = document.getElementById('officerFarmerHeading');
      const offTokenBadge = document.querySelector('.officer-token-badge');
      if (offTokenBadge) offTokenBadge.textContent = `ACTIVE TOKEN: ${currentToken}`;
      if (offFarmerHeading) offFarmerHeading.textContent = `Farmer: ${currentFarmerName} (Village ABC)`;

      if (offFarmerName) offFarmerName.textContent = currentFarmerName;
      if (offFarmerMobile) offFarmerMobile.textContent = '+91 ' + currentFarmerMobile;
      if (offCropName) offCropName.textContent = submittedCrop;
      if (offExpectedWeight) offExpectedWeight.textContent = formattedExpected;
      if (offActualWeight) offActualWeight.textContent = `${formattedActual} (Verified Gross ≤ Expected)`;
      if (offMspRate) offMspRate.textContent = formattedMsp;
      if (offTotalAmount) offTotalAmount.textContent = formattedTotal;
      if (offBankDetails) offBankDetails.textContent = `A/C ${farmerAcc} (IFSC: ${farmerIfsc})`;
    }

    // Update Assaying Certification and DBT Payment button prerequisite states
    const activeTokenNo = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
    const isAssayingCertified = (localStorage.getItem('cpc_certified_token') === activeTokenNo) && (localStorage.getItem('cpc_assaying_certified') === 'true');
    const badge = document.getElementById('officerAssayingBadge');
    const btnCertify = document.getElementById('btnCertifyAssaying');
    const btnReleaseDbt = document.getElementById('btnOfficerReleaseDbt');
    const tokenStampEl = document.getElementById('activeTokenCertifiedStamp');
    const sealStampEl = document.getElementById('largeOfficialStampSeal');
    const sealTokenNum = document.getElementById('stampSealTokenNumber');

    // Update visibility of the Certified Stamp on the active procurement token
    if (tokenStampEl) {
      if (isAssayingCertified) {
        tokenStampEl.classList.remove('hidden');
      } else {
        tokenStampEl.classList.add('hidden');
      }
    }

    if (sealStampEl) {
      if (isAssayingCertified) {
        sealStampEl.classList.remove('hidden');
        if (sealTokenNum) sealTokenNum.textContent = activeTokenNo;
      } else {
        sealStampEl.classList.add('hidden');
      }
    }

    if (badge) {
      if (isAssayingCertified) {
        badge.className = 'badge-tag badge-success';
        badge.textContent = '✓ Assaying FAQ Certified';
      } else {
        badge.className = 'badge-tag badge-pending';
        badge.textContent = 'Assaying in Progress (Pending Signature)';
      }
    }

    if (btnCertify) {
      if (isAssayingCertified) {
        btnCertify.className = 'btn-officer-action btn-certify certified';
        btnCertify.innerHTML = '<span>✓ 1. Assaying Report Approved &amp; Certified</span>';
        btnCertify.title = 'Quality Assaying Report has been digitally approved & certified by Inspector';
        btnCertify.style.cursor = 'default';
        btnCertify.style.opacity = '0.9';
      } else {
        btnCertify.className = 'btn-officer-action btn-certify';
        btnCertify.innerHTML = '<span>✓ 1. Approve &amp; Certify Assaying Report</span>';
        btnCertify.title = 'Click to approve & certify Quality Grade FAQ and Moisture Standard';
        btnCertify.style.cursor = 'pointer';
        btnCertify.style.opacity = '1';
      }
    }

    if (btnReleaseDbt) {
      if (isAssayingCertified) {
        btnReleaseDbt.className = 'btn-officer-action btn-dbt unlocked';
        btnReleaseDbt.innerHTML = '<span>💰 2. Finalize &amp; Authorize DBT Payment Release</span>';
        btnReleaseDbt.title = 'Click to finalize and authorize Direct Benefit Transfer (DBT) payment to farmer';
        btnReleaseDbt.removeAttribute('disabled');
        btnReleaseDbt.disabled = false;
        btnReleaseDbt.setAttribute('data-locked', 'false');
        btnReleaseDbt.style.cursor = 'pointer';
        btnReleaseDbt.style.opacity = '1';
        btnReleaseDbt.style.pointerEvents = 'auto';
      } else {
        btnReleaseDbt.className = 'btn-officer-action btn-dbt btn-disabled';
        btnReleaseDbt.innerHTML = '<span>🔒 2. Finalize &amp; Authorize DBT (Locked - Approve &amp; Certify First)</span>';
        btnReleaseDbt.title = '⚠️ Locked: Please click "✓ 1. Approve & Certify Assaying Report" first before finalizing DBT payment';
        btnReleaseDbt.removeAttribute('disabled');
        btnReleaseDbt.disabled = false;
        btnReleaseDbt.setAttribute('data-locked', 'true');
        btnReleaseDbt.style.cursor = 'not-allowed';
        btnReleaseDbt.style.opacity = '0.65';
        btnReleaseDbt.style.pointerEvents = 'auto';
      }
    }

    // ALWAYS Render Full Consolidated History and Queue!
    renderOfficerQueue(hasActiveConsignment, formattedActual, submittedCrop);
    renderOfficerHistory();
  }

  // Hook up live search on officer history input
  const officerHistorySearchInput = document.getElementById('officerHistorySearchInput');
  if (officerHistorySearchInput) {
    officerHistorySearchInput.addEventListener('input', (e) => {
      renderOfficerHistory(e.target.value);
    });
  }

  const officerHistoryClearSearchBtn = document.getElementById('officerHistoryClearSearchBtn');
  if (officerHistoryClearSearchBtn) {
    officerHistoryClearSearchBtn.addEventListener('click', () => {
      if (officerHistorySearchInput) officerHistorySearchInput.value = '';
      renderOfficerHistory('');
    });
  }

  window.officerCertifyAssaying = function() {
    const activeToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
    localStorage.setItem('cpc_certified_token', activeToken);
    localStorage.setItem('cpc_assaying_certified', 'true');
    populateOfficerDeskDetails();
    showToast(`✓ Quality Assaying certified! Official CERTIFIED stamp applied to Token ${activeToken}.`, 'success');
  };

  window.officerReleaseDbt = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const activeToken = localStorage.getItem('cpc_active_token_no') || '#TK-8492';
    const stampEl = document.getElementById('activeTokenCertifiedStamp');
    const isStampPresent = stampEl && !stampEl.classList.contains('hidden');
    const isCertified = (localStorage.getItem('cpc_certified_token') === activeToken) && 
                        (localStorage.getItem('cpc_assaying_certified') === 'true') && 
                        isStampPresent;

    if (!isCertified || !isStampPresent) {
      // Visual rejection shake and red alert on the locked DBT button
      const btnDbt = document.getElementById('btnOfficerReleaseDbt');
      if (btnDbt) {
        btnDbt.classList.remove('btn-shake-locked');
        void btnDbt.offsetWidth; // Force reflow to retrigger animation
        btnDbt.classList.add('btn-shake-locked');
        setTimeout(() => {
          btnDbt.classList.remove('btn-shake-locked');
        }, 600);
      }

      // Show high-priority error toast informing the user that DBT cannot work without certified stamp
      showToast('⚠️ Certified Stamp Missing on Token! You must click "✓ 1. Approve & Certify Assaying Report" to stamp the token before releasing DBT payment.', 'error');
      
      // Highlight and pulse the Approve & Certify button
      const btnCertify = document.getElementById('btnCertifyAssaying');
      if (btnCertify) {
        btnCertify.scrollIntoView({ behavior: 'smooth', block: 'center' });
        btnCertify.classList.remove('certify-attention-pulse');
        void btnCertify.offsetWidth;
        btnCertify.classList.add('certify-attention-pulse');
        setTimeout(() => {
          btnCertify.classList.remove('certify-attention-pulse');
        }, 1500);
      }
      return false;
    }

    const offTotalAmount = document.getElementById('offTotalAmount');
    const totalStr = offTotalAmount?.textContent || '₹ 1,09,200.00';

    // 1. Authorize and permanently record the demo consignment in Master Procurement History
    const ok = window.finalizePaymentAction(totalStr, activeToken);
    if (ok === false) return false;

    // 2. Reset certification state for next incoming consignment
    localStorage.removeItem('cpc_certified_token');
    localStorage.setItem('cpc_assaying_certified', 'false');
    populateOfficerDeskDetails();

    // 3. Automatically transition to Procurement History view and re-render history table
    showToast(`✓ DBT Payment Authorized! Demo Consignment (${activeToken}) recorded & updated in Procurement History.`, 'success');
    setTimeout(() => {
      window.switchOfficerDeskTab('history');
      renderOfficerHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
    return true;
  };

  window.officerInspectCurrent = function() {
    window.switchOfficerDeskTab('intake');
    const detailCard = document.querySelector('.officer-detail-card');
    if (detailCard) {
      detailCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      detailCard.style.boxShadow = '0 0 0 3px #1E824C';
      setTimeout(() => {
        detailCard.style.boxShadow = '0 6px 20px rgba(20, 53, 37, 0.07)';
      }, 1800);
    }
  };

  // --- Officer Demo Procurement Operation Handlers ---
  const DEMO_FARMERS = [
    { name: 'Rahul Sharma', mobile: '9876543210' },
    { name: 'Sunita Patel', mobile: '9812345678' },
    { name: 'Mohan Lal', mobile: '9765432109' },
    { name: 'Vikram Singh', mobile: '9923456781' },
    { name: 'Devendra Yadav', mobile: '9834567890' },
    { name: 'Pooja Verma', mobile: '9845678901' }
  ];

  window.runOfficerDemoOperation = function() {
    let demoRunCounter = parseInt(localStorage.getItem('cpc_demo_run_counter') || '0', 10);
    demoRunCounter++;
    localStorage.setItem('cpc_demo_run_counter', demoRunCounter.toString());

    const demoToken = `#TK-${8492 + (demoRunCounter - 1)}`;
    const crops = ['Wheat', 'Paddy / Rice', 'Mustard', 'Soybean', 'Cotton'];
    const selectedCrop = crops[(demoRunCounter - 1) % crops.length];
    const expectedQty = (45 + (demoRunCounter * 5) % 30).toFixed(2);
    const demoFarmerObj = DEMO_FARMERS[(demoRunCounter - 1) % DEMO_FARMERS.length];
    const sectors = ['North', 'East', 'South', 'West', 'Central'];
    const sectorName = sectors[demoRunCounter % sectors.length];

    localStorage.setItem('cpc_active_token_no', demoToken);
    localStorage.setItem('cpc_slot_booked', 'true');
    localStorage.setItem('cpc_timer_completed', 'true');
    localStorage.setItem('cpc_submitted_crop', selectedCrop);
    localStorage.setItem('cpc_submitted_qty', expectedQty);
    localStorage.setItem('cpc_submitted_survey', `Survey #${400 + demoRunCounter}/1A (${sectorName} Sector)`);
    localStorage.setItem('cpc_bank_account', `18116649${demoRunCounter}0`);
    localStorage.setItem('cpc_bank_ifsc', 'SBIN0001234');
    localStorage.setItem('cpc_procurement_finalized', 'false');
    localStorage.removeItem('cpc_certified_token'); // Strict uncertified initial state
    localStorage.setItem('cpc_assaying_certified', 'false'); // Must certify first!
    localStorage.setItem('cpc_is_demo', 'true');
    localStorage.setItem('cpc_demo_farmer', demoFarmerObj.name);
    localStorage.setItem('cpc_demo_farmer_mobile', demoFarmerObj.mobile);

    populateOfficerDeskDetails();

    // Switch to Live Intake tab so officer sees consignment ready for certification
    window.switchOfficerDeskTab('intake');

    const activeCard = document.getElementById('officerActiveConsignmentCard');
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      activeCard.style.boxShadow = '0 0 0 3.5px #DFC396, 0 10px 30px rgba(20,53,37,0.18)';
      setTimeout(() => {
        activeCard.style.boxShadow = '0 6px 20px rgba(20, 53, 37, 0.07)';
      }, 3000);
    }

    showToast(`⚡ Demo Consignment (${demoToken} • ${demoFarmerObj.name} • ${selectedCrop}) Loaded! Please click "✓ 1. Approve & Certify Assaying Report" to unlock DBT payment.`, 'info');
  };

  window.resetOfficerDemo = function() {
    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_procurement_finalized', 'false');
    localStorage.removeItem('cpc_certified_token');
    localStorage.setItem('cpc_assaying_certified', 'false');
    populateOfficerDeskDetails();
    showToast('Officer Desk reset to Standby State (No Active Tokens).', 'info');
  };

  // Officer Logout Handler
  const officerLogoutBtn = document.getElementById('officerLogoutBtn');
  if (officerLogoutBtn) {
    officerLogoutBtn.addEventListener('click', () => {
      moveLatestPaymentToPast();

      const officerDashboardScreen = document.getElementById('officerDashboardScreen');
      if (officerDashboardScreen && loginScreen) {
        officerDashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        setQuickDockVisible(false);
        updateQuickSwitchSkin('officer');
        showToast('Logged out of Procurement Officer Portal', 'info');
      }
    });
  }

  // --- Helper Functions ---
  function setFieldError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const errorEl = document.getElementById(errorId);
    if (group) group.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('has-error');
  }

  function setButtonLoading(isLoading) {
    if (!loginBtn) return;
    loginBtn.disabled = isLoading;
    if (isLoading) {
      btnText?.classList.add('hidden');
      btnArrow?.classList.add('hidden');
      btnLoader?.classList.remove('hidden');
    } else {
      btnText?.classList.remove('hidden');
      btnArrow?.classList.remove('hidden');
      btnLoader?.classList.add('hidden');
    }
  }

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '🌾';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Regional Language Selector Listeners (Telugu, Hindi, Tamil, Malayalam) ---
  const farmerLangSelect = document.getElementById('farmerLangSelect');
  if (farmerLangSelect) {
    farmerLangSelect.addEventListener('change', (e) => {
      applyFarmerLanguage(e.target.value, true);
    });
  }

  const langPills = document.querySelectorAll('.lang-pill');
  langPills.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-lang');
      applyFarmerLanguage(selected, true);
    });
  });

  // Apply initially saved regional language on dashboard load
  const savedLang = localStorage.getItem('cpc_selected_lang') || 'en';
  applyFarmerLanguage(savedLang, false);

  // Pre-initialize and render central consignment procurement history by default
  try {
    localStorage.removeItem('cpc_certified_token');
    localStorage.setItem('cpc_assaying_certified', 'false');
    getMasterProcurementHistory();
    populateOfficerDeskDetails();
    renderOfficerHistory();

    // Synchronize initial Quick Switch dock visibility & skin (hidden on login screen)
    if (loginScreen && !loginScreen.classList.contains('hidden')) {
      setQuickDockVisible(false);
    } else {
      setQuickDockVisible(true);
    }

    const initOfficerScreen = document.getElementById('officerDashboardScreen');
    if (initOfficerScreen && !initOfficerScreen.classList.contains('hidden')) {
      updateQuickSwitchSkin('officer');
    } else {
      updateQuickSwitchSkin('farmer');
    }
  } catch(e) {
    console.error('Initial history render:', e);
  }

  window.switchToOfficerPortal = function() {
    if (loginScreen) loginScreen.classList.add('hidden');
    if (dashboardScreen) dashboardScreen.classList.add('hidden');
    const officerDashboardScreen = document.getElementById('officerDashboardScreen');
    if (officerDashboardScreen) {
      officerDashboardScreen.classList.remove('hidden');
      setQuickDockVisible(true);
      localStorage.removeItem('cpc_certified_token');
      localStorage.setItem('cpc_assaying_certified', 'false');
      populateOfficerDeskDetails('OFF-8492');
      if (typeof window.switchOfficerDeskTab === 'function') {
        window.switchOfficerDeskTab('history');
      }
      updateQuickSwitchSkin('officer');
      showToast('🏛️ Switched to Procurement Officer Portal', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.switchToFarmerPortal = function() {
    const officerDashboardScreen = document.getElementById('officerDashboardScreen');
    if (officerDashboardScreen) officerDashboardScreen.classList.add('hidden');
    if (loginScreen) loginScreen.classList.add('hidden');
    if (dashboardScreen) {
      dashboardScreen.classList.remove('hidden');
      setQuickDockVisible(true);
      updateQuickSwitchSkin('farmer');
      showToast('🌾 Switched to Farmer Portal Dashboard', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  window.showToast = showToast;
});

