with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replacements to include real-world trade names
replacements = {
    '"commodity": "Paddy Common",': '"commodity": "Paddy Common",\n    "tradeName": "Paddy (Common / Grade A)",',
    '"commodity": "Medium Staple Cotton",': '"commodity": "Medium Staple Cotton",\n    "tradeName": "Cotton (Medium / Long Staple)",',
    '"commodity": "Maize",': '"commodity": "Maize",\n    "tradeName": "Maize (Kharif FAQ)",',
    '"commodity": "Groundnut",': '"commodity": "Groundnut",\n    "tradeName": "Groundnut (In Shell Pods)",',
    '"commodity": "Ragi",': '"commodity": "Ragi",\n    "tradeName": "Ragi / Finger Millet",'
}

for old, new in replacements.items():
    assert old in text, f"Could not find {old} in app.js"
    text = text.replace(old, new, 1)

# Check brace balance
assert text.count('{') == text.count('}'), "Braces mismatched!"

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS: Trade names added to app.js!")
