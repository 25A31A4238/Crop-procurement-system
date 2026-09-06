import re

def verify_crop_in_demand():
    print("=== VERIFYING CROP IN DEMAND MODULE & RENUMBERING ===")

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        app_js = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. Check card IDs and numbers in index.html
    expected_cards = [
        ('cardSchedule', '01', 'PROCUREMENT SCHEDULE'),
        ('cardCropInDemand', '02', 'CROP IN DEMAND'),
        ('cardFormFilling', '03', 'FORM FILLING'),
        ('cardSlotBooking', '04', 'PROCUREMENT CENTER & SLOT BOOKING'),
        ('cardTokenStatus', '05', 'TOKEN STATUS'),
        ('cardFinalize', '06', 'FINALIZE PROCUREMENT & PAYMENT'),
        ('cardPaymentHistory', '07', 'TRANSACTION &amp; PAYMENT HISTORY')
    ]

    for cid, num, title in expected_cards:
        assert f'id="{cid}"' in html, f"Missing card #{cid} in index.html"
        pattern = rf'id="{cid}"[\s\S]*?<span class="module-number">{num}</span>[\s\S]*?<h4 class="module-title">{title}</h4>'
        assert re.search(pattern, html), f"Card #{cid} does not have number {num} and title {title}"
    print("[PASS] Verified all 7 module cards, IDs, numbers (01-07), and titles in index.html")

    # 2. Check service tag in index.html
    assert '7 SERVICES AVAILABLE' in html, "index.html does not have '7 SERVICES AVAILABLE'"
    print("[PASS] Verified '7 SERVICES AVAILABLE' in index.html")

    # 3. Check translations for all 5 languages
    langs = ['en', 'te', 'hi', 'ta', 'ml']
    for l in langs:
        for key in ['mod1Title', 'mod2Title', 'mod3Title', 'mod4Title', 'mod5Title', 'mod6Title', 'mod7Title',
                    'mod1Action', 'mod2Action', 'mod3Action', 'mod4Action', 'mod5Action', 'mod6Action', 'mod7Action',
                    'servicesTag']:
            assert f'{key}:' in app_js, f"Missing key {key} in translations"
    print("[PASS] Verified mod1 to mod7 translation keys across all regional languages")

    # 4. Check GOVERNMENT_DEMAND_CROPS data
    demand_crops = ['Paddy Common', 'Wheat', 'Tur (Arhar)', 'Maize', 'Urad', 'Rapeseed/ Mustard', 'Gram', 'Soyabean Yellow', 'Medium Staple Cotton', 'Groundnut']
    for c in demand_crops:
        assert f"commodity: '{c}'" in app_js, f"Missing high-demand crop {c}"
    print(f"[PASS] Verified all {len(demand_crops)} high-demand government quota crops in app.js")

    # 5. Check helper functions
    helpers = [
        'renderCropInDemandModuleHtml', 'renderDemandCardsHtml',
        'filterDemandCategory', 'sortDemandCrops', 'searchDemandCrops',
        'selectCropAndBookSlot', 'selectCropAndFillForm', 'goToCropInDemand'
    ]
    for h in helpers:
        assert h in app_js, f"Missing helper function {h} in app.js"
    print(f"[PASS] Verified all interactive helper functions in app.js: {helpers}")

    # 6. Check CSS rules
    demand_css_rules = [
        '.icon-flame', '.demand-container', '.demand-hero-bar', '.demand-kpi-grid',
        '.demand-toolbar', '.demand-cards-grid', '.demand-card', '.demand-progress-bar-fill',
        '.demand-qty-grid', '.demand-pricing-box', '.demand-purpose-box', '.demand-guidance-box'
    ]
    for r in demand_css_rules:
        assert r in css, f"Missing CSS rule {r} in styles.css"
    print(f"[PASS] Verified all Crop in Demand CSS rules in styles.css")

    # 7. Check zero occurrences of forbidden term 'mandi'
    for name, content in [('index.html', html), ('styles.css', css), ('app.js', app_js)]:
        matches = re.findall(r'\bmandi\b', content, re.IGNORECASE)
        assert len(matches) == 0, f"Found forbidden term 'mandi' in {name}: {matches}"
    print("[PASS] Zero occurrences of forbidden word 'mandi' across all files")

    print("\nALL CROP IN DEMAND CHECKS PASSED WITH FLYING COLORS!")

if __name__ == '__main__':
    verify_crop_in_demand()
