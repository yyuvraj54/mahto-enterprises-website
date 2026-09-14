/* ============================================
   TESTIMONIALS SLIDER
   Dot navigation for testimonial carousel
   ============================================ */

export function initTestimonials() {
  const slider = document.querySelector('.testimonials__slider');
  const dots = document.querySelectorAll('.testimonials__dot');
  if (!slider || !dots.length) return;

  function updateDots() {
    const scrollLeft = slider.scrollLeft;
    const cardWidth = slider.querySelector('.testimonial-card')?.offsetWidth || 1;
    const gap = parseInt(getComputedStyle(slider).gap) || 0;
    const index = Math.round(scrollLeft / (cardWidth + gap));

    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === index);
    });
  }

  // Dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const card = slider.querySelector('.testimonial-card');
      if (!card) return;
      const gap = parseInt(getComputedStyle(slider).gap) || 0;
      slider.scrollTo({
        left: index * (card.offsetWidth + gap),
        behavior: 'smooth'
      });
    });
  });

  slider.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}
