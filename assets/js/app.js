/* ============================================
   APP.JS — All functionality in one file
   Works as a regular script (no ES modules needed)
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollReveal();
    initCounters();
    initSmoothScroll();
    initTestimonials();
    initBackToTop();
    if (document.querySelector('[data-validate]')) {
      initFormValidation();
    }
  });

  /* ---- NAVIGATION ---- */
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.querySelector('.nav__menu');
    var links = document.querySelectorAll('.nav__link');
    var body = document.body;

    if (!nav || !toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open');
      body.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Scroll-triggered header background
    var hero = document.querySelector('.hero');
    if (hero) {
      var observer = new IntersectionObserver(
        function (entries) {
          nav.classList.toggle('nav--scrolled', !entries[0].isIntersecting);
        },
        { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
      );
      observer.observe(hero);
    } else {
      nav.classList.add('nav--scrolled');
    }

    // Scroll spy
    var sections = document.querySelectorAll('section[id]');
    if (sections.length) {
      var spyObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.id;
              links.forEach(function (link) {
                link.classList.toggle(
                  'nav__link--active',
                  link.getAttribute('href') === '#' + id
                );
              });
            }
          });
        },
        { threshold: 0.3 }
      );
      sections.forEach(function (section) { spyObserver.observe(section); });
    }
  }

  /* ---- SCROLL REVEAL ---- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ---- ANIMATED COUNTERS ---- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    var duration = 2000;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = performance.now();

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var current = Math.floor(easeOutQuart(progress) * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(update);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) { observer.observe(counter); });
  }

  /* ---- SMOOTH SCROLL ---- */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        var navEl = document.querySelector('.nav');
        var offset = navEl ? navEl.offsetHeight + 20 : 20;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ---- TESTIMONIALS SLIDER ---- */
  function initTestimonials() {
    var slider = document.querySelector('.testimonials__slider');
    var dots = document.querySelectorAll('.testimonials__dot');
    if (!slider || !dots.length) return;

    function updateDots() {
      var scrollLeft = slider.scrollLeft;
      var card = slider.querySelector('.testimonial-card');
      var cardWidth = card ? card.offsetWidth : 1;
      var gap = parseInt(getComputedStyle(slider).gap) || 0;
      var index = Math.round(scrollLeft / (cardWidth + gap));

      dots.forEach(function (dot, i) {
        dot.classList.toggle('testimonials__dot--active', i === index);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        var card = slider.querySelector('.testimonial-card');
        if (!card) return;
        var gap = parseInt(getComputedStyle(slider).gap) || 0;
        slider.scrollTo({
          left: index * (card.offsetWidth + gap),
          behavior: 'smooth'
        });
      });
    });

    slider.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  }

  /* ---- BACK TO TOP ---- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- FORM VALIDATION ---- */
  function initFormValidation() {
    var form = document.querySelector('[data-validate]');
    if (!form) return;

    var rules = {
      name: { required: true, minLength: 2, message: 'Please enter your full name' },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
      phone: { required: false, pattern: /^[\d\s\-+()]{7,}$/, message: 'Please enter a valid phone number' },
      message: { required: true, minLength: 10, message: 'Message must be at least 10 characters' }
    };

    function validateField(input) {
      var name = input.name;
      var value = input.value.trim();
      var rule = rules[name];
      var group = input.closest('.form__group');
      var errorEl = group ? group.querySelector('.form__error') : null;

      if (!rule) return true;

      var isValid = true;
      if (rule.required && !value) {
        isValid = false;
      } else if (value && rule.pattern && !rule.pattern.test(value)) {
        isValid = false;
      } else if (value && rule.minLength && value.length < rule.minLength) {
        isValid = false;
      }

      input.classList.toggle('is-error', !isValid);
      if (errorEl) {
        errorEl.textContent = rule.message;
        errorEl.classList.toggle('is-visible', !isValid);
      }
      return isValid;
    }

    var inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isFormValid = true;
      inputs.forEach(function (input) {
        if (!validateField(input)) isFormValid = false;
      });
      if (isFormValid) {
        form.style.display = 'none';
        var success = document.querySelector('.form__success');
        if (success) success.classList.add('is-visible');
      }
    });
  }

})();
