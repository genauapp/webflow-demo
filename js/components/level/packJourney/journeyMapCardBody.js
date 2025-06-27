import { DeckStatus } from '../../../constants/props.js'

let els = {}

function initElements() {
  els = {
    container: () => document.getElementById('pack-journey-map-card-body'),
  }
}

// helper: wire up a stage element
function setupStageInteractivity(stageEl, stage, onStageSelected) {
  stageEl.dataset.stageId = stage.id
  // clear any old listener (optional but safe)
  stageEl.replaceWith(stageEl.cloneNode(true))
  stageEl = els.container().querySelector(`[data-stage-id="${stage.id}"]`)

  if (stage.status === DeckStatus.UNLOCKED) {
    stageEl.classList.add('interactive')
    stageEl.addEventListener('click', () => onStageSelected(stage.id))
  }
  return stageEl
}

export function renderJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return
  els.container().innerHTML = ''

  journeyState.deckSummaries.forEach((stage) => {
    const stageEl = document.createElement('div')
    stageEl.className = `journey-stage ${stage.status}`
    stageEl.textContent = `${stage.wordType} Deck`

    if (stage.status === DeckStatus.COMPLETED) {
      stageEl.innerHTML += '<span class="checkmark">✓</span>'
    }

    // wire up interactive states
    setupStageInteractivity(stageEl, stage, onStageSelected)

    els.container().appendChild(stageEl)
  })
}

export function updateJourneyMap(journeyState, onStageSelected) {
  if (!els.container) return

  journeyState.deckSummaries.forEach((stage) => {
    let stageEl = els.container().querySelector(`[data-stage-id="${stage.id}"]`)
    if (!stageEl) return

    // 1) update classes
    stageEl.className = `journey-stage ${stage.status}`

    // 2) update checkmark
    const existing = stageEl.querySelector('.checkmark')
    if (stage.status === DeckStatus.COMPLETED) {
      if (!existing) stageEl.innerHTML += '<span class="checkmark">✓</span>'
    } else {
      if (existing) existing.remove()
    }

    // 3) re-wire interactivity
    setupStageInteractivity(stageEl, stage, onStageSelected)
  })
}

export function initJourneyMapCardBody(journeyState, onStageSelected) {
  initElements()
  renderJourneyMap(journeyState, onStageSelected)
}

export function unmountJourneyMapCardBody() {
  if (els.container) els.container().innerHTML = ''
}
