with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

crops = ['Paddy (Common', 'Cotton (Medium', 'Maize (Kharif FAQ)', 'Groundnut (In Shell Pods)', 'Ragi / Finger Millet']
for c in crops:
    print(c, 'in js:', c in js)

import re
print('Paddy matches:', set(re.findall(r'Paddy[^\",\n\r<]*', js)))
print('Cotton matches:', set(re.findall(r'Cotton[^\",\n\r<]*', js)))
print('Maize matches:', set(re.findall(r'Maize[^\",\n\r<]*', js)))
print('Groundnut matches:', set(re.findall(r'Groundnut[^\",\n\r<]*', js)))
print('Ragi matches:', set(re.findall(r'Ragi[^\",\n\r<]*', js)))
