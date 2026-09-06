import re, json

def validate_system():
    print("==================================================")
    print("RUNNING COMPREHENSIVE SYSTEM VERIFICATION")
    print("==================================================")

    # 1. Read files
    with open('app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 2. Check braces in app.js
    open_curly = app_js.count('{')
    close_curly = app_js.count('}')
    assert open_curly == close_curly, f"Brace mismatch: {open_curly} vs {close_curly}"
    print(f"[PASS] Curly braces balanced: {open_curly} == {close_curly}")

    # 3. Check for zero occurrences of forbidden term 'mandi'
    for name, content in [('index.html', html), ('styles.css', css), ('app.js', app_js)]:
        matches = re.findall(r'\bmandi\b', content, re.IGNORECASE)
        assert len(matches) == 0, f"Found forbidden term 'mandi' in {name}: {matches}"
    print("[PASS] Zero occurrences of forbidden word 'mandi' across all files")

    # 4. Check translations
    langs = ['en', 'te', 'hi', 'ta', 'ml']
    for l in langs:
        assert f'{l}: {{' in app_js, f"Missing translation block {l}"
    print("[PASS] All 5 regional language packs present (en, te, hi, ta, ml)")

    # 5. Check all CACP raw data commodities
    crops = [
        'Paddy Common', 'Paddy(F)/Grade A', 'Jowar-Hybrid', 'Jowar-Maldandi', 'Bajra', 'Maize',
        'Ragi', 'Tur (Arhar)', 'Moong', 'Urad', 'Groundnut', 'Sunflower Seed', 'Soyabean Yellow',
        'Sesamum', 'Nigerseed', 'Medium Staple Cotton', 'Long Staple Cotton', 'Wheat', 'Barley',
        'Gram', 'Lentil (Masur)', 'Rapeseed/ Mustard', 'Safflower', 'Jute', 'Sugarcane',
        'Copra (Milling)', 'Copra (Ball)'
    ]
    for crop in crops:
        assert f'"{crop}"' in app_js or f"'{crop}'" in app_js, f"Missing commodity {crop} in CACP dataset"
    print(f"[PASS] Verified all {len(crops)} official CACP commodities in app.js")

    # 6. Check real-world crops and trade names
    rw_crops = ['Paddy (Common', 'Cotton (Medium', 'Maize (Kharif FAQ)', 'Groundnut (In Shell Pods)', 'Ragi / Finger Millet']
    for c in rw_crops:
        assert c in app_js, f"Missing trade specification crop: {c}"
    print("[PASS] Verified all 5 real-world trade specification crop labels")

    # 7. Check critical UI elements in index.html
    req_ids = [
        'quickPortalDock', 'quickSwitchFarmerBtn', 'quickSwitchOfficerBtn',
        'cacpMspModal', 'cacpRevisionForm', 'cacpRevCrop', 'cacpRevFixed',
        'farmerLangSelect'
    ]
    for rid in req_ids:
        assert f'id="{rid}"' in html, f"Missing required element #{rid} in index.html"
    print(f"[PASS] Verified all required interactive elements in index.html: {req_ids}")

    print("\nALL SYSTEM HEALTH AND INTEGRATION CHECKS PASSED WITH FLYING COLORS!")

if __name__ == '__main__':
    validate_system()
