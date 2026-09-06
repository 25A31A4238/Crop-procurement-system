import json, re

from build_schedule_renderer import cacp_store_block, render_schedule_code

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Replace CROP_MSP_RATES block
old_msp_pattern = """  // --- Constants & MSP Registry ---
  const CROP_MSP_RATES = {
    'Wheat': 2275,
    'Paddy / Rice': 2183,
    'Mustard': 5650,
    'Soybean': 4600,
    'Cotton': 7020,
    'Gram / Chana': 5440,
    'Maize': 2090
  };"""

assert old_msp_pattern in app_js, "Could not find old_msp_pattern in app.js"

replacement_1 = cacp_store_block + "\n\n" + render_schedule_code + "\n\n"
app_js_updated = app_js.replace(old_msp_pattern, replacement_1, 1)

# 2. Replace case 'schedule': block
old_schedule_regex = r"      case 'schedule':\s*title = t\.mod1Title;\s*category = `\$\{t\.mod1Title\} • KHARIF MARKETING SEASON \(KMS 2026-27\)`;\s*bodyHtml = `[\s\S]*?`;\s*break;"
match = re.search(old_schedule_regex, app_js_updated)
assert match, "Could not find case 'schedule' in app.js"

new_schedule_case = """      case 'schedule':
        title = t.mod1Title;
        category = `${t.mod1Title} • CACP MINISTRY OF AGRICULTURE MSP SCHEDULE`;
        bodyHtml = renderScheduleModuleHtml();
        break;"""

app_js_updated = app_js_updated[:match.start()] + new_schedule_case + app_js_updated[match.end():]

# 3. Add table content render hook in openModuleDetail
old_modal_show = """    dashDetailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';"""

assert old_modal_show in app_js_updated, "Could not find old_modal_show in app.js"

new_modal_show = """    dashDetailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // If schedule module is opened, render dynamic CACP table content
    if (moduleKey === 'schedule') {
      renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'all', CACP_MSP_STORE.currentSearch || '');
    }"""

app_js_updated = app_js_updated.replace(old_modal_show, new_modal_show, 1)

# 4. Replace form filling crop select options
old_crop_select_regex = r'<select id="ffCrop" required>[\s\S]*?<\/select>'
match_crop = re.search(old_crop_select_regex, app_js_updated)
assert match_crop, "Could not find select#ffCrop in app.js"

new_crop_select = """<select id="ffCrop" required>
                  <option value="" disabled ${!currentSavedCrop ? 'selected' : ''}>Select Agricultural Produce ▼</option>
                  ${CACP_MSP_STORE.getRegistrationCropOptions(currentSavedCrop)}
                </select>"""

app_js_updated = app_js_updated[:match_crop.start()] + new_crop_select + app_js_updated[match_crop.end():]

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js_updated)

print('SUCCESS! app.js successfully updated with official CACP MSP schedule & dynamic sync engine!')
