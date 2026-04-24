// ─── Nav: add "scrolled" class ──────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ─── Intersection Observer: reveal on scroll ─────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => observer.observe(el));

// ─── Stagger children inside .stagger-parent ─────────────────
document.querySelectorAll('.stagger-parent').forEach((parent) => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 90}ms`;
  });
});
