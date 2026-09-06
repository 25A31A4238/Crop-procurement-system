import re

with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Helper function to get sort label
new_demand_helpers = '''  function getDemandSortLabel(sortType) {
    const labels = {
      'target-desc': 'Target Quota (Highest First)',
      'target': 'Target Quota (Highest First)',
      'target-asc': 'Target Quota (Lowest First)',
      'remaining-desc': 'Open Intake Deficit (Most Urgent)',
      'remaining': 'Open Intake Deficit (Most Urgent)',
      'remaining-asc': 'Open Intake Deficit (Lowest / Near Full)',
      'msp-desc': 'Govt MSP Rate (Highest First)',
      'msp': 'Govt MSP Rate (Highest First)',
      'msp-asc': 'Govt MSP Rate (Lowest First)',
      'name-asc': 'Commodity Name (A to Z)',
      'progress-asc': 'Progress (Lowest / Most Urgent)',
      'progress-desc': 'Progress (Highest / Near Quota)'
    };
    return labels[sortType] || 'Target Quota (Highest First)';
  }'''

# 1. Update renderCropInDemandModuleHtml toolbar section
old_toolbar = '''        <!-- 3. Interactive Category Filter & Search Toolbar -->
        <div class="demand-toolbar">
          <div class="demand-filter-tabs" role="tablist" aria-label="Filter demand crops by category">
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'all' ? 'active' : ''}" onclick="window.filterDemandCategory('all');">All High Demand (10)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'cereals' ? 'active' : ''}" onclick="window.filterDemandCategory('cereals');">Foodgrains / Cereals (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'pulses' ? 'active' : ''}" onclick="window.filterDemandCategory('pulses');">Urgent Pulses / Buffer Deficit (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'oilseeds' ? 'active' : ''}" onclick="window.filterDemandCategory('oilseeds');">Oilseeds Mission (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'commercial' ? 'active' : ''}" onclick="window.filterDemandCategory('commercial');">Commercial / Industrial (1)</button>
          </div>

          <div class="demand-controls-right">
            <div class="demand-search-box">
              <span class="demand-search-icon" aria-hidden="true">🔍</span>
              <input type="text" class="demand-search-input" id="demandCropSearchInput" placeholder="Search crop or agency..." value="${currentDemandSearch}" oninput="window.searchDemandCrops(this.value);" aria-label="Search high demand crops">
            </div>

            <select class="demand-sort-select" id="demandCropSortSelect" onchange="window.sortDemandCrops(this.value);" aria-label="Sort high demand crops">
              <option value="target" ${currentDemandSort === 'target' ? 'selected' : ''}>Sort by: Target Quota (Highest)</option>
              <option value="remaining" ${currentDemandSort === 'remaining' ? 'selected' : ''}>Sort by: Open Intake Deficit</option>
              <option value="msp" ${currentDemandSort === 'msp' ? 'selected' : ''}>Sort by: Highest MSP Rate</option>
            </select>
          </div>
        </div>'''

new_toolbar = '''        <!-- 3. Interactive Category Filter & Search Toolbar -->
        <div class="demand-toolbar">
          <div class="demand-filter-tabs" role="tablist" aria-label="Filter demand crops by category">
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'all' ? 'active' : ''}" onclick="window.filterDemandCategory('all');">All High Demand (10)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'cereals' ? 'active' : ''}" onclick="window.filterDemandCategory('cereals');">Foodgrains / Cereals (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'pulses' ? 'active' : ''}" onclick="window.filterDemandCategory('pulses');">Urgent Pulses / Buffer Deficit (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'oilseeds' ? 'active' : ''}" onclick="window.filterDemandCategory('oilseeds');">Oilseeds Mission (3)</button>
            <button type="button" class="demand-tab-btn ${currentDemandFilter === 'commercial' ? 'active' : ''}" onclick="window.filterDemandCategory('commercial');">Commercial / Industrial (1)</button>
          </div>

          <div class="demand-controls-right" style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <!-- Quick Sort Pills -->
            <div class="demand-sort-pills-wrap" role="group" aria-label="Quick sort crops">
              <span style="font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase;">Sort:</span>
              <button type="button" class="demand-sort-pill ${(currentDemandSort === 'target-desc' || currentDemandSort === 'target') ? 'active' : ''}" data-sort="target-desc" onclick="window.sortDemandCrops('target-desc');" title="Sort by highest target quota">
                📊 Volume
              </button>
              <button type="button" class="demand-sort-pill ${(currentDemandSort === 'remaining-desc' || currentDemandSort === 'remaining') ? 'active' : ''}" data-sort="remaining-desc" onclick="window.sortDemandCrops('remaining-desc');" title="Sort by most urgent remaining deficit">
                ⚡ Deficit
              </button>
              <button type="button" class="demand-sort-pill ${(currentDemandSort === 'msp-desc' || currentDemandSort === 'msp') ? 'active' : ''}" data-sort="msp-desc" onclick="window.sortDemandCrops('msp-desc');" title="Sort by highest MSP price">
                💰 Highest MSP
              </button>
              <button type="button" class="demand-sort-pill ${currentDemandSort === 'name-asc' ? 'active' : ''}" data-sort="name-asc" onclick="window.sortDemandCrops('name-asc');" title="Sort alphabetically A to Z">
                🔤 A-Z
              </button>
            </div>

            <!-- Detailed Sort Dropdown -->
            <select class="demand-sort-select" id="demandCropSortSelect" onchange="window.sortDemandCrops(this.value);" aria-label="Sort high demand crops">
              <option value="target-desc" ${(currentDemandSort === 'target-desc' || currentDemandSort === 'target') ? 'selected' : ''}>Target Quota: High to Low</option>
              <option value="target-asc" ${currentDemandSort === 'target-asc' ? 'selected' : ''}>Target Quota: Low to High</option>
              <option value="remaining-desc" ${(currentDemandSort === 'remaining-desc' || currentDemandSort === 'remaining') ? 'selected' : ''}>Open Deficit: Most Urgent First</option>
              <option value="remaining-asc" ${currentDemandSort === 'remaining-asc' ? 'selected' : ''}>Open Deficit: Lowest First</option>
              <option value="msp-desc" ${(currentDemandSort === 'msp-desc' || currentDemandSort === 'msp') ? 'selected' : ''}>MSP Price: High to Low</option>
              <option value="msp-asc" ${currentDemandSort === 'msp-asc' ? 'selected' : ''}>MSP Price: Low to High</option>
              <option value="name-asc" ${currentDemandSort === 'name-asc' ? 'selected' : ''}>Commodity Name: A to Z</option>
            </select>

            <!-- Search Input -->
            <div class="demand-search-box">
              <span class="demand-search-icon" aria-hidden="true">🔍</span>
              <input type="text" class="demand-search-input" id="demandCropSearchInput" placeholder="Search crop or agency..." value="${currentDemandSearch}" oninput="window.searchDemandCrops(this.value);" aria-label="Search high demand crops">
            </div>

            <!-- Dynamic Active Sort Status Badge -->
            <span class="demand-sort-status-badge" id="demandSortStatusLabel">
              ✓ ${getDemandSortLabel(currentDemandSort)}
            </span>
          </div>
        </div>'''

assert old_toolbar in code, "Could not find old_toolbar"
code = code.replace(old_toolbar, new_toolbar)

# 2. Update renderDemandCardsHtml sorting and dynamic rank pills
old_cards_fn = '''  function renderDemandCardsHtml() {
    let filtered = [...GOVERNMENT_DEMAND_CROPS];

    // Category Filter
    if (currentDemandFilter !== 'all') {
      filtered = filtered.filter(c => c.category === currentDemandFilter);
    }

    // Search Filter
    if (currentDemandSearch && currentDemandSearch.trim() !== '') {
      const q = currentDemandSearch.trim().toLowerCase();
      filtered = filtered.filter(c => 
        c.commodity.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.primaryAgency.toLowerCase().includes(q) ||
        c.procurementPurpose.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (currentDemandSort === 'target') {
      filtered.sort((a, b) => b.nationalTargetQty - a.nationalTargetQty);
    } else if (currentDemandSort === 'remaining') {
      filtered.sort((a, b) => b.remainingDemandQty - a.remainingDemandQty);
    } else if (currentDemandSort === 'msp') {
      filtered.sort((a, b) => (b.mspRate + b.bonusIncentive) - (a.mspRate + a.bonusIncentive));
    }

    if (filtered.length === 0) {
      return `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1.5px dashed #DFC396; border-radius: 12px; padding: 40px 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
          <h4 style="font-size: 16px; font-weight: 700; color: #143525; margin-bottom: 6px;">No Matching High-Demand Crops Found</h4>
          <p style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">Try adjusting your category filter or search query.</p>
          <button type="button" class="btn-demand-action-secondary" onclick="window.filterDemandCategory('all');" style="margin: 0 auto; max-width: 220px;">
            Reset Filter to All (10)
          </button>
        </div>
      `;
    }

    return filtered.map(c => {
      const pctProcured = Math.min(100, Math.round((c.procuredSoFarQty / c.nationalTargetQty) * 100));
      const pctRemaining = 100 - pctProcured;
      const effectiveMsp = c.mspRate + c.bonusIncentive;
      const incentiveTag = c.bonusIncentive > 0 
        ? `<span class="demand-pricing-incentive">+ ₹${c.bonusIncentive}/Qtl Special Buffer Incentive</span>`
        : `<span class="demand-pricing-incentive" style="background: #E0F2FE; color: #0284C7;">Guaranteed 100% Purchase</span>`;

      return `
        <div class="demand-card" data-crop-id="${c.id}">
          <div>
            <div class="demand-card-top-bar">
              <div class="demand-card-badges">
                <span class="demand-rank-pill">${c.rank}</span>
                <span class="demand-urgency-pill ${c.urgency}">${c.urgencyLabel}</span>
              </div>'''

new_cards_fn = '''  function renderDemandCardsHtml() {
    let filtered = [...GOVERNMENT_DEMAND_CROPS];

    // Category Filter
    if (currentDemandFilter !== 'all') {
      filtered = filtered.filter(c => c.category === currentDemandFilter);
    }

    // Search Filter
    if (currentDemandSearch && currentDemandSearch.trim() !== '') {
      const q = currentDemandSearch.trim().toLowerCase();
      filtered = filtered.filter(c => 
        c.commodity.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.primaryAgency.toLowerCase().includes(q) ||
        c.procurementPurpose.toLowerCase().includes(q)
      );
    }

    // Comprehensive Sorting
    if (currentDemandSort === 'target-desc' || currentDemandSort === 'target') {
      filtered.sort((a, b) => b.nationalTargetQty - a.nationalTargetQty);
    } else if (currentDemandSort === 'target-asc') {
      filtered.sort((a, b) => a.nationalTargetQty - b.nationalTargetQty);
    } else if (currentDemandSort === 'remaining-desc' || currentDemandSort === 'remaining') {
      filtered.sort((a, b) => b.remainingDemandQty - a.remainingDemandQty);
    } else if (currentDemandSort === 'remaining-asc') {
      filtered.sort((a, b) => a.remainingDemandQty - b.remainingDemandQty);
    } else if (currentDemandSort === 'msp-desc' || currentDemandSort === 'msp') {
      filtered.sort((a, b) => (b.mspRate + b.bonusIncentive) - (a.mspRate + a.bonusIncentive));
    } else if (currentDemandSort === 'msp-asc') {
      filtered.sort((a, b) => (a.mspRate + a.bonusIncentive) - (b.mspRate + b.bonusIncentive));
    } else if (currentDemandSort === 'name-asc') {
      filtered.sort((a, b) => a.commodity.localeCompare(b.commodity));
    }

    if (filtered.length === 0) {
      return `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1.5px dashed #DFC396; border-radius: 12px; padding: 40px 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
          <h4 style="font-size: 16px; font-weight: 700; color: #143525; margin-bottom: 6px;">No Matching High-Demand Crops Found</h4>
          <p style="font-size: 13px; color: #6B7280; margin-bottom: 16px;">Try adjusting your category filter or search query.</p>
          <button type="button" class="btn-demand-action-secondary" onclick="window.filterDemandCategory('all');" style="margin: 0 auto; max-width: 220px;">
            Reset Filter to All (10)
          </button>
        </div>
      `;
    }

    return filtered.map((c, index) => {
      const rankNum = index + 1;
      const pctProcured = Math.min(100, Math.round((c.procuredSoFarQty / c.nationalTargetQty) * 100));
      const pctRemaining = 100 - pctProcured;
      const effectiveMsp = c.mspRate + c.bonusIncentive;
      const incentiveTag = c.bonusIncentive > 0 
        ? `<span class="demand-pricing-incentive">+ ₹${c.bonusIncentive}/Qtl Special Buffer Incentive</span>`
        : `<span class="demand-pricing-incentive" style="background: #E0F2FE; color: #0284C7;">Guaranteed 100% Purchase</span>`;

      return `
        <div class="demand-card" data-crop-id="${c.id}">
          <div>
            <div class="demand-card-top-bar">
              <div class="demand-card-badges">
                <span class="demand-rank-pill" title="Sorted Rank #${rankNum} in current view">Rank #${rankNum}</span>
                <span class="demand-urgency-pill ${c.urgency}">${c.urgencyLabel}</span>
              </div>'''

assert old_cards_fn in code, "Could not find old_cards_fn"
code = code.replace(old_cards_fn, new_cards_fn)

# 3. Update window.sortDemandCrops and add initDemandModuleEvents
old_sort_window = '''  window.sortDemandCrops = function(sortType) {
    currentDemandSort = sortType;
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }
  };'''

new_sort_window = '''  function initDemandModuleEvents() {
    const sortSelect = document.getElementById('demandCropSortSelect');
    if (sortSelect) {
      sortSelect.value = currentDemandSort;
      sortSelect.onchange = (e) => {
        window.sortDemandCrops(e.target.value);
      };
    }

    const searchInput = document.getElementById('demandCropSearchInput');
    if (searchInput) {
      searchInput.value = currentDemandSearch;
      searchInput.oninput = (e) => {
        window.searchDemandCrops(e.target.value);
      };
    }
  }

  window.sortDemandCrops = function(sortType) {
    currentDemandSort = sortType;

    // Update select element value
    const select = document.getElementById('demandCropSortSelect');
    if (select && select.value !== sortType) {
      select.value = sortType;
    }

    // Update quick sort pills
    const sortPills = document.querySelectorAll('.demand-sort-pill');
    sortPills.forEach(pill => {
      const pSort = pill.getAttribute('data-sort');
      if (pSort === sortType || (pSort === 'target-desc' && sortType === 'target') || (pSort === 'remaining-desc' && sortType === 'remaining') || (pSort === 'msp-desc' && sortType === 'msp')) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update active sort status badge
    const statusLabel = document.getElementById('demandSortStatusLabel');
    if (statusLabel) {
      statusLabel.textContent = `✓ ${getDemandSortLabel(sortType)}`;
    }

    // Re-render cards container
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }

    showToast(`📊 Sorted crops by: ${getDemandSortLabel(sortType)}`, 'info');
  };'''

assert old_sort_window in code, "Could not find old_sort_window"
code = code.replace(old_sort_window, new_sort_window)

# 4. Insert getDemandSortLabel right above renderCropInDemandModuleHtml
target_render_fn = "  function renderCropInDemandModuleHtml() {"
assert target_render_fn in code, "Could not find target_render_fn"
code = code.replace(target_render_fn, new_demand_helpers + "\n\n" + target_render_fn)

# 5. In openModuleDetail, call initDemandModuleEvents() when moduleKey === 'crop-in-demand'
old_post_open = '''    // If schedule module is opened, render dynamic CACP table content
    if (moduleKey === 'schedule') {
      renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'matrix', CACP_MSP_STORE.currentSearch || '');
    }'''

new_post_open = '''    // If crop-in-demand module is opened, initialize listeners
    if (moduleKey === 'crop-in-demand') {
      initDemandModuleEvents();
    }

    // If schedule module is opened, render dynamic CACP table content
    if (moduleKey === 'schedule') {
      renderCacpScheduleContent(CACP_MSP_STORE.currentTab || 'matrix', CACP_MSP_STORE.currentSearch || '');
    }'''

assert old_post_open in code, "Could not find old_post_open"
code = code.replace(old_post_open, new_post_open)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied fixed sorting, quick sort pills, dynamic rank numbering, and event listeners successfully!")
