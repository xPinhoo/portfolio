// Shared scroll-motion helpers used across pages.

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Adds .is-visible to every .reveal element the first time it scrolls into view,
 * and dispatches a `reveal` event on it so pages can start their own animations.
 */
export function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('is-visible');
        el.dispatchEvent(new CustomEvent('reveal'));
        io.unobserve(el);
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/** Runs `fn` at most once per frame on scroll/resize, and once immediately. */
export function onScrollFrame(fn: () => void) {
  let ticking = false;
  const run = () => {
    ticking = false;
    fn();
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    },
    { passive: true },
  );
  addEventListener('resize', fn);
  fn();
}

/** 0 → 1 as the element's body passes the middle of the viewport. */
export function railProgress(el: Element) {
  const r = el.getBoundingClientRect();
  return Math.min(1, Math.max(0, (innerHeight * 0.5 - r.top) / r.height));
}
