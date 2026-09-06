import json, re

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('const CACP_OFFICIAL_RAW_DATA = [')
end_idx = text.find('];', idx) + 1
raw_json = text[idx + len('const CACP_OFFICIAL_RAW_DATA = '):end_idx]
try:
    data = json.loads(raw_json)
    print("Total items:", len(data))
    kharif = [c['commodity'] for c in data if 'kharif' in c.get('season', '').lower()]
    rabi = [c['commodity'] for c in data if 'rabi' in c.get('season', '').lower()]
    comm = [c['commodity'] for c in data if 'commercial' in c.get('season', '').lower()]
    print(f"Kharif ({len(kharif)}):", kharif)
    print(f"Rabi ({len(rabi)}):", rabi)
    print(f"Commercial ({len(comm)}):", comm)
except Exception as e:
    print("JSON load error:", e)
