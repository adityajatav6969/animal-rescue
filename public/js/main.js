// ============================================
// Animal Rescue Platform — Client-Side JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileNav();
  initGeolocation();
  initPhotoPreview();
  initCharCounter();
  initStatCounters();
  initScrollAnimations();
});

// ── Dark Mode Toggle ─────────────────────────
function initDarkMode() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Load saved preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // Re-initialize lucide icons for the toggle
    if (window.lucide) lucide.createIcons();
  });
}

// ── Mobile Navigation ────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });

  // Close on link click
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });
}

// ── Geolocation Detection ────────────────────
function initGeolocation() {
  const btn = document.getElementById('detectLocation');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    btn.innerHTML = '<span class="spinner"></span> Detecting...';
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;

        // Show success
        const status = document.getElementById('locationStatus');
        const text = document.getElementById('locationText');
        if (status && text) {
          text.textContent = `Location captured: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          status.style.display = 'flex';
        }

        btn.innerHTML = '<i data-lucide="check-circle"></i> Location Captured';
        btn.classList.add('btn-success-state');
        if (window.lucide) lucide.createIcons();
      },
      (error) => {
        let msg = 'Unable to get location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out.';
            break;
        }
        alert(msg);
        btn.innerHTML = '<i data-lucide="crosshair"></i> Detect My Location';
        btn.disabled = false;
        if (window.lucide) lucide.createIcons();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// ── Photo Preview ────────────────────────────
function initPhotoPreview() {
  const input = document.getElementById('animalPhoto');
  const placeholder = document.getElementById('uploadPlaceholder');
  const preview = document.getElementById('uploadPreview');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('removePhoto');
  const uploadArea = document.getElementById('uploadArea');

  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5 MB.');
      input.value = '';
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) previewImg.src = e.target.result;
      if (placeholder) placeholder.style.display = 'none';
      if (preview) preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Remove photo
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.value = '';
      if (previewImg) previewImg.src = '';
      if (placeholder) placeholder.style.display = 'block';
      if (preview) preview.style.display = 'none';
    });
  }

  // Drag and drop visual feedback
  if (uploadArea) {
    ['dragenter', 'dragover'].forEach((evt) => {
      uploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((evt) => {
      uploadArea.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
      });
    });
  }
}

// ── Character Counter ────────────────────────
function initCharCounter() {
  const textarea = document.getElementById('description');
  const counter = document.getElementById('descCount');
  if (!textarea || !counter) return;

  textarea.addEventListener('input', () => {
    counter.textContent = textarea.value.length;
  });
}

// ── Animated Stat Counters ───────────────────
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length === 0) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(tick);
  };

  // Start animation when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((c) => observer.observe(c));
}

// ── Scroll-triggered Animations ──────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-fade-up');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}
