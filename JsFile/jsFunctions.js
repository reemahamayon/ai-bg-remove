/* =========================================================
   AI BACKGROUND REMOVER - GLOBAL JS (CLEAN VERSION)
========================================================= */

// ── Dark Mode Toggle ──────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
}

// ── Hamburger Menu ────────────────────────────────────────
function initHamburger() {
  const toggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('nav ul');
  if (!toggle || !navUl) return;

  toggle.addEventListener('click', function () {
    navUl.classList.toggle('open');
    this.setAttribute('aria-expanded', navUl.classList.contains('open'));
  });

  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !navUl.contains(e.target)) {
      navUl.classList.remove('open');
    }
  });
}

// ── Show Alert ────────────────────────────────────────────
function showAlert(containerId, message, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML =
    `<div class="alert-box alert-${type}">${message}</div>`;

  setTimeout(() => {
    container.innerHTML = '';
  }, 4000);
}

// ── Validation ────────────────────────────────────────────
const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = password => password.length >= 8;
const validateRequired = value => value.trim().length > 0;

// ── Login ─────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!validateEmail(email)) {
    return showAlert('login-alert', '⚠️ Please enter a valid email.', 'error');
  }

  if (!validateRequired(password)) {
    return showAlert('login-alert', '⚠️ Password cannot be empty.', 'error');
  }

  showAlert('login-alert', '✅ Logging you in...', 'success');
}

// ── Signup ────────────────────────────────────────────────
function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;

  if (!validateRequired(name)) {
    return showAlert('signup-alert', '⚠️ Full name is required.', 'error');
  }

  if (!validateEmail(email)) {
    return showAlert('signup-alert', '⚠️ Invalid email.', 'error');
  }

  if (!validatePassword(password)) {
    return showAlert('signup-alert', '⚠️ Min 8 characters required.', 'error');
  }

  if (password !== confirm) {
    return showAlert('signup-alert', '⚠️ Passwords do not match.', 'error');
  }

  showAlert('signup-alert', '🎉 Account created!', 'success');

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1400);
}

// ── Contact ───────────────────────────────────────────────
function handleContact(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  if (!validateRequired(name)) {
    return showAlert('contact-alert', '⚠️ Name required.', 'error');
  }

  if (!validateEmail(email)) {
    return showAlert('contact-alert', '⚠️ Invalid email.', 'error');
  }

  if (message.length < 10) {
    return showAlert('contact-alert', '⚠️ Message too short.', 'error');
  }

  showAlert('contact-alert', '✅ Message sent!', 'success');
  e.target.reset();
}

// ── Background Tool ───────────────────────────────────────
function initTool() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const originalPreview = document.getElementById('original-preview');
  const resultPreview = document.getElementById('result-preview');
  const resultArea = document.getElementById('result-area');
  const processBtn = document.getElementById('process-btn');
  const downloadBtn = document.getElementById('download-btn');
  const progressBar = document.getElementById('progress-bar');
  const progressWrap = document.getElementById('progress-wrap');

  if (!uploadArea) return;

  uploadArea.addEventListener('click', () => fileInput.click());

  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files[0]) loadImageFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) loadImageFile(fileInput.files[0]);
  });

  function loadImageFile(file) {
    if (!file.type.startsWith('image/')) {
      return showAlert('tool-alert', '⚠️ Invalid image.', 'error');
    }

    const reader = new FileReader();
    reader.onload = e => {
      originalPreview.src = e.target.result;
      resultArea.classList.add('visible');
      resultPreview.classList.remove('visible');
      downloadBtn.classList.remove('visible');

      document.getElementById('upload-hint').textContent = file.name;
    };
    reader.readAsDataURL(file);
  }

  if (processBtn) {
    processBtn.addEventListener('click', () => {
      if (!originalPreview.src) {
        return showAlert('tool-alert', '⚠️ Upload image first.', 'error');
      }

      progressWrap.classList.add('visible');
      processBtn.disabled = true;
      processBtn.textContent = 'Processing...';

      let width = 0;
      const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
          width = 100;
          clearInterval(interval);
          simulateResult();
        }
        progressBar.style.width = width + '%';
      }, 200);
    });
  }

  function simulateResult() {
    setTimeout(() => {
      resultPreview.src = originalPreview.src;
      resultPreview.classList.add('visible');

      progressWrap.classList.remove('visible');
      processBtn.disabled = false;
      processBtn.textContent = '✨ Remove Background';

      downloadBtn.classList.add('visible');
      showAlert('tool-alert', '✅ Done!', 'success');
    }, 400);
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = resultPreview.src;
      link.download = 'bg-removed.png';
      link.click();
    });
  }
}

// ── Pricing Tabs ──────────────────────────────────────────
function initPricingTabs() {
  document.querySelectorAll('.pricing-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.pricing-tab')
        .forEach(t => t.classList.remove('active'));

      this.classList.add('active');

      const mode = this.dataset.mode;

      document.querySelectorAll('.price-value')
        .forEach(el => el.textContent = el.dataset[mode]);

      document.querySelectorAll('.price-period')
        .forEach(el => el.textContent = mode === 'monthly' ? '/mo' : '/yr');
    });
  });
}

// ── Scroll Reveal ─────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// ── Charts ────────────────────────────────────────────────
function initCharts() {
  const yellow = '#F9E94E';
  const gold   = '#D4A017';
  const cream  = '#FDE68A';
  const light  = '#FFF8C2';
  const muted  = '#7A7A9D';

  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Digital', 'Software', 'Service', 'Hardware', 'Add-ons'],
        datasets: [{
          label: 'Stock Quantity',
          data: [500, 352, 208, 94, 94],
          backgroundColor: [yellow, gold, cream, light, muted],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const donutCtx = document.getElementById('donutChart');
  if (donutCtx) {
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [{
          data: [980, 198, 70],
          backgroundColor: [yellow, gold, '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 12, font: { size: 12 } }
          }
        }
      }
    });
  }

  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          {
            label: 'Stock Added',
            data: [120,180,90,210,160,240,200,310,270,190,350,290],
            borderColor: yellow,
            backgroundColor: 'rgba(249,233,78,0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: gold,
            pointRadius: 4
          },
          {
            label: 'Stock Removed',
            data: [60,90,45,130,80,150,110,180,140,100,200,160],
            borderColor: muted,
            backgroundColor: 'rgba(122,122,157,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: muted,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { padding: 12, font: { size: 12 } }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHamburger();
  initTool();
  initPricingTabs();
  initScrollReveal();
  initCharts();

  document.getElementById('theme-toggle')
    ?.addEventListener('click', toggleTheme);

  document.getElementById('login-form')
    ?.addEventListener('submit', handleLogin);

  document.getElementById('signup-form')
    ?.addEventListener('submit', handleSignup);

  document.getElementById('contact-form')
    ?.addEventListener('submit', handleContact);
});