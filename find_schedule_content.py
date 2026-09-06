with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function renderCacpScheduleContent')
print('Found at:', pos)
with open('scratch/schedule_content.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos:pos+3000])

print("Wrote schedule content to scratch/schedule_content.txt")
