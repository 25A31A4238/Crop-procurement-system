import re

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('const GOVERNMENT_DEMAND_CROPS = [')
idx2 = text.find('];', idx1)

items = []
for block in text[idx1:idx2].split('{')[1:]:
    comm = re.search(r"commodity:\s*['\"]([^'\"]+)", block)
    target = re.search(r"nationalTargetQty:\s*([0-9.]+)", block)
    remaining = re.search(r"remainingDemandQty:\s*([0-9.]+)", block)
    msp = re.search(r"mspRate:\s*([0-9.]+)", block)
    bonus = re.search(r"bonusIncentive:\s*([0-9.]+)", block)
    if comm and target:
        items.append({
            'commodity': comm.group(1),
            'target': float(target.group(1)),
            'remaining': float(remaining.group(1)),
            'msp': float(msp.group(1)) + float(bonus.group(1))
        })

print("--- SORT BY TARGET ---")
items.sort(key=lambda x: x['target'], reverse=True)
for i, x in enumerate(items):
    print(f"{i+1}. {x['commodity']}: target={x['target']}")

print("\n--- SORT BY REMAINING ---")
items.sort(key=lambda x: x['remaining'], reverse=True)
for i, x in enumerate(items):
    print(f"{i+1}. {x['commodity']}: remaining={x['remaining']}")

print("\n--- SORT BY MSP ---")
items.sort(key=lambda x: x['msp'], reverse=True)
for i, x in enumerate(items):
    print(f"{i+1}. {x['commodity']}: msp={x['msp']}")
