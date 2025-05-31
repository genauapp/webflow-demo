export function slideOpen(el, displayMode = 'block') {
  if (!el || el.classList.contains('slideable--expanded')) return
  el.style.display = displayMode
  void el.offsetHeight
  el.classList.add('slideable--expanded')
}

export function slideClose(el) {
  if (!el || !el.classList.contains('slideable--expanded')) return
  el.classList.remove('slideable--expanded')
  const onEnd = (evt) => {
    if (evt.propertyName === 'transform' || evt.propertyName === 'opacity') {
      el.style.display = 'none'
      el.removeEventListener('transitionend', onEnd)
    }
  }
  el.addEventListener('transitionend', onEnd)
}
