// ─── Custom Cursor ───────────────────────────────────────────
(function () {
  // Only activate on non-touch, pointer-fine devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Actual mouse position (dot snaps here immediately)
  let mouseX = -100, mouseY = -100;
  // Ring lags behind with lerp
  let ringX  = -100, ringY  = -100;
  const LERP = 0.10; // lower = more lag

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
  const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  // Only remove hover state when the pointer truly leaves all hover targets
  // (mouseout also fires when moving between parent/child, so check relatedTarget)
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets) && !e.relatedTarget?.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  function animate() {
    // Snap dot to exact mouse position
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

    // Lerp ring toward mouse position
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

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
