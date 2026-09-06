with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('class CacpMspStoreManager')
with open('scratch/store_mgr.txt', 'w', encoding='utf-8') as f_out:
    f_out.write(text[pos:pos+4000])

print("Wrote store mgr to scratch/store_mgr.txt")
