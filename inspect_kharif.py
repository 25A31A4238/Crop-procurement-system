with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find("tab === 'kharif'")
with open('scratch/kharif_render.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos:pos+2500])

print("Wrote to scratch/kharif_render.txt")
