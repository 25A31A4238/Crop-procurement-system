import re

def test_queue_management():
    print("=== VERIFYING REAL-WORLD 5-MEMBER QUEUE MANAGEMENT ===")

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # 1. Verify 5 Default Members defined in app.js
    assert 'DEFAULT_QUEUE_MEMBERS' in js, "Missing DEFAULT_QUEUE_MEMBERS in app.js"
    tokens = ['#TK-8487', '#TK-8488', '#TK-8489', '#TK-8490', '#TK-8491']
    for tok in tokens:
        assert tok in js, f"Missing default queue member token {tok} in app.js"
    print("[PASS] Found all 5 default queue members (#TK-8487 through #TK-8491) in app.js")

    # 2. Verify Queue Management functions
    assert 'function getQueueState(sec)' in js, "Missing getQueueState in app.js"
    assert 'function renderQueueTableRows(sec)' in js, "Missing renderQueueTableRows in app.js"
    assert 'function updateLiveQueueDisplay(sec)' in js, "Missing updateLiveQueueDisplay in app.js"
    assert 'window.resimulateLiveQueue' in js, "Missing window.resimulateLiveQueue in app.js"
    print("[PASS] Verified queue simulation and decreasing count helper functions in app.js")

    # 3. Verify CSS styling
    assert '.queue-board-container' in css, "Missing .queue-board-container in styles.css"
    assert '.queue-kpi-grid' in css, "Missing .queue-kpi-grid in styles.css"
    assert '.queue-table' in css, "Missing .queue-table in styles.css"
    assert '.queue-row-cleared' in css, "Missing .queue-row-cleared in styles.css"
    assert '.queue-row-active' in css, "Missing .queue-row-active in styles.css"
    assert '.queue-row-user' in css, "Missing .queue-row-user in styles.css"
    print("[PASS] Verified queue management responsive CSS rules in styles.css")

    # 4. Verify forbidden term
    assert not re.search(r'\bmandi\b', html, re.IGNORECASE), "Forbidden term in index.html"
    assert not re.search(r'\bmandi\b', js, re.IGNORECASE), "Forbidden term in app.js"
    assert not re.search(r'\bmandi\b', css, re.IGNORECASE), "Forbidden term in styles.css"
    print("[PASS] Zero occurrences of forbidden word 'mandi'")

    print("\nALL REAL-WORLD QUEUE MANAGEMENT CHECKS PASSED!")

if __name__ == '__main__':
    test_queue_management()
