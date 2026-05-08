/* ============================================================
   PORTFOLIO JAVASCRIPT — Alex Morgan
   Features:
     1. Sticky navbar + active link highlighting
     2. Mobile hamburger menu
     3. Scroll reveal animations
     4. Skill bar fill on scroll into view
     5. Contact form validation
     6. Back-to-top button
     7. Dynamic footer year
============================================================ */

'use strict';

/* ============================================================
   1. UTILITY: throttle
============================================================ */
function throttle(fn, delay = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn(...args); }
  };
}

/* ============================================================
   2. NAVBAR — scroll & active section highlighting
============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add 'scrolled' class once user scrolls past ~60px
  function handleNavScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActiveLink();
  }

  // Highlight the nav link whose section is in the viewport
  function highlightActiveLink() {
    let current = '';
    const offset = navbar.offsetHeight + 20;

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - offset) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', throttle(handleNavScroll, 80));
  handleNavScroll(); // run once on load
})();

/* ============================================================
   3. MOBILE HAMBURGER MENU
============================================================ */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('navLinks');
  const links = menu.querySelectorAll('.nav-link');

  function toggleMenu(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    // Prevent body scroll when menu is open
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => {
    toggleMenu(!btn.classList.contains('open'));
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   Observe .reveal elements; add .visible when 15% in view
============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. SKILL BAR ANIMATION
   When a skill card enters the viewport, fill its progress bar
============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const fill  = bar.querySelector('.skill-bar-fill');
          const width = bar.dataset.width || '0';
          fill.style.width = `${width}%`;
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

/* ============================================================
   6. CONTACT FORM VALIDATION
============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;

  const nameInput   = document.getElementById('name');
  const emailInput  = document.getElementById('email');
  const msgInput    = document.getElementById('message');
  const nameErr     = document.getElementById('nameError');
  const emailErr    = document.getElementById('emailError');
  const msgErr      = document.getElementById('messageError');
  const successBox  = document.getElementById('formSuccess');
  const btnText     = document.getElementById('btnText');

  // Email regex
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, errSpan, msg) {
    errSpan.textContent = msg;
    input.classList.add('error');
  }
  function clearError(input, errSpan) {
    errSpan.textContent = '';
    input.classList.remove('error');
  }

  // Live validation on blur
  nameInput.addEventListener('blur',  () => validateName());
  emailInput.addEventListener('blur', () => validateEmail());
  msgInput.addEventListener('blur',   () => validateMessage());

  // Clear error on input
  nameInput.addEventListener('input',  () => clearError(nameInput,  nameErr));
  emailInput.addEventListener('input', () => clearError(emailInput, emailErr));
  msgInput.addEventListener('input',   () => clearError(msgInput,   msgErr));

  function validateName() {
    const v = nameInput.value.trim();
    if (!v)        { setError(nameInput,  nameErr, 'Name is required.'); return false; }
    if (v.length < 2) { setError(nameInput, nameErr, 'Name must be at least 2 characters.'); return false; }
    clearError(nameInput, nameErr);
    return true;
  }
  function validateEmail() {
    const v = emailInput.value.trim();
    if (!v)              { setError(emailInput, emailErr, 'Email is required.'); return false; }
    if (!EMAIL_RE.test(v)) { setError(emailInput, emailErr, 'Please enter a valid email.'); return false; }
    clearError(emailInput, emailErr);
    return true;
  }
  function validateMessage() {
    const v = msgInput.value.trim();
    if (!v)         { setError(msgInput, msgErr, 'Message is required.'); return false; }
    if (v.length < 10) { setError(msgInput, msgErr, 'Message must be at least 10 characters.'); return false; }
    clearError(msgInput, msgErr);
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successBox.textContent = '';

    const ok = [validateName(), validateEmail(), validateMessage()].every(Boolean);
    if (!ok) return;

    // Simulate sending (replace with real fetch/EmailJS)
    btnText.textContent = 'Sending…';
    form.querySelector('button[type="submit"]').disabled = true;

    setTimeout(() => {
      successBox.textContent = '🎉 Your message was sent! I\'ll get back to you soon.';
      form.reset();
      btnText.textContent = 'Send Message';
      form.querySelector('button[type="submit"]').disabled = false;

      // Clear success after 6s
      setTimeout(() => { successBox.textContent = ''; }, 6000);
    }, 1400);
  });
})();

/* ============================================================
   7. BACK TO TOP BUTTON
============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function toggleBtn() {
    btn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', throttle(toggleBtn, 100));

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   8. DYNAMIC FOOTER YEAR
============================================================ */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   9. SMOOTH SCROLL POLYFILL for older anchors
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navbar = document.getElementById('navbar');
      const offset = navbar ? navbar.offsetHeight : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
