with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    l = line.strip()
    if l.startswith("case '") or 'function ' in l or 'window.goTo' in l:
        if any(w in l.lower() for w in ['form', 'slot', 'token', 'finalize', 'payment', 'dbt', 'decline']):
            print(f'{i+1}: {l[:110]}')
