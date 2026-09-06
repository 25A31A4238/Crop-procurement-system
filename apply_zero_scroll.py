import re

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Let's inspect where renderCacpScheduleContent is defined in app.js
pattern = r"  function renderCacpScheduleContent\(tab = 'matrix', search = ''\) \{[\s\S]*?  \}"

replacement = """  let cacpMatrixRange = 'recent'; // 'recent' (2021-2027) or 'all' (2010-2027)

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
      const matrixYears = cacpMatrixRange === 'recent'
        ? ['2026', '2025', '2024', '2023', '2022', '2021']
        : ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
      
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
              <span>🏛️ Crop &amp; Year-wise Minimum Support Price (MSP) Matrix</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <div class="matrix-range-toggle" role="group" aria-label="Year Range Filter">
                <button type="button" class="matrix-range-btn ${cacpMatrixRange === 'recent' ? 'active' : ''}" onclick="window.setMatrixRange('recent');" title="Display Recent 6 Marketing Years in spacious zero-scroll layout">⚡ Recent Years (2021–2027)</button>
                <button type="button" class="matrix-range-btn ${cacpMatrixRange === 'all' ? 'active' : ''}" onclick="window.setMatrixRange('all');" title="Display Full 17-Year Historical MSP Archive">📜 Full Archive (2010–2027)</button>
              </div>
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
          <div style="background: #FAF7F2; padding: 8px 16px; border-top: 1px solid #E8DEC8; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 11px; color: #64746A;">
            <div><strong>Official Legend:</strong> <span style="color:#55665B; margin-right: 12px;"><strong>Rec</strong> = Recommended by CACP</span> <span style="color:#143525;"><strong>Fixed</strong> = Approved Cabinet MSP</span></div>
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

    // Standard Operational Views (kharif, rabi, commercial)
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
  }"""

match = re.search(pattern, app_js)
assert match, "Could not find renderCacpScheduleContent in app.js"

app_js_updated = app_js[:match.start()] + replacement + app_js[match.end():]

# Also ensure window.setMatrixRange is registered
if "window.setMatrixRange" not in app_js_updated:
    app_js_updated = app_js_updated.replace(
        "window.renderCacpScheduleContent = renderCacpScheduleContent;",
        "window.renderCacpScheduleContent = renderCacpScheduleContent;\n  window.setMatrixRange = function(rangeKey) { cacpMatrixRange = rangeKey; renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'matrix', CACP_MSP_STORE.currentSearch || ''); };"
    )

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js_updated)

print('app.js successfully updated with range selector and optimized layout!')
