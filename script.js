const nav = document.querySelector('.site-nav');
const revealElements = document.querySelectorAll('.reveal');
const staggerParents = document.querySelectorAll('.stagger-parent');
const year = document.querySelector('#year');

const NAV_SCROLL_THRESHOLD = 8;
const REVEAL_THRESHOLD = 0.14;
const STAGGER_DELAY_MS = 85;

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > NAV_SCROLL_THRESHOLD);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: REVEAL_THRESHOLD }
);

revealElements.forEach((el) => observer.observe(el));

staggerParents.forEach((parent) => {
  Array.from(parent.children).forEach((child, index) => {
    child.style.transitionDelay = `${index * STAGGER_DELAY_MS}ms`;
  });
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
