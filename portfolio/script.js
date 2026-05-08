/* ==========================================================
   GOLAM MUKTADIR — PORTFOLIO JAVASCRIPT
   script.js  |  Vanilla JS, no dependencies
   ========================================================== */

/* ----------------------------------------------------------
   1. UTILITY — Wait for DOM to be fully loaded
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     2. DYNAMIC COPYRIGHT YEAR
     Automatically updates the footer year
  -------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* --------------------------------------------------------
     3. STICKY NAVBAR
     Adds .scrolled class once user scrolls past 60px.
     This triggers the frosted-glass background in CSS.
  -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load


  /* --------------------------------------------------------
     4. MOBILE NAV TOGGLE (Hamburger menu)
     Toggles .open on the button and the links list.
     Also updates aria-expanded for accessibility.
  -------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when any link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  // Close menu if user clicks outside the navbar
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    }
  });


  /* --------------------------------------------------------
     5. ACTIVE NAV LINK ON SCROLL
     Highlights the correct nav link as user scrolls through
     sections, using IntersectionObserver.
  -------------------------------------------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  // Observer: fire when 40% of a section enters the viewport
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active from all links
          navAnchors.forEach(a => a.classList.remove('active'));
          // Add active to the matching link
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => sectionObserver.observe(sec));


  /* --------------------------------------------------------
     6. SCROLL REVEAL ANIMATION
     Any element with .reveal fades + slides up when it
     enters the viewport. Uses IntersectionObserver.
  -------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }   // Trigger when 12% of the element is visible
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* --------------------------------------------------------
     7. SKILL BAR ANIMATION
     Each .skill-fill has data-percent="XX" attribute.
     Once its parent card is visible on screen, we transition
     its width from 0 to the target percentage.
  -------------------------------------------------------- */
  const skillCards = document.querySelectorAll('.skill-card');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find the fill bar inside this card
          const fill    = entry.target.querySelector('.skill-fill');
          const percent = fill ? fill.getAttribute('data-percent') : 0;

          // Use a tiny delay so the reveal animation settles first
          setTimeout(() => {
            if (fill) fill.style.width = percent + '%';
          }, 200);

          // Stop observing once animated
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillCards.forEach(card => skillObserver.observe(card));


  /* --------------------------------------------------------
     8. BACK TO TOP BUTTON
     Appears after scrolling down 400px.
     Smoothly scrolls back to the top when clicked.
  -------------------------------------------------------- */
  const backTopBtn = document.getElementById('backTop');

  function handleBackTopVisibility() {
    if (window.scrollY > 400) {
      backTopBtn.classList.add('visible');
    } else {
      backTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackTopVisibility, { passive: true });

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* --------------------------------------------------------
     9. CONTACT FORM VALIDATION & SUBMISSION
     - Validates Name, Email, and Message fields
     - Shows inline error messages
     - Shows a success / error banner after submission
     - No backend required; swap the submitForm() function
       with an EmailJS / Formspree call to make it live.
  -------------------------------------------------------- */
  const contactForm  = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn    = document.getElementById('submitBtn');

  /**
   * Validates a single field.
   * @param {HTMLElement} input  — the input or textarea
   * @param {string}      value  — trimmed value
   * @returns {string}           — error message, or '' if valid
   */
  function validateField(input, value) {
    if (!value) return 'This field is required.';
    if (input.type === 'email') {
      // Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address.';
    }
    if (input.tagName === 'TEXTAREA' && value.length < 10) {
      return 'Message must be at least 10 characters.';
    }
    return ''; // Valid
  }

  /**
   * Shows an error message below a field.
   * @param {HTMLElement} input   — the field
   * @param {string}      message — error text ('' clears the error)
   */
  function showFieldError(input, message) {
    const errorEl = input.closest('.form-group').querySelector('.field-error');
    if (errorEl) errorEl.textContent = message;

    // Add/remove a red border on the input
    if (message) {
      input.style.borderColor = '#ff6b6b';
    } else {
      input.style.borderColor = '';
    }
  }

  // Live validation: clear errors as user types
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      const error = validateField(field, field.value.trim());
      showFieldError(field, error);
    });
  });

  /**
   * Simulate an async form submission.
   * Replace this with a real API call (EmailJS / Formspree / fetch).
   * @returns {Promise<boolean>} — resolves true on success, false on failure
   */
  function submitForm() {
    return new Promise((resolve) => {
      // Simulate a 1.5s network delay
      setTimeout(() => resolve(true), 1500);
    });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Validate all fields ---
    const fields = contactForm.querySelectorAll('input, textarea');
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, field.value.trim());
      showFieldError(field, error);
      if (error) hasErrors = true;
    });

    if (hasErrors) return; // Stop if any field is invalid

    // --- Loading state ---
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    // Clear previous feedback
    formFeedback.className = 'form-feedback';
    formFeedback.textContent = '';

    try {
      const success = await submitForm();

      if (success) {
        // Success feedback
        formFeedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formFeedback.classList.add('success');
        contactForm.reset();

        // Clear any remaining error states
        fields.forEach(field => showFieldError(field, ''));
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // Error feedback
      formFeedback.textContent = '✗ Something went wrong. Please try again later.';
      formFeedback.classList.add('error');
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';

      // Auto-clear feedback after 5 seconds
      setTimeout(() => {
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';
      }, 5000);
    }
  });


  /* --------------------------------------------------------
     10. SMOOTH SCROLL FOR ANCHOR LINKS
     Provides a fallback for older browsers that don't
     support CSS scroll-behavior: smooth.
  -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* --------------------------------------------------------
     11. HERO TEXT — TYPEWRITER TAGLINE EFFECT (Optional)
     Cycles through roles beneath the name.
  -------------------------------------------------------- */
  const taglineEl = document.querySelector('.hero-tagline');
  if (taglineEl) {
    const roles = [
      'Web Developer & WordPress Enthusiast',
      'Front-End Developer',
      'WordPress Theme Builder',
      'UI/UX Learner',
    ];

    let roleIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;

    function typeWriter() {
      const current = roles[roleIndex];

      if (isDeleting) {
        // Remove a character
        taglineEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        // Add a character
        taglineEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      // Determine next delay
      let delay = isDeleting ? 50 : 80;

      if (!isDeleting && charIndex === current.length) {
        // Finished typing — pause before deleting
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting — move to next role
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        delay = 400;
      }

      setTimeout(typeWriter, delay);
    }

    // Start after a brief initial delay
    setTimeout(typeWriter, 1000);
  }

}); // End DOMContentLoaded
