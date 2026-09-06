with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
selects = re.findall(r'<select[^>]*id="([^"]+)"', html)
print('Select IDs:', selects)

for sid in selects:
    m = re.search(r'<select[^>]*id="' + sid + r'"[^>]*>(.*?)</select>', html, re.DOTALL)
    if m:
        opts = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>', m.group(1))
        print(f"Options for #{sid}:", opts[:6])
