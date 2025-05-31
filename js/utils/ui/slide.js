// ../../utils/ui/slide.js

/**
 * slideOpen: smoothly expand an element from height: 0 → its full (rendered) height.
 * We temporarily “unhide” it off‐screen to measure getBoundingClientRect().height (which
 * includes padding & border). If your children have margins, make sure the wrapper has
 * non‐zero padding (e.g. padding:1px 0) so that margin-collapse is prevented.
 *
 * @param {HTMLElement} el
 * @param {string} [displayType='block']  CSS display value to use while opened (e.g. 'flex', 'grid', etc.)
 */
export function slideOpen(el, displayType = 'block') {
  const cs = window.getComputedStyle(el);
  // If it’s already visible (display≠none) and height≠0, do nothing.
  if (cs.display !== 'none' && parseFloat(cs.height) > 0) {
    return;
  }

  // 1) Make it participate in layout off‐screen so we can measure:
  el.style.display = displayType;
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  // Ensure height:auto so getBoundingClientRect is correct:
  el.style.height = 'auto';

  // 2) Force a reflow & measure its “natural” rendered height:
  const fullHeight = el.getBoundingClientRect().height + 'px';

  // 3) Restore it to normal flow but collapsed to 0:
  el.style.removeProperty('position');
  el.style.removeProperty('visibility');
  el.style.height = '0px';
  el.style.overflow = 'hidden';

  // 4) Force a reflow so the browser registers height:0:
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;

  // 5) Animate height → fullHeight:
  el.style.transition = 'height 300ms ease';
  el.style.height = fullHeight;

  // 6) Clean up after transition—remove all inline height/overflow/transition so
  // the element can size itself naturally in the future:
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
 * slideClose: smoothly collapse an element from its current rendered height → 0, then hide it.
 * Uses getBoundingClientRect().height to lock in an exact start height (including padding & border).
 *
 * @param {HTMLElement} el
 */
export function slideClose(el) {
  const cs = window.getComputedStyle(el);
  // If already hidden (display:none) or already 0px high, force display:none and bail:
  if (cs.display === 'none' || parseFloat(cs.height) === 0) {
    el.style.display = 'none';
    return;
  }

  // 1) Measure its current rendered height (pixels):
  const currentHeight = el.getBoundingClientRect().height + 'px';
  el.style.height = currentHeight;
  el.style.overflow = 'hidden';

  // 2) Force a reflow so the browser sees that height:
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;

  // 3) Animate height → 0:
  el.style.transition = 'height 300ms ease';
  el.style.height = '0px';

  // 4) After transition, hide and clean up inline styles:
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
