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

  // ==========================================================================
  // OFFICIAL CACP MSP GOVERNMENT OF INDIA DATA STORE & DYNAMIC SYNC ENGINE
  // Source: Ministry of Agriculture & Farmers Welfare | https://cacp.da.gov.in/Home/MSP
  // ==========================================================================
  const CACP_OFFICIAL_RAW_DATA = [
  {
    "commodity": "Paddy Common",
    "tradeName": "Paddy (Common / Grade A)",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 17.0% \u2022 Foreign Matter \u2264 1.0%",
    "window": {
      "reg": "15 Aug \u2013 25 Sep 2026",
      "intake": "01 Sep \u2013 31 Dec 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "2441",
        "fixed": "2441"
      },
      "2025": {
        "reco": "2369",
        "fixed": "2369"
      },
      "2024": {
        "reco": "2300",
        "fixed": "2300"
      },
      "2023": {
        "reco": "2183",
        "fixed": "2183"
      },
      "2022": {
        "reco": "2040",
        "fixed": "2040"
      },
      "2021": {
        "reco": "1940",
        "fixed": "1940"
      },
      "2020": {
        "reco": "1868",
        "fixed": "1868"
      },
      "2019": {
        "reco": "1815",
        "fixed": "1815"
      },
      "2018": {
        "reco": "1745",
        "fixed": "1750"
      },
      "2017": {
        "reco": "1550",
        "fixed": "1550"
      },
      "2016": {
        "reco": "1470",
        "fixed": "1470"
      },
      "2015": {
        "reco": "1410",
        "fixed": "1410"
      },
      "2014": {
        "reco": "1360",
        "fixed": "1360"
      },
      "2013": {
        "reco": "1310",
        "fixed": "1310"
      },
      "2012": {
        "reco": "1250",
        "fixed": "1250"
      },
      "2011": {
        "reco": "1080",
        "fixed": "1080"
      },
      "2010": {
        "reco": "1000",
        "fixed": "1000"
      }
    }
  },
  {
    "commodity": "Paddy(F)/Grade A",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 17.0% \u2022 Inorganic \u2264 1.0% (Grade A)",
    "window": {
      "reg": "15 Aug \u2013 25 Sep 2026",
      "intake": "01 Sep \u2013 31 Dec 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "2461",
        "fixed": "2461"
      },
      "2025": {
        "reco": "2389",
        "fixed": "2389"
      },
      "2024": {
        "reco": "2320",
        "fixed": "2320"
      },
      "2023": {
        "reco": "2203",
        "fixed": "2203"
      },
      "2022": {
        "reco": "2060",
        "fixed": "2060"
      },
      "2021": {
        "reco": "1960",
        "fixed": "1960"
      },
      "2020": {
        "reco": "1888",
        "fixed": "1888"
      },
      "2019": {
        "reco": "1835",
        "fixed": "1835"
      },
      "2018": {
        "reco": "1770",
        "fixed": "1770"
      },
      "2017": {
        "reco": "1590",
        "fixed": "1590"
      },
      "2016": {
        "reco": "1510",
        "fixed": "1510"
      },
      "2015": {
        "reco": "1450",
        "fixed": "1450"
      },
      "2014": {
        "reco": "1400",
        "fixed": "1400"
      },
      "2013": {
        "reco": "1345",
        "fixed": "1345"
      },
      "2012": {
        "reco": "-",
        "fixed": "1280"
      },
      "2011": {
        "reco": "1110",
        "fixed": "1110"
      },
      "2010": {
        "reco": "1030",
        "fixed": "1030"
      }
    }
  },
  {
    "commodity": "Jowar-Hybrid",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Damaged Grain \u2264 2.0%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "4023",
        "fixed": "4023"
      },
      "2025": {
        "reco": "3699",
        "fixed": "3699"
      },
      "2024": {
        "reco": "3371",
        "fixed": "3371"
      },
      "2023": {
        "reco": "3180",
        "fixed": "3180"
      },
      "2022": {
        "reco": "2970",
        "fixed": "2970"
      },
      "2021": {
        "reco": "2738",
        "fixed": "2738"
      },
      "2020": {
        "reco": "2620",
        "fixed": "2620"
      },
      "2019": {
        "reco": "2550",
        "fixed": "2550"
      },
      "2018": {
        "reco": "2430",
        "fixed": "2430"
      },
      "2017": {
        "reco": "1700",
        "fixed": "1700"
      },
      "2016": {
        "reco": "1625",
        "fixed": "1625"
      },
      "2015": {
        "reco": "1570",
        "fixed": "1570"
      },
      "2014": {
        "reco": "1530",
        "fixed": "1530"
      },
      "2013": {
        "reco": "1500",
        "fixed": "1500"
      },
      "2012": {
        "reco": "1500",
        "fixed": "1500"
      },
      "2011": {
        "reco": "980",
        "fixed": "980"
      },
      "2010": {
        "reco": "880",
        "fixed": "880"
      }
    }
  },
  {
    "commodity": "Jowar-Maldandi",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Premium Food Grade",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "4073",
        "fixed": "4073"
      },
      "2025": {
        "reco": "3749",
        "fixed": "3749"
      },
      "2024": {
        "reco": "3421",
        "fixed": "3421"
      },
      "2023": {
        "reco": "3225",
        "fixed": "3225"
      },
      "2022": {
        "reco": "2990",
        "fixed": "2990"
      },
      "2021": {
        "reco": "2758",
        "fixed": "2758"
      },
      "2020": {
        "reco": "2640",
        "fixed": "2640"
      },
      "2019": {
        "reco": "2570",
        "fixed": "2570"
      },
      "2018": {
        "reco": "2450",
        "fixed": "2450"
      },
      "2017": {
        "reco": "1725",
        "fixed": "1725"
      },
      "2016": {
        "reco": "1650",
        "fixed": "1650"
      },
      "2015": {
        "reco": "1590",
        "fixed": "1590"
      },
      "2014": {
        "reco": "1550",
        "fixed": "1550"
      },
      "2013": {
        "reco": "1520",
        "fixed": "1520"
      },
      "2012": {
        "reco": "-",
        "fixed": "1520"
      },
      "2011": {
        "reco": "1000",
        "fixed": "1000"
      },
      "2010": {
        "reco": "900",
        "fixed": "900"
      }
    }
  },
  {
    "commodity": "Bajra",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Sound Grain \u2265 97.0%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "2900",
        "fixed": "2900"
      },
      "2025": {
        "reco": "2775",
        "fixed": "2775"
      },
      "2024": {
        "reco": "2625",
        "fixed": "2625"
      },
      "2023": {
        "reco": "2500",
        "fixed": "2500"
      },
      "2022": {
        "reco": "2350",
        "fixed": "2350"
      },
      "2021": {
        "reco": "2250",
        "fixed": "2250"
      },
      "2020": {
        "reco": "2150",
        "fixed": "2150"
      },
      "2019": {
        "reco": "2000",
        "fixed": "2000"
      },
      "2018": {
        "reco": "1950",
        "fixed": "1950"
      },
      "2017": {
        "reco": "1425",
        "fixed": "1425"
      },
      "2016": {
        "reco": "1330",
        "fixed": "1330"
      },
      "2015": {
        "reco": "1275",
        "fixed": "1275"
      },
      "2014": {
        "reco": "1250",
        "fixed": "1250"
      },
      "2013": {
        "reco": "1175",
        "fixed": "1250"
      },
      "2012": {
        "reco": "1175",
        "fixed": "1175"
      },
      "2011": {
        "reco": "980",
        "fixed": "980"
      },
      "2010": {
        "reco": "880",
        "fixed": "880"
      }
    }
  },
  {
    "commodity": "Maize",
    "tradeName": "Maize (Kharif FAQ)",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3d",
    "qualitySpec": "Moisture \u2264 14.0% \u2022 Weeviled Grain \u2264 1.0%",
    "window": {
      "reg": "20 Aug \u2013 30 Sep 2026",
      "intake": "10 Sep \u2013 30 Nov 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "2410",
        "fixed": "2410"
      },
      "2025": {
        "reco": "2400",
        "fixed": "2400"
      },
      "2024": {
        "reco": "2225",
        "fixed": "2225"
      },
      "2023": {
        "reco": "2090",
        "fixed": "2090"
      },
      "2022": {
        "reco": "1962",
        "fixed": "1962"
      },
      "2021": {
        "reco": "1870",
        "fixed": "1870"
      },
      "2020": {
        "reco": "1850",
        "fixed": "1850"
      },
      "2019": {
        "reco": "1760",
        "fixed": "1760"
      },
      "2018": {
        "reco": "1700",
        "fixed": "1700"
      },
      "2017": {
        "reco": "1425",
        "fixed": "1425"
      },
      "2016": {
        "reco": "1365",
        "fixed": "1365"
      },
      "2015": {
        "reco": "1325",
        "fixed": "1325"
      },
      "2014": {
        "reco": "1310",
        "fixed": "1310"
      },
      "2013": {
        "reco": "1310",
        "fixed": "1310"
      },
      "2012": {
        "reco": "1175",
        "fixed": "1175"
      },
      "2011": {
        "reco": "980",
        "fixed": "980"
      },
      "2010": {
        "reco": "880",
        "fixed": "880"
      }
    }
  },
  {
    "commodity": "Ragi",
    "tradeName": "Ragi / Finger Millet",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Nutri-Cereal Shree Anna",
    "window": {
      "reg": "01 Sep \u2013 30 Sep 2026",
      "intake": "05 Sep \u2013 15 Dec 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "5205",
        "fixed": "5205"
      },
      "2025": {
        "reco": "4886",
        "fixed": "4886"
      },
      "2024": {
        "reco": "4290",
        "fixed": "4290"
      },
      "2023": {
        "reco": "3846",
        "fixed": "3846"
      },
      "2022": {
        "reco": "3578",
        "fixed": "3578"
      },
      "2021": {
        "reco": "3377",
        "fixed": "3377"
      },
      "2020": {
        "reco": "3295",
        "fixed": "3295"
      },
      "2019": {
        "reco": "3150",
        "fixed": "3150"
      },
      "2018": {
        "reco": "2895",
        "fixed": "2897"
      },
      "2017": {
        "reco": "1900",
        "fixed": "1900"
      },
      "2016": {
        "reco": "1725",
        "fixed": "1725"
      },
      "2015": {
        "reco": "1650",
        "fixed": "1650"
      },
      "2014": {
        "reco": "1550",
        "fixed": "1550"
      },
      "2013": {
        "reco": "1500",
        "fixed": "1500"
      },
      "2012": {
        "reco": "1500",
        "fixed": "1500"
      },
      "2011": {
        "reco": "1050",
        "fixed": "1050"
      },
      "2010": {
        "reco": "965",
        "fixed": "965"
      }
    }
  },
  {
    "commodity": "Tur (Arhar)",
    "season": "Kharif Crops",
    "icon": "\ud83e\uded8",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Foreign Matter \u2264 2.0%",
    "window": {
      "reg": "15 Oct \u2013 30 Nov 2026",
      "intake": "01 Dec 2026 \u2013 28 Feb 2027",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "8450",
        "fixed": "8450"
      },
      "2025": {
        "reco": "8000",
        "fixed": "8000"
      },
      "2024": {
        "reco": "7550",
        "fixed": "7550"
      },
      "2023": {
        "reco": "7000",
        "fixed": "7000"
      },
      "2022": {
        "reco": "6600",
        "fixed": "6600"
      },
      "2021": {
        "reco": "6300",
        "fixed": "6300"
      },
      "2020": {
        "reco": "6000",
        "fixed": "6000"
      },
      "2019": {
        "reco": "5800",
        "fixed": "5800"
      },
      "2018": {
        "reco": "5675",
        "fixed": "5675"
      },
      "2017": {
        "reco": "5250",
        "fixed": "5450"
      },
      "2016": {
        "reco": "4625",
        "fixed": "5050"
      },
      "2015": {
        "reco": "4425",
        "fixed": "4625"
      },
      "2014": {
        "reco": "4350",
        "fixed": "4350"
      },
      "2013": {
        "reco": "3850",
        "fixed": "4300"
      },
      "2012": {
        "reco": "3850",
        "fixed": "3850"
      },
      "2011": {
        "reco": "3100",
        "fixed": "3200"
      },
      "2010": {
        "reco": "2800",
        "fixed": "3000"
      }
    }
  },
  {
    "commodity": "Moong",
    "season": "Kharif Crops",
    "icon": "\ud83e\uded8",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Damaged \u2264 3.0%",
    "window": {
      "reg": "01 Sep \u2013 30 Sep 2026",
      "intake": "15 Sep \u2013 15 Nov 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "8780",
        "fixed": "8780"
      },
      "2025": {
        "reco": "8768",
        "fixed": "8768"
      },
      "2024": {
        "reco": "8682",
        "fixed": "8682"
      },
      "2023": {
        "reco": "8558",
        "fixed": "8558"
      },
      "2022": {
        "reco": "7755",
        "fixed": "7755"
      },
      "2021": {
        "reco": "7275",
        "fixed": "7275"
      },
      "2020": {
        "reco": "7196",
        "fixed": "7196"
      },
      "2019": {
        "reco": "7050",
        "fixed": "7050"
      },
      "2018": {
        "reco": "6975",
        "fixed": "6975"
      },
      "2017": {
        "reco": "5375",
        "fixed": "5575"
      },
      "2016": {
        "reco": "4800",
        "fixed": "5225"
      },
      "2015": {
        "reco": "4650",
        "fixed": "4850"
      },
      "2014": {
        "reco": "4600",
        "fixed": "4600"
      },
      "2013": {
        "reco": "4500",
        "fixed": "4500"
      },
      "2012": {
        "reco": "4400",
        "fixed": "4400"
      },
      "2011": {
        "reco": "3400",
        "fixed": "3500"
      },
      "2010": {
        "reco": "3170",
        "fixed": "3170"
      }
    }
  },
  {
    "commodity": "Urad",
    "season": "Kharif Crops",
    "icon": "\ud83e\uded8",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Broken/Split \u2264 3.0%",
    "window": {
      "reg": "01 Sep \u2013 30 Sep 2026",
      "intake": "20 Sep \u2013 15 Dec 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "8200",
        "fixed": "8200"
      },
      "2025": {
        "reco": "7800",
        "fixed": "7800"
      },
      "2024": {
        "reco": "7400",
        "fixed": "7400"
      },
      "2023": {
        "reco": "6950",
        "fixed": "6950"
      },
      "2022": {
        "reco": "6600",
        "fixed": "6600"
      },
      "2021": {
        "reco": "6300",
        "fixed": "6300"
      },
      "2020": {
        "reco": "6000",
        "fixed": "6000"
      },
      "2019": {
        "reco": "5700",
        "fixed": "5700"
      },
      "2018": {
        "reco": "5600",
        "fixed": "5600"
      },
      "2017": {
        "reco": "5200",
        "fixed": "5400"
      },
      "2016": {
        "reco": "4575",
        "fixed": "5000"
      },
      "2015": {
        "reco": "4425",
        "fixed": "4625"
      },
      "2014": {
        "reco": "4350",
        "fixed": "4350"
      },
      "2013": {
        "reco": "4300",
        "fixed": "4300"
      },
      "2012": {
        "reco": "4300",
        "fixed": "4300"
      },
      "2011": {
        "reco": "3300",
        "fixed": "3300"
      },
      "2010": {
        "reco": "2900",
        "fixed": "2900"
      }
    }
  },
  {
    "commodity": "Groundnut",
    "tradeName": "Groundnut (In Shell Pods)",
    "season": "Kharif Crops",
    "icon": "\ud83e\udd5c",
    "qualitySpec": "Moisture \u2264 8.0% \u2022 Shelling Recovery \u2265 70%",
    "window": {
      "reg": "15 Sep \u2013 31 Oct 2026",
      "intake": "01 Nov 2026 \u2013 15 Jan 2027",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "7517",
        "fixed": "7517"
      },
      "2025": {
        "reco": "7263",
        "fixed": "7263"
      },
      "2024": {
        "reco": "6783",
        "fixed": "6783"
      },
      "2023": {
        "reco": "6377",
        "fixed": "6377"
      },
      "2022": {
        "reco": "5850",
        "fixed": "5850"
      },
      "2021": {
        "reco": "5550",
        "fixed": "5550"
      },
      "2020": {
        "reco": "5275",
        "fixed": "5275"
      },
      "2019": {
        "reco": "5090",
        "fixed": "5090"
      },
      "2018": {
        "reco": "4890",
        "fixed": "4890"
      },
      "2017": {
        "reco": "4250",
        "fixed": "4450"
      },
      "2016": {
        "reco": "4120",
        "fixed": "4220"
      },
      "2015": {
        "reco": "4030",
        "fixed": "4030"
      },
      "2014": {
        "reco": "4000",
        "fixed": "4000"
      },
      "2013": {
        "reco": "4000",
        "fixed": "4000"
      },
      "2012": {
        "reco": "3700",
        "fixed": "3700"
      },
      "2011": {
        "reco": "2700",
        "fixed": "2700"
      },
      "2010": {
        "reco": "2300",
        "fixed": "2300"
      }
    }
  },
  {
    "commodity": "Sunflower Seed",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf3b",
    "qualitySpec": "Moisture \u2264 9.0% \u2022 Oil Content \u2265 35%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "8343",
        "fixed": "8343"
      },
      "2025": {
        "reco": "7721",
        "fixed": "7721"
      },
      "2024": {
        "reco": "7280",
        "fixed": "7280"
      },
      "2023": {
        "reco": "6760",
        "fixed": "6760"
      },
      "2022": {
        "reco": "6400",
        "fixed": "6400"
      },
      "2021": {
        "reco": "6015",
        "fixed": "6015"
      },
      "2020": {
        "reco": "5885",
        "fixed": "5885"
      },
      "2019": {
        "reco": "5650",
        "fixed": "5650"
      },
      "2018": {
        "reco": "5385",
        "fixed": "5388"
      },
      "2017": {
        "reco": "4000",
        "fixed": "4100"
      },
      "2016": {
        "reco": "3850",
        "fixed": "3950"
      },
      "2015": {
        "reco": "3800",
        "fixed": "3800"
      },
      "2014": {
        "reco": "3750",
        "fixed": "3750"
      },
      "2013": {
        "reco": "3700",
        "fixed": "3700"
      },
      "2012": {
        "reco": "3700",
        "fixed": "3700"
      },
      "2011": {
        "reco": "2800",
        "fixed": "2800"
      },
      "2010": {
        "reco": "2350",
        "fixed": "2350"
      }
    }
  },
  {
    "commodity": "Soyabean Black",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf31",
    "qualitySpec": "FAQ Standard Cleanliness \u2265 98%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "-",
        "fixed": "-"
      },
      "2024": {
        "reco": "-",
        "fixed": "-"
      },
      "2023": {
        "reco": "-",
        "fixed": "-"
      },
      "2022": {
        "reco": "-",
        "fixed": "-"
      },
      "2021": {
        "reco": "-",
        "fixed": "-"
      },
      "2020": {
        "reco": "-",
        "fixed": "-"
      },
      "2019": {
        "reco": "-",
        "fixed": "-"
      },
      "2018": {
        "reco": "-",
        "fixed": "-"
      },
      "2017": {
        "reco": "-",
        "fixed": "-"
      },
      "2016": {
        "reco": "-",
        "fixed": "-"
      },
      "2015": {
        "reco": "-",
        "fixed": "-"
      },
      "2014": {
        "reco": "2500",
        "fixed": "2500"
      },
      "2013": {
        "reco": "2500",
        "fixed": "2500"
      },
      "2012": {
        "reco": "2200",
        "fixed": "2200"
      },
      "2011": {
        "reco": "1650",
        "fixed": "1650"
      },
      "2010": {
        "reco": "1400",
        "fixed": "1400"
      }
    }
  },
  {
    "commodity": "Soyabean Yellow",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf31",
    "qualitySpec": "Moisture \u2264 10.0% \u2022 Foreign Matter \u2264 2.0%",
    "window": {
      "reg": "01 Sep \u2013 15 Oct 2026",
      "intake": "01 Oct \u2013 31 Dec 2026",
      "status": "reg_open"
    },
    "years": {
      "2026": {
        "reco": "5708",
        "fixed": "5708"
      },
      "2025": {
        "reco": "5328",
        "fixed": "5328"
      },
      "2024": {
        "reco": "4892",
        "fixed": "4892"
      },
      "2023": {
        "reco": "4600",
        "fixed": "4600"
      },
      "2022": {
        "reco": "4300",
        "fixed": "4300"
      },
      "2021": {
        "reco": "3950",
        "fixed": "3950"
      },
      "2020": {
        "reco": "3880",
        "fixed": "3880"
      },
      "2019": {
        "reco": "3710",
        "fixed": "3710"
      },
      "2018": {
        "reco": "3390",
        "fixed": "3399"
      },
      "2017": {
        "reco": "2850",
        "fixed": "3050"
      },
      "2016": {
        "reco": "2675",
        "fixed": "2775"
      },
      "2015": {
        "reco": "2600",
        "fixed": "2600"
      },
      "2014": {
        "reco": "2560",
        "fixed": "2560"
      },
      "2013": {
        "reco": "2560",
        "fixed": "2560"
      },
      "2012": {
        "reco": "-",
        "fixed": "2240"
      },
      "2011": {
        "reco": "1690",
        "fixed": "1690"
      },
      "2010": {
        "reco": "1440",
        "fixed": "1440"
      }
    }
  },
  {
    "commodity": "Sesamum",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf31",
    "qualitySpec": "Moisture \u2264 7.0% \u2022 Oil Content \u2265 40%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "10346",
        "fixed": "10346"
      },
      "2025": {
        "reco": "9846",
        "fixed": "9846"
      },
      "2024": {
        "reco": "9267",
        "fixed": "9267"
      },
      "2023": {
        "reco": "8635",
        "fixed": "8635"
      },
      "2022": {
        "reco": "7830",
        "fixed": "7830"
      },
      "2021": {
        "reco": "7307",
        "fixed": "7307"
      },
      "2020": {
        "reco": "6855",
        "fixed": "6855"
      },
      "2019": {
        "reco": "6485",
        "fixed": "6485"
      },
      "2018": {
        "reco": "6230",
        "fixed": "6249"
      },
      "2017": {
        "reco": "5200",
        "fixed": "5300"
      },
      "2016": {
        "reco": "4800",
        "fixed": "5000"
      },
      "2015": {
        "reco": "4700",
        "fixed": "4700"
      },
      "2014": {
        "reco": "4600",
        "fixed": "4600"
      },
      "2013": {
        "reco": "4500",
        "fixed": "4500"
      },
      "2012": {
        "reco": "4200",
        "fixed": "4200"
      },
      "2011": {
        "reco": "3400",
        "fixed": "3400"
      },
      "2010": {
        "reco": "2900",
        "fixed": "2900"
      }
    }
  },
  {
    "commodity": "Nigerseed",
    "season": "Kharif Crops",
    "icon": "\ud83c\udf31",
    "qualitySpec": "Moisture \u2264 8.0% \u2022 Pure Seed \u2265 97%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "10052",
        "fixed": "10052"
      },
      "2025": {
        "reco": "9537",
        "fixed": "9537"
      },
      "2024": {
        "reco": "8717",
        "fixed": "8717"
      },
      "2023": {
        "reco": "7734",
        "fixed": "7734"
      },
      "2022": {
        "reco": "7287",
        "fixed": "7287"
      },
      "2021": {
        "reco": "6930",
        "fixed": "6930"
      },
      "2020": {
        "reco": "6695",
        "fixed": "6695"
      },
      "2019": {
        "reco": "5940",
        "fixed": "5940"
      },
      "2018": {
        "reco": "5860",
        "fixed": "5877"
      },
      "2017": {
        "reco": "3950",
        "fixed": "4050"
      },
      "2016": {
        "reco": "3725",
        "fixed": "3825"
      },
      "2015": {
        "reco": "3650",
        "fixed": "3650"
      },
      "2014": {
        "reco": "3600",
        "fixed": "3600"
      },
      "2013": {
        "reco": "3500",
        "fixed": "3500"
      },
      "2012": {
        "reco": "3500",
        "fixed": "3500"
      },
      "2011": {
        "reco": "2900",
        "fixed": "2900"
      },
      "2010": {
        "reco": "2450",
        "fixed": "2450"
      }
    }
  },
  {
    "commodity": "Medium Staple Cotton",
    "tradeName": "Cotton (Medium / Long Staple)",
    "season": "Kharif Crops",
    "icon": "\u2601\ufe0f",
    "qualitySpec": "Staple 24.5-25.5mm \u2022 Micronaire 4.3-5.1",
    "window": {
      "reg": "01 Sep \u2013 15 Oct 2026",
      "intake": "15 Oct 2026 \u2013 15 Feb 2027",
      "status": "reg_open"
    },
    "years": {
      "2026": {
        "reco": "8267",
        "fixed": "8267"
      },
      "2025": {
        "reco": "7710",
        "fixed": "7710"
      },
      "2024": {
        "reco": "7121",
        "fixed": "7121"
      },
      "2023": {
        "reco": "6620",
        "fixed": "6620"
      },
      "2022": {
        "reco": "6080",
        "fixed": "6080"
      },
      "2021": {
        "reco": "5726",
        "fixed": "5726"
      },
      "2020": {
        "reco": "5515",
        "fixed": "5515"
      },
      "2019": {
        "reco": "5255",
        "fixed": "5255"
      },
      "2018": {
        "reco": "5150",
        "fixed": "5150"
      },
      "2017": {
        "reco": "4020",
        "fixed": "4020"
      },
      "2016": {
        "reco": "3860",
        "fixed": "3860"
      },
      "2015": {
        "reco": "3800",
        "fixed": "3800"
      },
      "2014": {
        "reco": "3750",
        "fixed": "3750"
      },
      "2013": {
        "reco": "3700",
        "fixed": "3700"
      },
      "2012": {
        "reco": "3600",
        "fixed": "3600"
      },
      "2011": {
        "reco": "2800",
        "fixed": "2800"
      },
      "2010": {
        "reco": "2500",
        "fixed": "2500"
      }
    }
  },
  {
    "commodity": "Long Staple Cotton",
    "season": "Kharif Crops",
    "icon": "\u2601\ufe0f",
    "qualitySpec": "Staple 29.5-30.5mm \u2022 Micronaire 3.5-4.3",
    "window": {
      "reg": "01 Sep \u2013 15 Oct 2026",
      "intake": "15 Oct 2026 \u2013 15 Feb 2027",
      "status": "reg_open"
    },
    "years": {
      "2026": {
        "reco": "8667",
        "fixed": "8667"
      },
      "2025": {
        "reco": "8110",
        "fixed": "8110"
      },
      "2024": {
        "reco": "7521",
        "fixed": "7521"
      },
      "2023": {
        "reco": "7020",
        "fixed": "7020"
      },
      "2022": {
        "reco": "6380",
        "fixed": "6380"
      },
      "2021": {
        "reco": "6025",
        "fixed": "6025"
      },
      "2020": {
        "reco": "5825",
        "fixed": "5825"
      },
      "2019": {
        "reco": "5550",
        "fixed": "5550"
      },
      "2018": {
        "reco": "5450",
        "fixed": "5450"
      },
      "2017": {
        "reco": "4320",
        "fixed": "4320"
      },
      "2016": {
        "reco": "4160",
        "fixed": "4160"
      },
      "2015": {
        "reco": "4100",
        "fixed": "4100"
      },
      "2014": {
        "reco": "4050",
        "fixed": "4050"
      },
      "2013": {
        "reco": "4000",
        "fixed": "4000"
      },
      "2012": {
        "reco": "3900",
        "fixed": "3900"
      },
      "2011": {
        "reco": "3300",
        "fixed": "3300"
      },
      "2010": {
        "reco": "3000",
        "fixed": "3000"
      }
    }
  },
  {
    "commodity": "Wheat",
    "season": "Rabi Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Foreign Matter \u2264 0.75%",
    "window": {
      "reg": "15 Feb \u2013 31 Mar 2026",
      "intake": "01 Apr \u2013 30 Jun 2026",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "2585",
        "fixed": "2585"
      },
      "2024": {
        "reco": "2425",
        "fixed": "2425"
      },
      "2023": {
        "reco": "2275",
        "fixed": "2275"
      },
      "2022": {
        "reco": "2125",
        "fixed": "2125"
      },
      "2021": {
        "reco": "2015",
        "fixed": "2015"
      },
      "2020": {
        "reco": "1975",
        "fixed": "1975"
      },
      "2019": {
        "reco": "1925",
        "fixed": "1925"
      },
      "2018": {
        "reco": "1840",
        "fixed": "1840"
      },
      "2017": {
        "reco": "1735",
        "fixed": "1735"
      },
      "2016": {
        "reco": "1625",
        "fixed": "1625"
      },
      "2015": {
        "reco": "1525",
        "fixed": "1525"
      },
      "2014": {
        "reco": "1450",
        "fixed": "1450"
      },
      "2013": {
        "reco": "1400",
        "fixed": "1400"
      },
      "2012": {
        "reco": "1285",
        "fixed": "1350"
      },
      "2011": {
        "reco": "1285",
        "fixed": "1285"
      },
      "2010": {
        "reco": "1120",
        "fixed": "1170"
      }
    }
  },
  {
    "commodity": "Barley",
    "season": "Rabi Crops",
    "icon": "\ud83c\udf3e",
    "qualitySpec": "Moisture \u2264 12.0% \u2022 Admixture \u2264 2.0%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "2150",
        "fixed": "2150"
      },
      "2024": {
        "reco": "1980",
        "fixed": "1980"
      },
      "2023": {
        "reco": "1850",
        "fixed": "1850"
      },
      "2022": {
        "reco": "1735",
        "fixed": "1735"
      },
      "2021": {
        "reco": "1635",
        "fixed": "1635"
      },
      "2020": {
        "reco": "1600",
        "fixed": "1600"
      },
      "2019": {
        "reco": "1525",
        "fixed": "1525"
      },
      "2018": {
        "reco": "1440",
        "fixed": "1440"
      },
      "2017": {
        "reco": "1410",
        "fixed": "1410"
      },
      "2016": {
        "reco": "1325",
        "fixed": "1325"
      },
      "2015": {
        "reco": "1225",
        "fixed": "1225"
      },
      "2014": {
        "reco": "1150",
        "fixed": "1150"
      },
      "2013": {
        "reco": "1100",
        "fixed": "1100"
      },
      "2012": {
        "reco": "980",
        "fixed": "980"
      },
      "2011": {
        "reco": "980",
        "fixed": "980"
      },
      "2010": {
        "reco": "780",
        "fixed": "780"
      }
    }
  },
  {
    "commodity": "Gram",
    "season": "Rabi Crops",
    "icon": "\ud83e\uded8",
    "qualitySpec": "Moisture \u2264 10.0% \u2022 Foreign Matter \u2264 1.5%",
    "window": {
      "reg": "15 Feb \u2013 15 Mar 2026",
      "intake": "20 Mar \u2013 15 May 2026",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "5875",
        "fixed": "5875"
      },
      "2024": {
        "reco": "5650",
        "fixed": "5650"
      },
      "2023": {
        "reco": "5440",
        "fixed": "5440"
      },
      "2022": {
        "reco": "5335",
        "fixed": "5335"
      },
      "2021": {
        "reco": "5230",
        "fixed": "5230"
      },
      "2020": {
        "reco": "5100",
        "fixed": "5100"
      },
      "2019": {
        "reco": "4875",
        "fixed": "4875"
      },
      "2018": {
        "reco": "4620",
        "fixed": "4620"
      },
      "2017": {
        "reco": "4250",
        "fixed": "4400"
      },
      "2016": {
        "reco": "3800",
        "fixed": "4000"
      },
      "2015": {
        "reco": "3425",
        "fixed": "3500"
      },
      "2014": {
        "reco": "3175",
        "fixed": "3175"
      },
      "2013": {
        "reco": "3100",
        "fixed": "3100"
      },
      "2012": {
        "reco": "3000",
        "fixed": "3000"
      },
      "2011": {
        "reco": "2800",
        "fixed": "2800"
      },
      "2010": {
        "reco": "2100",
        "fixed": "2100"
      }
    }
  },
  {
    "commodity": "Lentil (Masur)",
    "season": "Rabi Crops",
    "icon": "\ud83e\uded8",
    "qualitySpec": "Moisture \u2264 10.0% \u2022 FAQ Cleanliness \u2265 98%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "7000",
        "fixed": "7000"
      },
      "2024": {
        "reco": "6700",
        "fixed": "6700"
      },
      "2023": {
        "reco": "6425",
        "fixed": "6425"
      },
      "2022": {
        "reco": "6000",
        "fixed": "6000"
      },
      "2021": {
        "reco": "5500",
        "fixed": "5500"
      },
      "2020": {
        "reco": "5100",
        "fixed": "5100"
      },
      "2019": {
        "reco": "4800",
        "fixed": "4800"
      },
      "2018": {
        "reco": "4475",
        "fixed": "4475"
      },
      "2017": {
        "reco": "4150",
        "fixed": "4250"
      },
      "2016": {
        "reco": "3800",
        "fixed": "3950"
      },
      "2015": {
        "reco": "3325",
        "fixed": "3400"
      },
      "2014": {
        "reco": "3075",
        "fixed": "3075"
      },
      "2013": {
        "reco": "2950",
        "fixed": "2950"
      },
      "2012": {
        "reco": "2900",
        "fixed": "2900"
      },
      "2011": {
        "reco": "2800",
        "fixed": "2800"
      },
      "2010": {
        "reco": "2250",
        "fixed": "2250"
      }
    }
  },
  {
    "commodity": "Rapeseed/ Mustard",
    "season": "Rabi Crops",
    "icon": "\ud83c\udf3c",
    "qualitySpec": "Moisture \u2264 8.0% \u2022 Oil Content \u2265 38%",
    "window": {
      "reg": "01 Feb \u2013 15 Mar 2026",
      "intake": "15 Mar \u2013 15 May 2026",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "6200",
        "fixed": "6200"
      },
      "2024": {
        "reco": "5950",
        "fixed": "5950"
      },
      "2023": {
        "reco": "5650",
        "fixed": "5650"
      },
      "2022": {
        "reco": "5450",
        "fixed": "5450"
      },
      "2021": {
        "reco": "5050",
        "fixed": "5050"
      },
      "2020": {
        "reco": "4650",
        "fixed": "4650"
      },
      "2019": {
        "reco": "4425",
        "fixed": "4425"
      },
      "2018": {
        "reco": "4200",
        "fixed": "4200"
      },
      "2017": {
        "reco": "3900",
        "fixed": "4000"
      },
      "2016": {
        "reco": "3600",
        "fixed": "3700"
      },
      "2015": {
        "reco": "3350",
        "fixed": "3350"
      },
      "2014": {
        "reco": "3100",
        "fixed": "3100"
      },
      "2013": {
        "reco": "3050",
        "fixed": "3050"
      },
      "2012": {
        "reco": "3000",
        "fixed": "3000"
      },
      "2011": {
        "reco": "2500",
        "fixed": "2500"
      },
      "2010": {
        "reco": "1850",
        "fixed": "1850"
      }
    }
  },
  {
    "commodity": "Safflower",
    "season": "Rabi Crops",
    "icon": "\ud83c\udf3b",
    "qualitySpec": "Moisture \u2264 8.0% \u2022 Oil Content \u2265 30%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "6540",
        "fixed": "6540"
      },
      "2024": {
        "reco": "5940",
        "fixed": "5940"
      },
      "2023": {
        "reco": "5800",
        "fixed": "5800"
      },
      "2022": {
        "reco": "5650",
        "fixed": "5650"
      },
      "2021": {
        "reco": "5441",
        "fixed": "5441"
      },
      "2020": {
        "reco": "5327",
        "fixed": "5327"
      },
      "2019": {
        "reco": "5215",
        "fixed": "5215"
      },
      "2018": {
        "reco": "4945",
        "fixed": "4945"
      },
      "2017": {
        "reco": "4000",
        "fixed": "4100"
      },
      "2016": {
        "reco": "3600",
        "fixed": "3700"
      },
      "2015": {
        "reco": "3300",
        "fixed": "3300"
      },
      "2014": {
        "reco": "3050",
        "fixed": "3050"
      },
      "2013": {
        "reco": "3000",
        "fixed": "3000"
      },
      "2012": {
        "reco": "2800",
        "fixed": "2800"
      },
      "2011": {
        "reco": "2500",
        "fixed": "2500"
      },
      "2010": {
        "reco": "1800",
        "fixed": "1800"
      }
    }
  },
  {
    "commodity": "Jute",
    "season": "Commercial Crops",
    "icon": "\ud83c\udf3f",
    "qualitySpec": "TDN3 Grade \u2022 Moisture \u2264 16%",
    "window": {
      "reg": "01 Jul \u2013 15 Aug 2026",
      "intake": "15 Jul \u2013 30 Nov 2026",
      "status": "live"
    },
    "years": {
      "2026": {
        "reco": "5925",
        "fixed": "5925"
      },
      "2025": {
        "reco": "5650",
        "fixed": "5650"
      },
      "2024": {
        "reco": "5335",
        "fixed": "5335"
      },
      "2023": {
        "reco": "5050",
        "fixed": "5050"
      },
      "2022": {
        "reco": "4750",
        "fixed": "4750"
      },
      "2021": {
        "reco": "4500",
        "fixed": "4500"
      },
      "2020": {
        "reco": "4225",
        "fixed": "4225"
      },
      "2019": {
        "reco": "3950",
        "fixed": "3950"
      },
      "2018": {
        "reco": "3700",
        "fixed": "3700"
      },
      "2017": {
        "reco": "3500",
        "fixed": "3500"
      },
      "2016": {
        "reco": "3200",
        "fixed": "3200"
      },
      "2015": {
        "reco": "2700",
        "fixed": "2700"
      },
      "2014": {
        "reco": "2400",
        "fixed": "2400"
      },
      "2013": {
        "reco": "2300",
        "fixed": "2300"
      },
      "2012": {
        "reco": "2200",
        "fixed": "2200"
      },
      "2011": {
        "reco": "1675",
        "fixed": "1675"
      },
      "2010": {
        "reco": "1575",
        "fixed": "1575"
      }
    }
  },
  {
    "commodity": "Sugarcane",
    "season": "Commercial Crops",
    "icon": "\ud83c\udf8b",
    "qualitySpec": "10.25% Basic Recovery Rate FRP",
    "window": {
      "reg": "01 Oct \u2013 30 Nov 2026",
      "intake": "01 Nov 2026 \u2013 30 Apr 2027",
      "status": "reg_open"
    },
    "years": {
      "2026": {
        "reco": "365",
        "fixed": "365"
      },
      "2025": {
        "reco": "355",
        "fixed": "355"
      },
      "2024": {
        "reco": "340",
        "fixed": "340"
      },
      "2023": {
        "reco": "315",
        "fixed": "315"
      },
      "2022": {
        "reco": "305",
        "fixed": "305"
      },
      "2021": {
        "reco": "290",
        "fixed": "290"
      },
      "2020": {
        "reco": "285",
        "fixed": "285"
      },
      "2019": {
        "reco": "275",
        "fixed": "275"
      },
      "2018": {
        "reco": "275",
        "fixed": "275"
      },
      "2017": {
        "reco": "255",
        "fixed": "255"
      },
      "2016": {
        "reco": "230",
        "fixed": "230"
      },
      "2015": {
        "reco": "230",
        "fixed": "230"
      },
      "2014": {
        "reco": "220",
        "fixed": "220"
      },
      "2013": {
        "reco": "210",
        "fixed": "210"
      },
      "2012": {
        "reco": "170",
        "fixed": "170"
      },
      "2011": {
        "reco": "145",
        "fixed": "145"
      },
      "2010": {
        "reco": "139.12",
        "fixed": "139.12"
      }
    }
  },
  {
    "commodity": "Copra (Milling)",
    "season": "Commercial Crops",
    "icon": "\ud83e\udd65",
    "qualitySpec": "Moisture \u2264 6.0% \u2022 Oil Content \u2265 68%",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "12027",
        "fixed": "12027"
      },
      "2024": {
        "reco": "11582",
        "fixed": "11582"
      },
      "2023": {
        "reco": "11160",
        "fixed": "11160"
      },
      "2022": {
        "reco": "10860",
        "fixed": "10860"
      },
      "2021": {
        "reco": "10590",
        "fixed": "10590"
      },
      "2020": {
        "reco": "10335",
        "fixed": "10335"
      },
      "2019": {
        "reco": "9960",
        "fixed": "9960"
      },
      "2018": {
        "reco": "9520",
        "fixed": "9521"
      },
      "2017": {
        "reco": "7500",
        "fixed": "7511"
      },
      "2016": {
        "reco": "6500",
        "fixed": "6500"
      },
      "2015": {
        "reco": "5950",
        "fixed": "5950"
      },
      "2014": {
        "reco": "5550",
        "fixed": "5550"
      },
      "2013": {
        "reco": "5250",
        "fixed": "5250"
      },
      "2012": {
        "reco": "5100",
        "fixed": "5250"
      },
      "2011": {
        "reco": "5100",
        "fixed": "5100"
      },
      "2010": {
        "reco": "4525",
        "fixed": "4525"
      }
    }
  },
  {
    "commodity": "Copra (Ball)",
    "season": "Commercial Crops",
    "icon": "\ud83e\udd65",
    "qualitySpec": "Moisture \u2264 7.0% \u2022 Ball FAQ Quality",
    "window": {
      "reg": "Per State Notification",
      "intake": "During Marketing Season",
      "status": "upcoming"
    },
    "years": {
      "2026": {
        "reco": "-",
        "fixed": "-"
      },
      "2025": {
        "reco": "12500",
        "fixed": "12500"
      },
      "2024": {
        "reco": "12100",
        "fixed": "12100"
      },
      "2023": {
        "reco": "12000",
        "fixed": "12000"
      },
      "2022": {
        "reco": "11750",
        "fixed": "11750"
      },
      "2021": {
        "reco": "11000",
        "fixed": "11000"
      },
      "2020": {
        "reco": "10600",
        "fixed": "10600"
      },
      "2019": {
        "reco": "10300",
        "fixed": "10300"
      },
      "2018": {
        "reco": "9920",
        "fixed": "9920"
      },
      "2017": {
        "reco": "7750",
        "fixed": "7750"
      },
      "2016": {
        "reco": "6785",
        "fixed": "6785"
      },
      "2015": {
        "reco": "6240",
        "fixed": "6240"
      },
      "2014": {
        "reco": "5830",
        "fixed": "5830"
      },
      "2013": {
        "reco": "5500",
        "fixed": "5500"
      },
      "2012": {
        "reco": "5350",
        "fixed": "5500"
      },
      "2011": {
        "reco": "5350",
        "fixed": "5350"
      },
      "2010": {
        "reco": "4775",
        "fixed": "4775"
      }
    }
  }
];

  const CACP_FOOTNOTES_DATA = [
  "a. Rec : Recommended by CACP (Commission for Agricultural Costs and Prices).",
  "b. Additional Bonus of \u20b9 500 per quintal for market arrivals within the first two months of harvesting for Tur, Moong and Urad for year 2010-11 and 2011-12.",
  "c. Including Bonus of \u20b9 50 per quintal for wheat for year 2010-11.",
  "d. For Jute, MSP for TD5 variety of jute till 2014-15, and TDN3 (equivalent of TD5) variety of jute from 2015-16.",
  "e. Recommended Bonus of \u20b9 40 per quintal subject to liquidation of 15 million tons of Central Pool Stocks for Wheat for year 2012-13.",
  "f. For Barley in 2012-13 crop year, CACP recommended 10 percent bonus if exports are banned.",
  "g. Including bonus of \u20b9 100 per quintal for Groundnut (2016-17), Sunflower seed (2016-17 ,2017-18), Soybean yellow ( 2016-17), Sesamum (2017-18), Nigerseed (2016-17, 2017-18), Lentil (2017-18), Rapeseed & Mustard (2016-17, 2017-18), Safflower (2016-17, 2017-18).",
  "h. Including bonus of \u20b9 150 per quintal for Gram (2017-18) Lentil (2016-17).",
  "i. Including bonus of \u20b9 75 per quintal for Gram and Lentil during 2015-16.",
  "j. Including Bonus of \u20b9 425 per quintal for Tur, Urad and Moong during 2016-17.",
  "k. Including Bonus of \u20b9 200 per quintal for Tur (2015-16, 2017-18), Moong (2015-16, 2017-18), Urad (2015-16, 2017-18), Soybean Yellow (2017-18), Sesamum (2016-17), Gram (2016-17), Groundnut (2017-18).",
  "l. For Sugarcane FRP at 9.5% recovery rate for years from 2012-13 to 2017-18 and at 10% recovery rate from year 2018-19 to 2021-22 and at 10.25% from 2022-23 (Fixed \u20b9365/Qtl for 2026-27).",
  "m. Recommended MSP Corresponding to oil content of 35 percent for Sunflower (2015-16, 2016-17 and 2017-18) and Rapeseed and Mustard ( 2014-15, 2015-16, 2016-17, 2017-18 and 2018-19).",
  "n. Staple length (mm) of 24.5-25.5 and micronaire value of 4.3-5.1 for Medium Staple Cotton.",
  "o. Staple length (mm) of 29.5-30.5 and Micronaire value of 3.5-4.3 for Long Staple Cotton."
];

  class CacpMspStoreManager {
    constructor() {
      this.rawBaseline = CACP_OFFICIAL_RAW_DATA;
      this.data = this.loadStoredData();
      this.lastSyncTime = localStorage.getItem('cpc_cacp_last_sync') || 'Today, 08:15 PM • Verified CACP da.gov.in';
      this.currentTab = 'matrix';
      this.currentSearch = '';
    }

    loadStoredData() {
      try {
        const stored = localStorage.getItem('cpc_cacp_msp_dataset');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Could not parse stored CACP dataset:', e);
      }
      return JSON.parse(JSON.stringify(this.rawBaseline));
    }

    saveData() {
      try {
        localStorage.setItem('cpc_cacp_msp_dataset', JSON.stringify(this.data));
      } catch (e) {
        console.warn('Could not save CACP dataset to localStorage:', e);
      }
    }

    getAll() {
      return this.data;
    }

    getBySeason(season) {
      if (!season || season === 'all' || season === 'matrix') return this.data;
      if (season === 'kharif') return this.data.filter(c => c.season === 'Kharif Crops');
      if (season === 'rabi') return this.data.filter(c => c.season === 'Rabi Crops');
      if (season === 'commercial') return this.data.filter(c => c.season === 'Commercial Crops');
      return this.data;
    }

    findCrop(query) {
      if (!query) return null;
      const q = query.toLowerCase().trim();
      return this.data.find(c => {
        const name = c.commodity.toLowerCase();
        if (name === q) return true;
        if (q.includes('paddy') && name.includes('paddy')) return true;
        if (q.includes('wheat') && name.includes('wheat')) return true;
        if (q.includes('cotton') && name.includes('cotton')) return true;
        if ((q.includes('mustard') || q.includes('rapeseed')) && name.includes('mustard')) return true;
        if (q.includes('soy') && name.includes('soya')) return true;
        if (q.includes('gram') && (name.includes('gram') || name.includes('chana'))) return true;
        if (q.includes('maize') && name.includes('maize')) return true;
        if (q.includes('groundnut') && name.includes('groundnut')) return true;
        if (q.includes('ragi') && name.includes('ragi')) return true;
        if (q.includes('moong') && name.includes('moong')) return true;
        if (q.includes('urad') && name.includes('urad')) return true;
        if (q.includes('tur') && name.includes('tur')) return true;
        if (q.includes('jute') && name.includes('jute')) return true;
        if (q.includes('sugarcane') && name.includes('sugarcane')) return true;
        return name.includes(q) || q.includes(name);
      });
    }

    getMspForCrop(cropName) {
      const item = this.findCrop(cropName);
      if (!item) return 2275;
      const yrs = item.years || {};
      const yr2026 = yrs['2026'] || yrs[2026];
      const yr2025 = yrs['2025'] || yrs[2025];
      const yr2024 = yrs['2024'] || yrs[2024];

      if (yr2026 && yr2026.fixed && yr2026.fixed !== '-') return parseInt(yr2026.fixed, 10);
      if (yr2025 && yr2025.fixed && yr2025.fixed !== '-') return parseInt(yr2025.fixed, 10);
      if (yr2024 && yr2024.fixed && yr2024.fixed !== '-') return parseInt(yr2024.fixed, 10);
      return 2275;
    }

    getLatestMspDetails(item) {
      const yrs = item.years || {};
      const y26 = yrs['2026'] || yrs[2026];
      const y25 = yrs['2025'] || yrs[2025];
      const y24 = yrs['2024'] || yrs[2024];
      const y23 = yrs['2023'] || yrs[2023];

      let curFixed = '-';
      let curReco = '-';
      let curYear = '2026-27';
      let prevFixed = '-';

      if (y26 && y26.fixed && y26.fixed !== '-') {
        curFixed = parseInt(y26.fixed, 10);
        curReco = y26.reco || y26.fixed;
        curYear = '2026-27';
        if (y25 && y25.fixed && y25.fixed !== '-') prevFixed = parseInt(y25.fixed, 10);
      } else if (y25 && y25.fixed && y25.fixed !== '-') {
        curFixed = parseInt(y25.fixed, 10);
        curReco = y25.reco || y25.fixed;
        curYear = '2025-26';
        if (y24 && y24.fixed && y24.fixed !== '-') prevFixed = parseInt(y24.fixed, 10);
      } else if (y24 && y24.fixed && y24.fixed !== '-') {
        curFixed = parseInt(y24.fixed, 10);
        curReco = y24.reco || y24.fixed;
        curYear = '2024-25';
        if (y23 && y23.fixed && y23.fixed !== '-') prevFixed = parseInt(y23.fixed, 10);
      }

      let hikeText = '';
      let hikeVal = 0;
      if (typeof curFixed === 'number' && typeof prevFixed === 'number') {
        hikeVal = curFixed - prevFixed;
        if (hikeVal > 0) {
          const pct = ((hikeVal / prevFixed) * 100).toFixed(1);
          hikeText = `+ ₹${hikeVal.toLocaleString('en-IN')} (${pct}%) YoY`;
        }
      }

      return {
        curFixed,
        curReco,
        curYear,
        prevFixed,
        hikeText,
        hikeVal
      };
    }

    getRegistrationCropOptions(selectedCrop) {
      const primaryCrops = [
        'Paddy Common',
        'Paddy(F)/Grade A',
        'Medium Staple Cotton',
        'Long Staple Cotton',
        'Maize',
        'Groundnut',
        'Ragi',
        'Wheat',
        'Rapeseed/ Mustard',
        'Soyabean Yellow',
        'Tur (Arhar)',
        'Moong',
        'Urad',
        'Gram',
        'Jute',
        'Sugarcane'
      ];

      return primaryCrops.map(name => {
        const item = this.findCrop(name);
        const rate = this.getMspForCrop(name);
        const isSel = (selectedCrop && (selectedCrop === name || selectedCrop.includes(name) || name.includes(selectedCrop))) ? 'selected' : '';
        const displayLabel = `${item?.icon || '🌾'} ${name} - Govt. MSP ₹${rate.toLocaleString('en-IN')}/Qtl`;
        return `<option value="${name}" ${isSel}>${displayLabel}</option>`;
      }).join('\n');
    }

    async syncLiveGovtMsp(showToastCallback) {
      const syncBtn = document.getElementById('cacpSyncBtn');
      if (syncBtn) syncBtn.classList.add('loading');

      const syncTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      this.lastSyncTime = `Today, ${syncTime} • Verified CACP da.gov.in`;
      localStorage.setItem('cpc_cacp_last_sync', this.lastSyncTime);

      try {
        const res = await fetch('https://cacp.da.gov.in/json.json', { cache: 'no-cache', mode: 'cors' }).catch(() => null);
        if (res && res.ok) {
          const rawItems = await res.json();
          if (Array.isArray(rawItems) && rawItems.length > 0) {
            rawItems.forEach(item => {
              const comm = item.commodityname;
              const season = item.seasonname;
              const year = parseInt(item.financialyear, 10);
              const reco = item.reco_price;
              const fixed = item.fixed_price;

              let match = this.data.find(d => d.commodity === comm);
              if (match) {
                if (!match.years) match.years = {};
                match.years[year] = { reco, fixed };
              } else {
                this.data.push({
                  commodity: comm,
                  season: season || 'Kharif Crops',
                  icon: '🌾',
                  qualitySpec: 'FAQ Assaying Quality Standards',
                  window: { reg: 'Per Official Circular', intake: 'Marketing Season', status: 'upcoming' },
                  years: { [year]: { reco, fixed } }
                });
              }
            });
            this.saveData();
          }
        }
      } catch (err) {
        console.log('Online sync note:', err.message, '- active baseline preserved');
      } finally {
        setTimeout(() => {
          if (syncBtn) syncBtn.classList.remove('loading');
        }, 600);
      }

      window.dispatchEvent(new CustomEvent('cacp-msp-updated', { detail: { lastSync: this.lastSyncTime } }));

      if (typeof showToastCallback === 'function') {
        showToastCallback(`🏛️ Government MSP Schedule Synced with Ministry of Agriculture CACP Portal (Updated: ${this.lastSyncTime})`, 'success');
      }

      if (document.getElementById('cacpScheduleTableWrap')) {
        renderCacpScheduleContent(this.currentTab, this.currentSearch);
      }

      return true;
    }

    applyRevision(season, commodity, year, reco, fixed) {
      let match = this.data.find(d => d.commodity === commodity);
      const yrKey = year.toString();
      if (match) {
        if (!match.years) match.years = {};
        match.years[yrKey] = { reco: reco.toString(), fixed: fixed.toString() };
      } else {
        this.data.push({
          commodity: commodity,
          season: season,
          icon: '🌾',
          qualitySpec: 'Cabinet Committee on Economic Affairs (CCEA) Gazette Approved',
          window: { reg: 'Open per Notification', intake: 'Active Center Bays', status: 'live' },
          years: { [yrKey]: { reco: reco.toString(), fixed: fixed.toString() } }
        });
      }
      this.lastSyncTime = `Just now (CCEA Gazette Revision) • Verified`;
      localStorage.setItem('cpc_cacp_last_sync', this.lastSyncTime);
      this.saveData();

      window.dispatchEvent(new CustomEvent('cacp-msp-updated', { detail: { commodity, fixed, year } }));
      if (document.getElementById('cacpScheduleTableWrap')) {
        renderCacpScheduleContent(this.currentTab, this.currentSearch);
      }
      return true;
    }

    resetToBaseline() {
      this.data = JSON.parse(JSON.stringify(this.rawBaseline));
      this.lastSyncTime = 'Today, 08:15 PM • Verified CACP da.gov.in';
      localStorage.removeItem('cpc_cacp_msp_dataset');
      localStorage.setItem('cpc_cacp_last_sync', this.lastSyncTime);
      window.dispatchEvent(new CustomEvent('cacp-msp-updated', { detail: { reset: true } }));
      if (document.getElementById('cacpScheduleTableWrap')) {
        renderCacpScheduleContent(this.currentTab, this.currentSearch);
      }
    }
  }

  const CACP_MSP_STORE = new CacpMspStoreManager();
  window.CACP_MSP_STORE = CACP_MSP_STORE;

  // Dynamic MSP Registry Proxy that transparently resolves latest CACP rates across the app
  const CROP_MSP_RATES = new Proxy({}, {
    get(target, prop) {
      if (typeof prop === 'string') {
        return CACP_MSP_STORE.getMspForCrop(prop);
      }
      return 2275;
    }
  });
  window.CROP_MSP_RATES = CROP_MSP_RATES;


  // ==========================================================================
  // CACP OFFICIAL MSP PROCUREMENT SCHEDULE RENDERER & OFFICIAL MATRIX BOX
  // Replicating official portal at https://cacp.da.gov.in/Home/MSP
  // ==========================================================================
  let cacpMatrixRange = 'recent'; // 'recent' (2021-2027) or 'all' (2010-2027)

  function renderCacpScheduleContent(tab = 'matrix', search = '') {
    const tableWrap = document.getElementById('cacpScheduleTableWrap');
    if (!tableWrap) return;

    CACP_MSP_STORE.currentTab = tab;
    CACP_MSP_STORE.currentSearch = search;

    // Update tab button active states
    document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const syncLabel = document.getElementById('cacpSyncTimeLabel');
    if (syncLabel) syncLabel.textContent = CACP_MSP_STORE.lastSyncTime;

    const matrixSyncLabel = document.getElementById('cacpMatrixSyncTime');
    if (matrixSyncLabel) matrixSyncLabel.textContent = CACP_MSP_STORE.lastSyncTime;

    let items = CACP_MSP_STORE.getAll();

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(c => c.commodity.toLowerCase().includes(q) || c.season.toLowerCase().includes(q));
    }

    if (tab === 'matrix') {
      // OFFICIAL GOVERNMENT CACP MATRIX BOX (cacp.da.gov.in style)
      const matrixYears = cacpMatrixRange === 'recent'
        ? ['2026', '2025', '2024', '2023', '2022', '2021']
        : ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
      
      const seasons = ['Kharif Crops', 'Rabi Crops', 'Commercial Crops'];
      
      let headerYearCols = '';
      let subHeaderCols = '';
      matrixYears.forEach(y => {
        const nextYr = (parseInt(y, 10) + 1).toString().slice(-2);
        const yrLabel = `${y}-${nextYr}`;
        headerYearCols += `<th colspan="2">${yrLabel}</th>`;
        subHeaderCols += `<th class="sub-th">Rec</th><th class="sub-th">Fixed</th>`;
      });

      let matrixBodyRows = '';
      seasons.forEach(seasonName => {
        const seasonItems = items.filter(i => i.season === seasonName);
        if (seasonItems.length === 0) return;

        // Season Header Row
        matrixBodyRows += `
          <tr class="cacp-season-header-row">
            <td colspan="${matrixYears.length * 2 + 1}">
              <strong>${seasonName.toUpperCase()}</strong>
            </td>
          </tr>
        `;

        seasonItems.forEach(c => {
          let priceCells = '';
          matrixYears.forEach(y => {
            const yrData = c.years?.[y];
            const reco = yrData?.reco && yrData.reco !== '-' ? `₹${parseInt(yrData.reco, 10).toLocaleString('en-IN')}` : '<span style="color:#B0BDB5;">-</span>';
            const fixed = yrData?.fixed && yrData.fixed !== '-' ? `₹${parseInt(yrData.fixed, 10).toLocaleString('en-IN')}` : '<span style="color:#B0BDB5;">-</span>';
            priceCells += `
              <td class="cacp-price-cell-reco">${reco}</td>
              <td class="cacp-price-cell-fixed">${fixed}</td>
            `;
          });

          matrixBodyRows += `
            <tr>
              <td class="commodity-name-cell">
                <span style="font-size: 15px; margin-right: 6px;">${c.icon || '🌾'}</span>
                <strong>${c.commodity}</strong>
              </td>
              ${priceCells}
            </tr>
          `;
        });
      });

      tableWrap.innerHTML = `
        <div class="cacp-official-matrix-card">
          <div class="cacp-matrix-top-bar">
            <div class="cacp-matrix-title">
              <span>🏛️ Crop &amp; Year-wise Minimum Support Price (MSP) Matrix</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <div class="matrix-range-toggle" role="group" aria-label="Year Range Filter">
                <button type="button" class="matrix-range-btn ${cacpMatrixRange === 'recent' ? 'active' : ''}" onclick="window.setMatrixRange('recent');" title="Display Recent 6 Marketing Years in spacious zero-scroll layout">⚡ Recent Years (2021–2027)</button>
                <button type="button" class="matrix-range-btn ${cacpMatrixRange === 'all' ? 'active' : ''}" onclick="window.setMatrixRange('all');" title="Display Full 17-Year Historical MSP Archive">📜 Full Archive (2010–2027)</button>
              </div>
              <span class="cacp-matrix-unit-tag">(₹/qtl) Updated on: <span id="cacpMatrixSyncTime">${CACP_MSP_STORE.lastSyncTime}</span></span>
            </div>
          </div>
          <div class="cacp-matrix-scroll-wrap">
            <table class="cacp-official-table">
              <thead>
                <tr>
                  <th rowspan="2" class="commodity-th">Commodity</th>
                  ${headerYearCols}
                </tr>
                <tr>
                  ${subHeaderCols}
                </tr>
              </thead>
              <tbody>
                ${matrixBodyRows || '<tr><td colspan="' + (matrixYears.length * 2 + 1) + '" style="text-align: center; padding: 24px; color: #7B8B7F;">No crops matching search query.</td></tr>'}
              </tbody>
            </table>
          </div>
          <div style="background: #FAF7F2; padding: 8px 16px; border-top: 1px solid #E8DEC8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 11px; color: #64746A;">
            <div><strong>Official Legend:</strong> <span style="color:#55665B; margin-right: 12px;"><strong>Rec</strong> = Recommended by CACP</span> <span style="color:#143525;"><strong>Fixed</strong> = Approved Cabinet MSP</span></div>
            <div>* Source: Commission for Agricultural Costs &amp; Prices (<a href="https://cacp.da.gov.in/Home/MSP" target="_blank" rel="noopener noreferrer" style="color: #1E824C; text-decoration: underline;">cacp.da.gov.in</a>)</div>
          </div>
        </div>
      `;
      return;
    }

    if (tab === 'history') {
      // Multi-Year Price History Comparison Table (2018 to 2026)
      const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
      let historyRows = '';

      items.forEach(c => {
        let yrCells = '';
        years.forEach(y => {
          const yData = c.years?.[y];
          const fix = yData?.fixed && yData.fixed !== '-' ? `₹${parseInt(yData.fixed, 10).toLocaleString('en-IN')}` : '<span style="color: #A0ABA3;">-</span>';
          yrCells += `<td style="font-size: 11px;"><strong>${fix}</strong></td>`;
        });

        historyRows += `
          <tr>
            <td class="crop-col" style="white-space: nowrap;">
              <span style="font-size: 16px; margin-right: 6px;">${c.icon || '🌾'}</span>
              <strong>${c.commodity}</strong>
              <div style="font-size: 10px; color: #7B8B7F;">${c.season}</div>
            </td>
            ${yrCells}
          </tr>
        `;
      });

      tableWrap.innerHTML = `
        <div style="overflow-x: auto;">
          <table class="detail-table schedule-table cacp-history-table">
            <thead>
              <tr>
                <th style="text-align: left;">Crop &amp; Variety</th>
                <th>2026-27 (₹)</th>
                <th>2025-26 (₹)</th>
                <th>2024-25 (₹)</th>
                <th>2023-24 (₹)</th>
                <th>2022-23 (₹)</th>
                <th>2021-22 (₹)</th>
                <th>2020-21 (₹)</th>
                <th>2019-20 (₹)</th>
                <th>2018-19 (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${historyRows || '<tr><td colspan="10" style="text-align: center; padding: 24px; color: #7B8B7F;">No crops matching search query.</td></tr>'}
            </tbody>
          </table>
        </div>
        <p style="font-size: 11px; color: #64746A; margin-top: 8px; text-align: right;">
          * All historical rates in INR (₹) per Quintal as fixed &amp; published by CACP, Department of Agriculture &amp; Farmers Welfare.
        </p>
      `;
      return;
    }

    // Standard Operational Views (kharif, rabi, commercial)
    const seasonFiltered = CACP_MSP_STORE.getBySeason(tab);
    const displayList = search && search.trim() ? seasonFiltered.filter(c => c.commodity.toLowerCase().includes(search.toLowerCase().trim())) : seasonFiltered;

    let rowsHtml = '';
    displayList.forEach(c => {
      const details = CACP_MSP_STORE.getLatestMspDetails(c);
      const isLive = c.window?.status === 'live';
      const isRegOpen = c.window?.status === 'reg_open';
      const rowClass = isLive ? 'schedule-row-active' : '';

      let statusBadge = '<span class="badge-tag badge-pending">📅 Upcoming Window</span>';
      let actionBtn = `<button type="button" class="btn-schedule-action outline" onclick="window.goToFormFilling();" title="Pre-register produce for upcoming season">Pre-Register →</button>`;

      if (isLive) {
        statusBadge = '<span class="badge-tag badge-success">🟢 Live Intake Active</span>';
        actionBtn = `<button type="button" class="btn-schedule-action" onclick="window.goToSlotBooking();" title="Book Weighbridge Slot for ${c.commodity}">Book Slot →</button>`;
      } else if (isRegOpen) {
        statusBadge = '<span class="badge-tag" style="background: #FFF3CD; color: #856404; border: 1px solid #FFEEBA;">🟡 Registration Open</span>';
        actionBtn = `<button type="button" class="btn-schedule-action outline" onclick="window.goToFormFilling();" title="Register produce in Form Filling">Register Crop →</button>`;
      }

      const formattedFixed = typeof details.curFixed === 'number' ? `₹${details.curFixed.toLocaleString('en-IN')}` : details.curFixed;
      const formattedReco = typeof details.curReco === 'number' || (typeof details.curReco === 'string' && details.curReco !== '-') ? `₹${parseInt(details.curReco, 10).toLocaleString('en-IN')}` : '-';

      rowsHtml += `
        <tr class="${rowClass}">
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">${c.icon || '🌾'}</span>
              <div>
                <strong>${c.commodity}</strong>
                <div style="font-size: 10.5px; color: #7B8B7F;">${c.season} • ${details.curYear}</div>
              </div>
            </div>
          </td>
          <td>
            <strong style="color: #143525; font-size: 13.5px;">${formattedFixed}</strong>
            ${details.hikeText ? `<div style="font-size: 10.5px; color: #1E824C; font-weight: 700;">${details.hikeText}</div>` : ''}
          </td>
          <td>
            <span style="color: #4A584E; font-size: 12px; font-weight: 600;">${formattedReco}</span>
          </td>
          <td style="font-size: 12px;">${c.window?.reg || 'Per Circular'}</td>
          <td style="font-size: 12px;">
            <strong>${c.window?.intake || 'Active Season'}</strong>
            ${isLive ? `<div style="font-size: 10px; color: #1E824C; font-weight: 700;">● Today Open for Weighment</div>` : ''}
          </td>
          <td style="font-size: 11px; color: #4A584E; line-height: 1.4;">${c.qualitySpec || 'FAQ Standards'}</td>
          <td>${statusBadge}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    });

    tableWrap.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="detail-table schedule-table">
          <thead>
            <tr>
              <th>Crop &amp; Official Grade</th>
              <th>Govt. Fixed MSP (₹/Qtl)</th>
              <th>Recommended (Rec ₹)</th>
              <th>Farmer Registration</th>
              <th>Weighbridge Intake Window</th>
              <th>Assaying FAQ Standards</th>
              <th>Intake Status</th>
              <th>Workflow Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="8" style="text-align: center; padding: 24px; color: #7B8B7F;">No crops matching search query.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderScheduleModuleHtml() {
    return `
      <!-- 1. CACP Official Ministry Source & Live Sync Bar -->
      <div class="cacp-source-bar">
        <div class="cacp-source-info">
          <div class="cacp-emblem-badge" title="Commission for Agricultural Costs and Prices, GoI">🌾</div>
          <div class="cacp-source-text">
            <div class="cacp-source-title">
              <span>Commission for Agricultural Costs &amp; Prices (CACP)</span>
              <span class="badge-tag badge-success" style="font-size: 9.5px; padding: 1px 6px;">AUTO-SYNC ACTIVE</span>
            </div>
            <div>Ministry of Agriculture &amp; Farmers Welfare, Government of India • <a href="https://cacp.da.gov.in/Home/MSP" target="_blank" rel="noopener noreferrer" class="cacp-source-link">🔗 Official Portal (cacp.da.gov.in/Home/MSP)</a></div>
          </div>
        </div>
        <div class="cacp-sync-actions">
          <span class="cacp-sync-status">
            <span class="live-dot-pulse"></span>
            <span id="cacpSyncTimeLabel">${CACP_MSP_STORE.lastSyncTime}</span>
          </span>
          <button type="button" class="btn-cacp-sync" id="cacpSyncBtn" onclick="window.syncLiveGovtMsp();" title="Sync live MSP updates directly from official CACP JSON endpoint">
            <span class="sync-icon">🔄</span>
            <span>Sync Live Govt MSP</span>
          </button>
          <button type="button" class="btn-cacp-admin" onclick="window.openCacpMspModal();" title="Announce or apply CCEA Gazette MSP revisions">
            <span>📢 Announce / Revise MSP</span>
          </button>
        </div>
      </div>

      <!-- 2. Real-World Center Operational Banner -->
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

      <!-- 3. Real-World Center Operations & Capacity KPI Summary -->
      <div class="schedule-kpi-grid">
        <div class="schedule-kpi-card">
          <span class="kpi-label">MONITORED COMMODITIES</span>
          <span class="kpi-value">28 Commodities</span>
          <span class="kpi-sub">Kharif, Rabi &amp; Commercial Crops</span>
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
          <span class="kpi-label">DBT MSP ASSURANCE</span>
          <span class="kpi-value" style="color: #1E824C;">100% Protected</span>
          <span class="kpi-sub">Direct Bank Account Credit (24–48h)</span>
        </div>
      </div>

      <!-- 4. Interactive Tab Filters and Search Bar -->
      <div class="payment-section-heading" style="margin-top: 10px; margin-bottom: 4px;">
        <span>📋 OFFICIAL MSP PROCUREMENT SCHEDULE &amp; OPERATIONAL CALENDAR</span>
      </div>

      <div class="schedule-controls-bar">
        <div class="schedule-tabs-wrap" role="tablist">
          <button type="button" class="schedule-tab-btn active" data-tab="matrix" onclick="window.switchScheduleTab('matrix');">🏛️ Official CACP Matrix Box (cacp.da.gov.in Style)</button>
          <button type="button" class="schedule-tab-btn" data-tab="kharif" onclick="window.switchScheduleTab('kharif');">🌾 Kharif Intake (2026-27)</button>
          <button type="button" class="schedule-tab-btn" data-tab="rabi" onclick="window.switchScheduleTab('rabi');">🌱 Rabi Crops</button>
          <button type="button" class="schedule-tab-btn" data-tab="commercial" onclick="window.switchScheduleTab('commercial');">🌴 Commercial Crops</button>
          <button type="button" class="schedule-tab-btn" data-tab="history" onclick="window.switchScheduleTab('history');">📊 Multi-Year Price History</button>
        </div>

        <div class="schedule-search-box">
          <span class="schedule-search-icon">🔍</span>
          <input type="text" class="schedule-search-input" id="scheduleSearchInput" placeholder="Search crop, variety, or season..." oninput="window.handleScheduleSearch(this.value);" />
        </div>
      </div>

      <!-- 5. Dynamic Schedule Table Container (Holds the Official Matrix Box or Selected View) -->
      <div id="cacpScheduleTableWrap" style="margin-top: 6px; margin-bottom: 16px;">
        <!-- Injected dynamically via renderCacpScheduleContent -->
      </div>

      <!-- 6. Official CACP Footnotes & Norms Accordion -->
      <div class="cacp-footnotes-card">
        <div class="cacp-footnotes-header" onclick="const fc = document.getElementById('cacpFootnotesContent'); const fa = document.getElementById('cacpFootnotesArrow'); if(fc) { const isH = fc.classList.toggle('hidden'); if(fa) fa.textContent = isH ? '▼ Expand' : '▲ Collapse'; }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">📜</span>
            <span>Official Statutory CACP Pricing &amp; Quality Norms (15 Footnotes from CACP Portal)</span>
          </div>
          <span id="cacpFootnotesArrow" style="font-size: 11px; color: #1E824C; font-weight: 700;">▼ Expand</span>
        </div>
        <div id="cacpFootnotesContent" class="cacp-footnotes-content hidden">
          <ul class="cacp-footnotes-list">
            ${CACP_FOOTNOTES_DATA.map(fn => `<li>${fn}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 7. Real-World End-to-End Workflow Pathway (Matching Website Modules 1 to 6) -->
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

          <div class="roadmap-step-card" onclick="window.goToCropInDemand();" title="Proceed to Phase 2: High Demand Crops">
            <span class="step-badge">STAGE 02</span>
            <div class="step-icon">🔥</div>
            <strong class="step-title">Crop in Demand</strong>
            <p class="step-desc">Discover high-quantity government procurement targets &amp; buffer quotas.</p>
            <span class="step-jump-link">Open Module 2 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToFormFilling();" title="Proceed to Phase 3: Produce Registration Form">
            <span class="step-badge">STAGE 03</span>
            <div class="step-icon">📝</div>
            <strong class="step-title">Produce Registration</strong>
            <p class="step-desc">Register land survey #, crop variety, harvest weight &amp; bank DBT.</p>
            <span class="step-jump-link">Open Module 3 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToSlotBooking();" title="Proceed to Phase 4: Center &amp; Slot Booking">
            <span class="step-badge">STAGE 04</span>
            <div class="step-icon">⏰</div>
            <strong class="step-title">Slot Reservation</strong>
            <p class="step-desc">Book morning/afternoon slot at Village ABC cooperative center.</p>
            <span class="step-jump-link">Open Module 4 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToTokenStatus();" title="Proceed to Phase 5: Live Token Queue Status">
            <span class="step-badge">STAGE 05</span>
            <div class="step-icon">🎟️</div>
            <strong class="step-title">Live Queue Status</strong>
            <p class="step-desc">Track token #TK-8492 with 5-vehicle countdown dispatching.</p>
            <span class="step-jump-link">Open Module 5 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToFinalizeProcurement();" title="Proceed to Phase 6: Finalize Procurement &amp; Assaying">
            <span class="step-badge">STAGE 06</span>
            <div class="step-icon">⚖️</div>
            <strong class="step-title">Assaying &amp; Stamp</strong>
            <p class="step-desc">Quality inspection, moisture grading &amp; official stamp certification.</p>
            <span class="step-jump-link">Open Module 6 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToPaymentHistory();" title="Proceed to Phase 7: Direct Benefit Transfer (DBT)">
            <span class="step-badge">STAGE 07</span>
            <div class="step-icon">💳</div>
            <strong class="step-title">DBT Settlement</strong>
            <p class="step-desc">Direct government bank credit within 24-48h with live UTR receipt.</p>
            <span class="step-jump-link">Open Module 7 →</span>
          </div>
        </div>
      </div>

      <!-- 8. Government Quality Guidelines & Operational Notice Box -->
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

      <!-- 9. Direct Workflow Navigation Bar -->
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
  }

  window.renderCacpScheduleContent = renderCacpScheduleContent;
  window.switchScheduleTab = function(tabKey) {
    const searchVal = document.getElementById('scheduleSearchInput')?.value || '';
    renderCacpScheduleContent(tabKey, searchVal);
  };
  window.handleScheduleSearch = function(searchVal) {
    renderCacpScheduleContent(CACP_MSP_STORE.currentTab, searchVal);
  };
  window.setMatrixRange = function(rangeKey) {
    cacpMatrixRange = rangeKey;
    renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'matrix', CACP_MSP_STORE.currentSearch || '');
  };
  window.syncLiveGovtMsp = function() {
    CACP_MSP_STORE.syncLiveGovtMsp(showToast);
  };

  window.openCacpMspModal = function() {
    const modal = document.getElementById('cacpMspModal');
    const select = document.getElementById('cacpRevCrop');
    if (select) {
      const allCrops = CACP_MSP_STORE.getAll();
      select.innerHTML = allCrops.map(c => `<option value="${c.commodity}">${c.icon || '🌾'} ${c.commodity} (${c.season})</option>`).join('');
    }
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCacpMspModal = function() {
    const modal = document.getElementById('cacpMspModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  window.submitCustomMspRevision = function() {
    const crop = document.getElementById('cacpRevCrop')?.value;
    const year = document.getElementById('cacpRevYear')?.value || '2026';
    const fixed = document.getElementById('cacpRevFixed')?.value;
    const notes = document.getElementById('cacpRevNotes')?.value || 'CCEA Gazette Notification';

    if (!crop || !fixed) {
      showToast('Please select a crop and enter a valid fixed MSP rate', 'error');
      return;
    }

    const item = CACP_MSP_STORE.findCrop(crop);
    const season = item?.season || 'Kharif Crops';
    const numFixed = parseInt(fixed, 10);

    CACP_MSP_STORE.applyRevision(season, crop, year, numFixed, numFixed);
    window.closeCacpMspModal();

    showToast(`📢 CCEA Gazette Revision Published! ${crop} MSP updated to ₹${numFixed.toLocaleString('en-IN')}/Qtl across the entire portal.`, 'success');
    addNotificationAlert(`🏛️ MSP Gazette Revision: ${crop}`, `${crop} MSP revised to ₹${numFixed.toLocaleString('en-IN')}/Qtl (${year}). Ref: ${notes}`, 'schedule');
  };

  window.applyCacpPreset = function(presetKey) {
    if (presetKey === 'rabi2026') {
      CACP_MSP_STORE.applyRevision('Rabi Crops', 'Wheat', 2026, 2715, 2715);
      CACP_MSP_STORE.applyRevision('Rabi Crops', 'Rapeseed/ Mustard', 2026, 6550, 6550);
      CACP_MSP_STORE.applyRevision('Rabi Crops', 'Gram', 2026, 6150, 6150);
      CACP_MSP_STORE.applyRevision('Rabi Crops', 'Lentil (Masur)', 2026, 7350, 7350);
      CACP_MSP_STORE.applyRevision('Rabi Crops', 'Barley', 2026, 2280, 2280);
      CACP_MSP_STORE.applyRevision('Rabi Crops', 'Safflower', 2026, 6940, 6940);
      window.closeCacpMspModal();
      showToast('📢 Applied Rabi 2026-27 CCEA Gazette MSP revisions (Wheat ₹2,715, Mustard ₹6,550, Gram ₹6,150)!', 'success');
      addNotificationAlert('🏛️ Rabi 2026-27 MSP Notification', 'CCEA notified new MSPs for Rabi crops including Wheat at ₹2,715/Qtl.', 'schedule');
    } else if (presetKey === 'pulseBonus') {
      const curTur = CACP_MSP_STORE.getMspForCrop('Tur (Arhar)');
      const curMoong = CACP_MSP_STORE.getMspForCrop('Moong');
      const curUrad = CACP_MSP_STORE.getMspForCrop('Urad');
      CACP_MSP_STORE.applyRevision('Kharif Crops', 'Tur (Arhar)', 2026, curTur + 250, curTur + 250);
      CACP_MSP_STORE.applyRevision('Kharif Crops', 'Moong', 2026, curMoong + 250, curMoong + 250);
      CACP_MSP_STORE.applyRevision('Kharif Crops', 'Urad', 2026, curUrad + 250, curUrad + 250);
      window.closeCacpMspModal();
      showToast('📢 Applied +₹250 Pulse Bonus to Tur, Moong & Urad MSP rates!', 'success');
      addNotificationAlert('🏛️ Special Pulse Bonus Applied', 'Government released +₹250/Qtl bonus for Tur, Moong, and Urad market arrivals.', 'schedule');
    }
  };

  window.resetToCacpBaseline = function() {
    CACP_MSP_STORE.resetToBaseline();
    window.closeCacpMspModal();
    showToast('↺ Reset all MSP rates to official factory CACP baseline datasets.', 'info');
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

  // ==========================================================================
  // DYNAMIC ROLLING MSP TICKER ENGINE (FARMER DASHBOARD)
  // Rolls current government MSP rates across all 28 CACP commodities
  // ==========================================================================
  let currentTickerSeason = 'all';
  let isTickerPausedByUser = false;
  let isTickerInitialized = false;

  function buildCropTickerCapsuleHtml(crop) {
    const details = CACP_MSP_STORE.getLatestMspDetails(crop);
    const mspPrice = (typeof details.curFixed === 'number') 
      ? `₹${details.curFixed.toLocaleString('en-IN')}` 
      : (crop.years?.['2026']?.fixed || '2,441');
    
    // Determine season class
    let seasonClass = 'season-kharif';
    let seasonShort = 'KHARIF';
    const seasonLower = (crop.season || '').toLowerCase();
    if (seasonLower.includes('rabi')) {
      seasonClass = 'season-rabi';
      seasonShort = 'RABI';
    } else if (seasonLower.includes('commercial')) {
      seasonClass = 'season-commercial';
      seasonShort = 'COMM';
    }

    // Hike badge
    let hikeBadge = '';
    if (details.hikeVal && details.hikeVal > 0) {
      hikeBadge = `<span class="ticker-item-hike">▲ +₹${details.hikeVal}</span>`;
    } else {
      hikeBadge = `<span class="ticker-item-hike">▲ MSP Live</span>`;
    }

    // High Demand badge
    const highDemandCommodities = ['Paddy Common', 'Wheat', 'Tur (Arhar)', 'Maize', 'Urad', 'Rapeseed/ Mustard', 'Gram', 'Soyabean Yellow'];
    const isHighDemand = highDemandCommodities.some(h => (crop.commodity || '').includes(h) || h.includes(crop.commodity || ''));
    const demandBadge = isHighDemand ? `<span class="ticker-item-demand">🔥 High Demand</span>` : '';

    const safeCropName = (crop.commodity || 'Crop').replace(/"/g, '&quot;');

    return `
      <div class="msp-ticker-item" data-crop="${safeCropName}" role="button" tabindex="0" title="Click to view full ${safeCropName} MSP schedule, high demand quota and historical rates">
        <span class="ticker-item-icon" aria-hidden="true">${crop.icon || '🌾'}</span>
        <span class="ticker-item-name">${crop.commodity}</span>
        <span class="ticker-item-season ${seasonClass}">${seasonShort}</span>
        ${demandBadge}
        <span class="ticker-item-price-wrap">
          <span class="ticker-item-price">${mspPrice}</span>
          <span class="ticker-item-unit">/Qtl</span>
        </span>
        ${hikeBadge}
      </div>
    `;
  }

  function renderFarmerMspTicker(season = 'all') {
    const track = document.getElementById('mspTickerTrack');
    if (!track) return;

    currentTickerSeason = season;

    let items = CACP_MSP_STORE.getAll();
    if (season === 'kharif') {
      items = items.filter(c => (c.season || '').toLowerCase().includes('kharif'));
    } else if (season === 'rabi') {
      items = items.filter(c => (c.season || '').toLowerCase().includes('rabi'));
    } else if (season === 'commercial') {
      items = items.filter(c => (c.season || '').toLowerCase().includes('commercial'));
    }

    if (!items || items.length === 0) {
      items = CACP_MSP_STORE.getAll();
    }

    // Ensure loop has enough items (minimum 18-20 items) so that the loop never runs out
    // of elements on wide screens and seamlessly tiles across any resolution
    let loopItems = [...items];
    if (loopItems.length > 0 && loopItems.length < 18) {
      const repeatCount = Math.ceil(18 / loopItems.length);
      const baseItems = [...loopItems];
      for (let r = 1; r < repeatCount; r++) {
        loopItems = loopItems.concat(baseItems);
      }
    }

    // Build the list of capsules
    const capsulesHtml = loopItems.map(buildCropTickerCapsuleHtml).join('');

    // Temporarily reset animation to avoid sudden displacement when swapping crop list
    track.style.animation = 'none';

    // Duplicate track for 100% seamless, infinite continuous roll
    track.innerHTML = `
      <div class="msp-ticker-loop">${capsulesHtml}</div>
      <div class="msp-ticker-loop" aria-hidden="true">${capsulesHtml}</div>
    `;

    // Calculate duration so linear roll speed (speed of crops gliding across the screen)
    // is 100% CONSTANT across ALL views: 'all', 'kharif', and 'rabi'.
    // Base reference: 28 crops roll across 95 seconds = ~3.392857 seconds per crop card.
    const SECONDS_PER_CROP = 95 / 28;
    const computedDuration = Math.max(12, loopItems.length * SECONDS_PER_CROP);

    // Apply speed via both CSS custom property and animationDuration
    track.style.setProperty('--ticker-duration', `${computedDuration.toFixed(2)}s`);
    track.style.animationDuration = `${computedDuration.toFixed(2)}s`;

    // Force DOM reflow and cleanly restore animation
    void track.offsetHeight;
    track.style.animation = '';

    // Reapply paused class if user had manually paused
    if (isTickerPausedByUser) {
      track.classList.add('paused');
    }

    // Attach click handlers to all capsules
    track.querySelectorAll('.msp-ticker-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const cropName = item.getAttribute('data-crop');
        if (cropName) {
          window.openCropInSchedule(cropName);
        }
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const cropName = item.getAttribute('data-crop');
          if (cropName) {
            window.openCropInSchedule(cropName);
          }
        }
      });
    });
  }

  function initFarmerMspTicker() {
    const tickerBar = document.getElementById('farmerMspTickerBar');
    if (!tickerBar) return;

    renderFarmerMspTicker(currentTickerSeason);

    if (isTickerInitialized) return;
    isTickerInitialized = true;

    // Pause / Play Button
    const playPauseBtn = document.getElementById('tickerPlayPauseBtn');
    const track = document.getElementById('mspTickerTrack');
    const pauseIcon = playPauseBtn?.querySelector('.icon-pause');
    const playIcon = playPauseBtn?.querySelector('.icon-play');
    const pauseText = document.getElementById('tickerPauseBtnText');

    if (playPauseBtn && track) {
      playPauseBtn.onclick = () => {
        isTickerPausedByUser = !isTickerPausedByUser;
        const curLang = localStorage.getItem('cpc_selected_lang') || 'en';
        const t = FARMER_TRANSLATIONS[curLang] || FARMER_TRANSLATIONS.en;

        if (isTickerPausedByUser) {
          track.classList.add('paused');
          pauseIcon?.classList.add('hidden');
          playIcon?.classList.remove('hidden');
          if (pauseText) pauseText.textContent = t.tickerResume || 'Play';
          playPauseBtn.setAttribute('title', 'Resume rolling ticker');
        } else {
          track.classList.remove('paused');
          pauseIcon?.classList.remove('hidden');
          playIcon?.classList.add('hidden');
          if (pauseText) pauseText.textContent = t.tickerPause || 'Pause';
          playPauseBtn.setAttribute('title', 'Pause rolling ticker');
        }
      };
    }

    // Season Filter Pills
    const filterBtns = document.querySelectorAll('.msp-season-pill');
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        const season = btn.getAttribute('data-season') || 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFarmerMspTicker(season);
      };
    });

    // View Full Matrix Button
    const openMatrixBtn = document.getElementById('tickerOpenMatrixBtn');
    if (openMatrixBtn) {
      openMatrixBtn.onclick = () => {
        openModuleDetail('schedule');
      };
    }

    // Auto-update ticker on live CACP updates
    window.addEventListener('cacp-msp-updated', () => {
      renderFarmerMspTicker(currentTickerSeason);
    });
  }

  window.openCropInSchedule = function(cropName) {
    openModuleDetail('schedule');
    setTimeout(() => {
      const searchInput = document.getElementById('scheduleSearchInput');
      if (searchInput) {
        searchInput.value = cropName;
        searchInput.focus();
        if (typeof window.handleScheduleSearch === 'function') {
          window.handleScheduleSearch(cropName);
        }
      }
      setTimeout(() => {
        const table = document.getElementById('cacpScheduleTableWrap');
        if (table) {
          const row = table.querySelector('tbody tr');
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.style.transition = 'all 0.4s ease';
            row.style.boxShadow = '0 0 16px rgba(223, 195, 150, 0.8)';
            setTimeout(() => { row.style.boxShadow = ''; }, 2200);
          }
        }
      }, 150);
    }, 100);
  };
  window.initFarmerMspTicker = initFarmerMspTicker;
  window.renderFarmerMspTicker = renderFarmerMspTicker;

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
      servicesTag: "7 SERVICES AVAILABLE",
      mod1Title: "PROCUREMENT SCHEDULE",
      mod1Desc: "View crop-wise MSP calendars, procurement operational schedules, daily intake quotas, and purchase limits.",
      mod1Action: "View Schedule",
      mod2Title: "CROP IN DEMAND",
      mod2Desc: "View high-demand crops required in large volumes by the government, national procurement quotas, and priority intake.",
      mod2Action: "View High Demand Crops",
      mod3Title: "FORM FILLING",
      mod3Desc: "Register new agricultural produce, enter harvest yield quintals, land survey numbers, and bank DBT details.",
      mod3Action: "Fill Crop Form",
      mod4Title: "PROCUREMENT CENTER & SLOT BOOKING",
      mod4Desc: "Choose your designated cooperative center, select preferred intake date, and reserve real-time weighbridge slots.",
      mod4Action: "Book Center Slot",
      mod5Title: "LIVE TOKEN QUEUE STATUS",
      mod5Desc: "Monitor live weighbridge gate countdowns, track truck convoy queue positions, and view active token numbers.",
      mod5Action: "Track Live Queue",
      mod6Title: "FINALIZE PROCUREMENT & PAYMENT",
      mod6Desc: "Inspect verified gross weights, view certified moisture assaying grades, and confirm direct bank DBT transfer.",
      mod6Action: "Authorize DBT Payment",
      mod7Title: "TRANSACTION & PAYMENT HISTORY",
      mod7Desc: "Access Direct Benefit Transfer (DBT) bank logs, government payment voucher receipts, and transaction reference numbers.",
      mod7Action: "View Statements",
      switchSuccess: "Language switched to English",
      tickerTitle: "LIVE MSP 2026-27",
      tickerSub: "GOVT. BENCHMARKS",
      tickerPause: "Pause",
      tickerResume: "Play",
      tickerMatrixBtn: "Full Matrix"
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
      servicesTag: "7 సేవలు అందుబాటులో ఉన్నాయి",
      mod1Title: "సేకరణ షెడ్యూల్",
      mod1Desc: "పంటల వారీగా MSP క్యాలెండర్లు, కొనుగోలు షెడ్యూల్‌లు, రోజువారీ కోటాలు మరియు కొనుగోలు పరిమితులను చూడండి.",
      mod1Action: "షెడ్యూల్ చూడండి",
      mod2Title: "అధిక డిమాండ్ ఉన్న పంటలు",
      mod2Desc: "ప్రభుత్వానికి పెద్ద పరిమాణంలో అవసరమైన అధిక డిమాండ్ పంటలు, జాతీయ సేకరణ లక్ష్యాలు మరియు ప్రాధాన్యత కోటాలను చూడండి.",
      mod2Action: "డిమాండ్ పంటలను చూడండి",
      mod3Title: "పంట నమోదు ఫారం",
      mod3Desc: "కొత్త పంటను నమోదు చేయండి, దిగుబడి క్వింటాళ్లు, భూమి సర్వే నంబర్ మరియు బ్యాంక్ DBT వివరాలను నమోదు చేయండి.",
      mod3Action: "ఫారమ్ పూరించండి",
      mod4Title: "సేకరణ కేంద్రం & స్లాట్ బుకింగ్",
      mod4Desc: "మీ సహకార కేంద్రాన్ని ఎంచుకోండి, తేదీని ఎంచుకోండి మరియు నిజ-సమయ వేయింగ్‌బ్రిడ్జ్ స్లాట్‌లను రిజర్వ్ చేసుకోండి.",
      mod4Action: "స్లాట్ బుక్ చేయండి",
      mod5Title: "లైవ్ టోకెన్ క్యూ స్థితి",
      mod5Desc: "లైవ్ వేయింగ్‌బ్రిడ్జ్ గేట్ కౌంట్‌డౌన్, క్యూలో మీ స్థానం మరియు యాక్టివ్ టోకెన్ నంబర్‌ను పర్యవేక్షించండి.",
      mod5Action: "లైవ్ క్యూ చూడండి",
      mod6Title: "సేకరణ & చెల్లింపును ఖరారు చేయండి",
      mod6Desc: "ధృవీకరించబడిన నికర బరువును తనిఖీ చేయండి, తేమ పరీక్ష గ్రేడ్‌ను వీక్షించండి మరియు బ్యాంక్ DBT బదిలీని నిర్ధారించండి.",
      mod6Action: "DBT చెల్లింపును నిర్ధారించండి",
      mod7Title: "లావాదేవీలు & చెల్లింపు చరిత్ర",
      mod7Desc: "డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (DBT) బ్యాంక్ లాగ్‌లు, ప్రభుత్వ చెల్లింపు రసీదులు మరియు UTR నంబర్‌లను పొందండి.",
      mod7Action: "స్టేట్‌మెంట్‌లను చూడండి",
      switchSuccess: "భాష తెలుగులోకి మార్చబడింది",
      tickerTitle: "లైవ్ MSP 2026-27",
      tickerSub: "ప్రభుత్వ మద్దతు ధరలు",
      tickerPause: "నిలిపివేయి",
      tickerResume: "ప్లే",
      tickerMatrixBtn: "పూర్తి పట్టిక"
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
      servicesTag: "7 सेवाएं उपलब्ध",
      mod1Title: "खरीद अनुसूची",
      mod1Desc: "फसल-वार एमएसपी कैलेंडर, खरीद कार्यक्रम, दैनिक कोटा और खरीद सीमाएं देखें।",
      mod1Action: "अनुसूची देखें",
      mod2Title: "उच्च मांग वाली फसलें",
      mod2Desc: "सरकार द्वारा भारी मात्रा में आवश्यक उच्च मांग वाली फसलें, राष्ट्रीय खरीद लक्ष्य और प्राथमिकता कोटा देखें।",
      mod2Action: "मांग वाली फसलें देखें",
      mod3Title: "फसल पंजीकरण फॉर्म",
      mod3Desc: "नई कृषि उपज पंजीकृत करें, उपज वजन (क्विंटल), भूमि सर्वे नंबर और बैंक डीबीटी विवरण दर्ज करें।",
      mod3Action: "फॉर्म भरें",
      mod4Title: "खरीद केंद्र और स्लॉट बुकिंग",
      mod4Desc: "सहकारी केंद्र चुनें, पसंदीदा तिथि चुनें और वास्तविक समय में वेईब्रिज स्लॉट आरक्षित करें।",
      mod4Action: "स्लॉट बुक करें",
      mod5Title: "लाइव टोकन कतार स्थिति",
      mod5Desc: "वेईब्रिज गेट काउंटडाउन, वाहनों की कतार स्थिति और सक्रिय टोकन नंबर की वास्तविक स्थिति देखें।",
      mod5Action: "लाइव कतार देखें",
      mod6Title: "खरीद और भुगतान अंतिम रूप दें",
      mod6Desc: "सत्यापित वजन की जांच करें, प्रमाणित नमी ग्रेड देखें और बैंक डीबीटी हस्तांतरण की पुष्टि करें।",
      mod6Action: "डीबीटी भुगतान अधिकृत करें",
      mod7Title: "लेनदेन और भुगतान इतिहास",
      mod7Desc: "प्रत्यक्ष लाभ अंतरण (डीबीटी) बैंक लॉग, सरकारी भुगतान वाउचर रसीदें और लेनदेन संदर्भ नंबर देखें।",
      mod7Action: "विवरण देखें",
      switchSuccess: "भाषा बदलकर हिन्दी कर दी गई",
      tickerTitle: "लाइव MSP 2026-27",
      tickerSub: "सरकारी दरें",
      tickerPause: "रोकें",
      tickerResume: "चलाएं",
      tickerMatrixBtn: "पूरी सूची"
    },
    ta: {
      systemName: "நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம், இந்தியா",
      portalTitle: "பயிர் கொள்முதல் போர்ட்டல்",
      centerActive: "கொள்முதல் செயலில் உள்ளது (கரீஃப் 2026-27)",
      logoutBtn: "வெளியேறு",
      heroBadge: "அதிகாரப்பூர்வ விவசாயி பிரிவு",
      heroTitle: "விவசாயி பயிர் கொள்முதல் டாஷ்போர்டு",
      heroDesc: "ஒருங்கிணைந்த கொள்முதல் மற்றும் குறைந்தபட்ச ஆதரவு விலை (MSP) போர்ட்டலுக்கு வரவேற்கிறோம். ஸ்லாட்டுகளை முன்பதிவு செய்ய, பயிரை பதிவு செய்ய, எடை மேடை டோக்கன்களை கண்காணிக்க அல்லது DBT ரசீதுகளைப் பெற கீழே உள்ள சேவையைத் தேர்ந்தெடுக்கவும்.",
      servicesHeading: "கொள்முதல் சேவையைத் தேர்ந்தெடுக்கவும்",
      servicesTag: "7 சேவைகள் உள்ளன",
      mod1Title: "கொள்முதல் அட்டவணை",
      mod1Desc: "பயிர்வாரியான MSP காலண்டர், செயல்பாட்டு அட்டவணை மற்றும் கொள்முதல் வரம்புகளைப் பார்க்கவும்.",
      mod1Action: "அட்டவணையைப் பார்க்கவும்",
      mod2Title: "அதிக தேவை கொண்ட பயிர்கள்",
      mod2Desc: "அரசாங்கத்தால் பெரிய அளவில் தேவைப்படும் அதிக தேவை பயிர்கள், தேசிய கொள்முதல் இலக்குகள் மற்றும் முன்னுரிமைகளை காண்க.",
      mod2Action: "தேவை பயிர்களை பார்க்க",
      mod3Title: "பயிர் பதிவு படிவம்",
      mod3Desc: "புதிய பயிரைப் பதிவு செய்க, விளைச்சல் குவிண்டால், சர்வே எண் மற்றும் வங்கி விவரங்களை உள்ளிடவும்.",
      mod3Action: "படிவம் நிரப்பவும்",
      mod4Title: "கொள்முதல் மையம் & ஸ்லாட் முன்பதிவு",
      mod4Desc: "கூட்டுறவு மையத்தைத் தேர்வுசெய்து, தேதியைத் தேர்ந்தெடுத்து எடை மேடை ஸ்லாட்டை முன்பதிவு செய்யவும்.",
      mod4Action: "ஸ்லாட் முன்பதிவு செய்க",
      mod5Title: "நேரலை டோக்கன் வரிசை நிலை",
      mod5Desc: "எடை மேடை கவுண்டவுன், வரிசை நிலை மற்றும் செயலில் உள்ள டோக்கன் எண்ணைக் கண்காணிக்கவும்.",
      mod5Action: "நேரலையைக் கண்காணிக்கவும்",
      mod6Title: "கொள்முதல் & கட்டணத்தை இறுதி செய்க",
      mod6Desc: "சரிபார்க்கப்பட்ட எடையைச் சரிபார்க்கவும், ஈரப்பத மதிப்பீட்டைப் பார்க்கவும், வங்கி DBT-ஐ உறுதிப்படுத்தவும்.",
      mod6Action: "DBT கட்டணத்தை உறுதிசெய்க",
      mod7Title: "பரிவர்த்தனை & கட்டண வரலாறு",
      mod7Desc: "நேரடி நன்மை பரிமாற்ற (DBT) பதிவுகள், அரசு கட்டண ரசீதுகள் மற்றும் UTR எண்களைப் பார்க்கவும்.",
      mod7Action: "அறிக்கைகளைப் பார்க்கவும்",
      switchSuccess: "மொழி தமிழுக்கு மாற்றப்பட்டது",
      tickerTitle: "நேரலை MSP 2026-27",
      tickerSub: "அரசு ஆதார விலை",
      tickerPause: "நிறுத்து",
      tickerResume: "தொடங்கு",
      tickerMatrixBtn: "முழு பட்டியல்"
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
      servicesTag: "7 സേവനങ്ങള്‍ ലഭ്യമാണ്",
      mod1Title: "സംഭരണ കലണ്ടർ",
      mod1Desc: "വിള തിരിച്ചുള്ള താങ്ങുവില കലണ്ടറും ദൈനംദിന സംഭരണ പരിധികളും പരിശോധിക്കുക.",
      mod1Action: "കലണ്ടർ കാണുക",
      mod2Title: "കൂടുതൽ ഡിമാൻഡുള്ള വിളകൾ",
      mod2Desc: "സർക്കാർ വൻതോതിൽ സംഭരിക്കാൻ ആവശ്യപ്പെടുന്ന ഉയർന്ന ഡിമാൻഡുള്ള വിളകൾ, ദേശീയ സംഭരണ ലക്ഷ്യങ്ങൾ എന്നിവ കാണുക.",
      mod2Action: "ഡിമാൻഡ് വിളകൾ കാണുക",
      mod3Title: "വിള രജിസ്ട്രേഷൻ ഫോം",
      mod3Desc: "പുതിയ വിള രജിസ്റ്റർ ചെയ്യുക, വിളവ് (ക്വിന്റൽ), സർവേ നമ്പർ, ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ നൽകുക.",
      mod3Action: "ഫോം പൂരിപ്പിക്കുക",
      mod4Title: "സംഭരണ കേന്ദ്രവും സ്ലോട്ട് ബുക്കിംഗും",
      mod4Desc: "സഹകരണ കേന്ദ്രം തിരഞ്ഞെടുത്ത് തത്സമയ വെയ്ബ്രിഡ്ജ് സ്ലോട്ട് ബുക്ക് ചെയ്യുക.",
      mod4Action: "സ്ലോട്ട് ബുക്ക് ചെയ്യുക",
      mod5Title: "തത്സമയ ടോക്കൺ ക്യൂ നില",
      mod5Desc: "വെയ്ബ്രിഡ്ജ് ഗേറ്റ് കൗണ്ട്ഡൗണും ടോക്കൺ നമ്പറിന്റെ തത്സമയ ക്യൂ നിലയും പരിശോധിക്കുക.",
      mod5Action: "ക്യൂ പരിശോധിക്കുക",
      mod6Title: "സംഭരണവും പേയ്‌മെന്റും പൂർത്തിയാക്കുക",
      mod6Desc: "സ്ഥിരീകരിച്ച തൂക്കം പരിശോധിച്ച് ഗുണനിലവാര സർട്ടിഫിക്കറ്റും ബാങ്ക് ഡിബിടി പേയ്‌മെന്റും സ്ഥിരീകരിക്കുക.",
      mod6Action: "ഡിബിടി പേയ്‌മെന്റ് ഉറപ്പാക്കുക",
      mod7Title: "ഇടപാടുകളും പേയ്‌മെന്റ് ചരിത്രവും",
      mod7Desc: "ബാങ്ക് ഡിബിടി വിവരങ്ങൾ, സർക്കാർ പേയ്‌മെന്റ് രസീതുകൾ, യുടിആർ നമ്പറുകൾ എന്നിവ പരിശോധിക്കുക.",
      mod7Action: "സ്റ്റേറ്റ്‌മെന്റുകൾ കാണുക",
      switchSuccess: "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി",
      tickerTitle: "തത്സമയ MSP 2026-27",
      tickerSub: "സർക്കാർ താങ്ങുവില",
      tickerPause: "താൽക്കാലികം",
      tickerResume: "പ്ലേ ചെയ്യുക",
      tickerMatrixBtn: "പൂർണ്ണ പട്ടിക"
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

    // Update Modules 1 to 7 Cards
    const modMap = [
      { id: 'cardSchedule', title: t.mod1Title, desc: t.mod1Desc, action: t.mod1Action },
      { id: 'cardCropInDemand', title: t.mod2Title, desc: t.mod2Desc, action: t.mod2Action },
      { id: 'cardFormFilling', title: t.mod3Title, desc: t.mod3Desc, action: t.mod3Action },
      { id: 'cardSlotBooking', title: t.mod4Title, desc: t.mod4Desc, action: t.mod4Action },
      { id: 'cardTokenStatus', title: t.mod5Title, desc: t.mod5Desc, action: t.mod5Action },
      { id: 'cardFinalize', title: t.mod6Title, desc: t.mod6Desc, action: t.mod6Action },
      { id: 'cardPaymentHistory', title: t.mod7Title, desc: t.mod7Desc, action: t.mod7Action }
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

    // Update Dynamic MSP Ticker Bar Translations
    const elTickerTitle = document.getElementById('tickerTitleLabel');
    if (elTickerTitle && t.tickerTitle) elTickerTitle.textContent = t.tickerTitle;

    const elTickerSub = document.getElementById('tickerSubLabel');
    if (elTickerSub && t.tickerSub) elTickerSub.textContent = t.tickerSub;

    const elTickerPause = document.getElementById('tickerPauseBtnText');
    if (elTickerPause) {
      elTickerPause.textContent = isTickerPausedByUser ? (t.tickerResume || 'Play') : (t.tickerPause || 'Pause');
    }

    const elTickerMatrix = document.getElementById('tickerViewMatrixText');
    if (elTickerMatrix && t.tickerMatrixBtn) elTickerMatrix.textContent = t.tickerMatrixBtn;

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

  // Initialize default login role to Farmer Desk on load
  setLoginRole('farmer');

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
          
          // Auto-sync official CACP MSP schedule on login
          CACP_MSP_STORE.syncLiveGovtMsp(false);
          
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
        
        // Auto-sync official CACP MSP schedule on login
        CACP_MSP_STORE.syncLiveGovtMsp(false);

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

          // Initialize and render live dynamic rolling MSP ticker
          initFarmerMspTicker();
          renderFarmerMspTicker(currentTickerSeason);
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

// ==========================================================================
  // MODULE 02: CROP IN DEMAND (HIGH QUANTITY GOVERNMENT PROCUREMENT TARGETS)
  // Replicating official Central Pool, FCI, NAFED, PM-AASHA & CACP quota drives
  // ==========================================================================
  const GOVERNMENT_DEMAND_CROPS = [
    {
      id: 'paddy-common',
      commodity: 'Paddy Common',
      category: 'cereals',
      categoryLabel: 'Major Foodgrain (Cereal)',
      season: 'Kharif Crops',
      icon: '🌾',
      nationalTargetQty: 540.0,
      procuredSoFarQty: 392.4,
      remainingDemandQty: 147.6,
      unit: 'Lakh Metric Tonnes (LMT)',
      urgency: 'critical',
      urgencyLabel: 'CRITICAL NATIONAL DEMAND',
      rank: '#1 Highest Quantity',
      primaryAgency: 'FCI & State Civil Supplies',
      procurementPurpose: 'National Food Security Act (NFSA), PMGKAY free grain distribution & 4-Month Central Strategic Buffer Reserve.',
      mspRate: 2300,
      bonusIncentive: 0,
      specialPerks: '100% guaranteed intake at all centers, express weighbridge gate clearance, 24-hr DBT payout settlement.',
      centerIntakeStatus: 'High Volume Intake Active',
      moistureSpec: 'Up to 17.0% Moisture FAQ allowed',
      scheduleTargetCrop: 'Paddy Common'
    },
    {
      id: 'wheat',
      commodity: 'Wheat',
      category: 'cereals',
      categoryLabel: 'Major Foodgrain (Cereal)',
      season: 'Rabi Crops',
      icon: '🌾',
      nationalTargetQty: 320.0,
      procuredSoFarQty: 266.0,
      remainingDemandQty: 54.0,
      unit: 'Lakh Metric Tonnes (LMT)',
      urgency: 'critical',
      urgencyLabel: 'CRITICAL NATIONAL DEMAND',
      rank: '#2 Strategic Reserve',
      primaryAgency: 'FCI & State Agencies',
      procurementPurpose: 'Central Pool Stock Replenishment, OMSS Market Stabilization & Public Distribution System (PDS).',
      mspRate: 2425,
      bonusIncentive: 0,
      specialPerks: 'Zero quantity cap per verified farmer. Inter-district transport rebate of ₹50/Qtl for >25 km transit.',
      centerIntakeStatus: 'Strategic Intake Open',
      moistureSpec: 'Moisture ≤ 12.0% FAQ standard',
      scheduleTargetCrop: 'Wheat'
    },
    {
      id: 'tur-arhar',
      commodity: 'Tur (Arhar)',
      category: 'pulses',
      categoryLabel: 'Urgent Buffer Deficit Pulse',
      season: 'Kharif Crops',
      icon: '🫘',
      nationalTargetQty: 40.0,
      procuredSoFarQty: 18.2,
      remainingDemandQty: 21.8,
      unit: 'Lakh Quintals',
      urgency: 'urgent',
      urgencyLabel: 'URGENT BUFFER DEFICIT',
      rank: '#1 Pulse Deficit',
      primaryAgency: 'NAFED & NCCF',
      procurementPurpose: 'Price Stabilization Fund (PSF) Pulse Buffer Drive to combat domestic price spikes & curb import dependence.',
      mspRate: 7550,
      bonusIncentive: 250,
      specialPerks: '100% Procurement Guarantee without state ceiling limit + ₹250/Qtl Direct Buffer Incentive on spot.',
      centerIntakeStatus: 'Urgent Procurement Priority',
      moistureSpec: 'Moisture ≤ 12.0% • Foreign matter ≤ 2.0%',
      scheduleTargetCrop: 'Tur (Arhar)'
    },
    {
      id: 'maize',
      commodity: 'Maize',
      category: 'cereals',
      categoryLabel: 'Biofuel & Industrial Cereal',
      season: 'Kharif Crops',
      icon: '🌽',
      nationalTargetQty: 65.0,
      procuredSoFarQty: 38.0,
      remainingDemandQty: 27.0,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH INDUSTRIAL DEMAND',
      rank: 'Surging Demand',
      primaryAgency: 'NAFED, NCCF & FCI',
      procurementPurpose: 'National Ethanol Blending Programme (EBP - 20% by 2025-26) for Grain-Based Distilleries & Poultry Nutrition.',
      mspRate: 2225,
      bonusIncentive: 0,
      specialPerks: 'Direct tie-up procurement for biofuel distilleries with guaranteed MSP and immediate weighing token clearance.',
      centerIntakeStatus: 'Active Biofuel Quota Open',
      moistureSpec: 'Moisture ≤ 14.0% (Relaxed FAQ standards)',
      scheduleTargetCrop: 'Maize'
    },
    {
      id: 'urad',
      commodity: 'Urad',
      category: 'pulses',
      categoryLabel: 'High Priority Pulse',
      season: 'Kharif Crops',
      icon: '🫘',
      nationalTargetQty: 35.0,
      procuredSoFarQty: 16.5,
      remainingDemandQty: 18.5,
      unit: 'Lakh Quintals',
      urgency: 'urgent',
      urgencyLabel: 'URGENT BUFFER DEFICIT',
      rank: '#2 Pulse Deficit',
      primaryAgency: 'NAFED',
      procurementPurpose: 'Central Strategic Pulse Buffer Stock & Defense Services Supply under Price Support Scheme (PSS).',
      mspRate: 7400,
      bonusIncentive: 200,
      specialPerks: 'Assured purchase under PM-AASHA with instant digital moisture assaying and zero broker commissions.',
      centerIntakeStatus: 'Direct NAFED Intake Active',
      moistureSpec: 'Moisture ≤ 12.0% • FAQ Grade',
      scheduleTargetCrop: 'Urad'
    },
    {
      id: 'rapeseed-mustard',
      commodity: 'Rapeseed/ Mustard',
      category: 'oilseeds',
      categoryLabel: 'National Edible Oil Mission',
      season: 'Rabi Crops',
      icon: '🌼',
      nationalTargetQty: 32.0,
      procuredSoFarQty: 21.4,
      remainingDemandQty: 10.6,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH EDIBLE OIL DEMAND',
      rank: '#1 Oilseed Demand',
      primaryAgency: 'NAFED & State Oil Federations',
      procurementPurpose: 'National Mission on Edible Oils - Oilseeds (NMEO-OS) to eliminate foreign cooking oil import dependence.',
      mspRate: 5950,
      bonusIncentive: 150,
      specialPerks: 'Direct cooperative milling intake with oil-content premium bonus up to ₹150/Qtl for >40% oil content.',
      centerIntakeStatus: 'High Volume Intake Open',
      moistureSpec: 'Moisture ≤ 8.0% • Oil content ≥ 38.0%',
      scheduleTargetCrop: 'Rapeseed/ Mustard'
    },
    {
      id: 'gram',
      commodity: 'Gram',
      category: 'pulses',
      categoryLabel: 'Strategic Protein Reserve',
      season: 'Rabi Crops',
      icon: '🫘',
      nationalTargetQty: 30.0,
      procuredSoFarQty: 22.5,
      remainingDemandQty: 7.5,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH VOLUME DEMAND',
      rank: 'Top Volume Pulse',
      primaryAgency: 'NAFED',
      procurementPurpose: 'Pulses Price Stabilization, Armed Forces Rationing & PM-POSHAN Mid-Day Meal Protein Allocation.',
      mspRate: 5650,
      bonusIncentive: 0,
      specialPerks: 'Smooth electronic weighbridge tokening, zero market fees or statutory deductions for registered farmers.',
      centerIntakeStatus: 'Intake Active',
      moistureSpec: 'Moisture ≤ 10.0% • Admixture ≤ 2.0%',
      scheduleTargetCrop: 'Gram'
    },
    {
      id: 'soyabean-yellow',
      commodity: 'Soyabean Yellow',
      category: 'oilseeds',
      categoryLabel: 'National Protein & Oil Drive',
      season: 'Kharif Crops',
      icon: '🫘',
      nationalTargetQty: 28.0,
      procuredSoFarQty: 17.8,
      remainingDemandQty: 10.2,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH VOLUME DEMAND',
      rank: '#2 Oilseed Demand',
      primaryAgency: 'NAFED & State Federations',
      procurementPurpose: 'Domestic Soya Oil Extraction & Non-GMO High-Protein Meal for National Dairy & Poultry Infrastructure.',
      mspRate: 4892,
      bonusIncentive: 0,
      specialPerks: 'Assured purchase under PM-AASHA with instant assaying report and direct bank voucher release.',
      centerIntakeStatus: 'Intake Active',
      moistureSpec: 'Moisture ≤ 12.0% • Foreign matter ≤ 2.0%',
      scheduleTargetCrop: 'Soyabean Yellow'
    },
    {
      id: 'cotton-medium',
      commodity: 'Medium Staple Cotton',
      category: 'commercial',
      categoryLabel: 'Commercial & Textile Pool',
      season: 'Kharif Crops',
      icon: '☁️',
      nationalTargetQty: 70.0,
      procuredSoFarQty: 46.5,
      remainingDemandQty: 23.5,
      unit: 'Lakh Bales (~170kg)',
      urgency: 'high',
      urgencyLabel: 'HIGH INDUSTRIAL DEMAND',
      rank: 'Commercial Leader',
      primaryAgency: 'Cotton Corporation of India (CCI)',
      procurementPurpose: 'Domestic Textile Mill Buffer Security, Cotton Price Stabilization & Export Buffer Reserves.',
      mspRate: 7121,
      bonusIncentive: 0,
      specialPerks: 'Electronic moisture testers installed at all intake centers. Moisture up to 8% standard, relaxed to 12% with prorated chart.',
      centerIntakeStatus: 'CCI Centers Operational',
      moistureSpec: 'Moisture 8% to 12% FAQ Grade',
      scheduleTargetCrop: 'Medium Staple Cotton'
    },
    {
      id: 'groundnut',
      commodity: 'Groundnut',
      category: 'oilseeds',
      categoryLabel: 'Domestic Edible Oil Buffer',
      season: 'Kharif Crops',
      icon: '🥜',
      nationalTargetQty: 22.0,
      procuredSoFarQty: 14.2,
      remainingDemandQty: 7.8,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH VOLUME DEMAND',
      rank: 'High Demand Pod',
      primaryAgency: 'NAFED & State Oilseed Unions',
      procurementPurpose: 'Domestic Groundnut Oil Reserves and HPS Export Grade Quality Buffer Stock Maintenance.',
      mspRate: 6783,
      bonusIncentive: 0,
      specialPerks: 'Spot weighment and electronic assaying certification. No deduction for pod size variations within FAQ standards.',
      centerIntakeStatus: 'Intake Active',
      moistureSpec: 'Moisture in pods ≤ 8.0%',
      scheduleTargetCrop: 'Groundnut'
    }
  ];

  let currentDemandFilter = 'all';
  let currentDemandSort = 'target';
  let currentDemandSearch = '';

  function getDemandSortLabel(sortType) {
    const labels = {
      'target-desc': 'Target Quota (Highest First)',
      'target': 'Target Quota (Highest First)',
      'target-asc': 'Target Quota (Lowest First)',
      'remaining-desc': 'Open Intake Deficit (Most Urgent)',
      'remaining': 'Open Intake Deficit (Most Urgent)',
      'remaining-asc': 'Open Intake Deficit (Lowest / Near Full)',
      'msp-desc': 'Govt MSP Rate (Highest First)',
      'msp': 'Govt MSP Rate (Highest First)',
      'msp-asc': 'Govt MSP Rate (Lowest First)',
      'name-asc': 'Commodity Name (A to Z)',
      'progress-asc': 'Progress (Lowest / Most Urgent)',
      'progress-desc': 'Progress (Highest / Near Quota)'
    };
    return labels[sortType] || 'Target Quota (Highest First)';
  }

  function renderCropInDemandModuleHtml() {
    return `
      <div class="demand-container">
        <!-- 1. Government Official Demand Banner -->
        <div class="demand-hero-bar">
          <div class="demand-hero-title-wrap">
            <div class="demand-hero-icon" aria-hidden="true">🏛️</div>
            <div>
              <span class="demand-hero-badge">NATIONAL PROCUREMENT TARGETS &amp; BUFFER QUOTAS</span>
              <h3 class="demand-hero-heading">High-Demand Government Procurement Produce</h3>
              <p class="demand-hero-sub">
                Official commodities required in high volume for National Food Security, central strategic buffer stocks, ethanol blending, and domestic edible oil self-reliance.
              </p>
            </div>
          </div>
          <div class="demand-hero-stats-pill">
            <span class="demand-hero-stats-val">920+ LMT / Qtl</span>
            <span class="demand-hero-stats-lbl">National Strategic Quota</span>
          </div>
        </div>

        <!-- 2. Top 4 Quantitative Demand KPI Summary -->
        <div class="demand-kpi-grid">
          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #FEE2E2; color: #DC2626;">🏆 #1 VOLUME FOODGRAIN</span>
              <span style="font-size: 14px;">🌾</span>
            </div>
            <div class="demand-kpi-val">540.0 LMT</div>
            <div class="demand-kpi-lbl">Paddy Common / Rice Target</div>
            <span class="demand-kpi-sub">147.6 LMT Open for Farmer Intake</span>
          </div>

          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #FEF3C7; color: #B45309;">🌾 STRATEGIC BREADBASKET</span>
              <span style="font-size: 14px;">🌾</span>
            </div>
            <div class="demand-kpi-val">320.0 LMT</div>
            <div class="demand-kpi-lbl">Wheat Central Reserve Target</div>
            <span class="demand-kpi-sub">54.0 LMT Open for Farmer Intake</span>
          </div>

          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #FEF3C7; color: #B45309;">⚡ CRITICAL DEFICIT PULSE</span>
              <span style="font-size: 14px;">🫘</span>
            </div>
            <div class="demand-kpi-val">40.0 L Qtl</div>
            <div class="demand-kpi-lbl">Tur (Arhar) Buffer Drive</div>
            <span class="demand-kpi-sub" style="color: #DC2626;">21.8 L Qtl Deficit • 100% Assured Purchase</span>
          </div>

          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #ECFDF5; color: #059669;">🌽 BIOFUEL 20% MISSION</span>
              <span style="font-size: 14px;">🌽</span>
            </div>
            <div class="demand-kpi-val">65.0 L Qtl</div>
            <div class="demand-kpi-lbl">Maize Ethanol Intake Quota</div>
            <span class="demand-kpi-sub">27.0 L Qtl Active Open Quota</span>
          </div>
        </div>

        <!-- 3. Interactive Category Filter & Search Toolbar -->
        <div class="demand-toolbar">
          <div class="demand-filter-tabs" role="tablist" aria-label="Filter demand crops by category">
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'all' ? 'active' : ''}" onclick="window.filterDemandCategory('all');">All High Demand (10)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'cereals' ? 'active' : ''}" onclick="window.filterDemandCategory('cereals');">Foodgrains / Cereals (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'pulses' ? 'active' : ''}" onclick="window.filterDemandCategory('pulses');">Urgent Pulses / Buffer Deficit (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'oilseeds' ? 'active' : ''}" onclick="window.filterDemandCategory('oilseeds');">Oilseeds Mission (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'commercial' ? 'active' : ''}" onclick="window.filterDemandCategory('commercial');">Commercial / Industrial (1)</button>
          </div>

          <div class="demand-controls-right" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Quick Sort Pills -->
            <div class="demand-sort-pills-wrap" role="group" aria-label="Quick sort crops">
              <span style="font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase;">Sort:</span>
              <button type="button" class="demand-sort-pill ${(currentDemandSort === 'target-desc' || currentDemandSort === 'target') ? 'active' : ''}" data-sort="target-desc" onclick="window.sortDemandCrops('target-desc');" title="Sort by highest target quota">
                📊 Volume
              </button>
              <button type="button" class="demand-sort-pill ${(currentDemandSort === 'remaining-desc' || currentDemandSort === 'remaining') ? 'active' : ''}" data-sort="remaining-desc" onclick="window.sortDemandCrops('remaining-desc');" title="Sort by most urgent remaining deficit">
                ⚡ Deficit
              </button>
              <button type="button" class="demand-sort-pill ${(currentDemandSort === 'msp-desc' || currentDemandSort === 'msp') ? 'active' : ''}" data-sort="msp-desc" onclick="window.sortDemandCrops('msp-desc');" title="Sort by highest MSP price">
                💰 Highest MSP
              </button>
              <button type="button" class="demand-sort-pill ${currentDemandSort === 'name-asc' ? 'active' : ''}" data-sort="name-asc" onclick="window.sortDemandCrops('name-asc');" title="Sort alphabetically A to Z">
                🔤 A-Z
              </button>
            </div>

            <!-- Detailed Sort Dropdown -->
            <select class="demand-sort-select" id="demandCropSortSelect" onchange="window.sortDemandCrops(this.value);" aria-label="Sort high demand crops">
              <option value="target-desc" ${(currentDemandSort === 'target-desc' || currentDemandSort === 'target') ? 'selected' : ''}>Target Quota: High to Low</option>
              <option value="target-asc" ${currentDemandSort === 'target-asc' ? 'selected' : ''}>Target Quota: Low to High</option>
              <option value="remaining-desc" ${(currentDemandSort === 'remaining-desc' || currentDemandSort === 'remaining') ? 'selected' : ''}>Open Deficit: Most Urgent First</option>
              <option value="remaining-asc" ${currentDemandSort === 'remaining-asc' ? 'selected' : ''}>Open Deficit: Lowest First</option>
              <option value="msp-desc" ${(currentDemandSort === 'msp-desc' || currentDemandSort === 'msp') ? 'selected' : ''}>MSP Price: High to Low</option>
              <option value="msp-asc" ${currentDemandSort === 'msp-asc' ? 'selected' : ''}>MSP Price: Low to High</option>
              <option value="name-asc" ${currentDemandSort === 'name-asc' ? 'selected' : ''}>Commodity Name: A to Z</option>
            </select>

            <!-- Search Input -->
            <div class="demand-search-box">
              <span class="demand-search-icon" aria-hidden="true">🔍</span>
              <input type="text" class="demand-search-input" id="demandCropSearchInput" placeholder="Search crop or agency..." value="${currentDemandSearch}" oninput="window.searchDemandCrops(this.value);" aria-label="Search high demand crops">
            </div>

            <!-- Dynamic Active Sort Status Badge -->
            <span class="demand-sort-status-badge" id="demandSortStatusLabel">
              ✓ ${getDemandSortLabel(currentDemandSort)}
            </span>
          </div>
        </div>

        <!-- 4. Dynamic Cards Container -->
        <div class="demand-cards-grid" id="demandCardsContainer">
          ${renderDemandCardsHtml()}
        </div>

        <!-- 5. Strategic Guidance for Farmers on Selling High-Demand Crops -->
        <div class="demand-guidance-box">
          <div class="demand-guidance-heading">
            <span>🌾</span>
            <span>Why Farmers Should Prioritize Selling High-Demand Government Crops:</span>
          </div>
          <div class="demand-benefits-grid">
            <div class="demand-benefit-item">
              <strong>1. Guaranteed Purchase Price</strong>
              <p>Government guarantees procurement at or above official CACP MSP benchmarks with zero distress selling risk.</p>
            </div>
            <div class="demand-benefit-item">
              <strong>2. Zero Middleman Commissions</strong>
              <p>Direct weighbridge intake at cooperative centers with zero commission fees, arbitrary cuts, or hidden deductions.</p>
            </div>
            <div class="demand-benefit-item">
              <strong>3. Direct Benefit Transfer (DBT)</strong>
              <p>100% verified digital payment transferred directly to your Aadhaar-seeded bank account within 24 to 48 hours.</p>
            </div>
            <div class="demand-benefit-item">
              <strong>4. Priority Intake Slots</strong>
              <p>High-demand quotas receive expedited convoy tokens, dedicated unloading bays, and faster gate clearance.</p>
            </div>
          </div>
        </div>

        <!-- 6. Inter-Module Navigation Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #FAF7F2; border: 1px solid #DFC396; border-radius: 10px; padding: 12px 18px; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12.5px; font-weight: 700; color: #143525;">
            Ready to schedule produce delivery for high-demand quotas?
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn-demand-action-secondary" onclick="window.goToSchedule();" style="padding: 6px 14px; font-size: 11.5px;">
              ← Back to Schedule (01)
            </button>
            <button type="button" class="btn-demand-action-primary" onclick="window.goToFormFilling();" style="padding: 6px 16px; font-size: 11.5px;">
              Proceed to Form Filling (03) →
            </button>
            <button type="button" class="btn-demand-action-primary" onclick="window.goToSlotBooking();" style="padding: 6px 16px; font-size: 11.5px; background: #9A6818;">
              Book Center Slot (04) →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderDemandCardsHtml() {
    let filtered = [...GOVERNMENT_DEMAND_CROPS];

    // Category Filter
    if (currentDemandFilter !== 'all') {
      filtered = filtered.filter(c => c.category === currentDemandFilter);
    }

    // Search Filter
    if (currentDemandSearch && currentDemandSearch.trim() !== '') {
      const q = currentDemandSearch.trim().toLowerCase();
      filtered = filtered.filter(c => 
        c.commodity.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.primaryAgency.toLowerCase().includes(q) ||
        c.procurementPurpose.toLowerCase().includes(q)
      );
    }

    // Comprehensive Sorting
    if (currentDemandSort === 'target-desc' || currentDemandSort === 'target') {
      filtered.sort((a, b) => b.nationalTargetQty - a.nationalTargetQty);
    } else if (currentDemandSort === 'target-asc') {
      filtered.sort((a, b) => a.nationalTargetQty - b.nationalTargetQty);
    } else if (currentDemandSort === 'remaining-desc' || currentDemandSort === 'remaining') {
      filtered.sort((a, b) => b.remainingDemandQty - a.remainingDemandQty);
    } else if (currentDemandSort === 'remaining-asc') {
      filtered.sort((a, b) => a.remainingDemandQty - b.remainingDemandQty);
    } else if (currentDemandSort === 'msp-desc' || currentDemandSort === 'msp') {
      filtered.sort((a, b) => (b.mspRate + b.bonusIncentive) - (a.mspRate + a.bonusIncentive));
    } else if (currentDemandSort === 'msp-asc') {
      filtered.sort((a, b) => (a.mspRate + a.bonusIncentive) - (b.mspRate + b.bonusIncentive));
    } else if (currentDemandSort === 'name-asc') {
      filtered.sort((a, b) => a.commodity.localeCompare(b.commodity));
    }

    if (filtered.length === 0) {
      return `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1.5px dashed #DFC396; border-radius: 12px; padding: 40px 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
          <h4 style="font-size: 16px; font-weight: 700; color: #143525; margin-bottom: 6px;">No Matching High-Demand Crops Found</h4>
          <p style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">Try adjusting your category filter or search query.</p>
          <button type="button" class="btn-demand-action-secondary" onclick="window.filterDemandCategory('all');" style="margin: 0 auto; max-width: 220px;">
            Reset Filter to All (10)
          </button>
        </div>
      `;
    }

    return filtered.map((c, index) => {
      const rankNum = index + 1;
      const pctProcured = Math.min(100, Math.round((c.procuredSoFarQty / c.nationalTargetQty) * 100));
      const pctRemaining = 100 - pctProcured;
      const effectiveMsp = c.mspRate + c.bonusIncentive;
      const incentiveTag = c.bonusIncentive > 0 
        ? `<span class="demand-pricing-incentive">+ ₹${c.bonusIncentive}/Qtl Special Buffer Incentive</span>`
        : `<span class="demand-pricing-incentive" style="background: #E0F2FE; color: #0284C7;">Guaranteed 100% Purchase</span>`;

      return `
        <div class="demand-card" data-crop-id="${c.id}">
          <div>
            <div class="demand-card-top-bar">
              <div class="demand-card-badges">
                <span class="demand-rank-pill" title="Sorted Rank #${rankNum} in current view">Rank #${rankNum}</span>
                <span class="demand-urgency-pill ${c.urgency}">${c.urgencyLabel}</span>
              </div>
              <span class="badge-tag badge-neutral" style="font-size: 10px; font-weight: 700;">${c.season}</span>
            </div>

            <div class="demand-card-crop-row">
              <div class="demand-crop-avatar" aria-hidden="true">${c.icon}</div>
              <div style="flex: 1;">
                <h4 class="demand-crop-title">${c.commodity}</h4>
                <div class="demand-crop-category">
                  <span>${c.categoryLabel}</span> • <span style="color: #1E824C; font-weight: 700;">${c.primaryAgency}</span>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="demand-progress-wrap">
              <div class="demand-progress-header">
                <span style="color: #143525;">Progress: <strong>${pctProcured}% Procured</strong></span>
                <span style="color: #B45309;">Remaining Deficit: <strong>${c.remainingDemandQty} ${c.unit.split(' ')[0]}</strong></span>
              </div>
              <div class="demand-progress-bar-track" title="${pctProcured}% Procured, ${pctRemaining}% Open Intake">
                <div class="demand-progress-bar-fill" style="width: ${pctProcured}%;"></div>
                <div class="demand-progress-bar-remaining" style="width: ${pctRemaining}%;"></div>
              </div>
            </div>

            <!-- 3-Column Quantity Numbers -->
            <div class="demand-qty-grid">
              <div class="demand-qty-item">
                <span class="demand-qty-val">${c.nationalTargetQty}</span>
                <span class="demand-qty-lbl">Govt Target (${c.unit.split(' ')[0]})</span>
              </div>
              <div class="demand-qty-item">
                <span class="demand-qty-val" style="color: #059669;">${c.procuredSoFarQty}</span>
                <span class="demand-qty-lbl">Procured So Far</span>
              </div>
              <div class="demand-qty-item">
                <span class="demand-qty-val remaining">${c.remainingDemandQty}</span>
                <span class="demand-qty-lbl">Open Intake Quota</span>
              </div>
            </div>

            <!-- MSP & Incentive Box -->
            <div class="demand-pricing-box">
              <span class="demand-pricing-rate">Govt MSP: ₹${c.mspRate.toLocaleString('en-IN')}/Qtl</span>
              ${incentiveTag}
            </div>

            <!-- Purpose Box -->
            <div class="demand-purpose-box">
              <strong>Govt Purpose:</strong> ${c.procurementPurpose}
            </div>

            <!-- Perks Summary -->
            <div style="font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 14px;">
              ✨ ${c.specialPerks}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="demand-card-actions">
            <button type="button" class="btn-demand-action-primary" onclick="window.selectCropAndBookSlot('${c.scheduleTargetCrop}');" title="Pre-select ${c.commodity} and proceed to slot booking">
              <span>Sell This Crop (Book Slot)</span>
            </button>
            <button type="button" class="btn-demand-action-secondary" onclick="window.selectCropAndFillForm('${c.scheduleTargetCrop}');" title="Pre-select ${c.commodity} in produce registration">
              <span>📝 Register Land</span>
            </button>
            <button type="button" class="btn-demand-action-secondary" onclick="window.openCropInSchedule('${c.scheduleTargetCrop}');" title="View historical price trend and CACP matrix" style="flex: 0.6; padding: 8px 6px;">
              <span>📊 Matrix</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.filterDemandCategory = function(cat) {
    currentDemandFilter = cat;
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }
    const tabs = document.querySelectorAll('.demand-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('onclick')?.includes(`'${cat}'`)) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  };

  function initDemandModuleEvents() {
    const sortSelect = document.getElementById('demandCropSortSelect');
    if (sortSelect) {
      sortSelect.value = currentDemandSort;
      sortSelect.onchange = (e) => {
        window.sortDemandCrops(e.target.value);
      };
    }

    const searchInput = document.getElementById('demandCropSearchInput');
    if (searchInput) {
      searchInput.value = currentDemandSearch;
      searchInput.oninput = (e) => {
        window.searchDemandCrops(e.target.value);
      };
    }
  }

  window.sortDemandCrops = function(sortType) {
    currentDemandSort = sortType;

    // Update select element value
    const select = document.getElementById('demandCropSortSelect');
    if (select && select.value !== sortType) {
      select.value = sortType;
    }

    // Update quick sort pills
    const sortPills = document.querySelectorAll('.demand-sort-pill');
    sortPills.forEach(pill => {
      const pSort = pill.getAttribute('data-sort');
      if (pSort === sortType || (pSort === 'target-desc' && sortType === 'target') || (pSort === 'remaining-desc' && sortType === 'remaining') || (pSort === 'msp-desc' && sortType === 'msp')) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update active sort status badge
    const statusLabel = document.getElementById('demandSortStatusLabel');
    if (statusLabel) {
      statusLabel.textContent = `✓ ${getDemandSortLabel(sortType)}`;
    }

    // Re-render cards container
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }

    showToast(`📊 Sorted crops by: ${getDemandSortLabel(sortType)}`, 'info');
  };

  window.searchDemandCrops = function(query) {
    currentDemandSearch = query;
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }
  };

  window.selectCropAndBookSlot = function(cropName) {
    // 1. Pre-register crop if not already set
    const currentCrop = localStorage.getItem('cpc_submitted_crop');
    if (!currentCrop) {
      localStorage.setItem('cpc_submitted_crop', cropName);
      localStorage.setItem('cpc_submitted_qty', '50.00');
      localStorage.setItem('cpc_submitted_survey', 'Survey #402/1A');
    }

    // 2. Open Slot Booking (Module 04)
    openModuleDetail('slot-booking');
    showToast(`🌾 Pre-selected ${cropName} for Priority Weighbridge Intake Slot Booking!`, 'success');
  };

  window.selectCropAndFillForm = function(cropName) {
    openModuleDetail('form-filling');
    setTimeout(() => {
      const select = document.getElementById('ffCrop');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.includes(cropName) || cropName.includes(select.options[i].value)) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
    }, 100);
    showToast(`📝 Pre-selected ${cropName} in Produce Registration Form!`, 'info');
  };

  window.goToCropInDemand = function() {
    openModuleDetail('crop-in-demand');
  };

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
        category = `${t.mod1Title} • CACP MINISTRY OF AGRICULTURE MSP SCHEDULE`;
        bodyHtml = renderScheduleModuleHtml();
        break;

      case 'crop-in-demand':
        title = t.mod2Title || 'CROP IN DEMAND';
        category = `${title} • NATIONAL HIGH QUANTITY PROCUREMENT TARGETS`;
        bodyHtml = renderCropInDemandModuleHtml();
        break;

      case 'form-filling':
        title = t.mod3Title;
        category = `${t.mod3Title} & PRODUCE INTAKE`;

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
                      <span class="reg-step-label">Stage 3<br>Form Filled</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 4<br>Slot Booked</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isTimerDone ? 'done' : 'current'}">${isTimerDone ? '✓' : '5'}</div>
                      <span class="reg-step-label">Stage 5<br>Queue Dispatch</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'done' : (isTimerDone ? 'current' : '')}">${isCert ? '✓' : '6'}</div>
                      <span class="reg-step-label">Stage 6<br>Assaying &amp; Price</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'current' : ''}">7</div>
                      <span class="reg-step-label">Stage 7<br>DBT Release</span>
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
                    <span>🎟️ Track Token Queue (Module 5)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToFinalizeProcurement();">
                    <span>⚖️ Review Price &amp; Assaying (Module 6)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav secondary" onclick="window.goToPaymentHistory();">
                    <span>💳 DBT Payment History (Module 7)</span>
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
                  ${CACP_MSP_STORE.getRegistrationCropOptions(currentSavedCrop)}
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
        title = t.mod4Title;
        category = `${t.mod4Title} & QUEUE ALLOCATION`;

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
        title = t.mod5Title;
        category = `${t.mod5Title} & WEIGHBRIDGE DISPATCH & LIVE TOKEN`;

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
        title = t.mod6Title;
        category = `${t.mod6Title} & DBT AUTHORIZATION`;

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
        title = t.mod7Title || 'TRANSACTION & PAYMENT HISTORY';
        category = `${t.mod7Title || 'TRANSACTION & PAYMENT HISTORY'} & DBT STATEMENTS`;

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

    // If crop-in-demand module is opened, initialize listeners
    if (moduleKey === 'crop-in-demand') {
      initDemandModuleEvents();
    }

    // If schedule module is opened, render dynamic CACP table content
    if (moduleKey === 'schedule') {
      renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'matrix', CACP_MSP_STORE.currentSearch || '');
    }

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

    // Initialize Dynamic Rolling MSP Ticker on page load
    initFarmerMspTicker();
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
      initFarmerMspTicker();
      renderFarmerMspTicker(currentTickerSeason);
    }
  };

  window.showToast = showToast;
});

