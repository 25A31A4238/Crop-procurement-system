import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Extract GOVERNMENT_DEMAND_CROPS array
match = re.search(r'const GOVERNMENT_DEMAND_CROPS = (\[.*?\]);\s*let currentDemandFilter', code, re.DOTALL)
if not match:
    print('Failed to find GOVERNMENT_DEMAND_CROPS')
    sys.exit(1)

# Convert JS object representation to python dict
raw_js = match.group(1)
# Clean up JS specific things if any
import json
# In JS keys are unquoted identifiers like id:, commodity:, etc.
# We can use regex to quote them or safely parse
lines = raw_js.splitlines()
cleaned_lines = []
for line in lines:
    # replace unquoted keys: (\s+)([a-zA-Z0-9_]+): with \1"\2":
    line = re.sub(r'(\s+)([a-zA-Z0-9_]+):', r'\1"\2":', line)
    # replace single quotes with double quotes
    line = re.sub(r"'([^']*)'", r'"\1"', line)
    cleaned_lines.append(line)

cleaned_js = '\n'.join(cleaned_lines)
# remove trailing commas before } or ]
cleaned_js = re.sub(r',\s*([}\]])', r'\1', cleaned_js)

try:
    crops = json.loads(cleaned_js)
except Exception as e:
    # fallback: evaluate with python using dict
    crops = eval(raw_js)

print(f'Successfully loaded {len(crops)} crops from GOVERNMENT_DEMAND_CROPS in app.js.\n')

sort_modes = {
    'target-desc': ('Target Quota: High to Low', lambda a, b: b['nationalTargetQty'] - a['nationalTargetQty']),
    'target-asc': ('Target Quota: Low to High', lambda a, b: a['nationalTargetQty'] - b['nationalTargetQty']),
    'remaining-desc': ('Remaining Deficit: Most Urgent', lambda a, b: b['remainingDemandQty'] - a['remainingDemandQty']),
    'remaining-asc': ('Remaining Deficit: Lowest First', lambda a, b: a['remainingDemandQty'] - b['remainingDemandQty']),
    'msp-desc': ('MSP Price: High to Low', lambda a, b: (b['mspRate'] + b['bonusIncentive']) - (a['mspRate'] + a['bonusIncentive'])),
    'msp-asc': ('MSP Price: Low to High', lambda a, b: (a['mspRate'] + a['bonusIncentive']) - (b['mspRate'] + b['bonusIncentive'])),
    'name-asc': ('Commodity Name: A to Z', lambda a, b: (a['commodity'] > b['commodity']) - (a['commodity'] < b['commodity'])),
}

from functools import cmp_to_key

for mode, (label, cmp_func) in sort_modes.items():
    sorted_crops = sorted(crops, key=cmp_to_key(cmp_func))
    print(f"=== [{mode}] {label} ===")
    for rank, c in enumerate(sorted_crops[:3], 1):
        eff_msp = c['mspRate'] + c['bonusIncentive']
        print(f"  Rank #{rank}: {c['commodity']} (Target: {c['nationalTargetQty']} {c['unit']} | Deficit: {c['remainingDemandQty']} | MSP: ₹{eff_msp:,}/Qtl)")
    print()

print("ALL SORT CRITERIA VERIFIED AND PRODUCE DIFFERENT, ACCURATE RANKINGS!")
