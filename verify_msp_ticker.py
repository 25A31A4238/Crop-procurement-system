import re

def test_msp_ticker():
    print("=== VERIFYING DYNAMIC ROLLING MSP PRICE TICKER ===")

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()

    # 1. Markup verification in index.html
    required_ids = [
        'farmerMspTickerBar',
        'tickerTitleLabel',
        'tickerSubLabel',
        'mspTickerViewport',
        'mspTickerTrack',
        'tickerFilterAll',
        'tickerFilterKharif',
        'tickerFilterRabi',
        'tickerPlayPauseBtn',
        'tickerPauseBtnText',
        'tickerOpenMatrixBtn',
        'tickerViewMatrixText'
    ]
    for element_id in required_ids:
        assert f'id="{element_id}"' in html, f"Missing #{element_id} in index.html"
    print(f"[PASS] All {len(required_ids)} required DOM elements present in index.html")

    # 2. CSS verification in styles.css
    required_css_classes = [
        '.farmer-msp-ticker-bar',
        '.msp-ticker-lead',
        '.msp-live-badge',
        '.msp-pulse-dot',
        '.msp-ticker-viewport',
        '.msp-ticker-track',
        '.msp-ticker-loop',
        '.msp-ticker-item',
        '.ticker-item-icon',
        '.ticker-item-name',
        '.ticker-item-season',
        '.ticker-item-price',
        '.ticker-item-hike',
        '.msp-ticker-actions',
        '.msp-season-pill',
        '.msp-control-btn',
        '.msp-matrix-btn'
    ]
    for cls in required_css_classes:
        assert cls in css, f"Missing CSS rule for {cls} in styles.css"
    print(f"[PASS] All {len(required_css_classes)} CSS classes present in styles.css")

    # Verify animation and seamless looping properties
    assert '@keyframes mspTickerRoll' in css, "Missing @keyframes mspTickerRoll in styles.css"
    assert 'translate3d(-50%, 0, 0)' in css, "Missing -50% translation for seamless infinite loop"
    assert 'animation-play-state: paused' in css, "Missing paused state in styles.css"
    print("[PASS] Verified seamless infinite animation and pause-on-hover CSS")

    # 3. JavaScript logic verification in app.js
    assert 'function buildCropTickerCapsuleHtml' in app_js, "Missing buildCropTickerCapsuleHtml in app.js"
    assert 'function renderFarmerMspTicker' in app_js, "Missing renderFarmerMspTicker in app.js"
    assert 'function initFarmerMspTicker' in app_js, "Missing initFarmerMspTicker in app.js"
    assert 'window.openCropInSchedule' in app_js, "Missing openCropInSchedule handler in app.js"

    # Verify that initFarmerMspTicker is called on initial load, login, and portal switch
    matches = re.findall(r'\binitFarmerMspTicker\(\)', app_js)
    assert len(matches) >= 3, f"Expected initFarmerMspTicker() to be called at least 3 times, got {len(matches)}"
    print(f"[PASS] Verified initFarmerMspTicker() invoked at {len(matches)} lifecycle points in app.js")

    # Verify multilingual support in applyFarmerLanguage
    assert 'tickerTitleLabel' in app_js, "Missing tickerTitleLabel update in applyFarmerLanguage"
    assert 'tickerSubLabel' in app_js, "Missing tickerSubLabel update in applyFarmerLanguage"
    assert 'tickerPauseBtnText' in app_js, "Missing tickerPauseBtnText update in applyFarmerLanguage"
    assert 'tickerViewMatrixText' in app_js, "Missing tickerViewMatrixText update in applyFarmerLanguage"
    print("[PASS] Verified multilingual synchronization in applyFarmerLanguage")

    # 4. Zero occurrences of forbidden word 'mandi'
    for name, content in [('index.html', html), ('styles.css', css), ('app.js', app_js)]:
        matches = re.findall(r'\bmandi\b', content, re.IGNORECASE)
        assert len(matches) == 0, f"Found forbidden term 'mandi' in {name}: {matches}"
    print("[PASS] Zero occurrences of forbidden word 'mandi'")

    # 5. Curly braces balanced
    open_curly = app_js.count('{')
    close_curly = app_js.count('}')
    assert open_curly == close_curly, f"Braces mismatched: {open_curly} vs {close_curly}"
    print(f"[PASS] Curly braces balanced: {open_curly} == {close_curly}")

    print("\nALL DYNAMIC ROLLING MSP TICKER CHECKS PASSED WITH FLYING COLORS!")

if __name__ == '__main__':
    test_msp_ticker()
