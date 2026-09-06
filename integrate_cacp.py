import json

# Read CACP dataset generated from scratch/cacp_official_dataset.js
with open('scratch/cacp_official_dataset.js', 'r', encoding='utf-8') as f:
    cacp_js_content = f.read()

# Load original app.js
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

print('Loaded files successfully.')
