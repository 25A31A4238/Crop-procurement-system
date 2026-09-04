import re

def test_skin_switching():
    print("=== VERIFYING QUICK SWITCH DOCK VISIBILITY & SKIN LOGIC ===")
    
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Check HTML elements
    assert 'id="quickPortalDock"' in html, "Missing #quickPortalDock"
    assert 'id="quickSwitchFarmerBtn"' in html, "Missing #quickSwitchFarmerBtn"
    assert 'id="quickSwitchOfficerBtn"' in html, "Missing #quickSwitchOfficerBtn"
    # Verify quickPortalDock has class 'hidden' by default so it's not visible on login interface
    assert 'class="quick-portal-dock hidden"' in html or 'quick-portal-dock hidden' in html, "quickPortalDock must have class hidden by default on login interface"
    print("[PASS] Found #quickPortalDock (hidden by default), #quickSwitchFarmerBtn, #quickSwitchOfficerBtn in index.html")

    # 2. Check CSS rules
    assert '.quick-portal-dock' in css, "Missing .quick-portal-dock in styles.css"
    assert '.quick-dock-btn' in css, "Missing .quick-dock-btn in styles.css"
    assert '.quick-dock-btn.active' in css, "Missing .quick-dock-btn.active in styles.css"
    assert '#DFC396' in css, "Missing #DFC396 in styles.css"
    assert '.quick-dock-indicator' in css, "Missing .quick-dock-indicator in styles.css"
    print("[PASS] styles.css defines complete .quick-portal-dock and .quick-dock-btn.active rules")

    # 3. Check JS implementation
    assert 'function setQuickDockVisible(visible)' in js, "Missing setQuickDockVisible in app.js"
    assert 'setQuickDockVisible(true)' in js, "Missing setQuickDockVisible(true) in app.js"
    assert 'setQuickDockVisible(false)' in js, "Missing setQuickDockVisible(false) in app.js"
    assert 'function updateQuickSwitchSkin(activePortal)' in js, "Missing updateQuickSwitchSkin in app.js"
    assert "window.updateQuickSwitchSkin = updateQuickSwitchSkin" in js, "Missing window.updateQuickSwitchSkin"
    assert "updateQuickSwitchSkin('officer')" in js, "Missing updateQuickSwitchSkin('officer')"
    assert "updateQuickSwitchSkin('farmer')" in js, "Missing updateQuickSwitchSkin('farmer')"
    assert "switchToOfficerPortal" in js, "Missing switchToOfficerPortal"
    assert "switchToFarmerPortal" in js, "Missing switchToFarmerPortal"
    print("[PASS] app.js implements dynamic dock visibility & skin switching logic")

    # 4. Check forbidden term
    assert not re.search(r'\bmandi\b', html, re.IGNORECASE), "Forbidden term in index.html"
    assert not re.search(r'\bmandi\b', js, re.IGNORECASE), "Forbidden term in app.js"
    assert not re.search(r'\bmandi\b', css, re.IGNORECASE), "Forbidden term in styles.css"
    print("[PASS] Zero occurrences of forbidden word 'mandi'")

    print("\nALL QUICK SWITCH TESTS PASSED PERFECTLY!")

if __name__ == '__main__':
    test_skin_switching()
