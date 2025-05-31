export function slideOpen(el, displayMode = 'block') {
  if (!el || el.classList.contains('expanded')) return
  el.style.display = displayMode
  el.style.height = '0px'
  el.style.opacity = '0'
  void el.offsetHeight
  // const fullHeight = el.scrollHeight + 'px';
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
  // el.style.height = fullHeight;
  el.style.height = 'auto' // assuming it is set from Webflow
  el.style.opacity = '1'
  el.classList.add('expanded')
  const onEnd = (evt) => {
    if (evt.propertyName === 'height') {
      el.style.height = 'auto'
      el.removeEventListener('transitionend', onEnd)
    }
  }
  el.addEventListener('transitionend', onEnd)
}

export function slideClose(el) {
  if (!el || !el.classList.contains('expanded')) return
  const currentHeight = el.getBoundingClientRect().height + 'px'
  el.style.height = currentHeight
  el.style.opacity = '1'
  el.classList.remove('expanded')
  void el.offsetHeight
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease'
  el.style.height = '0px'
  el.style.opacity = '0'
  const onEnd = (evt) => {
    if (evt.propertyName === 'height') {
      el.style.display = 'none'
      el.style.height = ''
      el.removeEventListener('transitionend', onEnd)
    }
  }
  el.addEventListener('transitionend', onEnd)
}
