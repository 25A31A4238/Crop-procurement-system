import re, json

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Update renderCacpScheduleContent and renderScheduleModuleHtml
new_renderer_code = """  // ==========================================================================
  // CACP OFFICIAL MSP PROCUREMENT SCHEDULE RENDERER & OFFICIAL MATRIX BOX
  // Replicating official portal at https://cacp.da.gov.in/Home/MSP
  // ==========================================================================
  function renderCacpScheduleContent(tab = 'matrix', search = '') {
    const tableWrap = document.getElementById('cacpScheduleTableWrap');
    if (!tableWrap) return;

    CACP_MSP_STORE.currentTab = tab;
    CACP_MSP_STORE.currentSearch = search;

    // Update tab button active states
    document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const syncLabel = document.getElementById('cacpSyncTimeLabel');
    if (syncLabel) syncLabel.textContent = CACP_MSP_STORE.lastSyncTime;

    const matrixSyncLabel = document.getElementById('cacpMatrixSyncTime');
    if (matrixSyncLabel) matrixSyncLabel.textContent = CACP_MSP_STORE.lastSyncTime;

    let items = CACP_MSP_STORE.getAll();

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(c => c.commodity.toLowerCase().includes(q) || c.season.toLowerCase().includes(q));
    }

    if (tab === 'matrix') {
      // OFFICIAL GOVERNMENT CACP MATRIX BOX (cacp.da.gov.in style)
      const matrixYears = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
      const seasons = ['Kharif Crops', 'Rabi Crops', 'Commercial Crops'];
      
      let headerYearCols = '';
      let subHeaderCols = '';
      matrixYears.forEach(y => {
        const nextYr = (parseInt(y, 10) + 1).toString().slice(-2);
        const yrLabel = `${y}-${nextYr}`;
        headerYearCols += `<th colspan="2">${yrLabel}</th>`;
        subHeaderCols += `<th class="sub-th">Rec</th><th class="sub-th">Fixed</th>`;
      });

      let matrixBodyRows = '';
      seasons.forEach(seasonName => {
        const seasonItems = items.filter(i => i.season === seasonName);
        if (seasonItems.length === 0) return;

        // Season Header Row
        matrixBodyRows += `
          <tr class="cacp-season-header-row">
            <td colspan="${matrixYears.length * 2 + 1}">
              <strong>${seasonName.toUpperCase()}</strong>
            </td>
          </tr>
        `;

        seasonItems.forEach(c => {
          let priceCells = '';
          matrixYears.forEach(y => {
            const yrData = c.years?.[y];
            const reco = yrData?.reco && yrData.reco !== '-' ? `₹${parseInt(yrData.reco, 10).toLocaleString('en-IN')}` : '<span style="color:#B0BDB5;">-</span>';
            const fixed = yrData?.fixed && yrData.fixed !== '-' ? `₹${parseInt(yrData.fixed, 10).toLocaleString('en-IN')}` : '<span style="color:#B0BDB5;">-</span>';
            priceCells += `
              <td class="cacp-price-cell-reco">${reco}</td>
              <td class="cacp-price-cell-fixed">${fixed}</td>
            `;
          });

          matrixBodyRows += `
            <tr>
              <td class="commodity-name-cell">
                <span style="font-size: 15px; margin-right: 6px;">${c.icon || '🌾'}</span>
                <strong>${c.commodity}</strong>
              </td>
              ${priceCells}
            </tr>
          `;
        });
      });

      tableWrap.innerHTML = `
        <div class="cacp-official-matrix-card">
          <div class="cacp-matrix-top-bar">
            <div class="cacp-matrix-title">
              <span>🏛️ Crop and Year-wise Minimum Support Price (MSP) Matrix</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="cacp-matrix-unit-tag">(₹/qtl) Updated on: <span id="cacpMatrixSyncTime">${CACP_MSP_STORE.lastSyncTime}</span></span>
            </div>
          </div>
          <div class="cacp-matrix-scroll-wrap">
            <table class="cacp-official-table">
              <thead>
                <tr>
                  <th rowspan="2" class="commodity-th">Commodity</th>
                  ${headerYearCols}
                </tr>
                <tr>
                  ${subHeaderCols}
                </tr>
              </thead>
              <tbody>
                ${matrixBodyRows || '<tr><td colspan="' + (matrixYears.length * 2 + 1) + '" style="text-align: center; padding: 24px; color: #7B8B7F;">No crops matching search query.</td></tr>'}
              </tbody>
            </table>
          </div>
          <div style="background: #FAF7F2; padding: 10px 16px; border-top: 1px solid #E8DEC8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 11px; color: #64746A;">
            <div><strong>Legend:</strong> <span style="color:#55665B; margin-right: 12px;"><strong>Rec</strong> = Recommended by CACP</span> <span style="color:#143525;"><strong>Fixed</strong> = Approved Cabinet MSP</span></div>
            <div>* Source: Commission for Agricultural Costs &amp; Prices (<a href="https://cacp.da.gov.in/Home/MSP" target="_blank" rel="noopener noreferrer" style="color: #1E824C; text-decoration: underline;">cacp.da.gov.in</a>)</div>
          </div>
        </div>
      `;
      return;
    }

    if (tab === 'history') {
      // Multi-Year Price History Comparison Table (2018 to 2026)
      const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
      let historyRows = '';

      items.forEach(c => {
        let yrCells = '';
        years.forEach(y => {
          const yData = c.years?.[y];
          const fix = yData?.fixed && yData.fixed !== '-' ? `₹${parseInt(yData.fixed, 10).toLocaleString('en-IN')}` : '<span style="color: #A0ABA3;">-</span>';
          yrCells += `<td style="font-size: 11px;"><strong>${fix}</strong></td>`;
        });

        historyRows += `
          <tr>
            <td class="crop-col" style="white-space: nowrap;">
              <span style="font-size: 16px; margin-right: 6px;">${c.icon || '🌾'}</span>
              <strong>${c.commodity}</strong>
              <div style="font-size: 10px; color: #7B8B7F;">${c.season}</div>
            </td>
            ${yrCells}
          </tr>
        `;
      });

      tableWrap.innerHTML = `
        <div style="overflow-x: auto;">
          <table class="detail-table schedule-table cacp-history-table">
            <thead>
              <tr>
                <th style="text-align: left;">Crop &amp; Variety</th>
                <th>2026-27 (₹)</th>
                <th>2025-26 (₹)</th>
                <th>2024-25 (₹)</th>
                <th>2023-24 (₹)</th>
                <th>2022-23 (₹)</th>
                <th>2021-22 (₹)</th>
                <th>2020-21 (₹)</th>
                <th>2019-20 (₹)</th>
                <th>2018-19 (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${historyRows || '<tr><td colspan="10" style="text-align: center; padding: 24px; color: #7B8B7F;">No crops matching search query.</td></tr>'}
            </tbody>
          </table>
        </div>
        <p style="font-size: 11px; color: #64746A; margin-top: 8px; text-align: right;">
          * All historical rates in INR (₹) per Quintal as fixed &amp; published by CACP, Department of Agriculture &amp; Farmers Welfare.
        </p>
      `;
      return;
    }

    // Standard Operational Views (kharif, rabi, commercial, all)
    const seasonFiltered = CACP_MSP_STORE.getBySeason(tab);
    const displayList = search && search.trim() ? seasonFiltered.filter(c => c.commodity.toLowerCase().includes(search.toLowerCase().trim())) : seasonFiltered;

    let rowsHtml = '';
    displayList.forEach(c => {
      const details = CACP_MSP_STORE.getLatestMspDetails(c);
      const isLive = c.window?.status === 'live';
      const isRegOpen = c.window?.status === 'reg_open';
      const rowClass = isLive ? 'schedule-row-active' : '';

      let statusBadge = '<span class="badge-tag badge-pending">📅 Upcoming Window</span>';
      let actionBtn = `<button type="button" class="btn-schedule-action outline" onclick="window.goToFormFilling();" title="Pre-register produce for upcoming season">Pre-Register →</button>`;

      if (isLive) {
        statusBadge = '<span class="badge-tag badge-success">🟢 Live Intake Active</span>';
        actionBtn = `<button type="button" class="btn-schedule-action" onclick="window.goToSlotBooking();" title="Book Weighbridge Slot for ${c.commodity}">Book Slot →</button>`;
      } else if (isRegOpen) {
        statusBadge = '<span class="badge-tag" style="background: #FFF3CD; color: #856404; border: 1px solid #FFEEBA;">🟡 Registration Open</span>';
        actionBtn = `<button type="button" class="btn-schedule-action outline" onclick="window.goToFormFilling();" title="Register produce in Form Filling">Register Crop →</button>`;
      }

      const formattedFixed = typeof details.curFixed === 'number' ? `₹${details.curFixed.toLocaleString('en-IN')}` : details.curFixed;
      const formattedReco = typeof details.curReco === 'number' || (typeof details.curReco === 'string' && details.curReco !== '-') ? `₹${parseInt(details.curReco, 10).toLocaleString('en-IN')}` : '-';

      rowsHtml += `
        <tr class="${rowClass}">
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 20px;">${c.icon || '🌾'}</span>
              <div>
                <strong>${c.commodity}</strong>
                <div style="font-size: 10.5px; color: #7B8B7F;">${c.season} • ${details.curYear}</div>
              </div>
            </div>
          </td>
          <td>
            <strong style="color: #143525; font-size: 13.5px;">${formattedFixed}</strong>
            ${details.hikeText ? `<div style="font-size: 10.5px; color: #1E824C; font-weight: 700;">${details.hikeText}</div>` : ''}
          </td>
          <td>
            <span style="color: #4A584E; font-size: 12px; font-weight: 600;">${formattedReco}</span>
          </td>
          <td style="font-size: 12px;">${c.window?.reg || 'Per Circular'}</td>
          <td style="font-size: 12px;">
            <strong>${c.window?.intake || 'Active Season'}</strong>
            ${isLive ? `<div style="font-size: 10px; color: #1E824C; font-weight: 700;">● Today Open for Weighment</div>` : ''}
          </td>
          <td style="font-size: 11px; color: #4A584E; line-height: 1.4;">${c.qualitySpec || 'FAQ Standards'}</td>
          <td>${statusBadge}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    });

    tableWrap.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="detail-table schedule-table">
          <thead>
            <tr>
              <th>Crop &amp; Official Grade</th>
              <th>Govt. Fixed MSP (₹/Qtl)</th>
              <th>Recommended (Rec ₹)</th>
              <th>Farmer Registration</th>
              <th>Weighbridge Intake Window</th>
              <th>Assaying FAQ Standards</th>
              <th>Intake Status</th>
              <th>Workflow Action</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="8" style="text-align: center; padding: 24px; color: #7B8B7F;">No crops matching search query.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderScheduleModuleHtml() {
    return `
      <!-- 1. CACP Official Ministry Source & Live Sync Bar -->
      <div class="cacp-source-bar">
        <div class="cacp-source-info">
          <div class="cacp-emblem-badge" title="Commission for Agricultural Costs and Prices, GoI">🌾</div>
          <div class="cacp-source-text">
            <div class="cacp-source-title">
              <span>Commission for Agricultural Costs &amp; Prices (CACP)</span>
              <span class="badge-tag badge-success" style="font-size: 9.5px; padding: 1px 6px;">AUTO-SYNC ACTIVE</span>
            </div>
            <div>Ministry of Agriculture &amp; Farmers Welfare, Government of India • <a href="https://cacp.da.gov.in/Home/MSP" target="_blank" rel="noopener noreferrer" class="cacp-source-link">🔗 Official Portal (cacp.da.gov.in/Home/MSP)</a></div>
          </div>
        </div>
        <div class="cacp-sync-actions">
          <span class="cacp-sync-status">
            <span class="live-dot-pulse"></span>
            <span id="cacpSyncTimeLabel">${CACP_MSP_STORE.lastSyncTime}</span>
          </span>
          <button type="button" class="btn-cacp-sync" id="cacpSyncBtn" onclick="window.syncLiveGovtMsp();" title="Sync live MSP updates directly from official CACP JSON endpoint">
            <span class="sync-icon">🔄</span>
            <span>Sync Live Govt MSP</span>
          </button>
          <button type="button" class="btn-cacp-admin" onclick="window.openCacpMspModal();" title="Announce or apply CCEA Gazette MSP revisions">
            <span>📢 Announce / Revise MSP</span>
          </button>
        </div>
      </div>

      <!-- 2. Real-World Center Operational Banner -->
      <div class="schedule-context-banner">
        <div class="schedule-context-left">
          <span class="schedule-season-tag">OFFICIAL KHARIF MARKETING SEASON (KMS) 2026-27</span>
          <h3 class="schedule-center-title">State Agricultural Cooperative Center (Village ABC)</h3>
          <p class="schedule-center-sub">Designated Central Procurement Center • Center Code: <strong>CPC-AP-VIL-ABC-04</strong> • Operating Hours: <strong>08:00 AM – 05:00 PM</strong></p>
        </div>
        <div class="schedule-context-badge">
          <span class="live-dot-pulse"></span>
          <span>LIVE INTAKE &amp; WEIGHMENT ACTIVE</span>
        </div>
      </div>

      <!-- 3. Real-World Center Operations & Capacity KPI Summary -->
      <div class="schedule-kpi-grid">
        <div class="schedule-kpi-card">
          <span class="kpi-label">MONITORED COMMODITIES</span>
          <span class="kpi-value">28 Commodities</span>
          <span class="kpi-sub">Kharif, Rabi &amp; Commercial Crops</span>
        </div>
        <div class="schedule-kpi-card">
          <span class="kpi-label">DAILY INTAKE CAP</span>
          <span class="kpi-value">1,200 Qtl / Day</span>
          <span class="kpi-sub">24 Weighbridge Slots per Day</span>
        </div>
        <div class="schedule-kpi-card">
          <span class="kpi-label">FARMER QUOTA</span>
          <span class="kpi-value">25 Qtl / Farmer / Day</span>
          <span class="kpi-sub">Max 100 Qtl Seasonal Ceiling</span>
        </div>
        <div class="schedule-kpi-card">
          <span class="kpi-label">DBT MSP ASSURANCE</span>
          <span class="kpi-value" style="color: #1E824C;">100% Protected</span>
          <span class="kpi-sub">Direct Bank Account Credit (24–48h)</span>
        </div>
      </div>

      <!-- 4. Interactive Tab Filters and Search Bar -->
      <div class="payment-section-heading" style="margin-top: 10px; margin-bottom: 4px;">
        <span>📋 OFFICIAL MSP PROCUREMENT SCHEDULE &amp; OPERATIONAL CALENDAR</span>
      </div>

      <div class="schedule-controls-bar">
        <div class="schedule-tabs-wrap" role="tablist">
          <button type="button" class="schedule-tab-btn active" data-tab="matrix" onclick="window.switchScheduleTab('matrix');">🏛️ Official CACP Matrix Box (cacp.da.gov.in Style)</button>
          <button type="button" class="schedule-tab-btn" data-tab="kharif" onclick="window.switchScheduleTab('kharif');">🌾 Kharif Intake (2026-27)</button>
          <button type="button" class="schedule-tab-btn" data-tab="rabi" onclick="window.switchScheduleTab('rabi');">🌱 Rabi Crops</button>
          <button type="button" class="schedule-tab-btn" data-tab="commercial" onclick="window.switchScheduleTab('commercial');">🌴 Commercial Crops</button>
          <button type="button" class="schedule-tab-btn" data-tab="history" onclick="window.switchScheduleTab('history');">📊 Multi-Year Price History</button>
        </div>

        <div class="schedule-search-box">
          <span class="schedule-search-icon">🔍</span>
          <input type="text" class="schedule-search-input" id="scheduleSearchInput" placeholder="Search crop, variety, or season..." oninput="window.handleScheduleSearch(this.value);" />
        </div>
      </div>

      <!-- 5. Dynamic Schedule Table Container (Holds the Official Matrix Box or Selected View) -->
      <div id="cacpScheduleTableWrap" style="margin-top: 6px; margin-bottom: 16px;">
        <!-- Injected dynamically via renderCacpScheduleContent -->
      </div>

      <!-- 6. Official CACP Footnotes & Norms Accordion -->
      <div class="cacp-footnotes-card">
        <div class="cacp-footnotes-header" onclick="const fc = document.getElementById('cacpFootnotesContent'); const fa = document.getElementById('cacpFootnotesArrow'); if(fc) { const isH = fc.classList.toggle('hidden'); if(fa) fa.textContent = isH ? '▼ Expand' : '▲ Collapse'; }">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">📜</span>
            <span>Official Statutory CACP Pricing &amp; Quality Norms (15 Footnotes from CACP Portal)</span>
          </div>
          <span id="cacpFootnotesArrow" style="font-size: 11px; color: #1E824C; font-weight: 700;">▼ Expand</span>
        </div>
        <div id="cacpFootnotesContent" class="cacp-footnotes-content hidden">
          <ul class="cacp-footnotes-list">
            ${CACP_FOOTNOTES_DATA.map(fn => `<li>${fn}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 7. Real-World End-to-End Workflow Pathway (Matching Website Modules 1 to 6) -->
      <div class="schedule-workflow-roadmap">
        <div class="roadmap-header">
          <h4>🔄 REAL-WORLD END-TO-END WEBSITE WORKFLOW (6 PHASES)</h4>
          <p>How the Procurement Schedule integrates with each operational module in this portal:</p>
        </div>
        <div class="roadmap-steps-grid">
          <div class="roadmap-step-card current" onclick="window.goToSchedule();" title="Phase 1: You are currently viewing the Procurement Schedule">
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
          </div>
        </div>
      </div>

      <!-- 8. Government Quality Guidelines & Operational Notice Box -->
      <div class="schedule-notice-box">
        <div style="display: flex; align-items: flex-start; gap: 10px;">
          <span style="font-size: 24px;">📢</span>
          <div>
            <strong style="color: #143525; font-size: 13.5px;">Official Central Guidelines for Kharif 2026-27 Intake:</strong>
            <ul style="margin: 6px 0 0 18px; padding: 0; font-size: 12px; color: #4A584E; line-height: 1.6;">
              <li><strong>Mandatory Documents at Weighbridge Gate:</strong> Farmer Registration Token Receipt, Aadhaar Card, Land Record/Patta Passbook (Survey No.), and Bank Passbook copy.</li>
              <li><strong>Quality Inspection Protocol:</strong> Paddy moisture must not exceed 17.0%. Produce above 17% must be dried in the center's drying yard before electronic weighment.</li>
              <li><strong>Direct Benefit Transfer (DBT) Assurance:</strong> Central treasury settlement is initiated into your Aadhaar-linked bank account within 24 to 48 hours of Assayer certification.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 9. Direct Workflow Navigation Bar -->
      <div class="workflow-nav-bar">
        <button type="button" class="workflow-btn workflow-btn-primary" onclick="window.goToFormFilling();">
          <span>Register Produce for Intake (Module 2)</span>
          <span>🌱</span>
        </button>
        <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.goToSlotBooking();">
          <span>Book Weighbridge Slot (Module 3)</span>
          <span>📅</span>
        </button>
        <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.print();" style="flex: none; min-width: 150px;">
          <span>Print Official Schedule</span>
          <span>🖨️</span>
        </button>
      </div>
    `;
  }

  window.renderCacpScheduleContent = renderCacpScheduleContent;
  window.switchScheduleTab = function(tabKey) {
    const searchVal = document.getElementById('scheduleSearchInput')?.value || '';
    renderCacpScheduleContent(tabKey, searchVal);
  };
  window.handleScheduleSearch = function(searchVal) {
    renderCacpScheduleContent(CACP_MSP_STORE.currentTab, searchVal);
  };
  window.syncLiveGovtMsp = function() {
    CACP_MSP_STORE.syncLiveGovtMsp(showToast);
  };"""

# Replace the previous renderCacpScheduleContent and renderScheduleModuleHtml in app_js
renderer_start = app_js.find("  // ==========================================================================\n  // CACP OFFICIAL MSP PROCUREMENT SCHEDULE RENDERER")
renderer_end = app_js.find("  window.openCacpMspModal = function() {")
assert renderer_start != -1 and renderer_end != -1, "Could not find renderer block in app.js"

app_js_updated = app_js[:renderer_start] + new_renderer_code + "\n\n" + app_js[renderer_end:]

# 2. Add Auto-Sync on Login
# Inside officer login success:
officer_login_target = "showToast(`Procurement Officer Login Successful — Welcome Officer (${officerIdVal})`, 'success');"
assert officer_login_target in app_js_updated, "Could not find officer login success"
officer_login_replacement = officer_login_target + "\n          \n          // Auto-sync official CACP MSP schedule on login\n          CACP_MSP_STORE.syncLiveGovtMsp(false);"
app_js_updated = app_js_updated.replace(officer_login_target, officer_login_replacement, 1)

# Inside farmer login success:
farmer_login_target = "showToast('Farmer Login Successful — Welcome to Portal', 'success');"
assert farmer_login_target in app_js_updated, "Could not find farmer login success"
farmer_login_replacement = farmer_login_target + "\n        \n        // Auto-sync official CACP MSP schedule on login\n        CACP_MSP_STORE.syncLiveGovtMsp(false);"
app_js_updated = app_js_updated.replace(farmer_login_target, farmer_login_replacement, 1)

# Inside openModuleDetail('schedule'): ensure default tab is 'matrix'
app_js_updated = app_js_updated.replace(
    "renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'all'",
    "renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'matrix'"
)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js_updated)

print('app.js successfully updated with Official CACP MSP Matrix Box and Auto-Sync on Login!')
