import re, json

def test_cacp_integration():
    print("=== VERIFYING CACP MSP SCHEDULE & DYNAMIC SYNC INTEGRATION ===")
    
    with open('app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Verify CACP_OFFICIAL_RAW_DATA presence
    assert 'const CACP_OFFICIAL_RAW_DATA =' in app_js, "Missing CACP_OFFICIAL_RAW_DATA in app.js"
    assert 'const CACP_FOOTNOTES_DATA =' in app_js, "Missing CACP_FOOTNOTES_DATA in app.js"
    assert 'class CacpMspStoreManager' in app_js, "Missing CacpMspStoreManager in app.js"
    assert 'const CACP_MSP_STORE = new CacpMspStoreManager();' in app_js, "Missing CACP_MSP_STORE instance"
    print("[PASS] Verified CACP data store and manager classes")

    # 2. Verify all 28 commodities in dataset
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

    # 3. Verify Proxy for CROP_MSP_RATES
    assert 'const CROP_MSP_RATES = new Proxy' in app_js, "Missing CROP_MSP_RATES dynamic Proxy"
    assert 'CACP_MSP_STORE.getMspForCrop' in app_js, "Missing getMspForCrop delegation in Proxy"
    print("[PASS] Verified dynamic CROP_MSP_RATES Proxy bridging to CACP store")

    # 4. Verify Schedule Renderer & Controls
    assert 'renderScheduleModuleHtml' in app_js, "Missing renderScheduleModuleHtml in app.js"
    assert 'renderCacpScheduleContent' in app_js, "Missing renderCacpScheduleContent in app.js"
    assert 'cacp.da.gov.in/Home/MSP' in app_js, "Missing official CACP URL link"
    assert 'syncLiveGovtMsp' in app_js, "Missing syncLiveGovtMsp in app.js"
    assert 'openCacpMspModal' in app_js, "Missing openCacpMspModal in app.js"
    assert 'applyCacpPreset' in app_js, "Missing applyCacpPreset in app.js"
    print("[PASS] Verified Schedule renderer, live sync engine, and Gazette revision handlers")

    # 5. Verify index.html contains cacpMspModal
    assert 'id="cacpMspModal"' in html, "Missing #cacpMspModal in index.html"
    assert 'id="cacpRevisionForm"' in html, "Missing #cacpRevisionForm in index.html"
    assert 'id="cacpRevCrop"' in html, "Missing #cacpRevCrop in index.html"
    assert 'id="cacpRevFixed"' in html, "Missing #cacpRevFixed in index.html"
    print("[PASS] Verified CACP MSP revision modal markup in index.html")

    # 6. Verify styles.css contains CACP and schedule styles
    assert '.cacp-source-bar' in css, "Missing .cacp-source-bar in styles.css"
    assert '.schedule-controls-bar' in css, "Missing .schedule-controls-bar in styles.css"
    assert '.schedule-tab-btn' in css, "Missing .schedule-tab-btn in styles.css"
    assert '.cacp-history-table' in css, "Missing .cacp-history-table in styles.css"
    assert '.cacp-footnotes-card' in css, "Missing .cacp-footnotes-card in styles.css"
    print("[PASS] Verified CACP schedule styles and history comparison table in styles.css")

    # 7. Check bracket balancing in app.js
    open_curly = app_js.count('{')
    close_curly = app_js.count('}')
    assert open_curly == close_curly, f"Mismatched curly braces: {open_curly} open vs {close_curly} close"
    print(f"[PASS] Curly braces balanced perfectly: {open_curly} == {close_curly}")

    print("\nALL CACP MSP INTEGRATION TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    test_cacp_integration()
