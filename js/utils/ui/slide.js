// utils/ui/slide.js

/**
 * slideOpen
 * Smoothly expands an element from height 0 → its scrollHeight.
 *
 * @param {HTMLElement} el           The element (or wrapper) to expand.
 * @param {string}      [display='block']  The CSS display value to set when un-collapsed.
 */
export function slideOpen(el, display = 'block') {
  // If already visible, do nothing
  if (window.getComputedStyle(el).display !== 'none') return;

  // 1) Prepare: set display so that scrollHeight is computable
  el.style.display = display;
  el.style.overflow = 'hidden';
  el.style.height = '0px';

  // Force a reflow so the browser registers the 0px height before animating
  // eslint-disable-next-line no-unused-expressions
  el.offsetHeight;

  // 2) Animate to full height
  el.style.transition = 'height 300ms ease';
  el.style.height = el.scrollHeight + 'px';

  // 3) Cleanup once the transition finishes
  const removeStyles = () => {
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
    el.removeEventListener('transitionend', removeStyles);
  };

  el.addEventListener('transitionend', removeStyles);
}

/**
 * slideClose
 * Smoothly collapses an element from its current height → 0, then display:none.
 *
 * @param {HTMLElement} el  The element (or wrapper) to collapse.
 */
export function slideClose(el) {
  // If already hidden, do nothing
  if (window.getComputedStyle(el).display === 'none') return;

  // 1) Fix its current height so we can animate away from it
  const currentHeight = el.scrollHeight;
  el.style.height = currentHeight + 'px';
  el.style.overflow = 'hidden';

  // Force a reflow so the browser registers the start height
  // eslint-disable-next-line no-unused-expressions
  el.offsetHeight;

  // 2) Animate height → 0
  el.style.transition = 'height 300ms ease';
  el.style.height = '0px';

  // 3) Once the transition finishes, set display:none and clean up
  const onEnd = () => {
    el.style.display = 'none';
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
    el.removeEventListener('transitionend', onEnd);
  };

  el.addEventListener('transitionend', onEnd);
}
