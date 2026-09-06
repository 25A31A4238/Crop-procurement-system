with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function renderCacpScheduleContent')
with open('scratch/schedule_content_3.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos+6000:pos+9500])

print("Wrote chunk 3 to scratch/schedule_content_3.txt")
