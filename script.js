/**
 * Tech Care - Modern Single Page Application Logic
 * Doorstep Home Appliance Repair Services in Bengaluru
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLiveStatus();
  initMobileNav();
  initServiceTabs();
  initCostCalculator();
  initFaqAccordion();
  initBookingForms();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Dark / Light Theme Switcher
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('techcare_theme') || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('techcare_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

function updateThemeIcons(theme) {
  const sunIcons = document.querySelectorAll('.theme-icon-sun');
  const moonIcons = document.querySelectorAll('.theme-icon-moon');
  
  if (theme === 'dark') {
    sunIcons.forEach(el => el.style.display = 'block');
    moonIcons.forEach(el => el.style.display = 'none');
  } else {
    sunIcons.forEach(el => el.style.display = 'none');
    moonIcons.forEach(el => el.style.display = 'block');
  }
}

/* --------------------------------------------------------------------------
   2. Live Store Hours & Status Indicator (Asia/Kolkata Time)
   -------------------------------------------------------------------------- */
function initLiveStatus() {
  const statusBadge = document.getElementById('liveStatusBadge');
  const statusText = document.getElementById('liveStatusText');
  if (!statusBadge || !statusText) return;

  function checkStatus() {
    // Current date/time in India (IST)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5)); // UTC+5.5

    const day = ist.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const currentTime = hours + (minutes / 60);

    let isOpen = false;
    let nextMsg = '';

    if (day === 0) {
      // Sunday: 10:00 AM to 2:30 PM (14.5)
      if (currentTime >= 10.0 && currentTime <= 14.5) {
        isOpen = true;
        nextMsg = 'Open Today till 2:30 PM';
      } else if (currentTime < 10.0) {
        nextMsg = 'Opens Today at 10:00 AM';
      } else {
        nextMsg = 'Closed · Opens Mon 9:00 AM';
      }
    } else {
      // Monday - Saturday: 9:00 AM to 9:00 PM (21.0)
      if (currentTime >= 9.0 && currentTime <= 21.0) {
        isOpen = true;
        nextMsg = 'Open Today till 9:00 PM';
      } else if (currentTime < 9.0) {
        nextMsg = 'Opens Today at 9:00 AM';
      } else {
        if (day === 6) {
          nextMsg = 'Closed · Opens Sun 10:00 AM';
        } else {
          nextMsg = 'Closed · Opens Tomorrow 9:00 AM';
        }
      }
    }

    if (isOpen) {
      statusBadge.className = 'status-badge open';
      statusText.innerHTML = `<span class="status-pulse"></span> Open Now &bull; Doorstep Service Active (${nextMsg})`;
    } else {
      statusBadge.className = 'status-badge closed';
      statusText.innerHTML = `<span class="status-pulse"></span> ${nextMsg} (Bookings Open 24/7)`;
    }
  }

  checkStatus();
  setInterval(checkStatus, 60000); // Recheck every minute
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const navLinks = drawer ? drawer.querySelectorAll('.nav-link') : [];

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   4. Service Tabs Filter
   -------------------------------------------------------------------------- */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Instant Cost Estimator & Quote Calculator
   -------------------------------------------------------------------------- */
const PRICING_DATA = {
  washing: {
    name: 'Washing Machine',
    issues: [
      { id: 'general', label: 'General Checkup & Servicing', price: 299 },
      { id: 'water', label: 'Water Draining / Inlet Problem', price: 449 },
      { id: 'spin', label: 'Drum Not Spinning / Heavy Noise', price: 599 },
      { id: 'power', label: 'Power Issue / PCB Circuit Repair', price: 799 },
      { id: 'motor', label: 'Motor Repair / Replacement', price: 999 }
    ]
  },
  fridge: {
    name: 'Refrigerator / Fridge',
    issues: [
      { id: 'general', label: 'Inspection & Temperature Calibration', price: 299 },
      { id: 'cooling', label: 'Not Cooling / Low Cooling', price: 499 },
      { id: 'gas', label: 'Gas Leakage & Refilling (R134a/R600a)', price: 1199 },
      { id: 'ice', label: 'Defrost / Excessive Ice Buildup', price: 549 },
      { id: 'compressor', label: 'Compressor Repair / Relay Change', price: 899 }
    ]
  },
  tv: {
    name: 'LED, LCD & Smart TV',
    issues: [
      { id: 'general', label: 'Diagnostic Checkup & Wall Mounting Setup', price: 349 },
      { id: 'display', label: 'Display Lines / Screen Flickering', price: 699 },
      { id: 'sound', label: 'No Sound / Distorted Audio', price: 499 },
      { id: 'backlight', label: 'Backlight Strip Issue (Dark Screen)', price: 799 },
      { id: 'motherboard', label: 'Motherboard / Smart Board Fix', price: 899 }
    ]
  },
  microwave: {
    name: 'Microwave Oven',
    issues: [
      { id: 'general', label: 'General Inspection & Cleaning', price: 299 },
      { id: 'heat', label: 'Not Heating / Magnetron Issue', price: 599 },
      { id: 'turntable', label: 'Turntable Plate Not Rotating', price: 399 },
      { id: 'spark', label: 'Sparking / Mica Sheet Replacement', price: 449 },
      { id: 'touch', label: 'Touch Panel & Keypad Repair', price: 649 }
    ]
  },
  water: {
    name: 'RO Water Purifier',
    issues: [
      { id: 'general', label: 'Complete Filter Inspection & TDS Check', price: 249 },
      { id: 'filters', label: 'Sediment & Pre-Carbon Filter Change', price: 499 },
      { id: 'membrane', label: 'RO Membrane Replacement & Balancing', price: 899 },
      { id: 'leak', label: 'Water Leakage / Low Output Flow', price: 349 },
      { id: 'pump', label: 'Booster Pump & SV Service', price: 699 }
    ]
  },
  ac: {
    name: 'Air Conditioner (AC)',
    issues: [
      { id: 'service', label: 'Deep Jet Pump Servicing (Indoor+Outdoor)', price: 499 },
      { id: 'cooling', label: 'Low Cooling / Filter Cleaning', price: 399 },
      { id: 'gas', label: 'AC Gas Charging & Leak Testing', price: 1499 },
      { id: 'leak', label: 'Water Leakage Indoor Unit', price: 449 },
      { id: 'install', label: 'AC Installation / Uninstallation', price: 899 }
    ]
  }
};

function initCostCalculator() {
  const applianceSelect = document.getElementById('calcAppliance');
  const issueSelect = document.getElementById('calcIssue');
  const priceDisplay = document.getElementById('calcPrice');
  const quoteBookBtn = document.getElementById('calcBookBtn');

  if (!applianceSelect || !issueSelect || !priceDisplay) return;

  function updateIssues() {
    const selectedAppliance = applianceSelect.value;
    const data = PRICING_DATA[selectedAppliance];
    
    issueSelect.innerHTML = '';
    if (data && data.issues) {
      data.issues.forEach(issue => {
        const opt = document.createElement('option');
        opt.value = issue.id;
        opt.textContent = `${issue.label}`;
        opt.setAttribute('data-price', issue.price);
        issueSelect.appendChild(opt);
      });
    }
    calculatePrice();
  }

  function calculatePrice() {
    const selectedAppliance = applianceSelect.value;
    const selectedIssueId = issueSelect.value;
    const data = PRICING_DATA[selectedAppliance];

    if (data) {
      const issue = data.issues.find(i => i.id === selectedIssueId) || data.issues[0];
      if (issue) {
        priceDisplay.innerHTML = `₹${issue.price}<small style="font-size:1.1rem;font-weight:600;color:var(--text-muted);">*</small>`;
        
        if (quoteBookBtn) {
          const text = encodeURIComponent(
            `Hello Tech Care! I would like to book a service for:\n- Appliance: ${data.name}\n- Issue: ${issue.label}\n- Estimated Price: ₹${issue.price}\nPlease confirm technician availability at my doorstep.`
          );
          quoteBookBtn.href = `https://wa.me/919738782111?text=${text}`;
        }
      }
    }
  }

  applianceSelect.addEventListener('change', updateIssues);
  issueSelect.addEventListener('change', calculatePrice);

  // Initialize defaults
  updateIssues();
}

/* --------------------------------------------------------------------------
   6. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Booking Forms & WhatsApp Direct Dispatch
   -------------------------------------------------------------------------- */
function initBookingForms() {
  const heroForm = document.getElementById('heroBookingForm');
  const contactForm = document.getElementById('contactBookingForm');

  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmission(heroForm);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmission(contactForm);
    });
  }
}

function handleBookingSubmission(form) {
  const name = form.querySelector('[name="name"]')?.value || 'Customer';
  const phone = form.querySelector('[name="phone"]')?.value || '';
  const appliance = form.querySelector('[name="appliance"]')?.value || 'Appliance Repair';
  const address = form.querySelector('[name="address"]')?.value || 'Bangalore';
  const message = form.querySelector('[name="message"]')?.value || '';

  if (!phone || phone.trim().length < 8) {
    showToast('Please enter a valid phone number', 'error');
    return;
  }

  const text = encodeURIComponent(
    `*NEW SERVICE BOOKING REQUEST - TECH CARE*\n` +
    `--------------------------------------\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `🛠️ Appliance: ${appliance}\n` +
    `📍 Area/Address: ${address}\n` +
    (message ? `📝 Notes: ${message}\n` : '') +
    `--------------------------------------\n` +
    `Please confirm the technician visit time.`
  );

  showToast('Connecting you with Tech Care technician on WhatsApp...', 'success');

  // Open WhatsApp in new tab
  setTimeout(() => {
    window.open(`https://wa.me/919738782111?text=${text}`, '_blank');
    form.reset();
  }, 600);
}

function showToast(msg, type = 'success') {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <div class="toast-text"><strong>${msg}</strong></div>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* --------------------------------------------------------------------------
   8. Smooth Scroll & Active Nav State
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link, .mobile-nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
