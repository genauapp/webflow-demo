// ../../utils/ui/slide.js

/**
 * slideOpen: smoothly expand an element from height: 0 → its full height.
 * @param {HTMLElement} el
 * @param {string} [displayType='block']  CSS display value to use while opened (e.g. 'flex', 'grid', etc.)
 */
export function slideOpen(el, displayType = 'block') {
  // If already visible and no height=0, bail out
  const computed = window.getComputedStyle(el);
  if (computed.display !== 'none' && computed.height !== '0px') return;

  // 1) Set it to the final display type and measure its full (auto) height:
  el.style.display = displayType;
  el.style.overflow = 'hidden';
  // Temporarily set height to auto so we can read scrollHeight:
  el.style.height = 'auto';
  const fullHeight = el.scrollHeight + 'px';
  // Immediately collapse back to 0 to prepare for the transition:
  el.style.height = '0px';

  // 2) Force a reflow so the browser sees height=0 before we switch to fullHeight:
  //    (reading offsetHeight forces a reflow)
  void el.offsetHeight;

  // 3) Animate height → fullHeight:
  el.style.transition = 'height 300ms ease';
  el.style.height = fullHeight;

  // 4) Once transition ends, clean up inline styles so the element can flex/grow normally:
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
 * slideClose: smoothly collapse an element from its current height → 0, then hide it.
 * @param {HTMLElement} el
 */
export function slideClose(el) {
  // If already hidden, bail out
  const computed = window.getComputedStyle(el);
  if (computed.display === 'none' || computed.height === '0px') {
    // Ensure it’s completely hidden (display:none)
    el.style.display = 'none';
    return;
  }

  // 1) Measure the element’s current full height as a pixel value:
  const fullHeight = el.scrollHeight + 'px';
  // If the element’s computed height is "auto", force it to be the measured pixel height:
  el.style.height = fullHeight;
  el.style.overflow = 'hidden';

  // 2) Force a reflow so the browser knows we’re starting from fullHeight
  void el.offsetHeight;

  // 3) Animate height from fullHeight → 0:
  el.style.transition = 'height 300ms ease';
  el.style.height = '0px';

  // 4) Once transition ends, hide it and clean up inline styles:
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
