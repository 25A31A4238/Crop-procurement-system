import json

with open('scratch/cacp_msp_official.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

seasons = {}
all_years = set()
for item in data:
    s = item.get('seasonname')
    c = item.get('commodityname')
    y = item.get('financialyear')
    rec = item.get('reco_price')
    fixed = item.get('fixed_price')
    all_years.add(y)
    if s not in seasons:
        seasons[s] = {}
    if c not in seasons[s]:
        seasons[s][c] = {}
    seasons[s][c][y] = {'reco': rec, 'fixed': fixed}

print('All Financial Years in data:', sorted(list(all_years), reverse=True))
print('Seasons:', list(seasons.keys()))

with open('scratch/cacp_summary.txt', 'w', encoding='utf-8') as out:
    for s, comms in seasons.items():
        out.write(f"\n=== Season: {s} ({len(comms)} commodities) ===\n")
        for c, years in comms.items():
            recent_years = sorted(years.keys(), reverse=True)[:5]
            summary_parts = [f"{yr}: Rec={years[yr]['reco']}, Fixed={years[yr]['fixed']}" for yr in recent_years]
            out.write(f"  - {c}: {', '.join(summary_parts)}\n")

print("Saved summary to scratch/cacp_summary.txt")
