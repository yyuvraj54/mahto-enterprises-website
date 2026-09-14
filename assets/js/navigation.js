/* ============================================
   NAVIGATION
   Sticky header, mobile menu, scroll spy
   ============================================ */

export function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');
  const links = document.querySelectorAll('.nav__link');
  const body = document.body;

  if (!nav || !toggle || !menu) return;

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open');
    body.classList.toggle('nav-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll-triggered header background
  const heroSentinel = document.querySelector('.hero');
  if (heroSentinel) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(heroSentinel);
  } else {
    nav.classList.add('nav--scrolled');
  }

  // Scroll spy
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach(link => {
              link.classList.toggle(
                'nav__link--active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(section => spyObserver.observe(section));
  }
}
