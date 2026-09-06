import re, json
from clean_schedule_builder import cacp_store_block, render_schedule_code

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Find the start of CACP block (line 48) and the end of CACP window handlers (before farmerBank)
start_marker = "  // ==========================================================================\n  // OFFICIAL CACP MSP GOVERNMENT OF INDIA DATA STORE & DYNAMIC SYNC ENGINE"
end_marker = "  // --- Stored State / Persistent Database Simulation ---"

assert start_marker in app_js, "Could not find start_marker in app.js"
assert end_marker in app_js, "Could not find end_marker in app.js"

idx_start = app_js.find(start_marker)
idx_end = app_js.find(end_marker)

new_cacp_and_renderer = cacp_store_block + "\n\n" + render_schedule_code + "\n\n"

app_js_clean = app_js[:idx_start] + new_cacp_and_renderer + app_js[idx_end:]

# Verify brace balance
open_c = app_js_clean.count('{')
close_c = app_js_clean.count('}')
print(f'Clean brace check: {open_c} open vs {close_c} close')

if open_c == close_c:
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(app_js_clean)
    print('SUCCESSFULLY updated app.js with exact brace balance!')
else:
    print('Mismatch! Not saving yet.')
