with open('app.js', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

pos_start = text.find('ml: {')
pos_end = text.find('function applyFarmerLanguage', pos_start)

with open('scratch/ml_area.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos_start:pos_end+100])

print("Wrote ml area to scratch/ml_area.txt")
