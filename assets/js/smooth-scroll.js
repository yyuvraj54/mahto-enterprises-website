/* ============================================
   SMOOTH SCROLL
   Smooth anchor navigation with header offset
   ============================================ */

export function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const nav = document.querySelector('.nav');
      const offset = nav ? nav.offsetHeight + 20 : 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });
}
