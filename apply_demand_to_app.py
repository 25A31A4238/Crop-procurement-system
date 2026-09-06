import re

with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Read the demand module code we tested earlier
with open('scratch/test_demand_block.py', 'r', encoding='utf-8') as f:
    test_file = f.read()

m = re.search(r"demand_module_code = '''([\s\S]*?)'''", test_file)
assert m, "Could not extract demand_module_code"
demand_code = m.group(1).strip()

# 1. Insert demand_code right before "// --- 7. Core Interface Renderer: openModuleDetail ---"
target_marker = "  // --- 7. Core Interface Renderer: openModuleDetail ---"
assert target_marker in code, "Could not find target marker for openModuleDetail"

code = code.replace(target_marker, demand_code + "\n\n" + target_marker)

# 2. Update switch (moduleKey) in openModuleDetail
old_switch = '''    switch (moduleKey) {
      case 'schedule':
        title = t.mod1Title;
        category = `${t.mod1Title} • CACP MINISTRY OF AGRICULTURE MSP SCHEDULE`;
        bodyHtml = renderScheduleModuleHtml();
        break;

      case 'form-filling':
        title = t.mod2Title;
        category = `${t.mod2Title} & PRODUCE INTAKE`;'''

new_switch = '''    switch (moduleKey) {
      case 'schedule':
        title = t.mod1Title;
        category = `${t.mod1Title} • CACP MINISTRY OF AGRICULTURE MSP SCHEDULE`;
        bodyHtml = renderScheduleModuleHtml();
        break;

      case 'crop-in-demand':
        title = t.mod2Title || 'CROP IN DEMAND';
        category = `${title} • NATIONAL HIGH QUANTITY PROCUREMENT TARGETS`;
        bodyHtml = renderCropInDemandModuleHtml();
        break;

      case 'form-filling':
        title = t.mod3Title;
        category = `${t.mod3Title} & PRODUCE INTAKE`;'''

assert old_switch in code, "Could not find old_switch"
code = code.replace(old_switch, new_switch)

# 3. Update remaining case titles in openModuleDetail
case_mods = [
    ("case 'slot-booking':\n        title = t.mod3Title;\n        category = `${t.mod3Title} & QUEUE ALLOCATION`;",
     "case 'slot-booking':\n        title = t.mod4Title;\n        category = `${t.mod4Title} & QUEUE ALLOCATION`;"),
    ("case 'token-status':\n        title = t.mod4Title;\n        category = `${t.mod4Title} & WEIGHBRIDGE DISPATCH & LIVE TOKEN`;",
     "case 'token-status':\n        title = t.mod5Title;\n        category = `${t.mod5Title} & WEIGHBRIDGE DISPATCH & LIVE TOKEN`;"),
    ("case 'finalize-procurement':\n        title = t.mod5Title;\n        category = `${t.mod5Title} & DBT AUTHORIZATION`;",
     "case 'finalize-procurement':\n        title = t.mod6Title;\n        category = `${t.mod6Title} & DBT AUTHORIZATION`;"),
    ("case 'payment-history':\n        title = 'TRANSACTION & PAYMENT HISTORY';\n        category = 'DIRECT BENEFIT TRANSFER (DBT) & TRANSACTION STATEMENTS';",
     "case 'payment-history':\n        title = t.mod7Title || 'TRANSACTION & PAYMENT HISTORY';\n        category = `${t.mod7Title || 'TRANSACTION & PAYMENT HISTORY'} & DBT STATEMENTS`;")
]

for old_c, new_c in case_mods:
    assert old_c in code, f"Could not find {old_c}"
    code = code.replace(old_c, new_c)

# 4. Update locked consignment steps in hasActiveInProgressProcurement
old_locked_steps = '''                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 2<br>Form Filled</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 3<br>Slot Booked</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isTimerDone ? 'done' : 'current'}">${isTimerDone ? '✓' : '4'}</div>
                      <span class="reg-step-label">Stage 4<br>Queue Dispatch</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'done' : (isTimerDone ? 'current' : '')}">${isCert ? '✓' : '5'}</div>
                      <span class="reg-step-label">Stage 5<br>Assaying &amp; Price</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'current' : ''}">6</div>
                      <span class="reg-step-label">Stage 6<br>DBT Release</span>
                    </div>'''

new_locked_steps = '''                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 3<br>Form Filled</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot done">✓</div>
                      <span class="reg-step-label">Stage 4<br>Slot Booked</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isTimerDone ? 'done' : 'current'}">${isTimerDone ? '✓' : '5'}</div>
                      <span class="reg-step-label">Stage 5<br>Queue Dispatch</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'done' : (isTimerDone ? 'current' : '')}">${isCert ? '✓' : '6'}</div>
                      <span class="reg-step-label">Stage 6<br>Assaying &amp; Price</span>
                    </div>
                    <div class="reg-progress-step">
                      <div class="reg-step-dot ${isCert ? 'current' : ''}">7</div>
                      <span class="reg-step-label">Stage 7<br>DBT Release</span>
                    </div>'''

assert old_locked_steps in code, "Could not find old_locked_steps"
code = code.replace(old_locked_steps, new_locked_steps)

# 5. Update locked action button labels
old_locked_buttons = '''                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToTokenStatus();">
                    <span>🎟️ Track Token Queue (Module 4)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToFinalizeProcurement();">
                    <span>⚖️ Review Price &amp; Assaying (Module 5)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav secondary" onclick="window.goToPaymentHistory();">
                    <span>💳 DBT Payment History (Module 6)</span>
                    <span>→</span>
                  </button>'''

new_locked_buttons = '''                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToTokenStatus();">
                    <span>🎟️ Track Token Queue (Module 5)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav" onclick="window.goToFinalizeProcurement();">
                    <span>⚖️ Review Price &amp; Assaying (Module 6)</span>
                    <span>→</span>
                  </button>
                  <button type="button" class="btn-reg-locked-nav secondary" onclick="window.goToPaymentHistory();">
                    <span>💳 DBT Payment History (Module 7)</span>
                    <span>→</span>
                  </button>'''

assert old_locked_buttons in code, "Could not find old_locked_buttons"
code = code.replace(old_locked_buttons, new_locked_buttons)

# 6. Update roadmap steps in renderScheduleModuleHtml
old_roadmap = '''          <div class="roadmap-step-card current" onclick="window.goToSchedule();" title="Phase 1: You are currently viewing the Procurement Schedule">
            <span class="step-badge">STAGE 01</span>
            <div class="step-icon">📅</div>
            <strong class="step-title">Procurement Schedule</strong>
            <p class="step-desc">Verify MSP prices, active intake dates, and daily center quotas.</p>
            <span class="step-status-tag">Active Viewing</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToFormFilling();" title="Proceed to Phase 2: Produce Registration Form">
            <span class="step-badge">STAGE 02</span>
            <div class="step-icon">📝</div>
            <strong class="step-title">Produce Registration</strong>
            <p class="step-desc">Register land survey #, crop variety, harvest weight &amp; bank DBT.</p>
            <span class="step-jump-link">Open Module 2 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToSlotBooking();" title="Proceed to Phase 3: Center &amp; Slot Booking">
            <span class="step-badge">STAGE 03</span>
            <div class="step-icon">⏰</div>
            <strong class="step-title">Slot Reservation</strong>
            <p class="step-desc">Book morning/afternoon slot at Village ABC cooperative center.</p>
            <span class="step-jump-link">Open Module 3 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToTokenStatus();" title="Proceed to Phase 4: Live Token Queue Status">
            <span class="step-badge">STAGE 04</span>
            <div class="step-icon">🎟️</div>
            <strong class="step-title">Live Queue Status</strong>
            <p class="step-desc">Track token #TK-8492 with 5-vehicle countdown dispatching.</p>
            <span class="step-jump-link">Open Module 4 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToFinalizeProcurement();" title="Proceed to Phase 5: Finalize Procurement &amp; Assaying">
            <span class="step-badge">STAGE 05</span>
            <div class="step-icon">⚖️</div>
            <strong class="step-title">Assaying &amp; Stamp</strong>
            <p class="step-desc">Quality inspection, moisture grading &amp; official stamp certification.</p>
            <span class="step-jump-link">Open Module 5 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToPaymentHistory();" title="Proceed to Phase 6: Direct Benefit Transfer (DBT)">
            <span class="step-badge">STAGE 06</span>
            <div class="step-icon">💳</div>
            <strong class="step-title">DBT Settlement</strong>
            <p class="step-desc">Direct government bank credit within 24-48h with live UTR receipt.</p>
            <span class="step-jump-link">Open Module 6 →</span>
          </div>'''

new_roadmap = '''          <div class="roadmap-step-card current" onclick="window.goToSchedule();" title="Phase 1: You are currently viewing the Procurement Schedule">
            <span class="step-badge">STAGE 01</span>
            <div class="step-icon">📅</div>
            <strong class="step-title">Procurement Schedule</strong>
            <p class="step-desc">Verify MSP prices, active intake dates, and daily center quotas.</p>
            <span class="step-status-tag">Active Viewing</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToCropInDemand();" title="Proceed to Phase 2: High Demand Crops">
            <span class="step-badge">STAGE 02</span>
            <div class="step-icon">🔥</div>
            <strong class="step-title">Crop in Demand</strong>
            <p class="step-desc">Discover high-quantity government procurement targets &amp; buffer quotas.</p>
            <span class="step-jump-link">Open Module 2 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToFormFilling();" title="Proceed to Phase 3: Produce Registration Form">
            <span class="step-badge">STAGE 03</span>
            <div class="step-icon">📝</div>
            <strong class="step-title">Produce Registration</strong>
            <p class="step-desc">Register land survey #, crop variety, harvest weight &amp; bank DBT.</p>
            <span class="step-jump-link">Open Module 3 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToSlotBooking();" title="Proceed to Phase 4: Center &amp; Slot Booking">
            <span class="step-badge">STAGE 04</span>
            <div class="step-icon">⏰</div>
            <strong class="step-title">Slot Reservation</strong>
            <p class="step-desc">Book morning/afternoon slot at Village ABC cooperative center.</p>
            <span class="step-jump-link">Open Module 4 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToTokenStatus();" title="Proceed to Phase 5: Live Token Queue Status">
            <span class="step-badge">STAGE 05</span>
            <div class="step-icon">🎟️</div>
            <strong class="step-title">Live Queue Status</strong>
            <p class="step-desc">Track token #TK-8492 with 5-vehicle countdown dispatching.</p>
            <span class="step-jump-link">Open Module 5 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToFinalizeProcurement();" title="Proceed to Phase 6: Finalize Procurement &amp; Assaying">
            <span class="step-badge">STAGE 06</span>
            <div class="step-icon">⚖️</div>
            <strong class="step-title">Assaying &amp; Stamp</strong>
            <p class="step-desc">Quality inspection, moisture grading &amp; official stamp certification.</p>
            <span class="step-jump-link">Open Module 6 →</span>
          </div>

          <div class="roadmap-step-card" onclick="window.goToPaymentHistory();" title="Proceed to Phase 7: Direct Benefit Transfer (DBT)">
            <span class="step-badge">STAGE 07</span>
            <div class="step-icon">💳</div>
            <strong class="step-title">DBT Settlement</strong>
            <p class="step-desc">Direct government bank credit within 24-48h with live UTR receipt.</p>
            <span class="step-jump-link">Open Module 7 →</span>
          </div>'''

assert old_roadmap in code, "Could not find old_roadmap"
code = code.replace(old_roadmap, new_roadmap)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied demand module and all numbering updates to app.js successfully!")
