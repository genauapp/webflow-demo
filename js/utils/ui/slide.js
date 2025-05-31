// ../../utils/ui/slide.js

/**
 * slideOpen: smoothly expand an element from height: 0 → its full (auto) height.
 * We temporarily take it out of the document flow (position:absolute; visibility:hidden)
 * so that measuring scrollHeight doesn’t cause inner‐content repaints in the middle
 * of the animation.
 *
 * @param {HTMLElement} el
 * @param {string} [displayType='block']  CSS display value to use once opened (e.g. 'flex', 'grid', etc.)
 */
export function slideOpen(el, displayType = 'block') {
  // If already visible and its height isn’t 0, do nothing
  const computed = window.getComputedStyle(el);
  if (computed.display !== 'none' && computed.height !== '0px') {
    return;
  }

  // 1) Put the element into the DOM flow as displayType, but hidden & absolutely placed
  el.style.display = displayType;
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  // Let it size itself to its "auto" height (so scrollHeight is correct)
  el.style.height = 'auto';

  // 2) Measure its full height
  const fullHeight = el.scrollHeight + 'px';

  // 3) Remove our “measuring” styles so it returns to normal flow,
  //    but set height:0 immediately so we can animate from 0→fullHeight
  el.style.removeProperty('position');
  el.style.removeProperty('visibility');
  el.style.height = '0px';
  el.style.overflow = 'hidden';

  // 4) Force a reflow so the browser registers height=0 before the transition
  //    (reading offsetHeight is the easiest way to do that)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;

  // 5) Now animate height from 0 → fullHeight
  el.style.transition = 'height 300ms ease';
  el.style.height = fullHeight;

  // 6) Once the transition completes, clean up inline styles: remove height/overflow/transition
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
 * We measure its current pixel height, lock that in, then animate it down to 0.
 *
 * @param {HTMLElement} el
 */
export function slideClose(el) {
  const computed = window.getComputedStyle(el);
  // If it’s already hidden (display:none) or already 0px tall, ensure display:none
  if (computed.display === 'none' || computed.height === '0px') {
    el.style.display = 'none';
    return;
  }

  // 1) Measure the element’s current full height in pixels:
  //    If computed.height is "auto", setting height=scrollHeight makes sure we start from the right pixel height.
  const fullHeight = el.scrollHeight + 'px';
  el.style.height = fullHeight;
  el.style.overflow = 'hidden';

  // 2) Force a reflow so the browser registers that height before we start animating
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  el.offsetHeight;

  // 3) Animate height from fullHeight → 0
  el.style.transition = 'height 300ms ease';
  el.style.height = '0px';

  // 4) Once the transition ends, set display:none and clean up inline styles
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
