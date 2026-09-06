with open('app.js', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

pos_start = text.find('mod6Title: "लेनदेन')
pos_end = text.find('ml: {', pos_start)

with open('scratch/damaged_area.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos_start-50:pos_end+50])

print("Wrote damaged area to scratch/damaged_area.txt")
print("Length of damaged section:", pos_end - pos_start)
