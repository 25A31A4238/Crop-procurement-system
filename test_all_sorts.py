import re

# Test sorting logic in python
crops = [
    {'commodity': 'Paddy Common', 'target': 540.0, 'remaining': 147.6, 'msp': 2300, 'bonus': 0},
    {'commodity': 'Wheat', 'target': 320.0, 'remaining': 54.0, 'msp': 2425, 'bonus': 0},
    {'commodity': 'Tur (Arhar)', 'target': 40.0, 'remaining': 21.8, 'msp': 7550, 'bonus': 250},
    {'commodity': 'Maize', 'target': 65.0, 'remaining': 27.0, 'msp': 2225, 'bonus': 0},
    {'commodity': 'Urad', 'target': 35.0, 'remaining': 18.5, 'msp': 7400, 'bonus': 200},
    {'commodity': 'Rapeseed/ Mustard', 'target': 32.0, 'remaining': 10.6, 'msp': 5950, 'bonus': 150},
    {'commodity': 'Gram', 'target': 30.0, 'remaining': 7.5, 'msp': 5650, 'bonus': 0},
    {'commodity': 'Soyabean Yellow', 'target': 28.0, 'remaining': 10.2, 'msp': 4892, 'bonus': 0},
    {'commodity': 'Medium Staple Cotton', 'target': 70.0, 'remaining': 23.5, 'msp': 7121, 'bonus': 0},
    {'commodity': 'Groundnut', 'target': 22.0, 'remaining': 7.8, 'msp': 6783, 'bonus': 0},
]

def run_sort(sort_key):
    c = list(crops)
    if sort_key == 'target-desc':
        c.sort(key=lambda x: x['target'], reverse=True)
    elif sort_key == 'target-asc':
        c.sort(key=lambda x: x['target'])
    elif sort_key == 'remaining-desc':
        c.sort(key=lambda x: x['remaining'], reverse=True)
    elif sort_key == 'remaining-asc':
        c.sort(key=lambda x: x['remaining'])
    elif sort_key == 'msp-desc':
        c.sort(key=lambda x: x['msp'] + x['bonus'], reverse=True)
    elif sort_key == 'msp-asc':
        c.sort(key=lambda x: x['msp'] + x['bonus'])
    elif sort_key == 'name-asc':
        c.sort(key=lambda x: x['commodity'])
    return [f"#{i+1} {x['commodity']}" for i, x in enumerate(c)]

print("TARGET DESC:", run_sort('target-desc')[:3])
print("TARGET ASC:", run_sort('target-asc')[:3])
print("REMAINING DESC:", run_sort('remaining-desc')[:3])
print("REMAINING ASC:", run_sort('remaining-asc')[:3])
print("MSP DESC:", run_sort('msp-desc')[:3])
print("MSP ASC:", run_sort('msp-asc')[:3])
print("NAME ASC:", run_sort('name-asc')[:3])
