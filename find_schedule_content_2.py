with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('function renderCacpScheduleContent')
with open('scratch/schedule_content_2.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos+3000:pos+6000])

print("Wrote next chunk to scratch/schedule_content_2.txt")
