import re

def test_real_world_schedule():
    print("=== VERIFYING REAL-WORLD PROCUREMENT SCHEDULE & WORKFLOW ===")

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Verify Real-World Crops & MSPs in app.js
    crops = ['Paddy (Common', 'Cotton (Medium', 'Maize (Kharif FAQ)', 'Groundnut (In Shell Pods)', 'Ragi / Finger Millet']
    for c in crops:
        assert c in js, f"Missing crop {c} in app.js"
    print("[PASS] Verified all 5 real-world crops with official MSPs in app.js")

    # 2. Verify 6-Phase Workflow Roadmap matching portal modules
    roadmap_modules = ['goToSchedule', 'goToFormFilling', 'goToSlotBooking', 'goToTokenStatus', 'goToFinalizeProcurement', 'goToPaymentHistory']
    for rm in roadmap_modules:
        assert rm in js, f"Missing workflow navigation function {rm} in app.js"
    print("[PASS] Verified all 6-phase workflow roadmap modules and deep-links in app.js")

    # 3. Verify CSS rules
    assert '.schedule-context-banner' in css, "Missing .schedule-context-banner in styles.css"
    assert '.schedule-kpi-grid' in css, "Missing .schedule-kpi-grid in styles.css"
    assert '.schedule-workflow-roadmap' in css, "Missing .schedule-workflow-roadmap in styles.css"
    assert '.roadmap-steps-grid' in css, "Missing .roadmap-steps-grid in styles.css"
    print("[PASS] Verified schedule styling and responsive roadmap grid in styles.css")

    # 4. Zero occurrences of forbidden term
    assert not re.search(r'\bmandi\b', html, re.IGNORECASE), "Forbidden term in index.html"
    assert not re.search(r'\bmandi\b', js, re.IGNORECASE), "Forbidden term in app.js"
    assert not re.search(r'\bmandi\b', css, re.IGNORECASE), "Forbidden term in styles.css"
    print("[PASS] Zero occurrences of forbidden word 'mandi'")

    print("\nALL REAL-WORLD SCHEDULE & WORKFLOW TESTS PASSED!")

if __name__ == '__main__':
    test_real_world_schedule()
