import re

demand_module_code = '''
  // ==========================================================================
  // MODULE 02: CROP IN DEMAND (HIGH QUANTITY GOVERNMENT PROCUREMENT TARGETS)
  // Replicating official Central Pool, FCI, NAFED, PM-AASHA & CACP quota drives
  // ==========================================================================
  const GOVERNMENT_DEMAND_CROPS = [
    {
      id: 'paddy-common',
      commodity: 'Paddy Common',
      category: 'cereals',
      categoryLabel: 'Major Foodgrain (Cereal)',
      season: 'Kharif Crops',
      icon: '🌾',
      nationalTargetQty: 540.0,
      procuredSoFarQty: 392.4,
      remainingDemandQty: 147.6,
      unit: 'Lakh Metric Tonnes (LMT)',
      urgency: 'critical',
      urgencyLabel: 'CRITICAL NATIONAL DEMAND',
      rank: '#1 Highest Quantity',
      primaryAgency: 'FCI & State Civil Supplies',
      procurementPurpose: 'National Food Security Act (NFSA), PMGKAY free grain distribution & 4-Month Central Strategic Buffer Reserve.',
      mspRate: 2300,
      bonusIncentive: 0,
      specialPerks: '100% guaranteed intake at all centers, express weighbridge gate clearance, 24-hr DBT payout settlement.',
      centerIntakeStatus: 'High Volume Intake Active',
      moistureSpec: 'Up to 17.0% Moisture FAQ allowed',
      scheduleTargetCrop: 'Paddy Common'
    },
    {
      id: 'wheat',
      commodity: 'Wheat',
      category: 'cereals',
      categoryLabel: 'Major Foodgrain (Cereal)',
      season: 'Rabi Crops',
      icon: '🌾',
      nationalTargetQty: 320.0,
      procuredSoFarQty: 266.0,
      remainingDemandQty: 54.0,
      unit: 'Lakh Metric Tonnes (LMT)',
      urgency: 'critical',
      urgencyLabel: 'CRITICAL NATIONAL DEMAND',
      rank: '#2 Strategic Reserve',
      primaryAgency: 'FCI & State Agencies',
      procurementPurpose: 'Central Pool Stock Replenishment, OMSS Market Stabilization & Public Distribution System (PDS).',
      mspRate: 2425,
      bonusIncentive: 0,
      specialPerks: 'Zero quantity cap per verified farmer. Inter-district transport rebate of ₹50/Qtl for >25 km transit.',
      centerIntakeStatus: 'Strategic Intake Open',
      moistureSpec: 'Moisture ≤ 12.0% FAQ standard',
      scheduleTargetCrop: 'Wheat'
    },
    {
      id: 'tur-arhar',
      commodity: 'Tur (Arhar)',
      category: 'pulses',
      categoryLabel: 'Urgent Buffer Deficit Pulse',
      season: 'Kharif Crops',
      icon: '🫘',
      nationalTargetQty: 40.0,
      procuredSoFarQty: 18.2,
      remainingDemandQty: 21.8,
      unit: 'Lakh Quintals',
      urgency: 'urgent',
      urgencyLabel: 'URGENT BUFFER DEFICIT',
      rank: '#1 Pulse Deficit',
      primaryAgency: 'NAFED & NCCF',
      procurementPurpose: 'Price Stabilization Fund (PSF) Pulse Buffer Drive to combat domestic price spikes & curb import dependence.',
      mspRate: 7550,
      bonusIncentive: 250,
      specialPerks: '100% Procurement Guarantee without state ceiling limit + ₹250/Qtl Direct Buffer Incentive on spot.',
      centerIntakeStatus: 'Urgent Procurement Priority',
      moistureSpec: 'Moisture ≤ 12.0% • Foreign matter ≤ 2.0%',
      scheduleTargetCrop: 'Tur (Arhar)'
    },
    {
      id: 'maize',
      commodity: 'Maize',
      category: 'cereals',
      categoryLabel: 'Biofuel & Industrial Cereal',
      season: 'Kharif Crops',
      icon: '🌽',
      nationalTargetQty: 65.0,
      procuredSoFarQty: 38.0,
      remainingDemandQty: 27.0,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH INDUSTRIAL DEMAND',
      rank: 'Surging Demand',
      primaryAgency: 'NAFED, NCCF & FCI',
      procurementPurpose: 'National Ethanol Blending Programme (EBP - 20% by 2025-26) for Grain-Based Distilleries & Poultry Nutrition.',
      mspRate: 2225,
      bonusIncentive: 0,
      specialPerks: 'Direct tie-up procurement for biofuel distilleries with guaranteed MSP and immediate weighing token clearance.',
      centerIntakeStatus: 'Active Biofuel Quota Open',
      moistureSpec: 'Moisture ≤ 14.0% (Relaxed FAQ standards)',
      scheduleTargetCrop: 'Maize'
    },
    {
      id: 'urad',
      commodity: 'Urad',
      category: 'pulses',
      categoryLabel: 'High Priority Pulse',
      season: 'Kharif Crops',
      icon: '🫘',
      nationalTargetQty: 35.0,
      procuredSoFarQty: 16.5,
      remainingDemandQty: 18.5,
      unit: 'Lakh Quintals',
      urgency: 'urgent',
      urgencyLabel: 'URGENT BUFFER DEFICIT',
      rank: '#2 Pulse Deficit',
      primaryAgency: 'NAFED',
      procurementPurpose: 'Central Strategic Pulse Buffer Stock & Defense Services Supply under Price Support Scheme (PSS).',
      mspRate: 7400,
      bonusIncentive: 200,
      specialPerks: 'Assured purchase under PM-AASHA with instant digital moisture assaying and zero broker commissions.',
      centerIntakeStatus: 'Direct NAFED Intake Active',
      moistureSpec: 'Moisture ≤ 12.0% • FAQ Grade',
      scheduleTargetCrop: 'Urad'
    },
    {
      id: 'rapeseed-mustard',
      commodity: 'Rapeseed/ Mustard',
      category: 'oilseeds',
      categoryLabel: 'National Edible Oil Mission',
      season: 'Rabi Crops',
      icon: '🌼',
      nationalTargetQty: 32.0,
      procuredSoFarQty: 21.4,
      remainingDemandQty: 10.6,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH EDIBLE OIL DEMAND',
      rank: '#1 Oilseed Demand',
      primaryAgency: 'NAFED & State Oil Federations',
      procurementPurpose: 'National Mission on Edible Oils - Oilseeds (NMEO-OS) to eliminate foreign cooking oil import dependence.',
      mspRate: 5950,
      bonusIncentive: 150,
      specialPerks: 'Direct cooperative milling intake with oil-content premium bonus up to ₹150/Qtl for >40% oil content.',
      centerIntakeStatus: 'High Volume Intake Open',
      moistureSpec: 'Moisture ≤ 8.0% • Oil content ≥ 38.0%',
      scheduleTargetCrop: 'Rapeseed/ Mustard'
    },
    {
      id: 'gram',
      commodity: 'Gram',
      category: 'pulses',
      categoryLabel: 'Strategic Protein Reserve',
      season: 'Rabi Crops',
      icon: '🫘',
      nationalTargetQty: 30.0,
      procuredSoFarQty: 22.5,
      remainingDemandQty: 7.5,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH VOLUME DEMAND',
      rank: 'Top Volume Pulse',
      primaryAgency: 'NAFED',
      procurementPurpose: 'Pulses Price Stabilization, Armed Forces Rationing & PM-POSHAN Mid-Day Meal Protein Allocation.',
      mspRate: 5650,
      bonusIncentive: 0,
      specialPerks: 'Smooth electronic weighbridge tokening, zero market fees or statutory deductions for registered farmers.',
      centerIntakeStatus: 'Intake Active',
      moistureSpec: 'Moisture ≤ 10.0% • Admixture ≤ 2.0%',
      scheduleTargetCrop: 'Gram'
    },
    {
      id: 'soyabean-yellow',
      commodity: 'Soyabean Yellow',
      category: 'oilseeds',
      categoryLabel: 'National Protein & Oil Drive',
      season: 'Kharif Crops',
      icon: '🫘',
      nationalTargetQty: 28.0,
      procuredSoFarQty: 17.8,
      remainingDemandQty: 10.2,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH VOLUME DEMAND',
      rank: '#2 Oilseed Demand',
      primaryAgency: 'NAFED & State Federations',
      procurementPurpose: 'Domestic Soya Oil Extraction & Non-GMO High-Protein Meal for National Dairy & Poultry Infrastructure.',
      mspRate: 4892,
      bonusIncentive: 0,
      specialPerks: 'Assured purchase under PM-AASHA with instant assaying report and direct bank voucher release.',
      centerIntakeStatus: 'Intake Active',
      moistureSpec: 'Moisture ≤ 12.0% • Foreign matter ≤ 2.0%',
      scheduleTargetCrop: 'Soyabean Yellow'
    },
    {
      id: 'cotton-medium',
      commodity: 'Medium Staple Cotton',
      category: 'commercial',
      categoryLabel: 'Commercial & Textile Pool',
      season: 'Kharif Crops',
      icon: '☁️',
      nationalTargetQty: 70.0,
      procuredSoFarQty: 46.5,
      remainingDemandQty: 23.5,
      unit: 'Lakh Bales (~170kg)',
      urgency: 'high',
      urgencyLabel: 'HIGH INDUSTRIAL DEMAND',
      rank: 'Commercial Leader',
      primaryAgency: 'Cotton Corporation of India (CCI)',
      procurementPurpose: 'Domestic Textile Mill Buffer Security, Cotton Price Stabilization & Export Buffer Reserves.',
      mspRate: 7121,
      bonusIncentive: 0,
      specialPerks: 'Electronic moisture testers installed at all intake centers. Moisture up to 8% standard, relaxed to 12% with prorated chart.',
      centerIntakeStatus: 'CCI Centers Operational',
      moistureSpec: 'Moisture 8% to 12% FAQ Grade',
      scheduleTargetCrop: 'Medium Staple Cotton'
    },
    {
      id: 'groundnut',
      commodity: 'Groundnut',
      category: 'oilseeds',
      categoryLabel: 'Domestic Edible Oil Buffer',
      season: 'Kharif Crops',
      icon: '🥜',
      nationalTargetQty: 22.0,
      procuredSoFarQty: 14.2,
      remainingDemandQty: 7.8,
      unit: 'Lakh Quintals',
      urgency: 'high',
      urgencyLabel: 'HIGH VOLUME DEMAND',
      rank: 'High Demand Pod',
      primaryAgency: 'NAFED & State Oilseed Unions',
      procurementPurpose: 'Domestic Groundnut Oil Reserves and HPS Export Grade Quality Buffer Stock Maintenance.',
      mspRate: 6783,
      bonusIncentive: 0,
      specialPerks: 'Spot weighment and electronic assaying certification. No deduction for pod size variations within FAQ standards.',
      centerIntakeStatus: 'Intake Active',
      moistureSpec: 'Moisture in pods ≤ 8.0%',
      scheduleTargetCrop: 'Groundnut'
    }
  ];

  let currentDemandFilter = 'all';
  let currentDemandSort = 'target';
  let currentDemandSearch = '';

  function renderCropInDemandModuleHtml() {
    return `
      <div class="demand-container">
        <!-- 1. Government Official Demand Banner -->
        <div class="demand-hero-bar">
          <div class="demand-hero-title-wrap">
            <div class="demand-hero-icon" aria-hidden="true">🏛️</div>
            <div>
              <span class="demand-hero-badge">NATIONAL PROCUREMENT TARGETS &amp; BUFFER QUOTAS</span>
              <h3 class="demand-hero-heading">High-Demand Government Procurement Produce</h3>
              <p class="demand-hero-sub">
                Official commodities required in high volume for National Food Security, central strategic buffer stocks, ethanol blending, and domestic edible oil self-reliance.
              </p>
            </div>
          </div>
          <div class="demand-hero-stats-pill">
            <span class="demand-hero-stats-val">920+ LMT / Qtl</span>
            <span class="demand-hero-stats-lbl">National Strategic Quota</span>
          </div>
        </div>

        <!-- 2. Top 4 Quantitative Demand KPI Summary -->
        <div class="demand-kpi-grid">
          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #FEE2E2; color: #DC2626;">🏆 #1 VOLUME FOODGRAIN</span>
              <span style="font-size: 14px;">🌾</span>
            </div>
            <div class="demand-kpi-val">540.0 LMT</div>
            <div class="demand-kpi-lbl">Paddy Common / Rice Target</div>
            <span class="demand-kpi-sub">147.6 LMT Open for Farmer Intake</span>
          </div>

          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #FEF3C7; color: #B45309;">🌾 STRATEGIC BREADBASKET</span>
              <span style="font-size: 14px;">🌾</span>
            </div>
            <div class="demand-kpi-val">320.0 LMT</div>
            <div class="demand-kpi-lbl">Wheat Central Reserve Target</div>
            <span class="demand-kpi-sub">54.0 LMT Open for Farmer Intake</span>
          </div>

          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #FEF3C7; color: #B45309;">⚡ CRITICAL DEFICIT PULSE</span>
              <span style="font-size: 14px;">🫘</span>
            </div>
            <div class="demand-kpi-val">40.0 L Qtl</div>
            <div class="demand-kpi-lbl">Tur (Arhar) Buffer Drive</div>
            <span class="demand-kpi-sub" style="color: #DC2626;">21.8 L Qtl Deficit • 100% Assured Purchase</span>
          </div>

          <div class="demand-kpi-card">
            <div class="demand-kpi-top">
              <span class="demand-kpi-badge" style="background: #ECFDF5; color: #059669;">🌽 BIOFUEL 20% MISSION</span>
              <span style="font-size: 14px;">🌽</span>
            </div>
            <div class="demand-kpi-val">65.0 L Qtl</div>
            <div class="demand-kpi-lbl">Maize Ethanol Intake Quota</div>
            <span class="demand-kpi-sub">27.0 L Qtl Active Open Quota</span>
          </div>
        </div>

        <!-- 3. Interactive Category Filter & Search Toolbar -->
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
        </div>

        <!-- 4. Dynamic Cards Container -->
        <div class="demand-cards-grid" id="demandCardsContainer">
          ${renderDemandCardsHtml()}
        </div>

        <!-- 5. Strategic Guidance for Farmers on Selling High-Demand Crops -->
        <div class="demand-guidance-box">
          <div class="demand-guidance-heading">
            <span>🌾</span>
            <span>Why Farmers Should Prioritize Selling High-Demand Government Crops:</span>
          </div>
          <div class="demand-benefits-grid">
            <div class="demand-benefit-item">
              <strong>1. Guaranteed Purchase Price</strong>
              <p>Government guarantees procurement at or above official CACP MSP benchmarks with zero distress selling risk.</p>
            </div>
            <div class="demand-benefit-item">
              <strong>2. Zero Middleman Commissions</strong>
              <p>Direct weighbridge intake at cooperative centers with zero commission fees, arbitrary cuts, or hidden deductions.</p>
            </div>
            <div class="demand-benefit-item">
              <strong>3. Direct Benefit Transfer (DBT)</strong>
              <p>100% verified digital payment transferred directly to your Aadhaar-seeded bank account within 24 to 48 hours.</p>
            </div>
            <div class="demand-benefit-item">
              <strong>4. Priority Intake Slots</strong>
              <p>High-demand quotas receive expedited convoy tokens, dedicated unloading bays, and faster gate clearance.</p>
            </div>
          </div>
        </div>

        <!-- 6. Inter-Module Navigation Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: #FAF7F2; border: 1px solid #DFC396; border-radius: 10px; padding: 12px 18px; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 12.5px; font-weight: 700; color: #143525;">
            Ready to schedule produce delivery for high-demand quotas?
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn-demand-action-secondary" onclick="window.goToSchedule();" style="padding: 6px 14px; font-size: 11.5px;">
              ← Back to Schedule (01)
            </button>
            <button type="button" class="btn-demand-action-primary" onclick="window.goToFormFilling();" style="padding: 6px 16px; font-size: 11.5px;">
              Proceed to Form Filling (03) →
            </button>
            <button type="button" class="btn-demand-action-primary" onclick="window.goToSlotBooking();" style="padding: 6px 16px; font-size: 11.5px; background: #9A6818;">
              Book Center Slot (04) →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderDemandCardsHtml() {
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
              </div>
              <span class="badge-tag badge-neutral" style="font-size: 10px; font-weight: 700;">${c.season}</span>
            </div>

            <div class="demand-card-crop-row">
              <div class="demand-crop-avatar" aria-hidden="true">${c.icon}</div>
              <div style="flex: 1;">
                <h4 class="demand-crop-title">${c.commodity}</h4>
                <div class="demand-crop-category">
                  <span>${c.categoryLabel}</span> • <span style="color: #1E824C; font-weight: 700;">${c.primaryAgency}</span>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="demand-progress-wrap">
              <div class="demand-progress-header">
                <span style="color: #143525;">Progress: <strong>${pctProcured}% Procured</strong></span>
                <span style="color: #B45309;">Remaining Deficit: <strong>${c.remainingDemandQty} ${c.unit.split(' ')[0]}</strong></span>
              </div>
              <div class="demand-progress-bar-track" title="${pctProcured}% Procured, ${pctRemaining}% Open Intake">
                <div class="demand-progress-bar-fill" style="width: ${pctProcured}%;"></div>
                <div class="demand-progress-bar-remaining" style="width: ${pctRemaining}%;"></div>
              </div>
            </div>

            <!-- 3-Column Quantity Numbers -->
            <div class="demand-qty-grid">
              <div class="demand-qty-item">
                <span class="demand-qty-val">${c.nationalTargetQty}</span>
                <span class="demand-qty-lbl">Govt Target (${c.unit.split(' ')[0]})</span>
              </div>
              <div class="demand-qty-item">
                <span class="demand-qty-val" style="color: #059669;">${c.procuredSoFarQty}</span>
                <span class="demand-qty-lbl">Procured So Far</span>
              </div>
              <div class="demand-qty-item">
                <span class="demand-qty-val remaining">${c.remainingDemandQty}</span>
                <span class="demand-qty-lbl">Open Intake Quota</span>
              </div>
            </div>

            <!-- MSP & Incentive Box -->
            <div class="demand-pricing-box">
              <span class="demand-pricing-rate">Govt MSP: ₹${c.mspRate.toLocaleString('en-IN')}/Qtl</span>
              ${incentiveTag}
            </div>

            <!-- Purpose Box -->
            <div class="demand-purpose-box">
              <strong>Govt Purpose:</strong> ${c.procurementPurpose}
            </div>

            <!-- Perks Summary -->
            <div style="font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 14px;">
              ✨ ${c.specialPerks}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="demand-card-actions">
            <button type="button" class="btn-demand-action-primary" onclick="window.selectCropAndBookSlot('${c.scheduleTargetCrop}');" title="Pre-select ${c.commodity} and proceed to slot booking">
              <span>🚀 Sell This Crop (Book Slot)</span>
            </button>
            <button type="button" class="btn-demand-action-secondary" onclick="window.selectCropAndFillForm('${c.scheduleTargetCrop}');" title="Pre-select ${c.commodity} in produce registration">
              <span>📝 Register Land</span>
            </button>
            <button type="button" class="btn-demand-action-secondary" onclick="window.openCropInSchedule('${c.scheduleTargetCrop}');" title="View historical price trend and CACP matrix" style="flex: 0.6; padding: 8px 6px;">
              <span>📊 Matrix</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.filterDemandCategory = function(cat) {
    currentDemandFilter = cat;
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }
    const tabs = document.querySelectorAll('.demand-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('onclick')?.includes(`'${cat}'`)) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  };

  window.sortDemandCrops = function(sortType) {
    currentDemandSort = sortType;
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }
  };

  window.searchDemandCrops = function(query) {
    currentDemandSearch = query;
    const container = document.getElementById('demandCardsContainer');
    if (container) {
      container.innerHTML = renderDemandCardsHtml();
    }
  };

  window.selectCropAndBookSlot = function(cropName) {
    // 1. Pre-register crop if not already set
    const currentCrop = localStorage.getItem('cpc_submitted_crop');
    if (!currentCrop) {
      localStorage.setItem('cpc_submitted_crop', cropName);
      localStorage.setItem('cpc_submitted_qty', '50.00');
      localStorage.setItem('cpc_submitted_survey', 'Survey #402/1A');
    }

    // 2. Open Slot Booking (Module 04)
    openModuleDetail('slot-booking');
    showToast(`🌾 Pre-selected ${cropName} for Priority Weighbridge Intake Slot Booking!`, 'success');
  };

  window.selectCropAndFillForm = function(cropName) {
    openModuleDetail('form-filling');
    setTimeout(() => {
      const select = document.getElementById('ffCrop');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.includes(cropName) || cropName.includes(select.options[i].value)) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
    }, 100);
    showToast(`📝 Pre-selected ${cropName} in Produce Registration Form!`, 'info');
  };

  window.goToCropInDemand = function() {
    openModuleDetail('crop-in-demand');
  };
'''

print("Checking demand module code for forbidden terms...")
assert 'mandi' not in demand_module_code.lower(), "Forbidden word found!"
print("Demand module code is clean!")
