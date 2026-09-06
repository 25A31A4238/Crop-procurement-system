with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'\"commodity\":\s*\"([^\"]+)\"', text)
print("Commodities in RAW DATA:", matches)
