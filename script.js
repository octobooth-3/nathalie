const POINTER_FINE_QUERY = '(pointer: fine)';
const INITIAL_CURSOR_POSITION = -100;
const RING_LERP = 0.10;
const HOVER_TARGETS = 'a, button, [role="button"], input, textarea, select, label, .project-card';
const NAV_SCROLL_THRESHOLD = 10;
const REVEAL_THRESHOLD = 0.12;
const STAGGER_DELAY_MS = 90;

const nav = document.querySelector('nav');
const revealEls = document.querySelectorAll('.reveal');

// ─── Custom Cursor ───────────────────────────────────────────
(function () {
  // Only activate on non-touch, pointer-fine devices
  if (!window.matchMedia(POINTER_FINE_QUERY).matches) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Actual mouse position (dot snaps here immediately)
  let mouseX = INITIAL_CURSOR_POSITION, mouseY = INITIAL_CURSOR_POSITION;
  // Ring lags behind with lerp
  let ringX = INITIAL_CURSOR_POSITION, ringY = INITIAL_CURSOR_POSITION;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Cursor disappears when leaving the window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });

  // Expand ring on interactive elements
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_TARGETS)) {
      document.body.classList.add('cursor-hover');
    }
  });
  // Only remove hover state when the pointer truly leaves all hover targets
  // (mouseout also fires when moving between parent/child, so check relatedTarget)
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_TARGETS) && !e.relatedTarget?.closest(HOVER_TARGETS)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  function animate() {
    // Snap dot to exact mouse position
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

    // Lerp ring toward mouse position
    ringX += (mouseX - ringX) * RING_LERP;
    ringY += (mouseY - ringY) * RING_LERP;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

// ─── Nav: add "scrolled" class ──────────────────────────────
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > NAV_SCROLL_THRESHOLD);
});

// ─── Intersection Observer: reveal on scroll ─────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: REVEAL_THRESHOLD }
);
revealEls.forEach((el) => observer.observe(el));

// ─── Stagger children inside .stagger-parent ─────────────────
document.querySelectorAll('.stagger-parent').forEach((parent) => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * STAGGER_DELAY_MS}ms`;
  });
});
