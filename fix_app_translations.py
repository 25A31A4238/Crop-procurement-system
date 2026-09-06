import re

with open('app.js', 'rb') as f:
    raw_data = f.read()

# We can replace the damaged bytes
# Let's locate the region from b'mod6Title: "\xe0\xa4\xb2\xe0\xa5\x87\xe0\xa4\xa8\xe0\xa4\xa6\xe0\xa5\x87\xe0\xa4\xa8'
# to the start of '  function applyFarmerLanguage(lang, notify = true) {'

text = raw_data.decode('utf-8', errors='replace')

pattern_start = '      mod6Title: "लेनदेन और भुगतान इतिहास",'
pattern_end = '  function applyFarmerLanguage(lang, notify = true) {'

idx_start = text.find(pattern_start)
idx_end = text.rfind(pattern_end)

print('Found start at:', idx_start)
print('Found end at:', idx_end)

clean_replacement = """      mod6Title: "लेनदेन और भुगतान इतिहास",
      mod6Desc: "प्रत्यक्ष लाभ अंतरण (डीबीटी) बैंक लॉग, सरकारी भुगतान वाउचर रसीदें और लेनदेन संदर्भ नंबर देखें।",
      mod6Action: "विवरण देखें",
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
      mod6Desc: "ബാങ്ക് ഡിബിടി വിവരങ്ങൾ, സർക്കാർ പേയ്‌മെന്റ് രസീതുകൾ, യുടിആർ നമ്പറുകൾ എന്നിവ പരിശോധിക്കുക.",
      mod6Action: "സ്റ്റേറ്റ്‌മെന്റുകൾ കാണുക",
      switchSuccess: "ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി",
      tickerTitle: "തത്സമയ MSP 2026-27",
      tickerSub: "സർക്കാർ താങ്ങുവില",
      tickerPause: "താൽക്കാലികം",
      tickerResume: "പ്ലേ ചെയ്യുക",
      tickerMatrixBtn: "പൂർണ്ണ പട്ടിക"
    }
  };

  """

updated_text = text[:idx_start] + clean_replacement + text[idx_end:]

# Verify UTF-8 encodability and brace balance
updated_bytes = updated_text.encode('utf-8')
print("Encoded bytes length:", len(updated_bytes))
print("Curly braces: { =", updated_text.count('{'), "} =", updated_text.count('}'))

# Backup and save
with open('scratch/app_backup.js', 'wb') as f_bak:
    f_bak.write(raw_data)

with open('app.js', 'wb') as f_out:
    f_out.write(updated_bytes)

print("SUCCESS: app.js translations cleanly restored!")
