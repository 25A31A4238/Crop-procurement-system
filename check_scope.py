with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('window.sortDemandCrops =')
dcl_idx = text.find("document.addEventListener('DOMContentLoaded'")
end_dcl = text.rfind("});")
print('DOMContentLoaded at:', dcl_idx)
print('sortDemandCrops at:', idx)
print('End of file at:', len(text))
print('Last }); at:', end_dcl)
print('Is inside DOMContentLoaded?', dcl_idx < idx < end_dcl)
