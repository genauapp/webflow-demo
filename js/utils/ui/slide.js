// ../../utils/ui/slide.js

/**
 * slideOpen: smoothly expand an element from height: 0 → its full rendered height.
 * Uses getBoundingClientRect().height to account for padding/border (and avoids
 * mid-transition jumps from child margins).
 *
 * @param {HTMLElement} el
 * @param {string} [displayType='block']  e.g. 'flex', 'grid', 'block', etc.
 */
export function slideOpen(el, displayType = 'block') {
  const computed = window.getComputedStyle(el);
  // If already visible and not zero‐height, do nothing
  if (computed.display !== 'none' && parseFloat(computed.height) > 0) {
    return;
  }

  // 1) Make it render off-screen to measure its “auto” height:
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  el.style.display = displayType;
  el.style.height = 'auto';
  el.style.overflow = 'visible';

  // 2) Now that it’s laid out (off-screen), measure its true rendered height:
  const fullHeightPx = el.getBoundingClientRect().height + 'px';

  // 3) Remove measurement styles so it returns to normal flow, but collapsed to 0:
  el.style.removeProperty('position');
  el.style.removeProperty('visibility');
  el.style.height = '0px';
  el.style.overflow = 'hidden';

  // 4) Force reflow so browser registers height=0 before we start animating:
  //    (reading offsetHeight triggers it)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;

  // 5) Transition height: 0 → fullHeightPx
  el.style.transition = 'height 300ms ease';
  el.style.height = fullHeightPx;

  // 6) On transition end, remove inline height/overflow/transition so it can go “auto” again
  function onEnd(e) {
    if (e.propertyName !== 'height') return;
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
    el.removeEventListener('transitionend', onEnd);
  }
  el.addEventListener('transitionend', onEnd);
}

/**
 * slideClose: smoothly collapse an element from its current rendered height → 0,
 * then set display:none. Reads getBoundingClientRect().height to account
 * for padding/border (and any child margins that aren’t captured by scrollHeight).
 *
 * @param {HTMLElement} el
 */
export function slideClose(el) {
  const computed = window.getComputedStyle(el);
  // If already hidden (display:none) or effectively zero-height, just hide:
  if (computed.display === 'none' || parseFloat(computed.height) === 0) {
    el.style.display = 'none';
    return;
  }

  // 1) Lock in its current on-screen height:
  const currentHeightPx = el.getBoundingClientRect().height + 'px';
  el.style.height = currentHeightPx;
  el.style.overflow = 'hidden';

  // 2) Force reflow (so browser knows we start from currentHeightPx):
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;

  // 3) Animate height: currentHeightPx → 0
  el.style.transition = 'height 300ms ease';
  el.style.height = '0px';

  // 4) Once transition ends, hide it fully and clean up:
  function onEnd(e) {
    if (e.propertyName !== 'height') return;
    el.style.display = 'none';
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
    el.removeEventListener('transitionend', onEnd);
  }
  el.addEventListener('transitionend', onEnd);
}
