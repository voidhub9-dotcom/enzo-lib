(() => {
  'use strict';

  /* Year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav scroll state */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);

    const toTop = document.getElementById('toTop');
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 480);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Back to top */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Toast + copy to clipboard */
  const toast = document.getElementById('toast');
  let toastTimer = null;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) { /* fall through to legacy path */ }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (err) {
      return false;
    }
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ok = await copyText(btn.getAttribute('data-copy') || '');
      showToast(ok ? 'Loadstring copied to clipboard' : 'Copy failed — select and copy manually');
    });
  });

  /* Showcase tabs */
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  showcaseTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      showcaseTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.showcase-panel').forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === target);
      });
    });
  });

  /* FAQ accordion */
  document.querySelectorAll('.acc-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.acc-trigger').forEach((other) => {
        if (other === trigger) return;
        other.setAttribute('aria-expanded', 'false');
        if (other.nextElementSibling) other.nextElementSibling.style.maxHeight = '0px';
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* Mock window interactivity */
  const mockSlider = document.getElementById('mockSlider');
  const mockSliderVal = document.getElementById('mockSliderVal');
  if (mockSlider && mockSliderVal) {
    const update = () => {
      const min = Number(mockSlider.min || 0);
      const max = Number(mockSlider.max || 100);
      const val = Number(mockSlider.value);
      const pct = ((val - min) / (max - min)) * 100;
      mockSlider.style.setProperty('--val', pct + '%');
      mockSliderVal.textContent = String(val);
    };
    mockSlider.addEventListener('input', update);
    update();
  }

  const mockDropdown = document.getElementById('mockDropdown');
  const mockDropdownBtn = document.getElementById('mockDropdownBtn');
  const mockDropdownList = document.getElementById('mockDropdownList');
  const mockDropdownVal = document.getElementById('mockDropdownVal');
  if (mockDropdown && mockDropdownBtn && mockDropdownList && mockDropdownVal) {
    mockDropdownBtn.addEventListener('click', () => {
      const isOpen = mockDropdown.classList.toggle('is-open');
      mockDropdownBtn.setAttribute('aria-expanded', String(isOpen));
    });
    mockDropdownList.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', () => {
        mockDropdownVal.textContent = li.textContent || '';
        mockDropdown.classList.remove('is-open');
        mockDropdownBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!mockDropdown.contains(e.target)) {
        mockDropdown.classList.remove('is-open');
        mockDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
