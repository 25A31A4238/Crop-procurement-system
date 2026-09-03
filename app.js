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

  function setLoginRole(role) {
    currentLoginRole = role;
    clearFieldError('mobileGroup');
    clearFieldError('passwordGroup');

    if (role === 'officer') {
      tabOfficerLogin?.classList.add('active');
      tabFarmerLogin?.classList.remove('active');
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
          
          // Populate officer desk with current farmer details
          populateOfficerDeskDetails(officerIdVal);

          // Switch to dedicated Officer Dashboard
          const officerDashboardScreen = document.getElementById('officerDashboardScreen');
          if (loginScreen && officerDashboardScreen) {
            loginScreen.classList.add('hidden');
            if (dashboardScreen) dashboardScreen.classList.add('hidden');
            officerDashboardScreen.classList.remove('hidden');
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
    return DEFAULT_CENTER_HISTORY;
  }

  function recordProcurementToMasterHistory(entry) {
    const list = getMasterProcurementHistory();
    if (!list.some(item => item.utr === entry.utr)) {
      list.unshift(entry);
      localStorage.setItem('cpc_master_procurement_history', JSON.stringify(list));
    }
  }

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
        category = `${t.mod1Title} (2026-27)`;
        bodyHtml = `
          <div class="detail-table-wrap">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Crop / Produce</th>
                  <th>Village</th>
                  <th>Procurement Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>September</strong></td>
                  <td>Paddy</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>October</strong></td>
                  <td>Cotton</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>November</strong></td>
                  <td>Maize</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>December</strong></td>
                  <td>Groundnut</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>January</strong></td>
                  <td>Paddy</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>February</strong></td>
                  <td>Chilli</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="background: #F8F3EA; border-left: 4px solid var(--accent-gold); padding: 14px 16px; border-radius: 8px; font-size: 13px; margin-top: 16px; line-height: 1.5; color: #3E4B41;">
            <strong>📢 Notice:</strong> Registration Dates and Slot Booking Dates are yet to be announced.
          </div>
        `;
        break;

      case 'form-filling':
        title = t.mod2Title;
        category = `${t.mod2Title} & PRODUCE INTAKE`;
        
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
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Please complete your slot booking in the <strong>Procurement Center & Slot Booking</strong> option first to generate your token number and start the live queue tracker.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToSlotBooking();" style="max-width: 340px; margin: 0 auto;">
                <span>Go to Procurement Center & Slot Booking</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else {
          let gateText = 'Weighbridge Gate 2 (North Entry)';
          let dateSlotText = `${bookedSlotDetails.date}, ${bookedSlotDetails.slot}`;

          let timerHeader = isTimerCompleted ? 'WEIGHBRIDGE QUEUE STATUS' : '⏱️ LIVE WEIGHBRIDGE QUEUE COUNTDOWN';
          let badgeClass = isTimerCompleted ? 'badge-success' : 'badge-pending';
          let badgeText = isTimerCompleted ? 'YOUR TURN RIGHT NOW' : 'Queue Approaching...';
          let digitDisplay = isTimerCompleted ? '0s (LIVE!)' : countdownSeconds + 's';
          let digitClass = isTimerCompleted ? 'live-alert' : '';
          let progressWidth = (countdownSeconds / 15) * 100;
          let subtextMsg = isTimerCompleted 
            ? '✅ Token #TK-8492 is active at Weighbridge Gate 2. Please enter for assaying & payment.'
            : 'Slot confirmed! Live queue processing. Token becomes active in seconds.';

          bodyHtml = `
            <!-- 1. Details Placed ABOVE the Token -->
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

            <!-- 3. Real-Time Working Countdown Timer -->
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

            <button type="button" class="modal-submit-btn" onclick="window.finalizePaymentAction('${formattedTotal}');" style="margin-top: 20px;">
              <span>FINALIZE PROCUREMENT &amp; CONFIRM DBT PAYMENT</span>
              <span>✓</span>
            </button>
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

  // --- Real-Time Live Countdown Timer Handler ---
  function startTokenCountdownTimer() {
    clearInterval(countdownInterval);

    if (!isSlotBooked || isTimerCompleted) {
      return;
    }

    if (countdownSeconds > 0) {
      countdownInterval = setInterval(() => {
        if (countdownSeconds > 0 && isSlotBooked && !isTimerCompleted) {
          countdownSeconds--;
          localStorage.setItem('cpc_countdown_seconds', countdownSeconds.toString());

          const display = document.getElementById('countdownDisplay');
          const bar = document.getElementById('countdownProgressBar');
          if (display) display.textContent = countdownSeconds + 's';
          if (bar) bar.style.width = ((countdownSeconds / 15) * 100) + '%';

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
      subtext.textContent = '✅ Token #TK-8492 is active! Please enter Weighbridge Gate 2.';
    }
    if (actionArea) {
      actionArea.classList.remove('hidden');
    }

    const liveMsg = 'It is your turn right now! Please proceed to FINALIZE PROCUREMENT & PAYMENT for further procedure.';
    showToast(liveMsg, 'success');

    // Add alert notification with deep-link
    addNotificationAlert('🚨 TOKEN #TK-8492 IS LIVE!', liveMsg, 'finalize-procurement');
  }

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
    const farmerDisplayName = registeredFarmer.name ? `${registeredFarmer.name} (Village ABC)` : 'Rahul (Village ABC)';
    const farmerSurveyVal = localStorage.getItem('cpc_submitted_survey') || 'Survey #402/1A';
    const farmerAccVal = farmerBank.account || localStorage.getItem('cpc_bank_account') || '1811664901';
    const farmerIfscVal = farmerBank.ifsc || localStorage.getItem('cpc_bank_ifsc') || 'SBIN0001234';

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
      source: 'Farmer Portal'
    };

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

    receiptModalBody.innerHTML = `
      <div class="receipt-header">
        <span class="receipt-gov-title">Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
        <h3 class="receipt-portal-title" id="receiptTitle">DBT Payment Receipt Voucher</h3>
        <span class="receipt-tag">Official Settlement Receipt • Token <code>${displayToken}</code></span>
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
          <span class="receipt-cell-label">Credited Bank Account</span>
          <span class="receipt-cell-val">A/C ${displayAcc} (IFSC: ${displayIfsc})</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Transaction Reference (UTR)</span>
          <span class="receipt-cell-val"><code>${targetPayment.utr}</code></span>
        </div>
      </div>

      <div class="receipt-total-banner">
        <div>
          <span class="receipt-total-label">DIRECT BENEFIT TRANSFER (DBT) AMOUNT</span>
          <div style="font-size: 11px; opacity: 0.85; margin-top: 2px;">Status: Direct Bank Transfer Credited • ${targetPayment.date}</div>
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
    const queueRowCrop = document.getElementById('queueRowCrop');
    const queueRowWeight = document.getElementById('queueRowWeight');
    const activeQueueRow = document.getElementById('activeQueueRow');
    const officerNoActiveTokenCard = document.getElementById('officerNoActiveTokenCard');
    const officerActiveConsignmentCard = document.getElementById('officerActiveConsignmentCard');
    const officerGateTag = document.getElementById('officerGateTag');

    if (officerProfileId && officerId) {
      officerProfileId.textContent = 'OFFICER ID: ' + officerId;
    }

    const slotBookedState = localStorage.getItem('cpc_slot_booked') === 'true';
    const timerCompletedState = localStorage.getItem('cpc_timer_completed') === 'true';
    const isFinalizedState = localStorage.getItem('cpc_procurement_finalized') === 'true';
    const hasActiveConsignment = slotBookedState && timerCompletedState && !isFinalizedState;

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
      return;
    }

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

    const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
    const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
    let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
    if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;

    const mspPerQtl = CROP_MSP_RATES[submittedCrop] || 2275;
    const totalApprovedAmount = actualWeightVal * mspPerQtl;

    const formattedExpected = expectedWeightVal.toFixed(2) + ' Quintals';
    const formattedActual = actualWeightVal.toFixed(2) + ' Quintals';
    const formattedMsp = '₹ ' + mspPerQtl.toLocaleString('en-IN') + ' per Quintal';
    const formattedTotal = '₹ ' + totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Exact bank details entered by farmer during form filling
    const farmerAcc = localStorage.getItem('cpc_bank_account') || farmerBank.account || '181166';
    const farmerIfsc = localStorage.getItem('cpc_bank_ifsc') || farmerBank.ifsc || 'SBIN0001234';
    const farmerSurvey = localStorage.getItem('cpc_submitted_survey') || 'Survey #402/1A';

    const offSurveyCell = document.getElementById('offSurveyCell');
    if (offSurveyCell) offSurveyCell.textContent = `Village ABC (${farmerSurvey})`;

    if (offFarmerName) offFarmerName.textContent = registeredFarmer.name || 'Rahul';
    if (offFarmerMobile) offFarmerMobile.textContent = '+91 ' + (registeredFarmer.mobile || '9876543210');
    if (offCropName) offCropName.textContent = submittedCrop;
    if (offExpectedWeight) offExpectedWeight.textContent = formattedExpected;
    if (offActualWeight) offActualWeight.textContent = `${formattedActual} (Verified Gross ≤ Expected)`;
    if (offMspRate) offMspRate.textContent = formattedMsp;
    if (offTotalAmount) offTotalAmount.textContent = formattedTotal;
    if (offBankDetails) offBankDetails.textContent = `A/C ${farmerAcc} (IFSC: ${farmerIfsc})`;

    // --- Dynamic Rendering of Today's Procurement Center Queue & History from Central Ledger ---
    const officerQueueTableBody = document.getElementById('officerQueueTableBody');
    const officerQueueCountTag = document.getElementById('officerQueueCountTag');
    const officerHistoryTableBody = document.getElementById('officerHistoryTableBody');
    const officerHistoryCountTag = document.getElementById('officerHistoryCountTag');
    const histStatCount = document.getElementById('histStatCount');
    const histStatWeight = document.getElementById('histStatWeight');
    const histStatAmount = document.getElementById('histStatAmount');

    const masterHistoryList = getMasterProcurementHistory();

    // 1. Render Today's Queue Table
    if (officerQueueTableBody) {
      let queueHtml = '';
      
      // If there is an active live consignment at desk, prepend it first
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
            <td>${item.crop.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : 'Verified Qtl'}</td>
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

    // 2. Render Full Consolidated Procurement History
    if (officerHistoryTableBody) {
      let historyHtml = '';
      let totalWeightNum = 0;
      let totalAmountNum = 0;

      masterHistoryList.forEach(item => {
        let weightStr = item.crop.match(/\((.*?)\)/) ? item.crop.match(/\((.*?)\)/)[1] : '40.00 Qtl';
        let weightVal = parseFloat(weightStr.replace(/[^\d.]/g, '')) || 0;
        totalWeightNum += weightVal;

        let amountVal = parseFloat(item.amount.replace(/[^\d.]/g, '')) || 0;
        totalAmountNum += amountVal;

        const surveyDisplay = item.survey || 'Survey #402/1A';
        const cropNameOnly = item.crop.split('(')[0].trim();

        historyHtml += `
          <tr>
            <td>${item.date}</td>
            <td><strong><code>${item.token}</code></strong></td>
            <td><strong>${item.farmer}</strong></td>
            <td><code>${surveyDisplay}</code></td>
            <td><strong>${cropNameOnly}</strong></td>
            <td><strong style="color: #143525;">${weightStr}</strong></td>
            <td><strong style="color: #1E824C;">${item.amount}</strong></td>
            <td><code>${item.utr}</code></td>
            <td><span class="badge-tag badge-success">${item.status}</span></td>
            <td><button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${item.utr}');" style="padding: 3px 8px; font-size: 11px;">Voucher 📄</button></td>
          </tr>
        `;
      });

      officerHistoryTableBody.innerHTML = historyHtml;

      if (officerHistoryCountTag) {
        officerHistoryCountTag.textContent = `${masterHistoryList.length} TOTAL SETTLED RECORDS`;
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
    }
  }

  window.officerCertifyAssaying = function() {
    const badge = document.getElementById('officerAssayingBadge');
    if (badge) {
      badge.className = 'badge-tag badge-success';
      badge.textContent = '✓ Assaying FAQ Certified';
    }
    showToast('Quality & Moisture Certificate digitally certified by Inspector V. S. Deshmukh', 'success');
  };

  window.officerReleaseDbt = function() {
    const offTotalAmount = document.getElementById('offTotalAmount');
    const totalStr = offTotalAmount?.textContent || '₹ 1,09,200.00';
    window.finalizePaymentAction(totalStr);
    populateOfficerDeskDetails();
  };

  window.officerInspectCurrent = function() {
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
  let demoRunCounter = 0;
  window.runOfficerDemoOperation = function() {
    demoRunCounter++;
    const demoToken = `#TK-${8492 + (demoRunCounter - 1)}`;
    const crops = ['Wheat', 'Paddy / Rice', 'Mustard', 'Soybean', 'Cotton'];
    const selectedCrop = crops[(demoRunCounter - 1) % crops.length];
    const expectedQty = (45 + (demoRunCounter * 5) % 30).toFixed(2);

    localStorage.setItem('cpc_active_token_no', demoToken);
    localStorage.setItem('cpc_slot_booked', 'true');
    localStorage.setItem('cpc_timer_completed', 'true');
    localStorage.setItem('cpc_submitted_crop', selectedCrop);
    localStorage.setItem('cpc_submitted_qty', expectedQty);
    localStorage.setItem('cpc_submitted_survey', `Survey #${400 + demoRunCounter}/1A (North Sector)`);
    localStorage.setItem('cpc_bank_account', `18116649${demoRunCounter}0`);
    localStorage.setItem('cpc_bank_ifsc', 'SBIN0001234');
    localStorage.setItem('cpc_procurement_finalized', 'false');

    populateOfficerDeskDetails();

    const activeCard = document.getElementById('officerActiveConsignmentCard');
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      activeCard.style.boxShadow = '0 0 0 3.5px #DFC396, 0 10px 30px rgba(20,53,37,0.18)';
      setTimeout(() => {
        activeCard.style.boxShadow = '0 6px 20px rgba(20, 53, 37, 0.07)';
      }, 3000);
    }

    showToast(`⚡ Demo Procurement (${demoToken} • ${selectedCrop}) Loaded! You can now test Certify Assaying & Authorize DBT Payment.`, 'success');
  };

  window.resetOfficerDemo = function() {
    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_procurement_finalized', 'false');
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

  window.showToast = showToast;
});
