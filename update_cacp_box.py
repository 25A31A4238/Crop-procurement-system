import json, re

# Let's inspect the current render_schedule_code in app.js
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

print('Length of app.js:', len(app_js))
