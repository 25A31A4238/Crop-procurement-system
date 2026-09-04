import re

def test_lock_and_decline():
    print("=== VERIFYING FORM LOCK & PRICE DECLINE OPTION ===")

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Check syntax & balance in app.js
    open_b = js.count('{')
    close_b = js.count('}')
    assert open_b == close_b, f"Brace mismatch: {open_b} open vs {close_b} close"
    print(f"[PASS] Exact brace balance in app.js: {open_b} braces")

    # 2. Check hasActiveInProgressProcurement
    assert 'hasActiveInProgressProcurement' in js, "Missing hasActiveInProgressProcurement in app.js"
    assert 'PRODUCE REGISTRATION FORM LOCKED' in js, "Missing locked screen in app.js"
    assert 'ONE CONSIGNMENT POLICY ACTIVE' in js, "Missing policy tag in app.js"
    print("[PASS] Verified hasActiveInProgressProcurement and locked screen template")

    # 3. Check guard in submitFarmerFormFilling
    assert 'if (hasActiveInProgressProcurement())' in js, "Missing guard in submitFarmerFormFilling"
    print("[PASS] Verified submit guard in submitFarmerFormFilling")

    # 4. Check slot booking lock
    assert 'SLOT ALREADY CONFIRMED & TOKEN ACTIVE' in js or 'SLOT ALREADY CONFIRMED &amp; TOKEN ACTIVE' in js, "Missing slot already booked check"
    print("[PASS] Verified slot already confirmed check")

    # 5. Check price decline in finalize-procurement
    assert 'btnDeclinePrice' in js, "Missing btnDeclinePrice in app.js"
    assert 'initiateDeclinePriceFlow' in js, "Missing initiateDeclinePriceFlow in app.js"
    assert 'executeDeclinePriceOffer' in js, "Missing executeDeclinePriceOffer in app.js"
    assert 'renderExitGatePassHtml' in js, "Missing renderExitGatePassHtml in app.js"
    print("[PASS] Verified price decline initiation, execution, and exit gate pass renderer")

    # 6. Check styles in styles.css
    assert '.reg-locked-container' in css, "Missing .reg-locked-container in styles.css"
    assert '.btn-decline-price-offer' in css, "Missing .btn-decline-price-offer in styles.css"
    assert '.exit-gatepass-card' in css, "Missing .exit-gatepass-card in styles.css"
    assert '.gatepass-stamp' in css, "Missing .gatepass-stamp in styles.css"
    print("[PASS] Verified all lock and decline styles in styles.css")

    # 7. Check zero occurrences of forbidden term
    assert not re.search(r'\bmandi\b', html, re.IGNORECASE), "Forbidden term in index.html"
    assert not re.search(r'\bmandi\b', js, re.IGNORECASE), "Forbidden term in app.js"
    assert not re.search(r'\bmandi\b', css, re.IGNORECASE), "Forbidden term in styles.css"
    print("[PASS] Zero occurrences of forbidden word 'mandi'")

    print("\nALL LOCK & PRICE DECLINE TESTS PASSED PERFECTLY!")

if __name__ == '__main__':
    test_lock_and_decline()
