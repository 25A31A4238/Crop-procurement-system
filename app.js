/**
 * Crop Procurement Center - Farmer Login & Portal Interactions
 * Connected Architecture for Ministry of Consumer Affairs, Food & Public Distribution
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const loginForm = document.getElementById('loginForm');
  const mobileInput = document.getElementById('mobileNumber');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const iconEye = togglePasswordBtn?.querySelector('.icon-eye');
  const iconEyeOff = togglePasswordBtn?.querySelector('.icon-eye-off');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = loginBtn?.querySelector('.btn-text');
  const btnArrow = loginBtn?.querySelector('.btn-arrow');
  const btnLoader = loginBtn?.querySelector('.btn-loader');
  const toastContainer = document.getElementById('toastContainer');

  // Modal elements
  const openRegisterBtn = document.getElementById('openRegisterBtn');
  const closeRegisterBtn = document.getElementById('closeRegisterBtn');
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');

  // Dashboard & Modal Elements
  const loginScreen = document.getElementById('loginScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const logoutBtn = document.getElementById('logoutBtn');
  const dashFarmerName = document.getElementById('dashFarmerName');
  const dashFarmerMobile = document.getElementById('dashFarmerMobile');
  
  const dashDetailModal = document.getElementById('dashDetailModal');
  const closeDashModalBtn = document.getElementById('closeDashModalBtn');
  const dashModalCategory = document.getElementById('dashModalCategory');
  const dashModalTitle = document.getElementById('dashModalTitle');
  const dashModalBody = document.getElementById('dashModalBody');
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const moduleCards = document.querySelectorAll('.module-card');

  // Receipt Modal Elements
  const receiptModal = document.getElementById('receiptModal');
  const closeReceiptBtn = document.getElementById('closeReceiptBtn');
  const receiptModalBody = document.getElementById('receiptModalBody');

  // --- Constants & MSP Registry ---
  const CROP_MSP_RATES = {
    'Wheat': 2275,
    'Paddy / Rice': 2183,
    'Mustard': 5650,
    'Soybean': 4600,
    'Cotton': 7020,
    'Gram / Chana': 5440,
    'Maize': 2090
  };

  // --- Stored State / Persistent Database Simulation ---
  let farmerBank = {
    account: localStorage.getItem('cpc_bank_account') || '',
    ifsc: localStorage.getItem('cpc_bank_ifsc') || ''
  };

  let slotState = {
    morning: parseInt(localStorage.getItem('cpc_slot_morning') || '10', 10),
    afternoon: parseInt(localStorage.getItem('cpc_slot_afternoon') || '10', 10),
    center: 'STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)',
    tokenNumber: 'TK-8492'
  };

  let isSlotBooked = localStorage.getItem('cpc_slot_booked') === 'true';
  let isTimerCompleted = localStorage.getItem('cpc_timer_completed') === 'true';
  let countdownSeconds = parseInt(localStorage.getItem('cpc_countdown_seconds') || '15', 10);
  let countdownInterval = null;
  let bookedSlotDetails = {
    date: localStorage.getItem('cpc_booked_date') || '2026-09-05',
    slot: localStorage.getItem('cpc_booked_slot') || 'Morning Slot (08:00 AM - 12:00 PM)'
  };

  let registeredFarmer = {
    name: localStorage.getItem('cpc_farmer_name') || 'Rahul',
    mobile: localStorage.getItem('cpc_farmer_mobile') || '9876543210'
  };

  // Pre-fill remembered credentials if any
  const savedMobile = localStorage.getItem('cpc_farmer_mobile');
  if (savedMobile && mobileInput) {
    mobileInput.value = savedMobile;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  // --- 1. Password Visibility Toggle ---
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      if (iconEye && iconEyeOff) {
        iconEye.classList.toggle('hidden', isPassword);
        iconEyeOff.classList.toggle('hidden', !isPassword);
      }
    });
  }

  // --- 2. Format Mobile Input on Typing ---
  if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
      clearFieldError('mobileGroup');
      let val = e.target.value.replace(/[^\d\s+]/g, '');
      e.target.value = val;
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      clearFieldError('passwordGroup');
    });
  }

  // --- 3. Login Form Submit Handler -> Transition to Dashboard Interface ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const mobileVal = mobileInput.value.trim();
      const passwordVal = passwordInput.value.trim();
      let isValid = true;

      // Validate Mobile Number
      const digitsOnly = mobileVal.replace(/\D/g, '');
      if (!mobileVal) {
        setFieldError('mobileGroup', 'mobileError', 'Please enter your registered mobile number');
        isValid = false;
      } else if (digitsOnly.length < 10) {
        setFieldError('mobileGroup', 'mobileError', 'Mobile number must be at least 10 digits');
        isValid = false;
      }

      // Validate Password
      if (!passwordVal) {
        setFieldError('passwordGroup', 'passwordError', 'Please enter your password');
        isValid = false;
      } else if (passwordVal.length < 4) {
        setFieldError('passwordGroup', 'passwordError', 'Password must be at least 4 characters');
        isValid = false;
      }

      if (!isValid) return;

      // Handle Remember Me
      if (rememberMeCheckbox?.checked) {
        localStorage.setItem('cpc_farmer_mobile', mobileVal);
      } else {
        localStorage.removeItem('cpc_farmer_mobile');
      }

      // Button loading state
      setButtonLoading(true);

      setTimeout(() => {
        setButtonLoading(false);
        
        // Move previous session's latest payment to past received list
        moveLatestPaymentToPast();

        // Reset produce, weight, and bank details so the user enters fresh values every time
        localStorage.removeItem('cpc_submitted_crop');
        localStorage.removeItem('cpc_submitted_qty');
        localStorage.removeItem('cpc_bank_account');
        localStorage.removeItem('cpc_bank_ifsc');
        localStorage.removeItem('cpc_slot_booked');
        localStorage.removeItem('cpc_timer_completed');
        localStorage.removeItem('cpc_countdown_seconds');
        localStorage.removeItem('cpc_procurement_finalized');
        farmerBank.account = '';
        farmerBank.ifsc = '';
        isSlotBooked = false;
        isTimerCompleted = false;
        countdownSeconds = 15;
        clearInterval(countdownInterval);

        // Toast message
        showToast('Farmer Login Successful — Welcome to Portal', 'success');

        // Reset past notifications to zero on fresh farmer login
        resetNotificationCenter();

        // Update dashboard farmer profile
        if (dashFarmerMobile) dashFarmerMobile.textContent = '+91 ' + (mobileVal || registeredFarmer.mobile);
        if (dashFarmerName) dashFarmerName.textContent = registeredFarmer.name || 'Rahul';

        // Switch screens smoothly
        if (loginScreen && dashboardScreen) {
          loginScreen.classList.add('hidden');
          dashboardScreen.classList.remove('hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 600);
    });
  }

  // --- 4. Notification Bell System with Deep-Links ---
  const notifBadge = notifBtn?.querySelector('.notif-badge');
  const notifCountTag = notifDropdown?.querySelector('.notif-count-tag');
  const notifList = notifDropdown?.querySelector('.notif-list');

  function resetNotificationCenter() {
    if (notifBadge) {
      notifBadge.textContent = '0';
      notifBadge.classList.add('zero');
    }
    if (notifCountTag) {
      notifCountTag.textContent = '0 New';
    }
    if (notifList) {
      notifList.innerHTML = `
        <div class="notif-empty-state" style="padding: 24px 16px; text-align: center; color: #64746A; font-size: 13px;">
          <p style="font-weight: 600; margin-bottom: 4px; color: #3E4B41;">No new notifications</p>
          <p style="font-size: 12px; color: #7B8B7F; line-height: 1.4;">Live center alerts, form confirmations, and DBT settlements will appear here.</p>
        </div>
      `;
    }
  }

  function addNotificationAlert(title, message, targetModule = 'form-filling') {
    if (!notifList) return;

    const emptyState = notifList.querySelector('.notif-empty-state');
    if (emptyState) emptyState.remove();

    const notifItem = document.createElement('div');
    notifItem.className = 'notif-item unread';
    notifItem.setAttribute('data-target-module', targetModule);
    notifItem.setAttribute('title', 'Click to open service directly');
    notifItem.innerHTML = `
      <span class="notif-dot"></span>
      <div class="notif-item-content">
        <p class="notif-title">${title}</p>
        <p class="notif-text">${message}</p>
        <span class="notif-time">Just now • Click to open →</span>
      </div>
    `;

    notifItem.addEventListener('click', () => {
      notifDropdown.classList.add('hidden');
      openModuleDetail(targetModule);
    });

    notifList.prepend(notifItem);

    if (notifBadge) {
      let count = parseInt(notifBadge.textContent || '0', 10) || 0;
      notifBadge.textContent = (count + 1).toString();
      notifBadge.classList.remove('zero');
    }
    if (notifCountTag) {
      let count = parseInt(notifBadge?.textContent || '1', 10);
      notifCountTag.textContent = `${count} New`;
    }
  }

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpening = notifDropdown.classList.contains('hidden');
      notifDropdown.classList.toggle('hidden');

      if (isOpening) {
        if (notifBadge) {
          notifBadge.textContent = '0';
          notifBadge.classList.add('zero');
        }
        if (notifCountTag) {
          notifCountTag.textContent = '0 New';
        }
        const unreadItems = notifDropdown.querySelectorAll('.notif-item');
        unreadItems.forEach(item => {
          item.classList.remove('unread');
          const dot = item.querySelector('.notif-dot');
          if (dot) dot.classList.add('read');
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
        notifDropdown.classList.add('hidden');
      }
    });
  }

  // --- 5. Payment Session Archiver: Move Latest to Past ---
  function moveLatestPaymentToPast() {
    try {
      const storedLatest = localStorage.getItem('cpc_latest_payment');
      if (storedLatest) {
        const latestObj = JSON.parse(storedLatest);
        if (latestObj && latestObj.utr) {
          let pastList = [
            { date: '28-Aug-2026', utr: 'GOV-DBT-984210', crop: 'Mustard (22 Qtl)', amount: '₹ 1,24,300.00', status: 'Credited' },
            { date: '12-May-2026', utr: 'GOV-DBT-719403', crop: 'Wheat (45 Qtl)', amount: '₹ 1,02,375.00', status: 'Credited' },
            { date: '18-Jan-2026', utr: 'GOV-DBT-440192', crop: 'Soybean (12 Qtl)', amount: '₹ 55,200.00', status: 'Credited' }
          ];
          const storedPast = localStorage.getItem('cpc_past_payments');
          if (storedPast) {
            pastList = JSON.parse(storedPast);
          }
          if (!pastList.some(p => p.utr === latestObj.utr)) {
            pastList.unshift(latestObj);
          }
          localStorage.setItem('cpc_past_payments', JSON.stringify(pastList));
          localStorage.removeItem('cpc_latest_payment');
          localStorage.removeItem('cpc_procurement_finalized');
        }
      }
    } catch(e) {}
  }

  // --- 6. Logout Handler ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      moveLatestPaymentToPast();

      localStorage.removeItem('cpc_submitted_crop');
      localStorage.removeItem('cpc_submitted_qty');
      localStorage.removeItem('cpc_bank_account');
      localStorage.removeItem('cpc_bank_ifsc');
      localStorage.removeItem('cpc_slot_booked');
      localStorage.removeItem('cpc_timer_completed');
      localStorage.removeItem('cpc_countdown_seconds');
      localStorage.removeItem('cpc_procurement_finalized');
      farmerBank.account = '';
      farmerBank.ifsc = '';
      isSlotBooked = false;
      isTimerCompleted = false;
      countdownSeconds = 15;
      clearInterval(countdownInterval);

      if (dashboardScreen && loginScreen) {
        dashboardScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        showToast('Logged out of Farmer Portal', 'info');
      }
    });
  }

  // --- 6. Module Cards Click Handlers ---
  moduleCards.forEach(card => {
    card.addEventListener('click', () => {
      const moduleKey = card.getAttribute('data-module');
      openModuleDetail(moduleKey);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const moduleKey = card.getAttribute('data-module');
        openModuleDetail(moduleKey);
      }
    });
  });

  // --- 7. Core Interface Renderer: openModuleDetail ---
  function openModuleDetail(moduleKey) {
    if (!dashDetailModal || !dashModalBody) return;

    let title = '';
    let category = 'PROCUREMENT SERVICE';
    let bodyHtml = '';

    switch (moduleKey) {
      case 'schedule':
        title = 'PROCUREMENT SCHEDULE';
        category = 'PROCUREMENT CALENDAR (2026-27)';
        bodyHtml = `
          <div class="detail-table-wrap">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Crop / Produce</th>
                  <th>Village</th>
                  <th>Procurement Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>September</strong></td>
                  <td>Paddy</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>October</strong></td>
                  <td>Cotton</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>November</strong></td>
                  <td>Maize</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>December</strong></td>
                  <td>Groundnut</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>January</strong></td>
                  <td>Paddy</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
                <tr>
                  <td><strong>February</strong></td>
                  <td>Chilli</td>
                  <td>VILLAGE ABC</td>
                  <td><em>To be announced</em></td>
                  <td><span class="badge-tag badge-pending">🟡 Upcoming</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="background: #F8F3EA; border-left: 4px solid var(--accent-gold); padding: 14px 16px; border-radius: 8px; font-size: 13px; margin-top: 16px; line-height: 1.5; color: #3E4B41;">
            <strong>📢 Notice:</strong> Registration Dates and Slot Booking Dates are yet to be announced.
          </div>
        `;
        break;

      case 'form-filling':
        title = 'FORM FILLING AND CROP REGISTRATION';
        category = 'FORM FILLING & CROP REGISTRATION';
        
        const currentSavedCrop = localStorage.getItem('cpc_submitted_crop') || '';
        const currentSavedQty = localStorage.getItem('cpc_submitted_qty') || '';

        bodyHtml = `
          <form id="dashFarmerRegForm" onsubmit="event.preventDefault(); window.submitFarmerFormFilling();">
            <div class="modal-form-grid single-col">
              <div class="modal-input-group full-width">
                <label for="ffName">Farmer Full Name (Default)</label>
                <input type="text" id="ffName" value="${registeredFarmer.name || 'Rahul'}" readonly style="background: #F4EFE6; font-weight: 600; color: #143525; cursor: default;">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffMobile">Registered Mobile Number (Default)</label>
                <input type="tel" id="ffMobile" value="${registeredFarmer.mobile || '9876543210'}" readonly style="background: #F4EFE6; font-weight: 600; color: #143525; cursor: default;">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffVillage">Designated Procurement Village (Default)</label>
                <input type="text" id="ffVillage" value="VILLAGE ABC" readonly style="background: #F4EFE6; font-weight: 600; color: #143525; cursor: default;">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffCrop">Agricultural Produce / Crop *</label>
                <select id="ffCrop" required>
                  <option value="" disabled ${!currentSavedCrop ? 'selected' : ''}>Select Agricultural Produce ▼</option>
                  <option value="Wheat" ${currentSavedCrop === 'Wheat' ? 'selected' : ''}>Wheat - MSP ₹2,275/Qtl</option>
                  <option value="Paddy / Rice" ${currentSavedCrop === 'Paddy / Rice' ? 'selected' : ''}>Paddy / Rice - MSP ₹2,183/Qtl</option>
                  <option value="Mustard" ${currentSavedCrop === 'Mustard' ? 'selected' : ''}>Mustard - MSP ₹5,650/Qtl</option>
                  <option value="Soybean" ${currentSavedCrop === 'Soybean' ? 'selected' : ''}>Soybean - MSP ₹4,600/Qtl</option>
                  <option value="Cotton" ${currentSavedCrop === 'Cotton' ? 'selected' : ''}>Cotton - MSP ₹7,020/Qtl</option>
                  <option value="Gram / Chana" ${currentSavedCrop === 'Gram / Chana' ? 'selected' : ''}>Gram / Chana - MSP ₹5,440/Qtl</option>
                  <option value="Maize" ${currentSavedCrop === 'Maize' ? 'selected' : ''}>Maize - MSP ₹2,090/Qtl</option>
                </select>
              </div>

              <div class="modal-input-group full-width">
                <label for="ffQty">Expected Crop Weight *</label>
                <div class="input-with-unit">
                  <input type="number" id="ffQty" min="1" max="5000" step="0.5" value="${currentSavedQty}" required placeholder="Enter expected weight in Quintals">
                  <span class="unit-badge">QUINTALS</span>
                </div>
              </div>

              <div class="modal-input-group full-width" style="margin-top: 6px;">
                <label for="ffBank">Bank Account Number *</label>
                <input type="text" id="ffBank" value="${farmerBank.account || ''}" required placeholder="Enter bank account number">
              </div>

              <div class="modal-input-group full-width">
                <label for="ffIfsc">Bank IFSC Code *</label>
                <input type="text" id="ffIfsc" value="${farmerBank.ifsc || ''}" required placeholder="Enter IFSC code" maxlength="11" style="text-transform: uppercase;">
              </div>
            </div>

            <button type="submit" class="modal-submit-btn" style="margin-top: 20px;">
              <span>SUBMIT FORM</span>
              <span>→</span>
            </button>
          </form>
        `;
        break;

      case 'slot-booking':
        title = 'PROCUREMENT CENTER & SLOT BOOKING';
        category = 'CENTER RESERVATION & QUEUE ALLOCATION';

        const submittedCropLabel = localStorage.getItem('cpc_submitted_crop');
        const submittedQtyVal = localStorage.getItem('cpc_submitted_qty');

        if (!submittedCropLabel || !submittedQtyVal) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">📝</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                CROP REGISTRATION FORM REQUIRED
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Please fill the <strong>Form Filling and Crop Registration</strong> form first with your agricultural produce, expected weight, and bank details before booking a procurement slot.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToFormFilling();" style="max-width: 340px; margin: 0 auto;">
                <span>Go to Form Filling & Crop Registration</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else {
          bodyHtml = `
            <div style="background: #F9F5EE; border: 1px solid #DFC396; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #7A5112; text-transform: uppercase;">Ready for Delivery</span>
                <p style="font-size: 13.5px; font-weight: 700; color: #143525; margin-top: 2px;">${submittedCropLabel} • ${submittedQtyVal} Quintals</p>
              </div>
              <button type="button" class="btn-modal-back" onclick="window.goToFormFilling();" style="font-size: 11px; padding: 4px 10px;">Edit Produce ✎</button>
            </div>

            <form id="slotBookingForm" onsubmit="event.preventDefault(); window.submitSlotBooking();">
              <div class="modal-form-grid single-col">
                <div class="modal-input-group full-width">
                  <label>PROCUREMENT CENTER</label>
                  <input type="text" value="STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)" readonly style="background: #F3ECE2; font-weight: 600; color: #143525; border-color: var(--accent-gold);">
                </div>

                <div class="modal-input-group full-width">
                  <label for="slotProcurementDate">Preferred Intake Date *</label>
                  <input type="date" id="slotProcurementDate" value="${bookedSlotDetails.date || '2026-09-05'}" required>
                </div>

                <div class="modal-input-group full-width">
                  <label>Select Preferred Time Window *</label>
                  <div class="slot-select-grid">
                    <label class="slot-card-option">
                      <input type="radio" name="slotTimeChoice" value="morning" checked>
                      <div class="slot-card-info">
                        <strong>Morning Slot (08:00 AM - 12:00 PM)</strong>
                        <span class="slot-avail-badge" id="morningSlotCount">${slotState.morning} Slots Available</span>
                      </div>
                    </label>
                    <label class="slot-card-option">
                      <input type="radio" name="slotTimeChoice" value="afternoon">
                      <div class="slot-card-info">
                        <strong>Afternoon Slot (01:00 PM - 05:00 PM)</strong>
                        <span class="slot-avail-badge" id="afternoonSlotCount">${slotState.afternoon} Slots Available</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" class="modal-submit-btn" style="margin-top: 20px;">
                <span>Confirm Reservation & Generate Live Token</span>
                <span>→</span>
              </button>
            </form>
          `;
        }
        break;

      case 'token-status':
        title = 'TOKEN STATUS';
        category = 'REAL-TIME QUEUE & LIVE TOKEN';

        if (!isSlotBooked) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">🎟️</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                SLOT BOOKING REQUIRED
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Please complete your slot booking in the <strong>Procurement Center & Slot Booking</strong> option first to generate your token number and start the live queue tracker.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToSlotBooking();" style="max-width: 340px; margin: 0 auto;">
                <span>Go to Procurement Center & Slot Booking</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else {
          let gateText = 'Weighbridge Gate 2 (North Entry)';
          let dateSlotText = `${bookedSlotDetails.date}, ${bookedSlotDetails.slot}`;

          let timerHeader = isTimerCompleted ? 'WEIGHBRIDGE QUEUE STATUS' : '⏱️ LIVE WEIGHBRIDGE QUEUE COUNTDOWN';
          let badgeClass = isTimerCompleted ? 'badge-success' : 'badge-pending';
          let badgeText = isTimerCompleted ? 'YOUR TURN RIGHT NOW' : 'Queue Approaching...';
          let digitDisplay = isTimerCompleted ? '0s (LIVE!)' : countdownSeconds + 's';
          let digitClass = isTimerCompleted ? 'live-alert' : '';
          let progressWidth = (countdownSeconds / 15) * 100;
          let subtextMsg = isTimerCompleted 
            ? '✅ Token #TK-8492 is active at Weighbridge Gate 2. Please enter for assaying & payment.'
            : 'Slot confirmed! Live queue processing. Token becomes active in seconds.';

          bodyHtml = `
            <!-- 1. Details Placed ABOVE the Token -->
            <div class="detail-table-wrap" style="margin-top: 4px; margin-bottom: 16px;">
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td><strong>Procurement Center</strong></td>
                    <td>STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)</td>
                  </tr>
                  <tr>
                    <td><strong>Assigned Weighbridge</strong></td>
                    <td>${gateText}</td>
                  </tr>
                  <tr>
                    <td><strong>PROCUREMENT OFFICER</strong></td>
                    <td>Inspector V. S. Deshmukh (Desk 3)</td>
                  </tr>
                  <tr>
                    <td><strong>Reserved Slot</strong></td>
                    <td>${dateSlotText}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 2. Static 3D Gold Coin (ONLY TOKEN NUMBER) -->
            <div class="coin-3d-stage">
              <div class="coin-3d-wrap" title="Procurement Token #TK-8492">
                <div class="coin-shine-glimmer"></div>
                <div class="coin-inner-ring">
                  <span class="coin-token-text">#TK-8492</span>
                </div>
              </div>
              <div class="coin-shadow-aura"></div>
            </div>

            <!-- 3. Real-Time Working Countdown Timer -->
            <div class="live-countdown-card">
              <div class="countdown-header-row">
                <span class="countdown-title">${timerHeader}</span>
                <span id="countdownStatusBadge" class="badge-tag ${badgeClass}">
                  ${badgeText}
                </span>
              </div>

              <div class="countdown-digit-wrap">
                <span id="countdownDisplay" class="countdown-digit ${digitClass}">
                  ${digitDisplay}
                </span>
              </div>

              <div class="countdown-progress-bar-bg">
                <div id="countdownProgressBar" class="countdown-progress-bar-fill" style="width: ${progressWidth}%"></div>
              </div>

              <p style="font-size: 12.5px; color: #64746A; margin-top: 10px;" id="countdownSubtext">
                ${subtextMsg}
              </p>
            </div>

            <div id="liveTurnActionArea" class="${isTimerCompleted ? '' : 'hidden'}" style="margin-top: 18px; width: 100%;">
              <button type="button" class="modal-submit-btn" onclick="window.goToFinalizeProcurement();">
                <span>FINALIZE PROCUREMENT</span>
                <span>→</span>
              </button>
            </div>
          `;
        }
        break;

      case 'finalize-procurement':
        title = 'FINALIZE PROCUREMENT & PAYMENT';
        category = 'WEIGHBRIDGE ASSAYING & DIRECT DBT RELEASE';

        const isFinalized = localStorage.getItem('cpc_procurement_finalized') === 'true';

        if (isFinalized) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">✅</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                NO LATEST PROCUREMENT PAYMENTS AWAITING SETTLEMENT
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 460px; margin: 0 auto 20px auto;">
                The previous Direct Benefit Transfer (DBT) payment has been successfully authorized and credited directly to your bank account. No pending intake batch is awaiting settlement.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToPaymentHistory();" style="max-width: 340px; margin: 0 auto;">
                <span>View Payment History & DBT Statements</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else if (!isSlotBooked) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">🎟️</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                PROCUREMENT SLOT & TOKEN REQUIRED
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Please book a slot in <strong>Procurement Center & Slot Booking</strong> first to generate your token before proceeding to weighbridge verification and payment.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToSlotBooking();" style="max-width: 340px; margin: 0 auto;">
                <span>Go to Procurement Center & Slot Booking</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else if (!isTimerCompleted) {
          bodyHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 14px; padding: 36px 20px; text-align: center; margin: 10px 0;">
              <div style="font-size: 38px; margin-bottom: 12px;">⏳</div>
              <h3 style="font-size: 16.5px; font-weight: 800; color: #143525; letter-spacing: 0.04em; margin-bottom: 8px;">
                TOKEN QUEUE IN PROGRESS (${countdownSeconds}s REMAINING)
              </h3>
              <p style="font-size: 13px; color: #5A6A5E; line-height: 1.55; max-width: 440px; margin: 0 auto 20px auto;">
                Token #TK-8492 is currently in queue. Please wait until the 15-second countdown timer completes and your turn is reached before finalizing procurement and payment.
              </p>
              <button type="button" class="modal-submit-btn" onclick="window.goToTokenStatus();" style="max-width: 340px; margin: 0 auto;">
                <span>View Live Token Status (${countdownSeconds}s)</span>
                <span>→</span>
              </button>
            </div>
          `;
        } else {
          const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
          const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
          
          // Verified actual weight <= Expected weight
          let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
          if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;

          const mspPerQtl = CROP_MSP_RATES[submittedCrop] || 2275;
          const totalApprovedAmount = actualWeightVal * mspPerQtl;

          const formattedExpected = expectedWeightVal.toFixed(2) + ' Quintals';
          const formattedActual = actualWeightVal.toFixed(2) + ' Quintals';
          const formattedMsp = '₹ ' + mspPerQtl.toLocaleString('en-IN') + ' per Quintal';
          const formattedTotal = '₹ ' + totalApprovedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          bodyHtml = `
            <p style="margin-bottom: 14px; font-size: 13.5px; color: #4A5836;">
              Official weighbridge weight slip and quality certification ready for final farmer authorization:
            </p>
            <div class="detail-table-wrap">
              <table class="detail-table">
                <tbody>
                  <tr>
                    <td><strong>Procurement Center</strong></td>
                    <td>STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC)</td>
                  </tr>
                  <tr>
                    <td><strong>CROP / PRODUCE</strong></td>
                    <td><strong>${submittedCrop}</strong></td>
                  </tr>
                  <tr>
                    <td><strong>EXPECTED WEIGHT</strong></td>
                    <td>${formattedExpected}</td>
                  </tr>
                  <tr>
                    <td><strong>ACTUAL VERIFIED WEIGHT</strong></td>
                    <td><strong style="color: #143525;">${formattedActual}</strong> <span style="font-size: 11px; color: #1E824C; background: #E8F7EE; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">(Verified Gross ≤ Expected)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Moisture Content & Grade</strong></td>
                    <td>10.8% • Grade FAQ (Fair Average Quality Certified)</td>
                  </tr>
                  <tr>
                    <td><strong>Government MSP Rate</strong></td>
                    <td>${formattedMsp}</td>
                  </tr>
                  <tr style="background: #FAF3E6;">
                    <td><strong style="font-size: 14.5px; color: #143525;">Total Approved DBT Amount</strong></td>
                    <td><strong style="font-size: 18px; color: #143525;">${formattedTotal}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button type="button" class="modal-submit-btn" onclick="window.finalizePaymentAction('${formattedTotal}');" style="margin-top: 20px;">
              <span>Authorize & Release Direct Payment (DBT)</span>
              <span>✓</span>
            </button>
          `;
        }
        break;

      case 'payment-history':
        title = 'PAYMENT HISTORY & DBT STATEMENTS';
        category = 'DIRECT BENEFIT TRANSFER (DBT) STATEMENTS';

        let latestPaymentData = null;
        try {
          latestPaymentData = JSON.parse(localStorage.getItem('cpc_latest_payment'));
        } catch(e) {}

        let pastPaymentsList = [
          { date: '28-Aug-2026', utr: 'GOV-DBT-984210', crop: 'Mustard (22 Qtl)', amount: '₹ 1,24,300.00', status: 'Credited' },
          { date: '12-May-2026', utr: 'GOV-DBT-719403', crop: 'Wheat (45 Qtl)', amount: '₹ 1,02,375.00', status: 'Credited' },
          { date: '18-Jan-2026', utr: 'GOV-DBT-440192', crop: 'Soybean (12 Qtl)', amount: '₹ 55,200.00', status: 'Credited' }
        ];

        try {
          const storedPast = localStorage.getItem('cpc_past_payments');
          if (storedPast) {
            pastPaymentsList = JSON.parse(storedPast);
          }
        } catch(e) {}

        let justReceivedHtml = '';
        if (latestPaymentData) {
          justReceivedHtml = `
            <div class="just-received-card">
              <div class="just-received-top">
                <span class="just-received-badge">⚡ JUST RECEIVED (LATEST SETTLEMENT)</span>
                <button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${latestPaymentData.utr}');" style="font-size: 11px; padding: 4px 10px;">
                  <span>Print Receipt 📄</span>
                </button>
              </div>
              <div class="just-received-amount">${latestPaymentData.amount}</div>
              <div class="just-received-grid">
                <div class="just-received-cell">
                  <span>Transaction UTR</span>
                  <strong><code>${latestPaymentData.utr}</code></strong>
                </div>
                <div class="just-received-cell">
                  <span>Crop & Weight</span>
                  <strong>${latestPaymentData.crop}</strong>
                </div>
                <div class="just-received-cell">
                  <span>Credited Date</span>
                  <strong>${latestPaymentData.date}</strong>
                </div>
              </div>
            </div>
          `;
        } else {
          justReceivedHtml = `
            <div style="background: #FAF7F2; border: 1.5px dashed #DFC396; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 16px; color: #64746A;">
              <p style="font-size: 13px; font-weight: 600;">No payment processed in current active session.</p>
              <p style="font-size: 12px; margin-top: 4px;">Once you finalize weighbridge procurement, the latest DBT transaction will appear here under <strong>JUST RECEIVED</strong>.</p>
            </div>
          `;
        }

        let pastRowsHtml = pastPaymentsList.map(item => `
          <tr>
            <td>${item.date}</td>
            <td><code>${item.utr}</code></td>
            <td><strong>${item.crop}</strong></td>
            <td><strong style="color: #143525;">${item.amount}</strong></td>
            <td><span class="badge-tag badge-success">${item.status}</span></td>
            <td>
              <button type="button" class="btn-modal-back" onclick="window.openReceiptModal('${item.utr}');" style="padding: 2px 8px; font-size: 11px;">Receipt ⬇</button>
            </td>
          </tr>
        `).join('');

        bodyHtml = `
          <p style="margin-bottom: 14px; font-size: 13.5px; color: #4A5836;">
            Official direct government MSP subsidy & procurement bank settlements:
          </p>

          <!-- 1. JUST RECEIVED SECTION -->
          <div class="payment-section-heading">
            <span>⚡ JUST RECEIVED</span>
          </div>
          ${justReceivedHtml}

          <!-- 2. PAST RECEIVED SECTION -->
          <div class="payment-section-heading" style="margin-top: 20px;">
            <span>📜 PAST RECEIVED</span>
          </div>
          <div class="detail-table-wrap">
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction / UTR No.</th>
                  <th>Crop</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Voucher</th>
                </tr>
              </thead>
              <tbody>
                ${pastRowsHtml}
              </tbody>
            </table>
          </div>

          <div class="workflow-nav-bar">
            <button type="button" class="workflow-btn workflow-btn-primary" onclick="window.showToast('Downloading complete statement PDF...', 'info');">
              <span>Download Consolidated Statement (PDF)</span>
              <span>⬇</span>
            </button>
            <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.goToFormFilling();">
              <span>Submit Next Crop Batch</span>
              <span>🌱</span>
            </button>
          </div>
        `;
        break;
    }

    if (dashModalTitle) dashModalTitle.textContent = title;
    if (dashModalCategory) dashModalCategory.textContent = category;
    dashModalBody.innerHTML = bodyHtml;

    dashDetailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // If token status module is opened, check if timer should run
    if (moduleKey === 'token-status') {
      startTokenCountdownTimer();
    }
  }

  // --- Real-Time Live Countdown Timer Handler ---
  function startTokenCountdownTimer() {
    clearInterval(countdownInterval);

    if (!isSlotBooked || isTimerCompleted) {
      return;
    }

    if (countdownSeconds > 0) {
      countdownInterval = setInterval(() => {
        if (countdownSeconds > 0 && isSlotBooked && !isTimerCompleted) {
          countdownSeconds--;
          localStorage.setItem('cpc_countdown_seconds', countdownSeconds.toString());

          const display = document.getElementById('countdownDisplay');
          const bar = document.getElementById('countdownProgressBar');
          if (display) display.textContent = countdownSeconds + 's';
          if (bar) bar.style.width = ((countdownSeconds / 15) * 100) + '%';

          if (countdownSeconds === 0) {
            clearInterval(countdownInterval);
            isTimerCompleted = true;
            localStorage.setItem('cpc_timer_completed', 'true');
            handleTokenTurnReached();
          }
        }
      }, 1000);
    } else {
      isTimerCompleted = true;
      localStorage.setItem('cpc_timer_completed', 'true');
      handleTokenTurnReached();
    }
  }

  function handleTokenTurnReached() {
    const display = document.getElementById('countdownDisplay');
    const badge = document.getElementById('countdownStatusBadge');
    const subtext = document.getElementById('countdownSubtext');
    const actionArea = document.getElementById('liveTurnActionArea');

    if (display) {
      display.textContent = '0s (LIVE!)';
      display.classList.add('live-alert');
    }
    if (badge) {
      badge.className = 'badge-tag badge-success';
      badge.textContent = 'YOUR TURN RIGHT NOW';
    }
    if (subtext) {
      subtext.textContent = '✅ Token #TK-8492 is active! Please enter Weighbridge Gate 2.';
    }
    if (actionArea) {
      actionArea.classList.remove('hidden');
    }

    const liveMsg = 'It is your turn right now! Please proceed to FINALIZE PROCUREMENT & PAYMENT for further procedure.';
    showToast(liveMsg, 'success');

    // Add alert notification with deep-link
    addNotificationAlert('🚨 TOKEN #TK-8492 IS LIVE!', liveMsg, 'finalize-procurement');
  }

  // --- Inter-Module Global Navigation Links ---
  window.goToSchedule = function() {
    openModuleDetail('schedule');
  };

  window.goToFormFilling = function() {
    openModuleDetail('form-filling');
  };

  window.goToSlotBooking = function() {
    openModuleDetail('slot-booking');
  };

  window.goToTokenStatus = function() {
    openModuleDetail('token-status');
  };

  window.goToFinalizeProcurement = function() {
    openModuleDetail('finalize-procurement');
  };

  window.goToPaymentHistory = function() {
    openModuleDetail('payment-history');
  };

  window.openModuleDetail = openModuleDetail;
  window.closeDashModal = closeDashModal;



  // --- Form Filling Submission Handler ---
  window.submitFarmerFormFilling = function() {
    const name = document.getElementById('ffName')?.value.trim();
    const mobile = document.getElementById('ffMobile')?.value.trim();
    const village = document.getElementById('ffVillage')?.value.trim();
    const crop = document.getElementById('ffCrop')?.value;
    const qty = document.getElementById('ffQty')?.value.trim();
    const bankAc = document.getElementById('ffBank')?.value.trim();
    const ifsc = document.getElementById('ffIfsc')?.value.trim();

    if (!name || !mobile || !village || !crop || !qty || !bankAc || !ifsc) {
      showToast('Please fill all mandatory (*) fields including Bank Account & IFSC', 'error');
      return;
    }

    farmerBank.account = bankAc;
    farmerBank.ifsc = ifsc;

    // Persist crop, quantity, and bank details
    if (crop) localStorage.setItem('cpc_submitted_crop', crop);
    if (qty) localStorage.setItem('cpc_submitted_qty', qty);
    if (bankAc) localStorage.setItem('cpc_bank_account', bankAc);
    if (ifsc) localStorage.setItem('cpc_bank_ifsc', ifsc);

    // RESET token countdown cycle & procurement finalized state for new crop submission
    clearInterval(countdownInterval);
    isSlotBooked = false;
    isTimerCompleted = false;
    countdownSeconds = 15;
    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');
    localStorage.setItem('cpc_procurement_finalized', 'false');

    // Notification toast
    const successMsg = 'Your form has been successfully filled, go to slot selection for booking your slot.';
    showToast(successMsg, 'success');

    // Reset bell notifications on fresh form submission & add new alert with deep link
    resetNotificationCenter();
    addNotificationAlert(`Form Registered (${crop})`, successMsg, 'slot-booking');

    // Auto-advance seamlessly to Slot Booking interface
    setTimeout(() => {
      openModuleDetail('slot-booking');
    }, 300);
  };

  // --- Slot Booking Submission Handler ---
  window.submitSlotBooking = function() {
    const selectedSlotRadio = document.querySelector('input[name="slotTimeChoice"]:checked');
    const chosenSlotType = selectedSlotRadio ? selectedSlotRadio.value : 'morning';
    const chosenDate = document.getElementById('slotProcurementDate')?.value || '2026-09-05';
    const slotTitle = chosenSlotType === 'morning' ? 'Morning Slot (08:00 AM - 12:00 PM)' : 'Afternoon Slot (01:00 PM - 05:00 PM)';

    // Decrease slot count by 1
    if (chosenSlotType === 'morning' && slotState.morning > 0) {
      slotState.morning -= 1;
      localStorage.setItem('cpc_slot_morning', slotState.morning.toString());
    } else if (chosenSlotType === 'afternoon' && slotState.afternoon > 0) {
      slotState.afternoon -= 1;
      localStorage.setItem('cpc_slot_afternoon', slotState.afternoon.toString());
    }

    // Mark slot as booked & reset 15-second queue
    isSlotBooked = true;
    isTimerCompleted = false;
    countdownSeconds = 15;
    bookedSlotDetails.date = chosenDate;
    bookedSlotDetails.slot = slotTitle;

    localStorage.setItem('cpc_slot_booked', 'true');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');
    localStorage.setItem('cpc_booked_date', chosenDate);
    localStorage.setItem('cpc_booked_slot', slotTitle);

    // Start timer immediately in background
    startTokenCountdownTimer();

    // Notification toast
    const toastMsg = `Slot booked successfully at STATE AGRICULTURAL COOPERATIVE CENTER (VILLAGE ABC) for ${chosenDate}! Token #TK-8492 is now in queue.`;
    showToast(toastMsg, 'success');

    // Add notification with deep-link
    addNotificationAlert(`Slot Confirmed #TK-8492`, `Booked on ${chosenDate} (${slotTitle}). Token queue started.`, 'token-status');

    // Auto-advance seamlessly to Token Status interface
    setTimeout(() => {
      openModuleDetail('token-status');
    }, 300);
  };

  // --- Finalize Payment Release Handler ---
  window.finalizePaymentAction = function(amountStr) {
    const displayAmount = amountStr || '₹ 1,19,210.00';
    const submittedCrop = localStorage.getItem('cpc_submitted_crop') || 'Wheat';
    const expectedWeightVal = parseFloat(localStorage.getItem('cpc_submitted_qty') || '50.00');
    let actualWeightVal = Math.round(expectedWeightVal * 0.96 * 100) / 100;
    if (actualWeightVal > expectedWeightVal) actualWeightVal = expectedWeightVal;

    const todayStr = 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newUtr = 'GOV-DBT-' + Math.floor(100000 + Math.random() * 900000);

    const newPayment = {
      date: todayStr,
      utr: newUtr,
      crop: `${submittedCrop} (${actualWeightVal} Qtl)`,
      amount: displayAmount,
      status: 'Credited'
    };

    // Past payments list
    let pastPaymentsList = [
      { date: '28-Aug-2026', utr: 'GOV-DBT-984210', crop: 'Mustard (22 Qtl)', amount: '₹ 1,24,300.00', status: 'Credited' },
      { date: '12-May-2026', utr: 'GOV-DBT-719403', crop: 'Wheat (45 Qtl)', amount: '₹ 1,02,375.00', status: 'Credited' },
      { date: '18-Jan-2026', utr: 'GOV-DBT-440192', crop: 'Soybean (12 Qtl)', amount: '₹ 55,200.00', status: 'Credited' }
    ];

    try {
      const storedPast = localStorage.getItem('cpc_past_payments');
      if (storedPast) {
        pastPaymentsList = JSON.parse(storedPast);
      }
    } catch(e) {}

    // Shift previous latest payment to past list
    try {
      const existingLatest = JSON.parse(localStorage.getItem('cpc_latest_payment'));
      if (existingLatest && existingLatest.utr) {
        pastPaymentsList.unshift(existingLatest);
      }
    } catch(e) {}

    // Save newest payment in "JUST RECEIVED" & mark finalized
    localStorage.setItem('cpc_latest_payment', JSON.stringify(newPayment));
    localStorage.setItem('cpc_past_payments', JSON.stringify(pastPaymentsList));
    localStorage.setItem('cpc_procurement_finalized', 'true');

    // Reset slot status after DBT completion
    isSlotBooked = false;
    isTimerCompleted = false;
    countdownSeconds = 15;
    localStorage.setItem('cpc_slot_booked', 'false');
    localStorage.setItem('cpc_timer_completed', 'false');
    localStorage.setItem('cpc_countdown_seconds', '15');

    const creditedAccount = farmerBank.account || 'Primary Bank';

    // Reset previously entered values of Crop, Weight, Bank Account, IFSC for next cycle
    localStorage.removeItem('cpc_submitted_crop');
    localStorage.removeItem('cpc_submitted_qty');
    localStorage.removeItem('cpc_bank_account');
    localStorage.removeItem('cpc_bank_ifsc');
    farmerBank.account = '';
    farmerBank.ifsc = '';

    showToast(`Payment of ${displayAmount} authorized! Transferred via DBT to Bank Account (Ref: ${newUtr}).`, 'success');

    // Add alert notification with deep-link
    addNotificationAlert('💰 DBT PAYMENT CREDITED', `${displayAmount} credited to Bank A/C ${creditedAccount} (Ref: ${newUtr}).`, 'payment-history');

    // Auto-advance seamlessly to Payment History interface
    setTimeout(() => {
      openModuleDetail('payment-history');
    }, 300);
  };

  // --- Official Government DBT Receipt Voucher Modal ---
  window.openReceiptModal = function(utr) {
    if (!receiptModal || !receiptModalBody) return;

    let targetPayment = null;
    try {
      const latest = JSON.parse(localStorage.getItem('cpc_latest_payment'));
      if (latest && latest.utr === utr) targetPayment = latest;
    } catch(e) {}

    if (!targetPayment) {
      try {
        const pastList = JSON.parse(localStorage.getItem('cpc_past_payments')) || [];
        targetPayment = pastList.find(p => p.utr === utr);
      } catch(e) {}
    }

    if (!targetPayment) {
      targetPayment = {
        date: 'Today',
        utr: utr || 'GOV-DBT-984210',
        crop: 'Wheat (48.00 Qtl)',
        amount: '₹ 1,09,200.00',
        status: 'Credited'
      };
    }

    receiptModalBody.innerHTML = `
      <div class="receipt-header">
        <span class="receipt-gov-title">Ministry of Consumer Affairs, Food &amp; Public Distribution</span>
        <h3 class="receipt-portal-title" id="receiptTitle">DBT Payment Receipt Voucher</h3>
        <span class="receipt-tag">Official Settlement Receipt</span>
      </div>

      <div class="receipt-grid">
        <div class="receipt-cell">
          <span class="receipt-cell-label">Beneficiary Farmer</span>
          <span class="receipt-cell-val">${registeredFarmer.name || 'Rahul'}</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Mobile Number</span>
          <span class="receipt-cell-val">+91 ${registeredFarmer.mobile || '9876543210'}</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Village / APMC</span>
          <span class="receipt-cell-val">VILLAGE ABC CENTER</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Procure Batch / Crop</span>
          <span class="receipt-cell-val">${targetPayment.crop}</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Bank Account Number</span>
          <span class="receipt-cell-val">A/C ${farmerBank.account} (IFSC: ${farmerBank.ifsc})</span>
        </div>
        <div class="receipt-cell">
          <span class="receipt-cell-label">Transaction Reference (UTR)</span>
          <span class="receipt-cell-val"><code>${targetPayment.utr}</code></span>
        </div>
      </div>

      <div class="receipt-total-banner">
        <div>
          <span class="receipt-total-label">DIRECT BENEFIT TRANSFER (DBT) AMOUNT</span>
          <div style="font-size: 11px; opacity: 0.85; margin-top: 2px;">Status: Direct Bank Transfer Credited • ${targetPayment.date}</div>
        </div>
        <div class="receipt-total-val">${targetPayment.amount}</div>
      </div>

      <div class="receipt-actions">
        <button type="button" class="workflow-btn workflow-btn-primary" onclick="window.print();" style="flex: 1;">
          <span>Print / Save Voucher (PDF)</span>
          <span>🖨️</span>
        </button>
        <button type="button" class="workflow-btn workflow-btn-secondary" onclick="window.closeReceiptModal();" style="flex: 1;">
          <span>Close Voucher</span>
        </button>
      </div>
    `;

    receiptModal.classList.remove('hidden');
  };

  function closeReceiptModal() {
    if (receiptModal) receiptModal.classList.add('hidden');
  }
  window.closeReceiptModal = closeReceiptModal;
  if (closeReceiptBtn) closeReceiptBtn.addEventListener('click', closeReceiptModal);

  // --- Close Dashboard Modal ---
  function closeDashModal() {
    if (dashDetailModal) {
      dashDetailModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (closeDashModalBtn) closeDashModalBtn.addEventListener('click', closeDashModal);
  if (dashDetailModal) {
    dashDetailModal.addEventListener('click', (e) => {
      if (e.target === dashDetailModal) closeDashModal();
    });
  }

  // --- Registration Modal Handlers ---
  if (openRegisterBtn && registerModal) {
    openRegisterBtn.addEventListener('click', () => {
      registerModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeModal = () => {
    if (registerModal) {
      registerModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', closeModal);
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (receiptModal && !receiptModal.classList.contains('hidden')) {
        closeReceiptModal();
      } else if (dashDetailModal && !dashDetailModal.classList.contains('hidden')) {
        closeDashModal();
      } else if (registerModal && !registerModal.classList.contains('hidden')) {
        closeModal();
      }
    }
  });

  // Format registration mobile input
  const regMobileInput = document.getElementById('regMobile');
  if (regMobileInput) {
    regMobileInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^\d\s+]/g, '');
    });
  }

  // Handle Registration Form Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('regFullName')?.value.trim();
      const regMob = document.getElementById('regMobile')?.value.trim();
      const regPass = document.getElementById('regPassword')?.value.trim();

      const digitsOnly = (regMob || '').replace(/\D/g, '');
      if (!fullName) {
        showToast('Please enter your full name', 'error');
        return;
      }
      if (!regMob || digitsOnly.length < 10) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
      }
      if (!regPass || regPass.length < 4) {
        showToast('Password must be at least 4 characters', 'error');
        return;
      }

      registeredFarmer = {
        name: fullName,
        mobile: regMob
      };
      localStorage.setItem('cpc_farmer_name', fullName);
      localStorage.setItem('cpc_farmer_mobile', regMob);

      closeModal();
      showToast(`Account created successfully for ${fullName}! Please login.`, 'success');
      
      // Auto pre-fill the login mobile & password inputs
      if (mobileInput && regMob) {
        mobileInput.value = regMob;
      }
      if (passwordInput && regPass) {
        passwordInput.value = regPass;
      }
      registerForm.reset();
    });
  }

  // --- Helper Functions ---
  function setFieldError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const errorEl = document.getElementById(errorId);
    if (group) group.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('has-error');
  }

  function setButtonLoading(isLoading) {
    if (!loginBtn) return;
    loginBtn.disabled = isLoading;
    if (isLoading) {
      btnText?.classList.add('hidden');
      btnArrow?.classList.add('hidden');
      btnLoader?.classList.remove('hidden');
    } else {
      btnText?.classList.remove('hidden');
      btnArrow?.classList.remove('hidden');
      btnLoader?.classList.add('hidden');
    }
  }

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '🌾';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  window.showToast = showToast;
});
